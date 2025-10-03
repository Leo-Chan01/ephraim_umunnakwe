import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { logout } from '../../lib/auth';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Projects', href: '/admin/projects', icon: '📁' },
    { name: 'Testimonials', href: '/admin/testimonials', icon: '⭐' },
    { name: 'Profile', href: '/admin/profile', icon: '👤' },
    { name: 'Messages', href: '/admin/messages', icon: '💬' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-black/40 backdrop-blur-sm border-r border-white/10 min-h-screen">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-8">Admin Panel</h2>
            
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    router.pathname === item.href
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-8 pt-8 border-t border-white/10">
              <a
                href="/"
                target="_blank"
                className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
              >
                <span className="text-xl">🌐</span>
                <span>View Site</span>
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors w-full text-left"
              >
                <span className="text-xl">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;