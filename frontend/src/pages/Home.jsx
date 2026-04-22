import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, ShieldCheck, Users, Activity, BarChart3, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, role } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={role === 'admin' ? '/admin' : '/user'} replace />;
  }

  const features = [
    {
      name: 'Role-Based Access',
      description: 'Enterprise-grade security ensuring complete data isolation between administrators and standard users.',
      icon: ShieldCheck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Membership Management',
      description: 'Effortlessly add, extend, or cancel memberships with automated validation and lifecycle tracking.',
      icon: Users,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      name: 'Automated Transactions',
      description: 'Every action automatically generates secure, immutable financial records without manual entry.',
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Real-Time Analytics',
      description: 'Instantly view active member counts, expiring accounts, and comprehensive financial reports.',
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="py-5 px-6 sm:px-10 border-b border-gray-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="TechEvent Logo" className="h-15 object-contain mix-blend-multiply" />

        </div>
        <Link to="/login" className="btn-primary rounded-full px-6 shadow-md hover:shadow-lg">
          Sign In
        </Link>
      </header>

      <main className="flex-grow">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-100/50 to-transparent blur-3xl rounded-full mix-blend-multiply opacity-70"></div>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-medium text-sm mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              TechEvent OS v2.0 is now live
            </div>
             */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]">
              The intelligent operating <br className="hidden md:block" />
              system <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">for technical events.</span>
            </h1>
            
            <p className="mt-6 max-w-2xl text-xl text-slate-600 mx-auto mb-12 leading-relaxed">
              A powerful, secure SaaS platform designed to streamline membership management, automate financial tracking, and deliver real-time operational analytics.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to="/login" className="btn-primary text-lg px-8 py-4 rounded-xl shadow-blue-500/25 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group w-full sm:w-auto">
                Access Platform
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="mt-12 flex justify-center items-center gap-8 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-500"/> No credit card required</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-500"/> 14-day free trial</div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-white border-y border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Everything you need. <br/><span className="text-slate-500">Nothing you don't.</span></h2>
              <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
                Purpose-built tools to manage your events with enterprise-grade security and uncompromising performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-blue-100 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group">
                  <div className={`inline-flex p-4 rounded-2xl ${feature.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.name}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-indigo-900/20"></div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Ready to streamline your events?</h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">Join the platform and experience the future of technical event management today.</p>
            <Link to="/login" className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-bold text-slate-900 hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:scale-105">
              Sign In to Workspace
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="TechEvent Logo" className="h-6 object-contain mix-blend-multiply opacity-80" />
            <span className="font-bold text-lg text-slate-900">TechEvent.</span>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} TechEvent Management Suite. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
