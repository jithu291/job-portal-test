import { z } from 'zod';

export const applySchema = z.object({
  jobId: z.string().uuid('Invalid job ID'),
  coverLetter: z.string().min(20, 'Cover letter must be at least 20 characters'),
  resumeUrl: z.string().url('Invalid resume URL').optional(),
});

export const applicationListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
