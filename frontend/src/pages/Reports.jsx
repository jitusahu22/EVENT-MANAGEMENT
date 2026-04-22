import { useState, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp, Loader2, Download, ArrowUpRight } from 'lucide-react';
import { reportService } from '../services/service';

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [detailedData, setDetailedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30days');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [summaryData, revenuePeriodData, detailedReportData] = await Promise.all([
          reportService.getSummary(),
          reportService.getRevenueByPeriod(selectedPeriod),
          reportService.getDetailedReport()
        ]);
        setSummary(summaryData);
        setRevenueData(revenuePeriodData);
        setDetailedData(detailedReportData);
      } catch (error) {
        console.error("Error loading reports", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [selectedPeriod]);

  const handlePeriodChange = async (period) => {
    setSelectedPeriod(period);
    try {
      const data = await reportService.getRevenueByPeriod(period);
      setRevenueData(data);
    } catch (error) {
      console.error("Error loading revenue data", error);
    }
  };

  const handleDownloadPDF = () => {
    const printContent = `
      <html>
        <head>
          <title>Event Management Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #1e293b; }
            .metric { display: inline-block; margin: 20px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; }
            .metric-value { font-size: 24px; font-weight: bold; color: #1e293b; }
            .metric-label { font-size: 14px; color: #64748b; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
            th { background: #f8fafc; }
          </style>
        </head>
        <body>
          <h1>Event Management Analytics Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <p>Period: ${selectedPeriod === '30days' ? 'Last 30 Days' : selectedPeriod === 'year' ? 'This Year' : 'All Time'}</p>
          
          <h2>Summary Metrics</h2>
          <div class="metric">
            <div class="metric-value">$${revenueData?.revenue || 0}</div>
            <div class="metric-label">Total Revenue (${revenueData?.transaction_count || 0} transactions)</div>
          </div>
          <div class="metric">
            <div class="metric-value">${summary?.active_memberships || 0}</div>
            <div class="metric-label">Active Members</div>
          </div>
          <div class="metric">
            <div class="metric-value">${summary?.total_memberships || 0}</div>
            <div class="metric-label">Total Accounts</div>
          </div>
          <div class="metric">
            <div class="metric-value">${summary?.expired_memberships || 0}</div>
            <div class="metric-label">Expired/Cancelled</div>
          </div>

          ${detailedData ? `
          <h2>Membership Breakdown by Type</h2>
          <table>
            <thead><tr><th>Type</th><th>Count</th><th>Revenue</th></tr></thead>
            <tbody>
              ${Object.entries(detailedData.memberships_by_type || {}).map(([type, count]) => `
                <tr>
                  <td>${type.replace('_', ' ')}</td>
                  <td>${count}</td>
                  <td>$${detailedData.revenue_by_type?.[type] || 0}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ` : ''}
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
            <Loader2 className="animate-spin h-6 w-6 text-white" />
          </div>
          <p className="text-slate-500 font-medium text-sm">Generating analytics...</p>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      label: 'Total Revenue',
      value: `$${revenueData?.revenue || summary?.total_revenue || 0}`,
      icon: TrendingUp,
      trend: `${revenueData?.transaction_count || 0} transactions`,
      trendUp: true,
      gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      sub: selectedPeriod === '30days' ? 'Last 30 Days' : selectedPeriod === 'year' ? 'This Year' : 'All Time'
    },
    {
      label: 'Active Members',
      value: summary?.active_memberships || 0,
      icon: BarChart3,
      trend: 'Healthy',
      trendUp: true,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      sub: 'retention rate'
    },
    {
      label: 'Total Accounts',
      value: summary?.total_memberships || 0,
      icon: PieChart,
      trend: 'Lifetime',
      trendUp: null,
      gradient: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
      sub: 'all-time accounts'
    },
    {
      label: 'Expired / Revoked',
      value: summary?.expired_memberships || 0,
      icon: TrendingUp,
      trend: 'Needs attention',
      trendUp: false,
      gradient: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
      sub: 'require follow-up'
    },
  ];

  const membershipTypeLabels = {
    '6_months': '6 Months',
    '1_year': '1 Year',
    '2_years': '2 Years'
  };

  return (
    <div className="max-w-6xl mx-auto space-y-7 pb-10">
      <style>{`
        .metric-card { transition: all 0.25s cubic-bezier(0.4,0,0.2,1); }
        .metric-card:hover { transform: translateY(-4px); }
        @keyframes barGrow { from { height: 0; } to { height: var(--h); } }
        .bar { animation: barGrow 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards; }
      `}</style>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900" style={{ letterSpacing: '-0.02em' }}>Analytics & Reports</h1>
          <p className="text-slate-400 mt-1 font-medium text-sm">In-depth breakdown of platform performance metrics.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 4px 16px rgba(79,70,229,0.3)' }}>
          <Download className="h-4 w-4" /> Download PDF Report
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((m, i) => (
          <div key={i} className="metric-card rounded-2xl p-6 relative overflow-hidden" style={{
            background: 'white',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
          }}>
            {/* Gradient orb */}
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10" style={{ background: m.gradient, filter: 'blur(16px)' }}></div>
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: m.gradient }}>
                <m.icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900 mb-1" style={{ letterSpacing: '-0.02em' }}>{m.value}</p>
              <p className="text-sm text-slate-500 font-medium mb-3">{m.label}</p>
              <div className="flex items-center gap-1.5 text-xs font-bold" style={{
                color: m.trendUp === true ? '#10b981' : m.trendUp === false ? '#f43f5e' : '#6366f1'
              }}>
                {m.trendUp !== null && <ArrowUpRight className="h-3.5 w-3.5" style={{ transform: m.trendUp ? '' : 'rotate(180deg)' }} />}
                {m.trend} <span className="font-medium text-slate-400">{m.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Breakdown */}
      {detailedData && (
        <div className="rounded-2xl overflow-hidden" style={{
          background: 'white',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
        }}>
          <div className="px-7 py-5" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <h3 className="text-base font-bold text-slate-900">Membership Breakdown by Type</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Distribution of memberships and revenue</p>
          </div>
          <div className="p-7">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(detailedData.memberships_by_type || {}).map(([type, count]) => (
                <div key={type} className="p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.1)' }}>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{membershipTypeLabels[type] || type}</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">{count}</p>
                  <p className="text-xs font-medium text-slate-500 mt-1">${detailedData.revenue_by_type?.[type] || 0} revenue</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Revenue Chart Area */}
      <div className="rounded-2xl overflow-hidden" style={{
        background: 'white',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
      }}>
        <div className="px-7 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <div>
            <h3 className="text-base font-bold text-slate-900">Revenue Breakdown Overview</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Tracking financial performance over time</p>
          </div>
          <select
            value={selectedPeriod}
            onChange={(e) => handlePeriodChange(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-xl outline-none transition-all cursor-pointer"
            style={{
              background: 'rgba(99,102,241,0.06)',
              border: '1px solid rgba(99,102,241,0.15)',
              color: '#4f46e5'
            }}
          >
            <option value="30days">Last 30 Days</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* Revenue Display */}
        <div className="p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-slate-500">Revenue for selected period</p>
              <p className="text-4xl font-extrabold text-slate-900 mt-1">${revenueData?.revenue || 0}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-500">Transactions</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{revenueData?.transaction_count || 0}</p>
            </div>
          </div>
          
          {/* Simple visual bar */}
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: '75%',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)'
              }}
            ></div>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">Performance indicator</p>
        </div>
      </div>
    </div>
  );
}