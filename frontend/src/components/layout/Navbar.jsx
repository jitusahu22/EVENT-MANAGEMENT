import { Menu, Bell, LogOut, Workflow } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar({ setSidebarOpen }) {
  const { logout, role, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white border-b border-slate-200 fixed top-0 right-0 z-30 w-full lg:w-[calc(100%-18rem)] supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2.5 -ml-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Search or Page Context can go here */}
        <div className="hidden lg:flex items-center flex-1">
          <div className="text-sm font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-xl">
            TechEvent Operating System
          </div>
          <a href="/flowchart.pdf" target="_blank" rel="noopener noreferrer" className="ml-4 flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-xl transition-all">
            <Workflow className="h-4 w-4" />
            View Flowchart
          </a>
        </div>

        {/* Right side actions */}
        <div className="flex justify-end items-center gap-3">
          {/* Bell Icon */}
          <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative group">
            <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            <Bell className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-extrabold text-slate-900">
                {user?.username || 'User'}
              </p>
              <p className="text-xs font-bold text-slate-500 capitalize">
                {role} Account
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
              {user?.username ? user.username[0].toUpperCase() : 'U'}
            </div>
            <button
              onClick={handleLogout}
              className="p-2.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
