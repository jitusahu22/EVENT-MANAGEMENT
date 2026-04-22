import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Mail, Loader2, ArrowLeft, ShieldCheck, UserPlus, AlertCircle } from 'lucide-react';
import { authService } from '../services/service';
import { useAuth } from '../contexts/AuthContext';
import { validateField } from '../utils/validation';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const usernameError = validateField('username', formData.username);
    const emailError = validateField('email', formData.email);
    const passwordError = validateField('password', formData.password);
    let confirmPasswordError = '';
    
    if (formData.password !== formData.confirmPassword) {
      confirmPasswordError = 'Passwords do not match';
    }
    
    setFieldErrors({
      username: usernameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError
    });
    
    if (usernameError || emailError || passwordError || confirmPasswordError) {
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await authService.register(formData.username, formData.password, formData.email);
      login(response.token, response.role, response.user);
      navigate('/user');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans">
      {/* Background Ornaments */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 blur-[100px] mix-blend-multiply"></div>
        <div className="absolute top-[60%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-100/50 blur-[120px] mix-blend-multiply"></div>
      </div>

      {/* Back Button */}
      <Link to="/" className="absolute top-4 sm:top-8 left-4 sm:left-8 z-20 flex items-center px-3 sm:px-4 py-2 bg-white/50 backdrop-blur-md border border-slate-200/50 rounded-full text-slate-600 hover:text-slate-900 font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md group">
        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Platform
      </Link>

      <div className="max-w-md w-full px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Create account
          </h2>
          <p className="mt-3 text-base text-slate-500 font-medium">
            Join TechEvent OS to manage your memberships
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100">
          <form className="space-y-5" onSubmit={handleSubmit}>

            {error && (
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-start">
                <div className="flex-shrink-0 bg-white p-1 rounded-full shadow-sm mt-0.5">
                  <ShieldCheck className="h-4 w-4 text-rose-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-rose-700 font-bold leading-tight">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 block">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  className={`w-full pl-12 pr-4 py-3 bg-slate-50 border-2 rounded-xl focus:bg-white font-medium text-slate-900 transition-all outline-none text-sm ${fieldErrors.username ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'}`}
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({...formData, username: e.target.value});
                    setFieldErrors({...fieldErrors, username: validateField('username', e.target.value)});
                  }}
                  disabled={loading}
                />
              </div>
              {fieldErrors.username && (
                <p className="text-xs font-bold text-rose-600 ml-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {fieldErrors.username}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 block">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  className={`w-full pl-12 pr-4 py-3 bg-slate-50 border-2 rounded-xl focus:bg-white font-medium text-slate-900 transition-all outline-none text-sm ${fieldErrors.email ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'}`}
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({...formData, email: e.target.value});
                    setFieldErrors({...fieldErrors, email: validateField('email', e.target.value)});
                  }}
                  disabled={loading}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs font-bold text-rose-600 ml-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 block">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  className={`w-full pl-12 pr-4 py-3 bg-slate-50 border-2 rounded-xl focus:bg-white font-medium text-slate-900 transition-all outline-none text-sm ${fieldErrors.password ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'}`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({...formData, password: e.target.value});
                    setFieldErrors({...fieldErrors, password: validateField('password', e.target.value)});
                  }}
                  disabled={loading}
                />
              </div>
              {fieldErrors.password && (
                <p className="text-xs font-bold text-rose-600 ml-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {fieldErrors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 block">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  className={`w-full pl-12 pr-4 py-3 bg-slate-50 border-2 rounded-xl focus:bg-white font-medium text-slate-900 transition-all outline-none text-sm ${fieldErrors.confirmPassword ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'}`}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({...formData, confirmPassword: e.target.value});
                    const error = e.target.value !== formData.password ? 'Passwords do not match' : '';
                    setFieldErrors({...fieldErrors, confirmPassword: error});
                  }}
                  disabled={loading}
                />
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-xs font-bold text-rose-600 ml-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white rounded-xl py-3.5 font-bold text-sm hover:bg-slate-800 focus:ring-4 focus:ring-slate-900/20 transition-all shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5 mt-4 flex justify-center items-center disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Account
                </>
              )}
            </button>

            <p className="text-center text-sm font-medium text-slate-600 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
