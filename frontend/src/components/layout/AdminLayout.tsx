import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logoutUser } from '../../features/auth/authSlice';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/jobs', label: 'Jobs', end: false },
];

export default function AdminLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="w-full md:w-60 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-4 md:p-5 border-b border-slate-700">
          <h1 className="text-lg font-semibold">Job Portal</h1>
          <p className="text-xs text-slate-400 mt-1">Admin Panel</p>
        </div>
        <nav className="flex md:flex-col gap-1 p-3 overflow-x-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm whitespace-nowrap ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6">
          <span className="text-sm text-slate-600">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Logout
          </button>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
