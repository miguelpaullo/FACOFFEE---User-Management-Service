import type { Request, Response, NextFunction } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { AuthenticatedUser } from '../types/authenticatedUser';

const keycloakIssuer =
  process.env.KEYCLOAK_ISSUER || 'http://localhost:8080/realms/facoffee';

const jwks = createRemoteJWKSet(
  new URL(`${keycloakIssuer}/protocol/openid-connect/certs`)
);

function extractRoles(payload: any): string[] {
  const rolesFromClaim = Array.isArray(payload.roles) ? payload.roles : [];

  const rolesFromRealmAccess = Array.isArray(payload.realm_access?.roles)
    ? payload.realm_access.roles
    : [];

  return Array.from(new Set([...rolesFromClaim, ...rolesFromRealmAccess]));
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({
      error: 'missing_authorization_header',
      message: 'Token de acesso não informado.',
    });
  }

  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      error: 'invalid_authorization_header',
      message: 'Formato esperado: Authorization: Bearer <token>.',
    });
  }

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: keycloakIssuer,
    });

    const userId =
    String(payload.sub || payload.sid || payload.preferred_username || payload.email || '');

    const authenticatedUser: AuthenticatedUser = {
    id: userId,
    email: String(payload.email || payload.preferred_username || ''),
    roles: extractRoles(payload),
    };
    (req as any).authenticatedUser = authenticatedUser;

    return next();
  } catch {
    return res.status(401).json({
      error: 'invalid_access_token',
      message: 'Token de acesso inválido ou expirado.',
    });
  }
}