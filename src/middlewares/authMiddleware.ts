import { Request, Response, NextFunction } from 'express';
import { AuthenticatedUser } from '../types/authenticatedUser';

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

  // Temporário: depois vamos validar o token JWT de verdade com o Keycloak.
  const authenticatedUser: AuthenticatedUser = {
    id: 'temporary-user-id',
    email: 'temporary@email.com',
    roles: ['MANAGER'],
  };

  (req as any).authenticatedUser = authenticatedUser;

  return next();
}