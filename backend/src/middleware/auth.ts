import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';

export interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

export function authenticate(req: AuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized', 401));
  }

  try {
    const token = header.split(' ')[1];
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
}

export function requireAdmin(req: AuthRequest, _res: Response, next: NextFunction) {
  if (req.user?.role !== 'ADMIN') {
    return next(new AppError('Forbidden', 403));
  }
  next();
}

export function requireUser(req: AuthRequest, _res: Response, next: NextFunction) {
  if (req.user?.role !== 'USER') {
    return next(new AppError('Forbidden', 403));
  }
  next();
}
