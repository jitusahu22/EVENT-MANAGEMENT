import { useState, useEffect } from 'react';
import { Loader2, Users, Activity, CreditCard, TrendingUp, CalendarCheck, ArrowUpRight } from 'lucide-react';
import { reportService, transactionService } from '../services/service';

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryData, transactionsData] = await Promise.all([
          reportService.getSummary(),
          transactionService.getTransactions()
        ]);
        setSummary(summaryData);
        setTransactions(transactionsData.slice(0, 6));
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
              <Loader2 className="animate-spin h-7 w-7 text-white" />
            </div>
          </div>
          <p className="text-slate-500 font-medium text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Revenue',
      value: `$${summary?.total_revenue || 0}`,
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      lightBg: 'rgba(79,70,229,0.06)',
      iconColor: '#4f46e5',
      change: '+12%'
    },
    {
      name: 'Total Members',
      value: summary?.total_memberships || 0,
      icon: Users,
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
      lightBg: 'rgba(14,165,233,0.06)',
      iconColor: '#0ea5e9',
      change: '+8%'
    },
    {
      name: 'Active Accounts',
      value: summary?.active_memberships || 0,
      icon: Activity,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      lightBg: 'rgba(16,185,129,0.06)',
      iconColor: '#10b981',
      change: '+5%'
    },
    {
      name: 'Expired / Cancelled',
      value: summary?.expired_memberships || 0,
      icon: CreditCard,
      gradient: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
      lightBg: 'rgba(244,63,94,0.06)',
      iconColor: '#f43f5e',
      change: '-2%'
    },
  ];

  return (
    <div className="space-y-7 pb-8">
      <style>{`
        .stat-card { transition: all 0.25s cubic-bezier(0.4,0,0.2,1); }
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
        .trx-row { transition: background 0.15s; }
        .trx-row:hover { background: rgba(79,70,229,0.03); }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
            Admin Dashboard
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Welcome back! Here's your platform overview for today.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl" style={{
          background: 'linear-gradient(135deg, rgba(79,70,229,0.08), rgba(124,58,237,0.08))',
          color: '#4f46e5',
          border: '1px solid rgba(79,70,229,0.15)'
        }}>
          <CalendarCheck className="h-4 w-4" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card rounded-2xl p-6 relative overflow-hidden" style={{
            background: 'white',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
          }}>
            <div className="absolute top-0 right-0 w-28 h-28 rounded-full" style={{
              background: stat.lightBg,
              filter: 'blur(20px)',
              transform: 'translate(30%, -30%)'
            }}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <div className="p-2.5 rounded-xl" style={{ background: stat.lightBg }}>
                  <stat.icon className="h-5 w-5" style={{ color: stat.iconColor }} />
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{
                  color: stat.change.startsWith('+') ? '#10b981' : '#f43f5e',
                  background: stat.change.startsWith('+') ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)'
                }}>
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900" style={{ letterSpacing: '-0.02em' }}>{stat.value}</p>
              <p className="mt-1 text-sm text-slate-500 font-medium">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl overflow-hidden" style={{
        background: 'white',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
      }}>
        <div className="px-7 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
            <p className="text-xs font-medium text-slate-400 mt-0.5">Latest financial activity on the platform</p>
          </div>
          <button className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl transition-all hover:bg-indigo-50" style={{ color: '#4f46e5' }}>
            View All <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                {['Transaction', 'Membership', 'Type', 'Amount', 'Status', 'Date'].map((h, i) => (
                  <th key={h} className={`px-7 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 ${i === 5 ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-7 py-12 text-center text-slate-400 font-medium text-sm">No transactions found.</td>
                </tr>
              ) : (
                transactions.map((trx) => (
                  <tr key={trx.id} className="trx-row" style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                    <td className="px-7 py-4 font-bold text-slate-800" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      <span className="text-xs font-bold mr-1" style={{ color: '#94a3b8' }}>#</span>{trx.id}
                    </td>
                    <td className="px-7 py-4 font-medium text-slate-600">{trx.membership_name || 'N/A'}</td>
                    <td className="px-7 py-4">
                      <span className="capitalize text-xs font-bold px-2.5 py-1 rounded-lg" style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1' }}>
                        {trx.transaction_type}
                      </span>
                    </td>
                    <td className="px-7 py-4 font-extrabold text-slate-900" style={{ fontVariantNumeric: 'tabular-nums' }}>${trx.amount}</td>
                    <td className="px-7 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize`} style={{
                        background: trx.status === 'completed' ? 'rgba(16,185,129,0.1)' : trx.status === 'failed' ? 'rgba(244,63,94,0.1)' : 'rgba(245,158,11,0.1)',
                        color: trx.status === 'completed' ? '#059669' : trx.status === 'failed' ? '#e11d48' : '#d97706'
                      }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{
                          background: trx.status === 'completed' ? '#10b981' : trx.status === 'failed' ? '#f43f5e' : '#f59e0b'
                        }}></span>
                        {trx.status}
                      </span>
                    </td>
                    <td className="px-7 py-4 text-slate-400 font-medium text-right text-xs">{new Date(trx.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}