import { prisma } from '../../config/db';
import { AppError } from '../../utils/AppError';

type ListQuery = {
  page: number;
  limit: number;
  category?: string;
  experienceLevel?: string;
  search?: string;
};

export async function listJobs(query: ListQuery) {
  const { page, limit, category, experienceLevel, search } = query;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (category) where.category = category;
  if (experienceLevel) where.experienceLevel = experienceLevel;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { companyName: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { createdBy: { select: { id: true, email: true } } },
    }),
    prisma.job.count({ where }),
  ]);

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getJob(id: string) {
  const job = await prisma.job.findUnique({
    where: { id },
    include: { createdBy: { select: { id: true, email: true } } },
  });
  if (!job) throw new AppError('Job not found', 404);
  return job;
}

export async function createJob(data: any, userId: string) {
  return prisma.job.create({
    data: { ...data, createdById: userId },
    include: { createdBy: { select: { id: true, email: true } } },
  });
}

export async function updateJob(id: string, data: any) {
  await getJob(id);
  return prisma.job.update({
    where: { id },
    data,
    include: { createdBy: { select: { id: true, email: true } } },
  });
}

export async function deleteJob(id: string) {
  await getJob(id);
  await prisma.job.delete({ where: { id } });
}

export async function getDashboardStats() {
  const [totalJobs, publishedJobs, draftJobs, closedJobs, byCategory] = await Promise.all([
    prisma.job.count(),
    prisma.job.count({ where: { status: 'PUBLISHED' } }),
    prisma.job.count({ where: { status: 'DRAFT' } }),
    prisma.job.count({ where: { status: 'CLOSED' } }),
    prisma.job.groupBy({
      by: ['category'],
      _count: { category: true },
    }),
  ]);

  const recentJobs = await prisma.job.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      companyName: true,
      status: true,
      category: true,
      createdAt: true,
    },
  });

  return {
    totalJobs,
    publishedJobs,
    draftJobs,
    closedJobs,
    byCategory: byCategory.map((c) => ({ category: c.category, count: c._count.category })),
    recentJobs,
  };
}
