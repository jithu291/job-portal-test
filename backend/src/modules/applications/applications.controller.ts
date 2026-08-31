import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import * as applicationsService from './applications.service';

export async function apply(req: AuthRequest, res: Response) {
  const body = { ...req.body };
  if (body.resumeUrl === '') delete body.resumeUrl;
  const result = await applicationsService.apply(req.user!.userId, body);
  res.status(201).json(result);
}

export async function myApplications(req: AuthRequest, res: Response) {
  const { page, limit } = res.locals.query;
  const result = await applicationsService.getMyApplications(req.user!.userId, page, limit);
  res.json(result);
}

export async function jobApplications(req: AuthRequest, res: Response) {
  const { page, limit } = res.locals.query;
  const result = await applicationsService.getJobApplications(String(req.params.jobId), page, limit);
  res.json(result);
}

export async function checkApplied(req: AuthRequest, res: Response) {
  const applied = await applicationsService.hasApplied(req.user!.userId, String(req.params.jobId));
  res.json({ applied });
}
