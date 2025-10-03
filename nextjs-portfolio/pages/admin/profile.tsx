import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '../../lib/auth';
import { AdminLayout } from '../../components/admin';
import { PersonalInfo, SocialLink } from '../../types/portfolio';
import { portfolioService } from '../../lib/supabase';

export default function AdminProfile() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
  });
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { platform: 'GitHub', url: '', is_visible: true },
    { platform: 'LinkedIn', url: '', is_visible: true },
    { platform: 'Twitter', url: '', is_visible: true },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    loadData();
  }, [router, mounted]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [info, links] = await Promise.all([
        portfolioService.getPersonalInfo(),
        portfolioService.getSocialLinks(),
      ]);
      
      if (info) setPersonalInfo(info);
      if (links && Array.isArray(links)) {
        setSocialLinks(links);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log('Saving profile:', { personalInfo, socialLinks });
      
      // Use the improved saveProfile method from portfolioService
      await portfolioService.saveProfile({
        personalInfo,
        socialLinks
      });
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      console.error('Personal info:', personalInfo);
      console.error('Social links:', socialLinks);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to save profile: ${errorMessage}`);
    }
    setIsSaving(false);
  };

  if (!mounted || !isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
        <p className="text-gray-300">Update your personal information and social links</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-300">Loading profile...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Info */}
          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={personalInfo.name}
                  onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Professional Title</label>
                <input
                  type="text"
                  value={personalInfo.title}
                  onChange={(e) => setPersonalInfo({...personalInfo, title: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={personalInfo.location}
                  onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Bio</label>
                <textarea
                  rows={4}
                  value={personalInfo.bio}
                  onChange={(e) => setPersonalInfo({...personalInfo, bio: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Profile Image URL</label>
                <input
                  type="url"
                  value={personalInfo.profile_image_url || ''}
                  onChange={(e) => setPersonalInfo({...personalInfo, profile_image_url: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3"
                  placeholder="https://example.com/profile.jpg"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Social Links</h2>
            <div className="space-y-4">
              {socialLinks.map((link, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-20">
                    <span className="text-white font-medium">{link.platform}</span>
                  </div>
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => {
                      const updated = [...socialLinks];
                      updated[index].url = e.target.value;
                      setSocialLinks(updated);
                    }}
                    className="flex-1 bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3"
                    placeholder={`Your ${link.platform} URL`}
                  />
                  <button
                    onClick={() => {
                      const updated = [...socialLinks];
                      updated[index].is_visible = !updated[index].is_visible;
                      setSocialLinks(updated);
                    }}
                    className={`px-3 py-2 rounded ${
                      link.is_visible 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {link.is_visible ? '👁️' : '🙈'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-semibold disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </AdminLayout>
  );
}