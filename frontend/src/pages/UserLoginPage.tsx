import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearAuthError, loginUser } from '../features/auth/authSlice';
import PageContainer from '../components/common/PageContainer';
import ErrorAlert from '../components/common/ErrorAlert';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function UserLoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { status, error, accessToken, user } = useAppSelector((s) => s.auth);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (accessToken && user) {
      const redirect = searchParams.get('redirect');
      if (user.role === 'ADMIN') navigate('/admin', { replace: true });
      else navigate(redirect || '/', { replace: true });
    }
  }, [accessToken, user, navigate, searchParams]);

  const onSubmit = async (data: FormData) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      const redirect = searchParams.get('redirect');
      if (result.payload.user.role === 'ADMIN') navigate('/admin');
      else navigate(redirect || '/');
    }
  };

  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center py-12">
      <PageContainer className="flex justify-center">
        <div className="w-full max-w-md card p-8 sm:p-10">
          <h1 className="text-2xl font-bold text-center text-slate-900">Welcome back</h1>
          <p className="text-slate-500 text-center text-sm mt-2 mb-8">Sign in to your account</p>
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
            <button type="submit" disabled={status === 'loading'} className="btn-primary w-full py-3">
              {status === 'loading' ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-sm text-center text-slate-500 mt-6">
            No account? <Link to="/register" className="text-indigo-600 font-medium hover:underline">Register</Link>
          </p>
        </div>
      </PageContainer>
    </div>
  );
}
