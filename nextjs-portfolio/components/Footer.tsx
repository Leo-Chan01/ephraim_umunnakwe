import Link from 'next/link';
import { Github, Linkedin, Twitter, Instagram, Facebook, Youtube, Globe, Mail } from 'lucide-react';
import { PersonalInfo, SocialLink } from '../types/portfolio';

interface FooterProps {
  personalInfo: PersonalInfo | null;
  socialLinks: SocialLink[];
}

export default function Footer({ personalInfo, socialLinks }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const displayName = personalInfo?.name || 'Ephraim Umunnakwe';

  // Get visible social links
  const visibleSocialLinks = socialLinks.filter(link => link.is_visible);

  return (
    <footer className="bg-secondary dark:bg-primary border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-bold tracking-tightest text-neutral-900 dark:text-secondary mb-6">{displayName}</h3>
            <div className="flex flex-wrap gap-3">
              {visibleSocialLinks.length > 0 ? (
                visibleSocialLinks.map((link) => {
                  // Get appropriate icon component for each platform
                  const getIconComponent = (platform: string) => {
                    const p = platform.toLowerCase();
                    if (p.includes('github')) return { Icon: Github, label: 'GitHub' };
                    if (p.includes('linkedin')) return { Icon: Linkedin, label: 'LinkedIn' };
                    if (p.includes('twitter') || p.includes('x.com')) return { Icon: Twitter, label: 'Twitter' };
                    if (p.includes('instagram')) return { Icon: Instagram, label: 'Instagram' };
                    if (p.includes('facebook')) return { Icon: Facebook, label: 'Facebook' };
                    if (p.includes('youtube')) return { Icon: Youtube, label: 'YouTube' };
                    if (p.includes('mail') || p.includes('email')) return { Icon: Mail, label: 'Email' };
                    return { Icon: Globe, label: platform };
                  };

                  const { Icon, label } = getIconComponent(link.platform);
                  return (
                    <a
                      key={link.platform}
                      href={link.url}
                      className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-none flex items-center justify-center hover:bg-neutral-900 hover:text-white dark:hover:bg-secondary dark:hover:text-primary transition-all duration-200 group text-neutral-600 dark:text-neutral-400"
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Follow me on ${label}`}
                    >
                      <Icon size={20} className="group-hover:scale-110 transition-transform" />
                    </a>
                  );
                })
              ) : (
                <>
                  <a href="https://github.com" className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-none flex items-center justify-center hover:bg-neutral-900 hover:text-white dark:hover:bg-secondary dark:hover:text-primary transition-all duration-200" title="GitHub">
                    <Github size={20} />
                  </a>
                  <a href="https://linkedin.com" className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-none flex items-center justify-center hover:bg-neutral-900 hover:text-white dark:hover:bg-secondary dark:hover:text-primary transition-all duration-200" title="LinkedIn">
                    <Linkedin size={20} />
                  </a>
                </>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-gray-900 dark:text-white font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/about" className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">About</Link>
              <Link href="/projects" className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Projects</Link>
              <Link href="/services" className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Services</Link>
              <Link href="/contact" className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="text-gray-900 dark:text-white font-semibold mb-4">Services</h4>
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-400">Web Development</p>
              <p className="text-gray-600 dark:text-gray-400">Mobile Apps</p>
              <p className="text-gray-600 dark:text-gray-400">API Development</p>
              <p className="text-gray-600 dark:text-gray-400">Consulting</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © {currentYear} {displayName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}