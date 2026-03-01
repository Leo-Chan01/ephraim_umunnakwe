import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { logout } from '../../lib/auth';
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  User,
  Settings,
  Star,
  ExternalLink,
  LogOut,
  Layers,
  Wrench
} from 'lucide-react';


interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title = 'Admin' }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', href: '/admin/projects', icon: <Briefcase size={20} /> },
    { name: 'Services', href: '/admin/services', icon: <Wrench size={20} /> },
    { name: 'Blog', href: '/admin/blog', icon: <Layers size={20} /> },
    { name: 'Testimonials', href: '/admin/testimonials', icon: <Star size={20} /> },
    { name: 'Profile', href: '/admin/profile', icon: <User size={20} /> },
    { name: 'Messages', href: '/admin/messages', icon: <MessageSquare size={20} /> },
    { name: 'Settings', href: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-primary flex">
      {/* Sidebar */}
      <div className="w-72 bg-neutral-900 border-r-4 border-neutral-900 min-h-screen flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b-2 border-white/10">
          <h2 className="text-2xl font-black text-white uppercase tracking-tightest">
            Architecture<br />
            <span className="text-accent">OS</span>
          </h2>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1">
          {navItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-4 px-6 py-4 font-black uppercase tracking-widest text-xs transition-all ${isActive
                  ? 'bg-accent text-white border-l-8 border-white'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <span className={isActive ? 'text-white' : 'text-accent'}>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 space-y-2 border-t-2 border-white/10 bg-black/20">
          <a
            href="/"
            target="_blank"
            className="flex items-center space-x-4 px-6 py-4 text-neutral-400 hover:bg-white/5 hover:text-white font-black uppercase tracking-widest text-xs transition-all"
          >
            <ExternalLink size={20} className="text-accent" />
            <span>View Site</span>
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-4 px-6 py-4 text-neutral-400 hover:bg-red-500/20 hover:text-red-400 font-black uppercase tracking-widest text-xs transition-all w-full text-left"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-secondary dark:bg-primary">
        <header className="h-24 border-b-4 border-neutral-900 dark:border-neutral-800 bg-white dark:bg-primary flex items-center justify-between px-12 sticky top-0 z-10">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-neutral-900 dark:text-white">{title}</h1>
          <div className="flex items-center space-x-6">
            <span className="w-3 h-3 bg-accent animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-widest text-neutral-400">System Live</span>
          </div>
        </header>
        <main className="p-12 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;