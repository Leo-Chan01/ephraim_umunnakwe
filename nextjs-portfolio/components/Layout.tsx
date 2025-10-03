import { ReactNode, useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';
import { portfolioService } from '../lib/supabase';
import { PersonalInfo, SocialLink } from '../types/portfolio';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({ 
  children, 
  title,
  description
}: LayoutProps) {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [personalInfo, socialLinks] = await Promise.all([
          portfolioService.getPersonalInfo(),
          portfolioService.getSocialLinks()
        ]);
        setPersonalInfo(personalInfo);
        setSocialLinks(socialLinks);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const pageTitle = title || (personalInfo ? `${personalInfo.name} - ${personalInfo.title}` : 'Ephraim Umunnakwe - Software Developer');
  const pageDescription = description || personalInfo?.bio || 'Full-stack developer specializing in mobile and web applications';
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Navbar personalInfo={personalInfo} socialLinks={socialLinks} />
        <main>{children}</main>
        <Footer personalInfo={personalInfo} socialLinks={socialLinks} />
      </div>
    </>
  );
}