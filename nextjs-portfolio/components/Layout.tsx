'use client';

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
  /** Preview image for link shares (absolute URL or a path under /public) */
  image?: string;
  /** Path of this page, e.g. /blog/my-post/ — used for og:url and canonical */
  path?: string;
  type?: 'website' | 'article';
}

export default function Layout({
  children,
  title,
  description,
  image,
  path,
  type = 'website'
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
  const pageUrl = path ? `${siteUrl}${path.startsWith('/') ? path : `/${path}`}` : siteUrl;
  const rawImage = image || personalInfo?.profile_image_url;
  const pageImage = rawImage
    ? (/^https?:\/\//.test(rawImage) ? rawImage : `${siteUrl}${rawImage.startsWith('/') ? rawImage : `/${rawImage}`}`)
    : undefined;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta key="description" name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Author and Keywords */}
        <meta name="author" content="Ephraim Ekene Umunnakwe" />
        <meta name="keywords" content="Ephraim Umunnakwe, Ephraim Ekene Umunnakwe, Flutter Developer, Mobile Developer, Software Engineer, Web Developer, Next.js, React, Node.js, TypeScript, Dart, Firebase, Supabase, Full Stack Developer, Nigeria Developer" />

        {/* Open Graph / Facebook */}
        <meta key="og:type" property="og:type" content={type} />
        <meta key="og:url" property="og:url" content={pageUrl} />
        <meta key="og:title" property="og:title" content={pageTitle} />
        <meta key="og:description" property="og:description" content={pageDescription} />
        <meta property="og:site_name" content={siteName} />
        {pageImage && <meta key="og:image" property="og:image" content={pageImage} />}
        {pageImage && <meta key="og:image:alt" property="og:image:alt" content={pageTitle} />}

        {/* Twitter */}
        <meta key="twitter:card" name="twitter:card" content={pageImage ? 'summary_large_image' : 'summary'} />
        <meta key="twitter:url" name="twitter:url" content={pageUrl} />
        <meta key="twitter:title" name="twitter:title" content={pageTitle} />
        <meta key="twitter:description" name="twitter:description" content={pageDescription} />
        {pageImage && <meta key="twitter:image" name="twitter:image" content={pageImage} />}

        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <link key="canonical" rel="canonical" href={pageUrl} />
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
      
      <div className="min-h-screen bg-white dark:bg-primary text-gray-900 dark:text-gray-100">
        <Navbar personalInfo={personalInfo} socialLinks={socialLinks} />
        <main>{children}</main>
        <Footer personalInfo={personalInfo} socialLinks={socialLinks} />
      </div>
    </>
  );
}