import { Link } from 'react-router-dom';
import type { PublicJob } from '../../types';
import { JOB_CATEGORIES, EXPERIENCE_LEVELS } from '../../types';

const catLabel = (v: string) => JOB_CATEGORIES.find((c) => c.value === v)?.label || v;
const expLabel = (v: string) => EXPERIENCE_LEVELS.find((l) => l.value === v)?.label || v;

interface Props {
  job: PublicJob;
  variant?: 'grid' | 'list';
}

export default function JobCard({ job, variant = 'grid' }: Props) {
  if (variant === 'list') {
    return (
      <Link
        to={`/jobs/${job.id}`}
        className="card flex flex-col sm:flex-row sm:items-center gap-4 p-5 sm:p-6 w-full hover:border-indigo-300 hover:shadow-md transition group"
      >
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 text-lg group-hover:text-indigo-600 transition">
            {job.title}
          </h3>
          <p className="text-sm text-slate-600 mt-1">{job.companyName} &middot; {job.location}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full font-medium">
              {catLabel(job.category)}
            </span>
            <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">
              {expLabel(job.experienceLevel)}
            </span>
          </div>
        </div>
        <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-2 shrink-0">
          <span className="text-xs text-slate-400">{new Date(job.createdAt).toLocaleDateString()}</span>
          <span className="text-sm font-medium text-indigo-600 group-hover:underline">View details</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="card block p-5 h-full hover:border-indigo-300 hover:shadow-md transition group"
    >
      <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition">{job.title}</h3>
      <p className="text-sm text-slate-600 mt-1">{job.companyName} &middot; {job.location}</p>
      <div className="flex flex-wrap gap-2 mt-3">
        <span className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full font-medium">
          {catLabel(job.category)}
        </span>
        <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">
          {expLabel(job.experienceLevel)}
        </span>
      </div>
      <p className="text-xs text-slate-400 mt-4">{new Date(job.createdAt).toLocaleDateString()}</p>
    </Link>
  );
}
