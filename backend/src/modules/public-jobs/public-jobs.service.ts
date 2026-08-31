import { prisma } from '../../config/db';
import { AppError } from '../../utils/AppError';

type ListQuery = {
  page: number;
  limit: number;
  category?: string;
  experienceLevel?: string;
  location?: string;
  search?: string;
  sort?: string;
  publishedOnly?: boolean;
};

function buildWhere(query: Omit<ListQuery, 'page' | 'limit' | 'sort'>) {
  const where: any = {};
  if (query.publishedOnly) where.status = 'PUBLISHED';
  if (query.category) where.category = query.category;
  if (query.experienceLevel) where.experienceLevel = query.experienceLevel;
  if (query.location) {
    where.location = { contains: query.location, mode: 'insensitive' };
  }
  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: 'insensitive' } },
      { companyName: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
      { location: { contains: query.search, mode: 'insensitive' } },
    ];
  }
  return where;
}

const publicSelect = {
  id: true,
  title: true,
  description: true,
  category: true,
  experienceLevel: true,
  location: true,
  companyName: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

export async function listPublicJobs(query: ListQuery) {
  const { page, limit, sort } = query;
  const skip = (page - 1) * limit;
  const where = buildWhere({ ...query, publishedOnly: true });

  const [data, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: sort === 'oldest' ? 'asc' : 'desc' },
      select: publicSelect,
    }),
    prisma.job.count({ where }),
  ]);

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getFeaturedJobs() {
  return prisma.job.findMany({
    where: { status: 'PUBLISHED' },
    take: 6,
    orderBy: { createdAt: 'desc' },
    select: publicSelect,
  });
}

export async function getCategoryCounts() {
  const groups = await prisma.job.groupBy({
    by: ['category'],
    where: { status: 'PUBLISHED' },
    _count: { category: true },
  });
  return groups.map((g) => ({ category: g.category, count: g._count.category }));
}

export async function getPublicJob(id: string) {
  const job = await prisma.job.findFirst({
    where: { id, status: 'PUBLISHED' },
    select: publicSelect,
  });
  if (!job) throw new AppError('Job not found', 404);
  return job;
}
