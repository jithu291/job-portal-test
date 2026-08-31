import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchDashboardStats } from '../../features/jobs/jobsSlice';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import ErrorAlert from '../../components/common/ErrorAlert';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { stats, statsStatus, error } = useAppSelector((s) => s.jobs);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const cards = [
    { label: 'Total Jobs', value: stats?.totalJobs ?? 0 },
    { label: 'Published', value: stats?.publishedJobs ?? 0 },
    { label: 'Draft', value: stats?.draftJobs ?? 0 },
    { label: 'Closed', value: stats?.closedJobs ?? 0 },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of job postings" />

      {error && statsStatus === 'failed' && <ErrorAlert message={error} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg border border-slate-200 p-5">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="text-3xl font-semibold mt-1">
              {statsStatus === 'loading' ? '—' : card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-medium">Recent Jobs</h3>
          <Link to="/admin/jobs" className="text-sm text-indigo-600 hover:underline">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Company</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {statsStatus === 'loading' ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-400">Loading...</td>
                </tr>
              ) : stats?.recentJobs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-400">No jobs yet</td>
                </tr>
              ) : (
                stats?.recentJobs.map((job) => (
                  <tr key={job.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-5 py-3">{job.title}</td>
                    <td className="px-5 py-3 text-slate-600">{job.companyName}</td>
                    <td className="px-5 py-3 text-slate-600">{job.category}</td>
                    <td className="px-5 py-3"><StatusBadge status={job.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
