import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  School, 
  Award, 
  User as UserIcon, 
  ShieldAlert, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import useAuth from '../features/auth/hooks/useAuth';

export const Layout: React.FC = () => {
  const { user, isAuthenticated, isInitializing, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  React.useEffect(() => {
    if (!isInitializing) {
      if (!isAuthenticated || !user) {
        navigate('/login', { replace: true });
      } else if (location.pathname.startsWith('/admin') && user.role !== 'admin') {
        navigate('/courses', { replace: true });
      }
    }
  }, [isInitializing, isAuthenticated, user, location.pathname, navigate]);

  const navItems = [
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'Classrooms', path: '/classrooms', icon: School },
    { name: 'Certificates', path: '/certificates', icon: Award },
    { name: 'My Profile', path: '/profile/me', icon: UserIcon },
  ];

  // Render Admin Link if user is Admin
  const isAdmin = user?.role === 'admin';
  if (isAdmin) {
    navItems.push({ name: 'Admin Panel', path: '/admin', icon: ShieldAlert });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col md:flex-row text-gray-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-zinc-800">
          <Link to="/courses" className="flex items-center gap-2.5">
            <div className="p-1.5 bg-violet-600 rounded-lg text-white">
              <School size={20} />
            </div>
            <span className="font-black text-lg tracking-tight bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">EduLink</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400' 
                    : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
          {user && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl mb-4">
              <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold uppercase text-sm">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-xs truncate text-gray-400 dark:text-zinc-500 capitalize">{user.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-200"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden h-16 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-4 sticky top-0 z-40">
        <button 
          onClick={toggleSidebar}
          className="p-2 text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
        >
          <Menu size={20} />
        </button>

        <Link to="/courses" className="flex items-center gap-2">
          <div className="p-1 bg-violet-600 rounded-lg text-white">
            <School size={16} />
          </div>
          <span className="font-black text-md bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">EduLink</span>
        </Link>

        <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold uppercase text-sm">
          {user?.name.charAt(0) || 'U'}
        </div>
      </header>

      {/* Mobile Drawer Sidebar */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs" onClick={toggleSidebar} />
          <aside className="relative flex flex-col w-72 bg-white dark:bg-zinc-900 h-full p-4 border-r border-gray-200 dark:border-zinc-800">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800 mb-6">
              <span className="font-black text-lg bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">EduLink Menu</span>
              <button 
                onClick={toggleSidebar}
                className="p-2 text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={toggleSidebar}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive 
                        ? 'bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400' 
                        : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-gray-150 dark:border-zinc-850">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-200"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 max-w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
