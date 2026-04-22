import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CreditCard,
  BarChart3,
  X,
  Sparkles,
  Wrench
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { role } = useAuth();
  const isAdmin = role === 'admin';

  const navigation = isAdmin ? [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Transactions', href: '/admin/transactions', icon: CreditCard },
    { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { name: 'Maintenance', href: '/admin/maintenance', icon: Wrench },
    { name: 'Add Membership', href: '/admin/memberships/add', icon: UserPlus },
    { name: 'Update Membership', href: '/admin/memberships/update', icon: Users },
  ] : [
    { name: 'Dashboard', href: '/user', icon: LayoutDashboard },
    { name: 'Transactions', href: '/user/transactions', icon: CreditCard },
    { name: 'Reports', href: '/user/reports', icon: BarChart3 },
  ];

  return (
    <>
      <style>{`
        .sidebar-link { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .sidebar-link:hover { transform: translateX(3px); }
        .sidebar-link.active { transform: translateX(0); }
        .nav-pill {
          position: relative;
          overflow: hidden;
        }
        .nav-pill::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.08) 100%);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .nav-pill:hover::before { opacity: 1; }
        .active-pill {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%) !important;
          box-shadow: 0 4px 20px rgba(99,102,241,0.35);
        }
        .sidebar-glow {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
        }
      `}</style>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:fixed flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #fafaff 100%)',
          borderRight: '1px solid rgba(99,102,241,0.1)',
          boxShadow: '4px 0 40px rgba(0,0,0,0.06)'
        }}>

        {/* Decorative glows */}
        <div className="sidebar-glow" style={{ top: '-60px', right: '-60px', background: 'rgba(99,102,241,0.06)' }}></div>
        <div className="sidebar-glow" style={{ bottom: '20px', left: '-80px', background: 'rgba(139,92,246,0.05)' }}></div>

        {/* Header */}
        <div className="flex h-16 items-center px-6 justify-between flex-shrink-0 relative" style={{ borderBottom: '1px solid rgba(99,102,241,0.08)' }}>
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
            <img src="/logo.png" alt="TechEvent Logo" className="h-7 object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
          </Link>
          <button
            className="lg:hidden p-2 rounded-xl transition-colors hover:bg-slate-100 text-slate-400"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Role Badge */}
        <div className="px-5 pt-5 pb-2">
          <div className="px-3 py-2 rounded-xl text-xs font-700 tracking-wide" style={{
            background: isAdmin ? 'linear-gradient(135deg, rgba(79,70,229,0.08), rgba(124,58,237,0.08))' : 'rgba(16,185,129,0.08)',
            color: isAdmin ? '#4f46e5' : '#059669',
            border: `1px solid ${isAdmin ? 'rgba(79,70,229,0.15)' : 'rgba(16,185,129,0.15)'}`,
            fontWeight: 700
          }}>
            {isAdmin ? '⚡ Admin Panel' : '👤 User Portal'}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
          <div className="text-xs font-800 uppercase tracking-widest mb-4 px-3" style={{ color: '#94a3b8', letterSpacing: '0.1em', fontWeight: 800 }}>
            Navigation
          </div>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`sidebar-link nav-pill group flex items-center px-4 py-3 text-sm rounded-2xl ${isActive ? 'active-pill active' : ''}`}
                style={!isActive ? { color: '#64748b', fontWeight: 600 } : { color: 'white', fontWeight: 700 }}
              >
                <div className={`mr-3 flex-shrink-0 p-1.5 rounded-lg transition-all ${isActive ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-indigo-50'}`}>
                  <item.icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}`} style={{ transition: 'color 0.2s' }} />
                </div>
                {item.name}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70"></div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 flex-shrink-0" style={{ borderTop: '1px solid rgba(99,102,241,0.08)' }}>
          <div className="px-4 py-3 rounded-2xl text-xs" style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.06))',
            color: '#94a3b8',
            fontWeight: 500
          }}>
            <div style={{ color: '#6366f1', fontWeight: 700, marginBottom: 2 }}>TechEvent Platform</div>
            v2.0 · All systems operational
          </div>
        </div>
      </div>
    </>
  );
}