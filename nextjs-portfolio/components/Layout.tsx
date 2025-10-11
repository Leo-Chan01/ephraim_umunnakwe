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
  const pageDescription = description || personalInfo?.bio || 'Ephraim Ekene Umunnakwe - Senior Flutter Developer specializing in mobile and web applications. Expert in Flutter, Dart, Next.js, Node.js, and modern web technologies.';
  const siteName = 'Ephraim Umunnakwe Portfolio';
  const siteUrl = 'https://phenomenalephraim.web.app';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Author and Keywords */}
        <meta name="author" content="Ephraim Ekene Umunnakwe" />
        <meta name="keywords" content="Ephraim Umunnakwe, Ephraim Ekene Umunnakwe, Flutter Developer, Mobile Developer, Software Engineer, Web Developer, Next.js, React, Node.js, TypeScript, Dart, Firebase, Supabase, Full Stack Developer, Nigeria Developer" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:site_name" content={siteName} />
        {personalInfo?.profile_image_url && (
          <meta property="og:image" content={personalInfo.profile_image_url} />
        )}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={siteUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        {personalInfo?.profile_image_url && (
          <meta name="twitter:image" content={personalInfo.profile_image_url} />
        )}

        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href={siteUrl} />
        <link rel="icon" href="/favicon.ico" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Ephraim Ekene Umunnakwe",
              "alternateName": ["Ephraim Umunnakwe", "Ephraim E. Umunnakwe"],
              "url": siteUrl,
              "image": personalInfo?.profile_image_url,
              "jobTitle": personalInfo?.title || "Senior Flutter Developer",
              "description": pageDescription,
              "knowsAbout": [
                "Flutter Development",
                "Mobile App Development",
                "Web Development",
                "Software Engineering",
                "Next.js",
                "React",
                "Node.js",
                "TypeScript",
                "Dart",
                "Firebase",
                "Supabase"
              ],
              "sameAs": socialLinks.map(link => link.url).filter(Boolean)
            })
          }}
        />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Navbar personalInfo={personalInfo} socialLinks={socialLinks} />
        <main>{children}</main>
        <Footer personalInfo={personalInfo} socialLinks={socialLinks} />
      </div>
    </>
  );
}