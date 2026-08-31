import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchPublicJobs, setPublicFilters } from '../features/publicJobs/publicJobsSlice';
import JobCard from '../components/common/JobCard';
import PageContainer from '../components/common/PageContainer';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import ErrorAlert from '../components/common/ErrorAlert';
import { EXPERIENCE_LEVELS, JOB_CATEGORIES } from '../types';

export default function JobsPage() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { list, meta, filters, listStatus, error } = useAppSelector((s) => s.publicJobs);

  const [searchInput, setSearchInput] = useState(filters.search);
  const [locationInput, setLocationInput] = useState(filters.location);

  useEffect(() => {
    const category = searchParams.get('category') || '';
    const page = Number(searchParams.get('page')) || 1;
    dispatch(setPublicFilters({ category: category as any, page, search: '', location: '', experienceLevel: '' }));
  }, []);

  useEffect(() => {
    dispatch(fetchPublicJobs());
  }, [dispatch, filters]);

  const updateFilter = (key: string, value: string | number) => {
    const page = key === 'page' ? Number(value) : 1;
    dispatch(setPublicFilters({ [key]: value, page: key === 'page' ? Number(value) : page }));
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, String(value));
    else params.delete(key);
    if (key !== 'page') params.set('page', '1');
    setSearchParams(params);
  };

  const applySearch = () => {
    dispatch(setPublicFilters({ search: searchInput, location: locationInput, page: 1 }));
    dispatch(fetchPublicJobs());
  };

  const clearFilters = () => {
    setSearchInput('');
    setLocationInput('');
    dispatch(setPublicFilters({
      search: '', location: '', category: '', experienceLevel: '', page: 1, sort: 'newest',
    }));
    setSearchParams({});
  };

  return (
    <div className="w-full py-8 sm:py-10">
      <PageContainer>
        <div className="mb-8">
          <h1 className="section-title">Browse Jobs</h1>
          <p className="section-subtitle">
            {listStatus === 'succeeded' ? `${meta.total} job${meta.total !== 1 ? 's' : ''} found` : 'Search and filter openings'}
          </p>
        </div>

        {error && listStatus === 'failed' && <ErrorAlert message={error} />}

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full">
          <aside className="w-full lg:w-72 xl:w-80 shrink-0">
            <div className="card p-5 space-y-4 lg:sticky lg:top-24">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Filters</h2>
                <button onClick={clearFilters} className="text-xs text-indigo-600 hover:underline">
                  Clear all
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Search</label>
                <input
                  type="text"
                  placeholder="Job title, company..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                  className="field-input"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Location</label>
                <input
                  type="text"
                  placeholder="City, remote..."
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                  className="field-input"
                />
              </div>
              <button onClick={applySearch} className="btn-primary w-full">
                Apply Filters
              </button>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="field-input"
                >
                  <option value="">All Categories</option>
                  {JOB_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Experience</label>
                <select
                  value={filters.experienceLevel}
                  onChange={(e) => updateFilter('experienceLevel', e.target.value)}
                  className="field-input"
                >
                  <option value="">All Levels</option>
                  {EXPERIENCE_LEVELS.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Sort by</label>
                <select
                  value={filters.sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="field-input"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0 w-full">
            {listStatus === 'loading' ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card h-28 animate-pulse bg-slate-100" />
                ))}
              </div>
            ) : list.length === 0 ? (
              <EmptyState message="No jobs match your filters" />
            ) : (
              <div className="space-y-4 w-full">
                {list.map((job) => (
                  <JobCard key={job.id} job={job} variant="list" />
                ))}
              </div>
            )}
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              onPageChange={(page) => updateFilter('page', page)}
            />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
