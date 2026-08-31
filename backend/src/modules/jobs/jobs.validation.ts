import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.enum(['ENGINEERING', 'DESIGN', 'MARKETING', 'SALES', 'OPERATIONS', 'HR', 'OTHER']),
  experienceLevel: z.enum(['INTERN', 'JUNIOR', 'MID', 'SENIOR', 'LEAD']),
  location: z.string().min(2, 'Location is required'),
  companyName: z.string().min(2, 'Company name is required'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED']).default('DRAFT'),
});

export const updateJobSchema = createJobSchema.partial();

export const jobListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  category: z.enum(['ENGINEERING', 'DESIGN', 'MARKETING', 'SALES', 'OPERATIONS', 'HR', 'OTHER']).optional(),
  experienceLevel: z.enum(['INTERN', 'JUNIOR', 'MID', 'SENIOR', 'LEAD']).optional(),
  search: z.string().optional(),
});
