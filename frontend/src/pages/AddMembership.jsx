import { useState } from 'react';
import { Save, Loader2, CheckCircle, ArrowLeft, Shield, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { membershipService } from '../services/service';
import { validateField } from '../utils/validation';

export default function AddMembership() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    membership_number: '',
    name: '',
    email: '',
    phone: ''
  });

  const [formData, setFormData] = useState({
    membership_number: '',
    name: '',
    email: '',
    phone: '',
    membership_type: '6_months'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const membershipNumberError = validateField('membershipNumber', formData.membership_number);
    const nameError = validateField('name', formData.name);
    const emailError = validateField('email', formData.email);
    const phoneError = validateField('phone', formData.phone);
    
    setFieldErrors({
      membership_number: membershipNumberError,
      name: nameError,
      email: emailError,
      phone: phoneError
    });
    
    if (membershipNumberError || nameError || emailError || phoneError) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await membershipService.addMembership(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add membership.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg text-center py-16 px-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-emerald-100 mb-8 animate-bounce">
            <CheckCircle className="h-12 w-12 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Membership Created</h2>
          <p className="text-lg text-slate-600 font-medium">The new membership record and transaction log have been securely generated.</p>
          <div className="mt-8">
            <Loader2 className="h-6 w-6 text-emerald-500 animate-spin mx-auto" />
            <p className="text-sm text-slate-400 mt-2 font-medium">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors shadow-sm">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Add New Membership</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Register a new user and generate their invoice automatically.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50/50 p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-blue-100 p-2.5 rounded-xl">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Member Details</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-6">
          {error && (
            <div className="p-5 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 text-sm font-semibold flex items-center gap-3">
              <div className="bg-white p-1 rounded-full"><AlertCircle className="h-5 w-5" /></div>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Membership Number *</label>
              <input
                type="text"
                required
                className={`w-full rounded-xl border-2 bg-slate-50 px-4 py-3 text-slate-900 focus:bg-white font-medium transition-all outline-none text-sm ${fieldErrors.membership_number ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'}`}
                placeholder="e.g. MEM001"
                value={formData.membership_number}
                onChange={(e) => {
                  setFormData({...formData, membership_number: e.target.value});
                  setFieldErrors({...fieldErrors, membership_number: validateField('membershipNumber', e.target.value)});
                }}
              />
              {fieldErrors.membership_number && (
                <p className="text-xs font-bold text-rose-600 ml-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {fieldErrors.membership_number}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name *</label>
              <input
                type="text"
                required
                className={`w-full rounded-xl border-2 bg-slate-50 px-4 py-3 text-slate-900 focus:bg-white font-medium transition-all outline-none text-sm ${fieldErrors.name ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'}`}
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) => {
                  setFormData({...formData, name: e.target.value});
                  setFieldErrors({...fieldErrors, name: validateField('name', e.target.value)});
                }}
              />
              {fieldErrors.name && (
                <p className="text-xs font-bold text-rose-600 ml-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {fieldErrors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address *</label>
              <input
                type="email"
                required
                className={`w-full rounded-xl border-2 bg-slate-50 px-4 py-3 text-slate-900 focus:bg-white font-medium transition-all outline-none text-sm ${fieldErrors.email ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'}`}
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({...formData, email: e.target.value});
                  setFieldErrors({...fieldErrors, email: validateField('email', e.target.value)});
                }}
              />
              {fieldErrors.email && (
                <p className="text-xs font-bold text-rose-600 ml-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Phone Number *</label>
              <input
                type="tel"
                required
                className={`w-full rounded-xl border-2 bg-slate-50 px-4 py-3 text-slate-900 focus:bg-white font-medium transition-all outline-none text-sm ${fieldErrors.phone ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'}`}
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({...formData, phone: e.target.value});
                  setFieldErrors({...fieldErrors, phone: validateField('phone', e.target.value)});
                }}
              />
              {fieldErrors.phone && (
                <p className="text-xs font-bold text-rose-600 ml-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {fieldErrors.phone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Membership Duration *</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50/30">
                  <input
                    type="radio"
                    name="membership_type"
                    value="6_months"
                    checked={formData.membership_type === '6_months'}
                    onChange={(e) => setFormData({...formData, membership_type: e.target.value})}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-slate-900">6 months</span>
                    <span className="text-slate-500 text-sm ml-2">— $50.00</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50/30">
                  <input
                    type="radio"
                    name="membership_type"
                    value="1_year"
                    checked={formData.membership_type === '1_year'}
                    onChange={(e) => setFormData({...formData, membership_type: e.target.value})}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-slate-900">1 year</span>
                    <span className="text-slate-500 text-sm ml-2">— $90.00 (Save $10)</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50/30">
                  <input
                    type="radio"
                    name="membership_type"
                    value="2_years"
                    checked={formData.membership_type === '2_years'}
                    onChange={(e) => setFormData({...formData, membership_type: e.target.value})}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-slate-900">2 years</span>
                    <span className="text-slate-500 text-sm ml-2">— $160.00 (Best Value)</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary rounded-lg py-3 px-5 font-bold text-sm w-full sm:w-auto border-2">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary rounded-lg py-3 px-6 font-bold text-sm w-full sm:w-auto shadow-blue-500/25 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
              {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save & Generate Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
