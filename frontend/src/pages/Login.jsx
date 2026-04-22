import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Lock, User, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { authService } from '../services/service';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, role } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to={role === 'admin' ? '/admin' : '/user'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(username, password);
      login(response.token, response.role, response.user);
      
      if (response.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please verify your credentials.');
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
      <Link to="/" className="absolute top-8 left-8 z-20 flex items-center px-4 py-2 bg-white/50 backdrop-blur-md border border-slate-200/50 rounded-full text-slate-600 hover:text-slate-900 font-bold text-sm transition-all shadow-sm hover:shadow-md group">
        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Platform
      </Link>

      <div className="max-w-md w-full px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome back
          </h2>
          <p className="mt-3 text-base text-slate-500 font-medium">
            Sign in to access the TechEvent OS dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
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
              <label className="text-sm font-bold text-slate-700 ml-1 block">Workspace Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium text-slate-900 transition-all outline-none"
                  placeholder="admin or user"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-slate-700 block">Password</label>
                <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">Forgot?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium text-slate-900 transition-all outline-none"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white rounded-xl py-4 font-bold text-base hover:bg-slate-800 focus:ring-4 focus:ring-slate-900/20 transition-all shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5 mt-4 flex justify-center items-center disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Authenticating...
                </>
              ) : (
                'Secure Sign In'
              )}
            </button>
            
            <p className="text-center text-xs font-medium text-slate-400 mt-6 flex justify-center items-center">
              <ShieldCheck className="h-4 w-4 mr-1.5" /> Secured by TechEvent Identity
            </p>

            <p className="text-center text-sm font-medium text-slate-600 mt-4">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
                Create account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
