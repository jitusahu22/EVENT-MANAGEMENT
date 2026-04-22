import { useState, useEffect } from 'react';
import { Loader2, Calendar, Ticket, CalendarCheck, Clock, ArrowRight, Zap } from 'lucide-react';
import { reportService, transactionService } from '../services/service';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryData, transactionsData] = await Promise.all([
          reportService.getSummary(),
          transactionService.getTransactions()
        ]);
        setSummary(summaryData);
        setTransactions(transactionsData.slice(0, 5));
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
            <Loader2 className="animate-spin h-6 w-6 text-white" />
          </div>
          <p className="text-slate-500 font-medium text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-7 pb-10">
      <style>{`
        .activity-card { transition: all 0.2s cubic-bezier(0.4,0,0.2,1); }
        .activity-card:hover { transform: translateX(4px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
        .hero-card { position: relative; overflow: hidden; }
        .hero-card::before {
          content: '';
          position: absolute;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          top: -80px; right: -80px;
          pointer-events: none;
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900" style={{ letterSpacing: '-0.02em' }}>User Dashboard</h1>
          <p className="text-slate-400 mt-1 font-medium text-sm">Manage your registered events and view your transaction history.</p>
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

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Active Registrations */}
        <div className="hero-card rounded-2xl p-8" style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          boxShadow: '0 12px 40px rgba(79,70,229,0.3)'
        }}>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}>
                ● Live
              </span>
            </div>
            <p className="text-5xl font-extrabold text-white mb-2" style={{ letterSpacing: '-0.03em' }}>
              {summary?.active_memberships || 0}
            </p>
            <h3 className="text-base font-bold text-white/90">Active Registrations</h3>
            <p className="text-xs text-white/60 font-medium mt-1">Events you are currently attending</p>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="hero-card rounded-2xl p-8" style={{
          background: 'white',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
        }}>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="p-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.08)' }}>
                <Ticket className="h-6 w-6" style={{ color: '#6366f1' }} />
              </div>
              <div className="p-2 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)' }}>
                <Zap className="h-4 w-4" style={{ color: '#10b981' }} />
              </div>
            </div>
            <p className="text-5xl font-extrabold text-slate-900 mb-2" style={{ letterSpacing: '-0.03em' }}>
              {transactions.length}
            </p>
            <h3 className="text-base font-bold text-slate-900">Total Transactions</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">Your lifetime purchases</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl overflow-hidden" style={{
        background: 'white',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
      }}>
        <div className="px-7 py-5 flex justify-between items-center" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Your latest transactions</p>
          </div>
          <Link to="#" className="flex items-center gap-1 text-xs font-bold transition-colors hover:opacity-70" style={{ color: '#4f46e5' }}>
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="p-5">
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(99,102,241,0.06)' }}>
                <Clock className="h-7 w-7" style={{ color: '#c7d2fe' }} />
              </div>
              <p className="text-slate-500 font-semibold">No recent activity found.</p>
              <p className="text-slate-400 text-xs mt-1 font-medium">When you make a purchase, it will appear here.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {transactions.map((trx) => (
                <li key={trx.id} className="activity-card flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-2xl" style={{
                  background: '#fafafa',
                  border: '1px solid rgba(0,0,0,0.04)'
                }}>
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.1), rgba(124,58,237,0.1))' }}>
                      <Ticket className="h-5 w-5" style={{ color: '#6366f1' }} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">Order <span style={{ fontVariantNumeric: 'tabular-nums' }}>#{trx.id}</span></p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="capitalize text-xs font-bold px-2 py-0.5 rounded-md" style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1' }}>
                          {trx.transaction_type}
                        </span>
                        <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(trx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold capitalize" style={{
                      background: trx.status === 'completed' ? 'rgba(16,185,129,0.1)' : trx.status === 'failed' ? 'rgba(244,63,94,0.1)' : 'rgba(245,158,11,0.1)',
                      color: trx.status === 'completed' ? '#059669' : trx.status === 'failed' ? '#e11d48' : '#d97706'
                    }}>
                      {trx.status}
                    </span>
                    <span className="text-xl font-extrabold text-slate-900" style={{ fontVariantNumeric: 'tabular-nums' }}>${trx.amount}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}