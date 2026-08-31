import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { deleteJob, fetchJobs, setFilters } from '../../features/jobs/jobsSlice';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import ErrorAlert from '../../components/common/ErrorAlert';
import { EXPERIENCE_LEVELS, JOB_CATEGORIES } from '../../types';

export default function JobListPage() {
  const dispatch = useAppDispatch();
  const { list, meta, filters, listStatus, error } = useAppSelector((s) => s.jobs);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch, filters]);

  const applySearch = () => {
    dispatch(setFilters({ search: searchInput, page: 1 }));
  };

  const handleFilterChange = (key: string, value: string) => {
    dispatch(setFilters({ [key]: value, page: 1 }));
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteJob(id));
    setDeleteId(null);
    dispatch(fetchJobs());
  };

  return (
    <div>
      <PageHeader
        title="Jobs"
        subtitle="Manage job postings"
        action={
          <Link
            to="/admin/jobs/new"
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
          >
            Add Job
          </Link>
        }
      />

      {error && listStatus === 'failed' && <ErrorAlert message={error} />}

      <div className="bg-white rounded-lg border border-slate-200 mb-4 p-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search title, company, location..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applySearch()}
          className="px-3 py-2 border border-slate-300 rounded-md text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={applySearch}
          className="px-4 py-2 text-sm border border-slate-300 rounded-md hover:bg-slate-50"
        >
          Search
        </button>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Categories</option>
          {JOB_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <select
          value={filters.experienceLevel}
          onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Levels</option>
          {EXPERIENCE_LEVELS.map((l) => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Company</th>
              <th className="px-5 py-3 font-medium">Location</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Level</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listStatus === 'loading' ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-slate-400">Loading...</td>
              </tr>
            ) : list.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-slate-400">No jobs found</td>
              </tr>
            ) : (
              list.map((job) => (
                <tr key={job.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium">{job.title}</td>
                  <td className="px-5 py-3 text-slate-600">{job.companyName}</td>
                  <td className="px-5 py-3 text-slate-600">{job.location}</td>
                  <td className="px-5 py-3 text-slate-600">{job.category}</td>
                  <td className="px-5 py-3 text-slate-600">{job.experienceLevel}</td>
                  <td className="px-5 py-3"><StatusBadge status={job.status} /></td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-3">
                      <Link to={`/admin/jobs/${job.id}/applications`} className="text-indigo-600 hover:underline">
                        Applications
                      </Link>
                      <Link to={`/admin/jobs/${job.id}/edit`} className="text-indigo-600 hover:underline">
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteId(job.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={meta.page}
        totalPages={meta.totalPages}
        onPageChange={(page) => dispatch(setFilters({ page }))}
      />

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h3 className="font-medium mb-2">Delete Job</h3>
            <p className="text-sm text-slate-600 mb-4">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm border border-slate-300 rounded-md hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
