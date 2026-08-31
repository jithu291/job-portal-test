import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  clearJobError,
  createJob,
  fetchJobById,
  resetSelectedJob,
  updateJob,
} from '../../features/jobs/jobsSlice';
import PageHeader from '../../components/common/PageHeader';
import ErrorAlert from '../../components/common/ErrorAlert';
import { EXPERIENCE_LEVELS, JOB_CATEGORIES, JOB_STATUSES } from '../../types';

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.enum(['ENGINEERING', 'DESIGN', 'MARKETING', 'SALES', 'OPERATIONS', 'HR', 'OTHER']),
  experienceLevel: z.enum(['INTERN', 'JUNIOR', 'MID', 'SENIOR', 'LEAD']),
  location: z.string().min(2, 'Location is required'),
  companyName: z.string().min(2, 'Company name is required'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED']),
});

type FormData = z.infer<typeof schema>;

export default function JobFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedJob, detailStatus, formStatus, error } = useAppSelector((s) => s.jobs);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'DRAFT', category: 'ENGINEERING', experienceLevel: 'MID' },
  });

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchJobById(id));
    }
    return () => { dispatch(resetSelectedJob()); };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (selectedJob && isEdit) {
      reset({
        title: selectedJob.title,
        description: selectedJob.description,
        category: selectedJob.category,
        experienceLevel: selectedJob.experienceLevel,
        location: selectedJob.location,
        companyName: selectedJob.companyName,
        status: selectedJob.status,
      });
    }
  }, [selectedJob, isEdit, reset]);

  const onSubmit = async (data: FormData) => {
    dispatch(clearJobError());
    const result = isEdit
      ? await dispatch(updateJob({ id: id!, ...data }))
      : await dispatch(createJob(data));

    const action = isEdit ? updateJob : createJob;
    if (action.fulfilled.match(result)) {
      navigate('/admin/jobs');
    }
  };

  if (isEdit && detailStatus === 'loading') {
    return <p className="text-slate-500">Loading...</p>;
  }

  return (
    <div className="w-full">
      <PageHeader title={isEdit ? 'Edit Job' : 'Create Job'} />

      {error && formStatus === 'failed' && (
        <ErrorAlert message={error} onClose={() => dispatch(clearJobError())} />
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full bg-white rounded-lg border border-slate-200 p-4 sm:p-6 lg:p-8"
      >
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input {...register('title')} className="field-input" />
              {errors.title && <p className="field-error">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                <input {...register('companyName')} className="field-input" />
                {errors.companyName && <p className="field-error">{errors.companyName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input {...register('location')} className="field-input" />
                {errors.location && <p className="field-error">{errors.location.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select {...register('category')} className="field-input">
                  {JOB_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Experience</label>
                <select {...register('experienceLevel')} className="field-input">
                  {EXPERIENCE_LEVELS.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select {...register('status')} className="field-input">
                  {JOB_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col min-h-[220px] xl:min-h-0">
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              {...register('description')}
              className="field-input flex-1 min-h-[220px] xl:min-h-[320px] resize-y"
            />
            {errors.description && <p className="field-error">{errors.description.message}</p>}
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 mt-6 border-t border-slate-100">
          <button
            type="submit"
            disabled={formStatus === 'loading'}
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {formStatus === 'loading' ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/jobs')}
            className="w-full sm:w-auto px-5 py-2.5 text-sm border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
