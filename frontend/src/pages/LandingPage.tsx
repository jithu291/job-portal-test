import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchFeaturedJobs, fetchCategoryCounts } from '../features/publicJobs/publicJobsSlice';
import JobCard from '../components/common/JobCard';
import PageContainer from '../components/common/PageContainer';
import EmptyState from '../components/common/EmptyState';
import { JOB_CATEGORIES } from '../types';

export default function LandingPage() {
  const dispatch = useAppDispatch();
  const { featured, categories, featuredStatus } = useAppSelector((s) => s.publicJobs);

  useEffect(() => {
    dispatch(fetchFeaturedJobs());
    dispatch(fetchCategoryCounts());
  }, [dispatch]);

  const totalJobs = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="w-full">
      <section className="w-full bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 text-white">
        <PageContainer className="py-16 sm:py-24 lg:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Find Your Next Opportunity
            </h1>
            <p className="mt-5 text-indigo-100 text-lg sm:text-xl leading-relaxed">
              Browse job openings from top companies. Apply in minutes and track your applications.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/jobs" className="btn-primary bg-white text-indigo-700 hover:bg-indigo-50 px-8 py-3 text-base">
                Browse Jobs
              </Link>
              <Link to="/register" className="btn-outline border-white/40 text-white hover:bg-white/10 px-8 py-3 text-base">
                Create Account
              </Link>
            </div>
          </div>
          {totalJobs > 0 && (
            <p className="mt-10 text-indigo-200 text-sm">
              {totalJobs} open position{totalJobs !== 1 ? 's' : ''} available
            </p>
          )}
        </PageContainer>
      </section>

      <section className="w-full py-12 sm:py-16">
        <PageContainer>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="section-title">Featured Jobs</h2>
              <p className="section-subtitle">Recently posted opportunities</p>
            </div>
            <Link to="/jobs" className="text-indigo-600 font-medium hover:underline text-sm">
              View all jobs &rarr;
            </Link>
          </div>
          {featuredStatus === 'loading' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card h-40 animate-pulse bg-slate-100" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <EmptyState message="No jobs available right now" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
              {featured.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </PageContainer>
      </section>

      <section className="w-full bg-white border-y border-slate-200 py-12 sm:py-16">
        <PageContainer>
          <div className="mb-8">
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-subtitle">Explore jobs in your field</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 w-full">
            {JOB_CATEGORIES.map((cat) => {
              const count = categories.find((c) => c.category === cat.value)?.count || 0;
              return (
                <Link
                  key={cat.value}
                  to={`/jobs?category=${cat.value}`}
                  className="card p-4 sm:p-5 text-center hover:border-indigo-300 hover:shadow-md transition group"
                >
                  <p className="font-semibold text-slate-900 text-sm sm:text-base group-hover:text-indigo-600 transition">
                    {cat.label}
                  </p>
                  <p className="text-sm text-slate-500 mt-2">{count} job{count !== 1 ? 's' : ''}</p>
                </Link>
              );
            })}
          </div>
        </PageContainer>
      </section>
    </div>
  );
}
