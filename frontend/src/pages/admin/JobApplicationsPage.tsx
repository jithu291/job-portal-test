import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchJobById } from '../../features/jobs/jobsSlice';
import { fetchJobApplications, resetJobApplications } from '../../features/applications/applicationsSlice';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';

export default function JobApplicationsPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { selectedJob } = useAppSelector((s) => s.jobs);
  const { jobApplications, jobAppsStatus } = useAppSelector((s) => s.applications);

  useEffect(() => {
    if (id) {
      dispatch(fetchJobById(id));
      dispatch(fetchJobApplications(id));
    }
    return () => { dispatch(resetJobApplications()); };
  }, [dispatch, id]);

  return (
    <div>
      <Link to="/admin/jobs" className="text-sm text-indigo-600 hover:underline mb-4 inline-block">
        &larr; Back to jobs
      </Link>

      <PageHeader
        title="Applications"
        subtitle={selectedJob ? `${selectedJob.title} at ${selectedJob.companyName}` : 'Loading...'}
      />

      {jobAppsStatus === 'loading' ? (
        <p className="text-slate-500">Loading...</p>
      ) : jobApplications.length === 0 ? (
        <EmptyState message="No applications yet" />
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="px-5 py-3 font-medium">Applicant</th>
                <th className="px-5 py-3 font-medium">Cover Letter</th>
                <th className="px-5 py-3 font-medium">Resume</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Applied</th>
              </tr>
            </thead>
            <tbody>
              {jobApplications.map((app) => (
                <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium">{app.user?.email}</td>
                  <td className="px-5 py-3 text-slate-600 max-w-xs truncate" title={app.coverLetter}>
                    {app.coverLetter}
                  </td>
                  <td className="px-5 py-3">
                    {app.resumeUrl ? (
                      <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                        View
                      </a>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={app.status} /></td>
                  <td className="px-5 py-3 text-slate-600">{new Date(app.appliedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
