import { useState, useEffect } from 'react';
import { Search, Filter, Download, Loader2, CreditCard } from 'lucide-react';
import { transactionService } from '../services/service';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await transactionService.getTransactions();
        setTransactions(data);
      } catch (error) {
        console.error("Error loading transactions", error);
      } finally {
        setLoading(false);
      }
    };
    loadTransactions();
  }, []);

  const filteredTransactions = transactions.filter(t =>
    t.id.toString().includes(searchTerm) ||
    (t.membership_name && t.membership_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      alert('No transactions to export');
      return;
    }

    const headers = ['Transaction ID', 'Member Name', 'Type', 'Amount', 'Status', 'Date'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        t.id,
        t.membership_name || 'N/A',
        t.transaction_type,
        t.amount,
        t.status,
        new Date(t.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-7 pb-10">
      <style>{`
        .search-box:focus { border-color: #6366f1 !important; background: white !important; box-shadow: 0 0 0 4px rgba(99,102,241,0.1); }
        .search-box::placeholder { color: #cbd5e1; }
        .trx-row { transition: background 0.12s; }
        .trx-row:hover { background: rgba(99,102,241,0.02); }
        .tool-btn { transition: all 0.15s; }
        .tool-btn:hover { background: rgba(99,102,241,0.08); color: #4f46e5; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900" style={{ letterSpacing: '-0.02em' }}>Transactions</h1>
          <p className="text-slate-400 mt-1 font-medium text-sm">Comprehensive financial logs and payment records.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl" style={{
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.15)',
          color: '#059669'
        }}>
          <CreditCard className="h-4 w-4" />
          {transactions.length} Total Records
        </div>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl overflow-hidden" style={{
        background: 'white',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
      }}>
        {/* Toolbar */}
        <div className="px-6 py-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <div className="relative group w-full lg:max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID or member name..."
              className="search-box w-full pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 rounded-xl outline-none transition-all"
              style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="tool-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-500 border" style={{ border: '1.5px solid #e2e8f0' }}>
              <Filter className="h-4 w-4" /> Filter
            </button>
            <button 
              onClick={handleExportCSV}
              className="tool-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-500 border cursor-pointer" 
              style={{ border: '1.5px solid #e2e8f0' }}
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                {['Transaction ID', 'Member Name', 'Record Type', 'Amount', 'Status', 'Timestamp'].map((h, i) => (
                  <th key={h} className={`px-7 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 ${i === 5 ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-7 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.1), rgba(124,58,237,0.1))' }}>
                        <Loader2 className="animate-spin h-5 w-5" style={{ color: '#6366f1' }} />
                      </div>
                      <p className="text-sm font-medium text-slate-400">Loading transactions...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-7 py-16 text-center text-slate-400 font-medium text-sm">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((trx) => (
                  <tr key={trx.id} className="trx-row" style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                    <td className="px-7 py-4">
                      <span className="font-extrabold text-slate-800" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        <span className="text-xs font-bold mr-1" style={{ color: '#94a3b8' }}>#</span>{trx.id}
                      </span>
                    </td>
                    <td className="px-7 py-4 font-semibold text-slate-700">{trx.membership_name || 'N/A'}</td>
                    <td className="px-7 py-4">
                      <span className="capitalize text-xs font-bold px-2.5 py-1 rounded-lg" style={{
                        background: 'rgba(99,102,241,0.08)',
                        color: '#6366f1'
                      }}>
                        {trx.transaction_type}
                      </span>
                    </td>
                    <td className="px-7 py-4 font-extrabold text-slate-900" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      ${trx.amount}
                    </td>
                    <td className="px-7 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize" style={{
                        background: trx.status === 'completed' ? 'rgba(16,185,129,0.1)' : trx.status === 'failed' ? 'rgba(244,63,94,0.1)' : 'rgba(245,158,11,0.1)',
                        color: trx.status === 'completed' ? '#059669' : trx.status === 'failed' ? '#e11d48' : '#d97706'
                      }}>
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{
                          background: trx.status === 'completed' ? '#10b981' : trx.status === 'failed' ? '#f43f5e' : '#f59e0b'
                        }}></span>
                        {trx.status}
                      </span>
                    </td>
                    <td className="px-7 py-4 text-right">
                      <span className="text-xs font-semibold text-slate-600 block">
                        {new Date(trx.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-xs text-slate-400 mt-0.5 block">
                        {new Date(trx.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
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