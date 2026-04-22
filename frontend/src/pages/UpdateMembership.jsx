import { useState } from 'react';
import { Loader2, ArrowLeft, Search, UserCheck, RefreshCw, XCircle, Calendar, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { membershipService } from '../services/service';
import { validateField } from '../utils/validation';

export default function UpdateMembership() {
  const navigate = useNavigate();
  const [membershipNumber, setMembershipNumber] = useState('');
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [fieldError, setFieldError] = useState('');

  const fetchMembership = async () => {
    const validationError = validateField('membershipNumber', membershipNumber);
    setFieldError(validationError);
    
    if (validationError) {
      return;
    }
    
    setLoading(true);
    setSearchError('');
    try {
      const data = await membershipService.getMembershipByNumber(membershipNumber);
      setMembership(data);
    } catch (err) {
      setSearchError('Membership not found');
      setMembership(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (action) => {
    if (action === 'cancel' && !window.confirm('Are you absolutely sure you want to cancel this membership? This action cannot be undone.')) return;
    setActionLoading(true);
    try {
      await membershipService.updateMembership(membership.membership_number, action);
      await fetchMembership();
    } catch (err) {
      alert(err.response?.data?.error || 'Action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const statusConfig = {
    active: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Active' },
    cancelled: { color: '#f43f5e', bg: 'rgba(244,63,94,0.1)', label: 'Cancelled' },
    expired: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Expired' },
  };

  const status = membership ? (statusConfig[membership.status] || statusConfig.expired) : null;

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-8">
      <style>{`
        .search-input:focus { border-color: #6366f1 !important; background: white !important; box-shadow: 0 0 0 4px rgba(99,102,241,0.1); }
        .search-input::placeholder { color: #cbd5e1; }
        .btn-extend { background: linear-gradient(135deg, #4f46e5, #7c3aed); transition: all 0.2s; }
        .btn-extend:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(79,70,229,0.3); }
        .btn-cancel-mem { background: linear-gradient(135deg, #f43f5e, #e11d48); transition: all 0.2s; }
        .btn-cancel-mem:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(244,63,94,0.3); }
        .btn-extend:disabled, .btn-cancel-mem:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; box-shadow: none !important; }
        .detail-item { transition: background 0.15s; }
        .detail-item:hover { background: rgba(99,102,241,0.02); }
      `}</style>

      {/* Header */}
      <div className="flex items-center gap-4 rounded-2xl p-4" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900" style={{ letterSpacing: '-0.02em' }}>Update Membership</h1>
          <p className="text-slate-400 text-xs font-medium mt-0.5">Enter membership number to modify access.</p>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
        <label className="text-xs font-bold text-slate-600 mb-2 block">Membership Number</label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              className="search-input w-full pl-10 pr-4 py-3 text-sm font-medium text-slate-800 rounded-xl outline-none transition-all"
              style={{ background: '#f8fafc', border: fieldError ? '1.5px solid #f43f5e' : '1.5px solid #e2e8f0' }}
              placeholder="Enter Membership Number"
              value={membershipNumber}
              onChange={(e) => {
                setMembershipNumber(e.target.value);
                setFieldError(validateField('membershipNumber', e.target.value));
              }}
              onKeyPress={(e) => e.key === 'Enter' && fetchMembership()}
            />
          </div>
          <button
            onClick={fetchMembership}
            disabled={loading}
            className="px-5 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-60 transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
          </button>
        </div>
        {fieldError && (
          <p className="text-xs font-semibold mt-2.5 flex items-center gap-1.5" style={{ color: '#e11d48' }}>
            <AlertCircle className="h-3.5 w-3.5" /> {fieldError}
          </p>
        )}
        {searchError && (
          <p className="text-xs font-semibold mt-2.5 flex items-center gap-1.5" style={{ color: '#e11d48' }}>
            <XCircle className="h-3.5 w-3.5" /> {searchError}
          </p>
        )}
      </div>

      {/* Membership Details */}
      {membership && (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          {/* Card Header */}
          <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.1), rgba(124,58,237,0.1))' }}>
                <UserCheck className="h-5 w-5" style={{ color: '#6366f1' }} />
              </div>
              <div>
                <p className="text-base font-bold text-slate-900">{membership.name}</p>
                <p className="text-xs text-slate-400 font-medium">{membership.membership_number}</p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full capitalize" style={{ background: status.bg, color: status.color }}>
              ● {membership.status}
            </span>
          </div>

          {/* Details Grid */}
          <div className="p-5">
            <div className="grid grid-cols-2 gap-1 mb-5">
              {[
                { label: 'Email', value: membership.email },
                { label: 'Phone', value: membership.phone },
                { label: 'Membership Type', value: membership.membership_type.replace('_', ' ') },
                { label: 'Status', value: membership.status },
              ].map(({ label, value }) => (
                <div key={label} className="detail-item px-3 py-3 rounded-xl">
                  <p className="text-xs font-bold text-slate-400 mb-0.5 uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-semibold text-slate-700 capitalize">{value}</p>
                </div>
              ))}
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-3 p-4 rounded-xl mb-5" style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.04), rgba(139,92,246,0.04))',
              border: '1px solid rgba(99,102,241,0.1)'
            }}>
              <Calendar className="h-4 w-4 flex-shrink-0" style={{ color: '#6366f1' }} />
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <span className="font-bold text-slate-700">{new Date(membership.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className="text-slate-300">→</span>
                <span className="font-bold text-slate-700">{new Date(membership.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                disabled={actionLoading || membership.status === 'cancelled'}
                onClick={() => handleUpdate('extend')}
                className="btn-extend flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white"
              >
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Extend 6 Months
              </button>
              <button
                disabled={actionLoading || membership.status === 'cancelled'}
                onClick={() => handleUpdate('cancel')}
                className="btn-cancel-mem flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white"
              >
                <XCircle className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}