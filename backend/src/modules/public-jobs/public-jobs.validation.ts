import { z } from 'zod';

export const publicJobListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  category: z.enum(['ENGINEERING', 'DESIGN', 'MARKETING', 'SALES', 'OPERATIONS', 'HR', 'OTHER']).optional(),
  experienceLevel: z.enum(['INTERN', 'JUNIOR', 'MID', 'SENIOR', 'LEAD']).optional(),
  location: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(['newest', 'oldest']).default('newest'),
});
