import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchMyApplications } from '../features/applications/applicationsSlice';
import PageContainer from '../components/common/PageContainer';
import EmptyState from '../components/common/EmptyState';
import StatusBadge from '../components/common/StatusBadge';

export default function MyApplicationsPage() {
  const dispatch = useAppDispatch();
  const { myList, listStatus } = useAppSelector((s) => s.applications);

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  return (
    <div className="w-full py-8 sm:py-10">
      <PageContainer>
        <div className="mb-8">
          <h1 className="section-title">My Applications</h1>
          <p className="section-subtitle">Track your job applications</p>
        </div>

        {listStatus === 'loading' ? (
          <div className="card h-48 animate-pulse bg-slate-100" />
        ) : myList.length === 0 ? (
          <EmptyState message="You haven't applied to any jobs yet" />
        ) : (
          <div className="card overflow-hidden w-full">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 font-medium">Job</th>
                    <th className="px-6 py-4 font-medium">Company</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Applied</th>
                  </tr>
                </thead>
                <tbody>
                  {myList.map((app) => (
                    <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <Link to={`/jobs/${app.jobId}`} className="text-indigo-600 hover:underline font-medium">
                          {app.job?.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{app.job?.companyName}</td>
                      <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                      <td className="px-6 py-4 text-slate-600">{new Date(app.appliedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
