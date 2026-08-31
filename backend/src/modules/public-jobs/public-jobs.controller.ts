import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import * as publicJobsService from './public-jobs.service';

export async function list(req: AuthRequest, res: Response) {
  const result = await publicJobsService.listPublicJobs(res.locals.query);
  res.json(result);
}

export async function featured(_req: AuthRequest, res: Response) {
  const data = await publicJobsService.getFeaturedJobs();
  res.json(data);
}

export async function categories(_req: AuthRequest, res: Response) {
  const data = await publicJobsService.getCategoryCounts();
  res.json(data);
}

export async function getOne(req: AuthRequest, res: Response) {
  const job = await publicJobsService.getPublicJob(String(req.params.id));
  res.json(job);
}
