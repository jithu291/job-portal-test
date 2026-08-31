import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import * as jobsService from './jobs.service';

export async function list(req: AuthRequest, res: Response) {
  const result = await jobsService.listJobs(res.locals.query);
  res.json(result);
}

export async function getOne(req: AuthRequest, res: Response) {
  const job = await jobsService.getJob(String(req.params.id));
  res.json(job);
}

export async function create(req: AuthRequest, res: Response) {
  const job = await jobsService.createJob(req.body, req.user!.userId);
  res.status(201).json(job);
}

export async function update(req: AuthRequest, res: Response) {
  const job = await jobsService.updateJob(String(req.params.id), req.body);
  res.json(job);
}

export async function remove(req: AuthRequest, res: Response) {
  await jobsService.deleteJob(String(req.params.id));
  res.json({ message: 'Job deleted' });
}

export async function stats(_req: AuthRequest, res: Response) {
  const data = await jobsService.getDashboardStats();
  res.json(data);
}
