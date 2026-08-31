import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import * as authService from './auth.service';

export async function register(req: AuthRequest, res: Response) {
  const result = await authService.register(req.body.email, req.body.password);
  res.status(201).json(result);
}

export async function login(req: AuthRequest, res: Response) {
  const result = await authService.login(req.body.email, req.body.password);
  res.json(result);
}

export async function refresh(req: AuthRequest, res: Response) {
  const result = await authService.refresh(req.body.refreshToken);
  res.json(result);
}

export async function logout(req: AuthRequest, res: Response) {
  await authService.logout(req.body.refreshToken);
  res.json({ message: 'Logged out' });
}

export async function me(req: AuthRequest, res: Response) {
  const user = await authService.getMe(req.user!.userId);
  res.json(user);
}
