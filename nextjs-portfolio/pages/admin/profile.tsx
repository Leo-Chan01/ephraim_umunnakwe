import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { User, Globe, Mail, Phone, MapPin, Save, Eye, EyeOff, Shield } from 'lucide-react';
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
    years_of_experience: 0,
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
      await portfolioService.saveProfile({
        personalInfo,
        socialLinks
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    }
    setIsSaving(false);
  };

  if (!mounted || !isAuthenticated()) {
    return (
      <div className="min-h-screen bg-white dark:bg-primary flex items-center justify-center">
        <div className="text-neutral-900 dark:text-white font-black uppercase tracking-widest animate-pulse">Initializing Identity...</div>
      </div>
    );
  }

  return (
    <AdminLayout title="Identity Module">
      <div className="mb-12 flex justify-between items-end">
        <div className="space-y-4">
          <div className="w-16 h-2 bg-accent"></div>
          <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Public Profile Configuration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-neutral-900 dark:bg-white text-white dark:text-primary px-10 py-5 border-4 border-neutral-900 dark:border-white font-black text-xl uppercase tracking-widest hover:bg-accent dark:hover:bg-accent transition-all flex items-center gap-4 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] disabled:opacity-50"
        >
          <Save size={20} />
          {isSaving ? 'COMMIT...' : 'SAVE MODULE'}
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center border-4 border-dashed border-neutral-100 dark:border-neutral-800">
          <div className="animate-spin w-12 h-12 border-t-4 border-accent mx-auto mb-6"></div>
          <p className="text-neutral-400 font-black uppercase tracking-widest text-xs">Accessing profile node...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Info - 8/12 columns */}
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-white dark:bg-primary border-4 border-neutral-900 dark:border-neutral-800 p-10">
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white mb-10 uppercase tracking-tighter flex items-center gap-4">
                <User className="text-accent" />
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">LEGAL NAME</label>
                  <input
                    type="text"
                    value={personalInfo.name}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">PROFESSIONAL TITLE</label>
                  <input
                    type="text"
                    value={personalInfo.title}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">EMAIL LINK</label>
                  <input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">SECURE PHONE</label>
                  <input
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">PHYSICAL LOCATION</label>
                  <input
                    type="text"
                    value={personalInfo.location}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">YEARS OF EXPERIENCE</label>
                  <input
                    type="number"
                    value={personalInfo.years_of_experience || 0}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, years_of_experience: parseInt(e.target.value) || 0 })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                    placeholder="e.g. 8"
                  />
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">PROFILE SUMMARY (BIO)</label>
                <textarea
                  rows={6}
                  value={personalInfo.bio}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all resize-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">AVATAR REFERENCE URL</label>
                <input
                  type="url"
                  value={personalInfo.profile_image_url || ''}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, profile_image_url: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                  placeholder="https://cloud.com/user.jpg"
                />
              </div>
            </div>
          </div>

          {/* Social Links - 4/12 columns */}
          <div className="lg:col-span-4 space-y-10">
            <div className="bg-white dark:bg-primary border-4 border-neutral-900 dark:border-neutral-800 p-10">
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white mb-10 uppercase tracking-tighter flex items-center gap-4">
                <Globe className="text-accent" />
                Social Matrix
              </h2>

              <div className="space-y-8">
                {socialLinks.map((link, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase tracking-tightest text-neutral-400">{link.platform}</label>
                      <button
                        onClick={() => {
                          const updated = [...socialLinks];
                          updated[index].is_visible = !updated[index].is_visible;
                          setSocialLinks(updated);
                        }}
                        className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${link.is_visible ? 'text-green-500' : 'text-neutral-300'
                          }`}
                      >
                        {link.is_visible ? <Eye size={12} /> : <EyeOff size={12} />}
                        {link.is_visible ? 'VISIBLE' : 'HIDDEN'}
                      </button>
                    </div>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => {
                        const updated = [...socialLinks];
                        updated[index].url = e.target.value;
                        setSocialLinks(updated);
                      }}
                      className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-5 py-3 focus:outline-none focus:border-accent font-bold transition-all"
                      placeholder={`${link.platform} URL`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-900 dark:bg-neutral-800 p-8 border-4 border-neutral-900 dark:border-neutral-800 text-white">
              <h3 className="text-lg font-black uppercase tracking-widest mb-4 flex items-center gap-3">
                <Shield size={20} className="text-accent" />
                System Note
              </h3>
              <p className="text-[10px] uppercase font-bold text-neutral-400 leading-relaxed">
                Updating these modules will immediately reflect across all public interface nodes. Ensure data integrity before committing changes to the primary database.
              </p>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}