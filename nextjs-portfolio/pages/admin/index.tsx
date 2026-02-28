import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Briefcase, MessageSquare, Star, Eye, ChevronRight, Plus } from 'lucide-react';
import { isAuthenticated, isAuthenticatedSync } from '../../lib/auth';
import { AdminLayout } from '../../components/admin';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    testimonials: 0,
    messages: 0,
    views: 0
  });
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
          router.push('/admin/login');
          return;
        }

        // Load dashboard stats
        setStats({
          projects: 12,
          testimonials: 8,
          messages: 24,
          views: 1250
        });
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [router, mounted]);

  if (!mounted || !isAuthenticatedSync()) {
    return (
      <div className="min-h-screen bg-white dark:bg-primary flex items-center justify-center">
        <div className="text-neutral-900 dark:text-white font-black uppercase tracking-widest animate-pulse">Initializing System...</div>
      </div>
    );
  }

  return (
    <AdminLayout title="System Overview">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {[
          { label: 'Total Projects', value: stats.projects, icon: <Briefcase />, color: 'text-accent' },
          { label: 'Client Reviews', value: stats.testimonials, icon: <Star />, color: 'text-accent' },
          { label: 'Inbox', value: stats.messages, icon: <MessageSquare />, color: 'text-accent' },
          { label: 'Global Views', value: stats.views, icon: <Eye />, color: 'text-accent' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-primary border-4 border-neutral-900 dark:border-neutral-800 p-8 flex items-center justify-between hover:translate-x-1 hover:-translate-y-1 transition-transform cursor-pointer">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">{stat.label}</p>
              <p className="text-4xl font-black text-neutral-900 dark:text-white tabular-nums">{stat.value}</p>
            </div>
            <div className={`${stat.color} bg-neutral-900 dark:bg-neutral-800 p-4 border-2 border-neutral-800`}>
              {React.cloneElement(stat.icon as React.ReactElement, { size: 24 })}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-neutral-900 dark:text-white flex items-center gap-4">
            <span className="w-8 h-2 bg-accent"></span>
            Operational Controls
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/admin/projects"
              className="group bg-neutral-900 text-white p-8 border-4 border-neutral-900 flex justify-between items-center hover:bg-white hover:text-neutral-900 transition-all duration-300"
            >
              <div>
                <h4 className="text-xl font-black uppercase tracking-tight mb-1">Projects</h4>
                <p className="text-xs text-neutral-400 group-hover:text-neutral-500 font-bold uppercase tracking-widest">Manage Portfolio Items</p>
              </div>
              <Plus className="text-accent" />
            </Link>
            <Link
              href="/admin/testimonials"
              className="group bg-neutral-900 text-white p-8 border-4 border-neutral-900 flex justify-between items-center hover:bg-white hover:text-neutral-900 transition-all duration-300"
            >
              <div>
                <h4 className="text-xl font-black uppercase tracking-tight mb-1">Reviews</h4>
                <p className="text-xs text-neutral-400 group-hover:text-neutral-500 font-bold uppercase tracking-widest">Update Client Feedback</p>
              </div>
              <Plus className="text-accent" />
            </Link>
            <Link
              href="/admin/profile"
              className="group border-4 border-neutral-900 dark:border-neutral-800 p-8 flex justify-between items-center hover:bg-neutral-900 hover:text-white transition-all duration-300"
            >
              <div>
                <h4 className="text-xl font-black uppercase tracking-tight mb-1">Identity</h4>
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Modify Personal Info</p>
              </div>
              <ChevronRight className="text-accent" />
            </Link>
            <Link
              href="/admin/settings"
              className="group border-4 border-neutral-900 dark:border-neutral-800 p-8 flex justify-between items-center hover:bg-neutral-900 hover:text-white transition-all duration-300"
            >
              <div>
                <h4 className="text-xl font-black uppercase tracking-tight mb-1">Cortex</h4>
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">System Configurations</p>
              </div>
              <ChevronRight className="text-accent" />
            </Link>
          </div>
        </div>

        {/* Status Area */}
        <div className="space-y-8">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-neutral-900 dark:text-white flex items-center gap-4">
            <span className="w-8 h-2 bg-accent"></span>
            Telemetry
          </h2>
          <div className="bg-white dark:bg-primary border-4 border-neutral-900 dark:border-neutral-800 p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-neutral-500">Database Engine</span>
                <span className="text-xs font-black uppercase tracking-widest text-green-500 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Optimal
                </span>
              </div>
              <div className="w-full h-1 bg-neutral-100 dark:bg-neutral-800">
                <div className="h-full bg-accent w-[98%]"></div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-neutral-500">API Interface</span>
                <span className="text-xs font-black uppercase tracking-widest text-green-500">Connected</span>
              </div>
              <div className="w-full h-1 bg-neutral-100 dark:bg-neutral-800">
                <div className="h-full bg-accent w-[100%]"></div>
              </div>
            </div>

            <div className="pt-6">
              <div className="bg-neutral-50 dark:bg-neutral-900 p-6 border-2 border-dashed border-neutral-200 dark:border-neutral-800">
                <h5 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">Memory usage</h5>
                <p className="text-2xl font-black text-neutral-900 dark:text-white">124 MB <span className="text-neutral-400 text-sm">/ 512 MB</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}