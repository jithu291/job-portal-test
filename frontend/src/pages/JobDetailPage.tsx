import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchPublicJobById, resetSelectedPublicJob } from '../features/publicJobs/publicJobsSlice';
import { checkApplied, clearApplicationError, submitApplication } from '../features/applications/applicationsSlice';
import PageContainer from '../components/common/PageContainer';
import ErrorAlert from '../components/common/ErrorAlert';
import { EXPERIENCE_LEVELS, JOB_CATEGORIES } from '../types';

const schema = z.object({
  coverLetter: z.string().min(20, 'Cover letter must be at least 20 characters'),
  resumeUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

export default function JobDetailPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedJob, detailStatus, error } = useAppSelector((s) => s.publicJobs);
  const { user } = useAppSelector((s) => s.auth);
  const { appliedJobIds, submitStatus, error: appError } = useAppSelector((s) => s.applications);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchPublicJobById(id));
      if (user?.role === 'USER') dispatch(checkApplied(id));
    }
    return () => { dispatch(resetSelectedPublicJob()); };
  }, [dispatch, id, user]);

  const onSubmit = async (data: FormData) => {
    if (!id) return;
    dispatch(clearApplicationError());
    const payload: any = { jobId: id, coverLetter: data.coverLetter };
    if (data.resumeUrl) payload.resumeUrl = data.resumeUrl;
    const result = await dispatch(submitApplication(payload));
    if (submitApplication.fulfilled.match(result)) {
      setShowForm(false);
    }
  };

  const handleApplyClick = () => {
    if (!user) {
      navigate(`/login?redirect=/jobs/${id}`);
      return;
    }
    if (user.role === 'ADMIN') return;
    setShowForm(true);
  };

  if (detailStatus === 'loading') {
    return (
      <PageContainer className="py-10">
        <div className="card h-96 animate-pulse bg-slate-100" />
      </PageContainer>
    );
  }

  if (detailStatus === 'failed' || !selectedJob) {
    return (
      <PageContainer className="py-10 text-center">
        <p className="text-slate-500 text-lg">Job not found</p>
        <Link to="/jobs" className="text-indigo-600 hover:underline mt-4 inline-block">Back to jobs</Link>
      </PageContainer>
    );
  }

  const catLabel = JOB_CATEGORIES.find((c) => c.value === selectedJob.category)?.label;
  const expLabel = EXPERIENCE_LEVELS.find((l) => l.value === selectedJob.experienceLevel)?.label;
  const applied = id ? appliedJobIds[id] : false;

  return (
    <div className="w-full py-8 sm:py-10">
      <PageContainer>
        <Link to="/jobs" className="inline-flex items-center text-sm text-indigo-600 hover:underline mb-6">
          &larr; Back to all jobs
        </Link>

        {error && <ErrorAlert message={error} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6 sm:p-8 w-full">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 break-words">{selectedJob.title}</h1>
              <p className="text-slate-600 mt-2 text-lg">{selectedJob.companyName}</p>
              <p className="text-slate-500 mt-1">{selectedJob.location}</p>
              <div className="flex flex-wrap gap-2 mt-5">
                <span className="text-xs px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full font-medium">{catLabel}</span>
                <span className="text-xs px-3 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">{expLabel}</span>
              </div>
              <p className="text-sm text-slate-400 mt-4">
                Posted {new Date(selectedJob.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="card p-6 sm:p-8 w-full">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Job Description</h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap break-words">{selectedJob.description}</p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6 lg:sticky lg:top-24 w-full">
              <h3 className="font-semibold text-slate-900 mb-4">Apply for this position</h3>
              {applied ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium text-sm">Application submitted</p>
                  <p className="text-green-600 text-xs mt-1">We'll review your application soon.</p>
                </div>
              ) : user?.role === 'ADMIN' ? (
                <p className="text-slate-500 text-sm">Admin accounts cannot apply for jobs.</p>
              ) : showForm ? (
                <div>
                  {appError && <ErrorAlert message={appError} onClose={() => dispatch(clearApplicationError())} />}
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Cover Letter</label>
                      <textarea {...register('coverLetter')} rows={6} className="field-input resize-y" placeholder="Tell us why you're a great fit..." />
                      {errors.coverLetter && <p className="field-error">{errors.coverLetter.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Resume URL (optional)</label>
                      <input {...register('resumeUrl')} className="field-input" placeholder="https://..." />
                      {errors.resumeUrl && <p className="field-error">{errors.resumeUrl.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button type="submit" disabled={submitStatus === 'loading'} className="btn-primary w-full">
                        {submitStatus === 'loading' ? 'Submitting...' : 'Submit Application'}
                      </button>
                      <button type="button" onClick={() => setShowForm(false)} className="btn-outline w-full">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <>
                  <p className="text-sm text-slate-500 mb-4">
                    {user ? 'Ready to apply? Fill out a short application below.' : 'Sign in to apply for this job.'}
                  </p>
                  <button onClick={handleApplyClick} className="btn-primary w-full py-3">
                    {user ? 'Apply Now' : 'Sign in to Apply'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
