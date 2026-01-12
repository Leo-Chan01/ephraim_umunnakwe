import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FolderOpen, MessageSquare } from 'lucide-react';
import { isAuthenticated, logout, isAuthenticatedSync } from '../../lib/auth';
import { AdminLayout } from '../../components/admin';

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-300">Welcome back! Here's an overview of your portfolio.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Total Projects</p>
              <p className="text-3xl font-bold text-white">{stats.projects}</p>
            </div>
            <div className="text-blue-400 text-2xl"><FolderOpen size={32} /></div>
          </div>
        </div>

        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Testimonials</p>
              <p className="text-3xl font-bold text-white">{stats.testimonials}</p>
            </div>
            <div className="text-green-400 text-2xl">⭐</div>
          </div>
        </div>

        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Messages</p>
              <p className="text-3xl font-bold text-white">{stats.messages}</p>
            </div>
            <div className="text-purple-400 text-2xl"><MessageSquare size={32} /></div>
          </div>
        </div>

        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Page Views</p>
              <p className="text-3xl font-bold text-white">{stats.views}</p>
            </div>
            <div className="text-yellow-400 text-2xl">👁️</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/admin/projects"
              className="block w-full bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors"
            >
              Manage Projects
            </a>
            <a
              href="/admin/testimonials"
              className="block w-full bg-green-500/20 text-green-300 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors"
            >
              Manage Testimonials
            </a>
            <a
              href="/admin/profile"
              className="block w-full bg-purple-500/20 text-purple-300 px-4 py-2 rounded-lg hover:bg-purple-500/30 transition-colors"
            >
              Update Profile
            </a>
          </div>
        </div>

        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">New project added</span>
              <span className="text-gray-400">2 hours ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Testimonial updated</span>
              <span className="text-gray-400">1 day ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Profile updated</span>
              <span className="text-gray-400">3 days ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Database</span>
              <span className="text-green-400">✓ Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">API</span>
              <span className="text-green-400">✓ Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Storage</span>
              <span className="text-green-400">✓ Online</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}