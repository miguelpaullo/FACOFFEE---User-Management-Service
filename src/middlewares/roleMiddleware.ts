import type { Request, Response, NextFunction } from 'express';

export function requireManager(
  req: Request,
  res: Response,
  next: NextFunction,
) {

  const user = (req as any).authenticatedUser;

  if (!user) {
    return res.status(401).json({
      error: 'unauthenticated',
    });
  }

  if (!user.roles.includes('MANAGER')) {
    return res.status(403).json({
      error: 'forbidden',
      message: 'Acesso permitido apenas para MANAGER.',
    });
  }

  next();
}