import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, ShieldCheck, Users, Activity, BarChart3 } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, role } = useAuth();

  // If already logged in, redirect to respective dashboard
  if (isAuthenticated) {
    return <Navigate to={role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  const features = [
    {
      name: 'Secure Role-Based Access',
      description: 'Enterprise-grade authentication ensuring complete data isolation between administrators and standard users.',
      icon: ShieldCheck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Effortless Membership Management',
      description: 'Add, extend, or cancel memberships with automated validation and lifecycle tracking.',
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-200 bg-white shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Activity className="h-8 w-8 text-primary" />
          </div>
          <span className="font-bold text-2xl text-gray-900 tracking-tight">TechEvent Management</span>
        </div>
        <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
          Sign In
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32">
          {/* Background Decorations */}
          <div className="absolute inset-0 z-0">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl mix-blend-multiply"></div>
            <div className="absolute top-48 right-12 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl mix-blend-multiply"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block p-4 bg-white rounded-3xl shadow-sm border border-gray-100 mb-8 transform hover:scale-105 transition-transform duration-300">
              <div className="bg-primary/10 p-4 rounded-2xl">
                <Activity className="h-16 w-16 text-primary" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
              The intelligent operating system <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">for technical events.</span>
            </h1>
            
            <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto mb-10">
              A complete, secure SaaS platform for managing memberships, tracking transactions, and generating real-time analytics.
            </p>
            
            <div className="flex justify-center">
              <Link to="/login" className="btn-primary text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                Access Dashboard
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-white border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">How it works</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to manage your technical events, packed into one seamless and secure platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="surface-card group hover:-translate-y-2 transition-all duration-300">
                  <div className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-6`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.name}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to streamline your events?</h2>
            <p className="text-xl text-slate-300 mb-10">Join the platform and experience the future of event management.</p>
            <Link to="/login" className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-bold text-slate-900 hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl">
              Sign In Now
            </Link>
          </div>
        </section>

      </main>

      {/* Minimal Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} TechEvent Management Suite. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
