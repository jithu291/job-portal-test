import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearAuthError, registerUser } from '../features/auth/authSlice';
import PageContainer from '../components/common/PageContainer';
import ErrorAlert from '../components/common/ErrorAlert';

const schema = z
  .object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error, accessToken } = useAppSelector((s) => s.auth);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (accessToken) navigate('/', { replace: true });
  }, [accessToken, navigate]);

  const onSubmit = async (data: FormData) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) navigate('/');
  };

  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center py-12">
      <PageContainer className="flex justify-center">
        <div className="w-full max-w-md card p-8 sm:p-10">
          <h1 className="text-2xl font-bold text-center text-slate-900">Create account</h1>
          <p className="text-slate-500 text-center text-sm mt-2 mb-8">Start applying to jobs today</p>
          {error && <ErrorAlert message={error} onClose={() => dispatch(clearAuthError())} />}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" {...register('email')} className="field-input" placeholder="you@example.com" />
              {errors.email && <p className="field-error">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input type="password" {...register('password')} className="field-input" />
              {errors.password && <p className="field-error">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
              <input type="password" {...register('confirmPassword')} className="field-input" />
              {errors.confirmPassword && <p className="field-error">{errors.confirmPassword.message}</p>}
            </div>
            <button type="submit" disabled={status === 'loading'} className="btn-primary w-full py-3">
              {status === 'loading' ? 'Creating account...' : 'Register'}
            </button>
          </form>
          <p className="text-sm text-center text-slate-500 mt-6">
            Already have an account? <Link to="/login" className="text-indigo-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </PageContainer>
    </div>
  );
}
