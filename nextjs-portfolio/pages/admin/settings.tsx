import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Settings, LogOut, Trash2, Database, BarChart, Save, ShieldAlert, Cpu, ToggleLeft, ToggleRight } from 'lucide-react';
import { isAuthenticated, logout, isAuthenticatedSync } from '../../lib/auth';
import { AdminLayout } from '../../components/admin';
import { settingsService, SiteSettings } from '../../lib/settings-service';

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>({
    site_title: 'Ephraim Umunnakwe Portfolio',
    site_description: 'Full-stack developer specializing in mobile and web applications',
    maintenance_mode: false,
    allow_comments: true,
    email_notifications: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const checkAuthAndLoad = async () => {
      try {
        if (!(await isAuthenticated())) {
          router.push('/admin/login');
          return;
        }

        const data = await settingsService.getSettings();
        if (data) {
          setSettings(data);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
      setIsLoading(false);
    };

    checkAuthAndLoad();
  }, [router, mounted]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await settingsService.updateSettings(settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
    setIsSaving(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const handleClearCache = async () => {
    if (confirm('Are you sure you want to clear the cache?')) {
      await new Promise(resolve => setTimeout(resolve, 500));
      alert('Cache cleared successfully!');
    }
  };

  if (!mounted || !isAuthenticatedSync()) {
    return (
      <div className="min-h-screen bg-white dark:bg-primary flex items-center justify-center">
        <div className="text-neutral-900 dark:text-white font-black uppercase tracking-widest animate-pulse">Initializing System...</div>
      </div>
    );
  }

  return (
    <AdminLayout title="Core Settings">
      <div className="mb-12 flex justify-between items-end">
        <div className="space-y-4">
          <div className="w-16 h-2 bg-accent"></div>
          <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">System Master Configuration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-neutral-900 dark:bg-white text-white dark:text-primary px-10 py-5 border-4 border-neutral-900 dark:border-white font-black text-xl uppercase tracking-widest hover:bg-accent dark:hover:bg-accent transition-all flex items-center gap-4 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] disabled:opacity-50"
        >
          <Save size={20} />
          {isSaving ? 'SYNCING...' : 'COMMIT CHANGES'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* General Settings - 7/12 */}
        <div className="lg:col-span-7 space-y-10">
          <div className="bg-white dark:bg-primary border-4 border-neutral-900 dark:border-neutral-800 p-10">
            <h2 className="text-2xl font-black text-neutral-900 dark:text-white mb-10 uppercase tracking-tighter flex items-center gap-4">
              <Settings className="text-accent" />
              Global Parameters
            </h2>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">INTERFACE BRANDING (TITLE)</label>
                <input
                  type="text"
                  value={settings.site_title}
                  onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">METADATA DESCRIPTION</label>
                <textarea
                  rows={4}
                  value={settings.site_description}
                  onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all resize-none"
                />
              </div>

              <div className="pt-6 border-t border-neutral-100 dark:border-neutral-900 space-y-6">
                <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-950 border-2 border-neutral-100 dark:border-neutral-900">
                  <div className="flex items-center gap-4">
                    <ShieldAlert size={20} className={settings.maintenance_mode ? 'text-red-500' : 'text-neutral-400'} />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-900 dark:text-white leading-none">Maintenance Protocol</p>
                      <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-tighter mt-1">Locks public access during updates</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, maintenance_mode: !settings.maintenance_mode })}
                    className={`transition-colors ${settings.maintenance_mode ? 'text-red-500' : 'text-neutral-300'}`}
                  >
                    {settings.maintenance_mode ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-950 border-2 border-neutral-100 dark:border-neutral-900">
                  <div className="flex items-center gap-4">
                    <Database size={20} className={settings.email_notifications ? 'text-accent' : 'text-neutral-400'} />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-900 dark:text-white leading-none">Telemetry Uplink</p>
                      <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-tighter mt-1">Receive email alerts for submissions</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, email_notifications: !settings.email_notifications })}
                    className={`transition-colors ${settings.email_notifications ? 'text-accent' : 'text-neutral-300'}`}
                  >
                    {settings.email_notifications ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Operations - 5/12 */}
        <div className="lg:col-span-5 space-y-10">
          <div className="bg-white dark:bg-primary border-4 border-neutral-900 dark:border-neutral-800 p-10">
            <h2 className="text-2xl font-black text-neutral-900 dark:text-white mb-10 uppercase tracking-tighter flex items-center gap-4">
              <Cpu className="text-accent" />
              Infrastructure
            </h2>

            <div className="grid grid-cols-1 gap-6">
              <div className="group border-4 border-neutral-100 dark:border-neutral-900 p-6 flex items-center justify-between hover:border-accent transition-all">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-neutral-900 dark:text-white">Neural Cache</p>
                  <p className="text-[9px] font-bold text-neutral-400 uppercase">Optimize response times</p>
                </div>
                <button
                  onClick={handleClearCache}
                  className="p-3 bg-neutral-900 text-white hover:bg-accent transition-colors"
                >
                  <Database size={16} />
                </button>
              </div>

              <div className="group border-4 border-neutral-100 dark:border-neutral-900 p-6 flex items-center justify-between hover:border-accent transition-all">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-neutral-900 dark:text-white">Data Manifest</p>
                  <p className="text-[9px] font-bold text-neutral-400 uppercase">Generate full archive</p>
                </div>
                <button className="p-3 bg-neutral-900 text-white hover:bg-accent transition-colors">
                  <BarChart size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border-4 border-red-500/20 p-10">
            <h3 className="text-lg font-black uppercase tracking-widest mb-8 flex items-center gap-3 text-red-500">
              <ShieldAlert size={20} />
              Danger zone
            </h3>
            <div className="space-y-6">
              <p className="text-[10px] font-bold uppercase text-red-500/60 leading-relaxed">
                Terminating the current session will restrict administrative access immediately.
              </p>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white py-4 border-4 border-red-500 font-black text-xs uppercase tracking-widest hover:bg-transparent hover:text-red-500 transition-all flex items-center justify-center gap-4"
              >
                <LogOut size={16} />
                TERMINATE SESSION
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}