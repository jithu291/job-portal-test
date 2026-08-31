import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logoutUser } from '../../features/auth/authSlice';
import PageContainer from '../common/PageContainer';

export default function PublicLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <PageContainer className="h-16 flex items-center justify-between gap-4">
          <Link to="/" className="text-xl font-bold text-indigo-600 shrink-0">
            Job Portal
          </Link>
          <nav className="flex items-center flex-wrap justify-end gap-x-5 gap-y-2 text-sm">
            <Link to="/jobs" className="text-slate-600 hover:text-indigo-600 font-medium transition">
              Browse Jobs
            </Link>
            {user?.role === 'USER' ? (
              <>
                <Link to="/my-applications" className="text-slate-600 hover:text-indigo-600 font-medium transition">
                  My Applications
                </Link>
                <span className="text-slate-400 hidden md:inline truncate max-w-[180px]">{user.email}</span>
                <button onClick={handleLogout} className="text-slate-600 hover:text-indigo-600 font-medium transition">
                  Logout
                </button>
              </>
            ) : user?.role === 'ADMIN' ? (
              <Link to="/admin" className="btn-primary py-2 px-4 text-sm">
                Admin Panel
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-medium transition">
                  Login
                </Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm">
                  Register
                </Link>
              </>
            )}
          </nav>
        </PageContainer>
      </header>

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <footer className="w-full bg-slate-900 text-slate-400 mt-auto">
        <PageContainer className="py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-semibold text-white text-lg">Job Portal</p>
              <p className="text-sm mt-1">Find your next opportunity</p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link to="/jobs" className="hover:text-white transition">Browse Jobs</Link>
              <Link to="/login" className="hover:text-white transition">Login</Link>
              <Link to="/register" className="hover:text-white transition">Register</Link>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-8 pt-6 border-t border-slate-800 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Job Portal. All rights reserved.
          </p>
        </PageContainer>
      </footer>
    </div>
  );
}
