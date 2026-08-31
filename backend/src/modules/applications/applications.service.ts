import { prisma } from '../../config/db';
import { AppError } from '../../utils/AppError';

export async function apply(userId: string, data: { jobId: string; coverLetter: string; resumeUrl?: string }) {
  const job = await prisma.job.findFirst({
    where: { id: data.jobId, status: 'PUBLISHED' },
  });
  if (!job) throw new AppError('Job not available for application', 404);

  const existing = await prisma.application.findUnique({
    where: { userId_jobId: { userId, jobId: data.jobId } },
  });
  if (existing) throw new AppError('You have already applied to this job', 409);

  return prisma.application.create({
    data: {
      userId,
      jobId: data.jobId,
      coverLetter: data.coverLetter,
      resumeUrl: data.resumeUrl || null,
    },
    include: {
      job: { select: { id: true, title: true, companyName: true } },
    },
  });
}

export async function getMyApplications(userId: string, page: number, limit: number) {
  const skip = (page - 1) * limit;
  const where = { userId };

  const [data, total] = await Promise.all([
    prisma.application.findMany({
      where,
      skip,
      take: limit,
      orderBy: { appliedAt: 'desc' },
      include: {
        job: {
          select: { id: true, title: true, companyName: true, location: true, status: true },
        },
      },
    }),
    prisma.application.count({ where }),
  ]);

  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function getJobApplications(jobId: string, page: number, limit: number) {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new AppError('Job not found', 404);

  const skip = (page - 1) * limit;
  const where = { jobId };

  const [data, total] = await Promise.all([
    prisma.application.findMany({
      where,
      skip,
      take: limit,
      orderBy: { appliedAt: 'desc' },
      include: {
        user: { select: { id: true, email: true } },
      },
    }),
    prisma.application.count({ where }),
  ]);

  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function hasApplied(userId: string, jobId: string) {
  const app = await prisma.application.findUnique({
    where: { userId_jobId: { userId, jobId } },
  });
  return !!app;
}
