import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
        
        // Load settings
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
      // Simulate cache clear
      await new Promise(resolve => setTimeout(resolve, 500));
      alert('Cache cleared successfully!');
    }
  };

  if (!mounted || !isAuthenticatedSync()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-300">Configure your portfolio settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">Site Title</label>
              <input
                type="text"
                value={settings.site_title}
                onChange={(e) => setSettings({...settings, site_title: e.target.value})}
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Site Description</label>
              <textarea
                rows={3}
                value={settings.site_description}
                onChange={(e) => setSettings({...settings, site_description: e.target.value})}
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3"
              />
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.maintenance_mode}
                  onChange={(e) => setSettings({...settings, maintenance_mode: e.target.checked})}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                />
                <span className="text-white">Maintenance Mode</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.allow_comments}
                  onChange={(e) => setSettings({...settings, allow_comments: e.target.checked})}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                />
                <span className="text-white">Allow Comments on Blog</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.email_notifications}
                  onChange={(e) => setSettings({...settings, email_notifications: e.target.checked})}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                />
                <span className="text-white">Email Notifications</span>
              </label>
            </div>
          </div>
        </div>

        {/* System Actions */}
        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">System Actions</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Cache Management</h3>
              <p className="text-gray-300 text-sm mb-3">Clear cached data to improve performance</p>
              <button
                onClick={handleClearCache}
                className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors"
              >
                Clear Cache
              </button>
            </div>
            
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Backup Data</h3>
              <p className="text-gray-300 text-sm mb-3">Download a backup of your portfolio data</p>
              <button className="bg-green-500/20 text-green-300 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors">
                Download Backup
              </button>
            </div>
            
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Analytics</h3>
              <p className="text-gray-300 text-sm mb-3">View detailed analytics and statistics</p>
              <button className="bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-lg hover:bg-yellow-500/30 transition-colors">
                View Analytics
              </button>
            </div>
            
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Danger Zone</h3>
              <p className="text-gray-300 text-sm mb-3">Logout from admin panel</p>
              <button
                onClick={handleLogout}
                className="bg-red-500/20 text-red-300 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-semibold disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </AdminLayout>
  );
}