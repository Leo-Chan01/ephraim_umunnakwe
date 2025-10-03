import Link from 'next/link';
import { PersonalInfo, SocialLink } from '../types/portfolio';

interface FooterProps {
  personalInfo: PersonalInfo | null;
  socialLinks: SocialLink[];
}

export default function Footer({ personalInfo, socialLinks }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const displayName = personalInfo?.name || 'Ephraim Umunnakwe';
  const displayBio = personalInfo?.bio || 'Full-stack developer passionate about creating innovative solutions that make a difference.';

  // Get visible social links
  const visibleSocialLinks = socialLinks.filter(link => link.is_visible);

  return (
    <footer className="bg-black/40 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">{displayName}</h3>
            <p className="text-gray-300 mb-4">
              {displayBio}
            </p>
            <div className="flex space-x-4">
              {visibleSocialLinks.length > 0 ? (
                visibleSocialLinks.map((link) => {
                  // Get appropriate emoji and styling for each platform
                  const getPlatformConfig = (platform: string) => {
                    const p = platform.toLowerCase();
                    if (p.includes('github')) return { emoji: '🐙', label: 'GitHub' };
                    if (p.includes('linkedin')) return { emoji: '💼', label: 'LinkedIn' };
                    if (p.includes('twitter') || p.includes('x.com')) return { emoji: '🐦', label: 'Twitter' };
                    if (p.includes('instagram')) return { emoji: '📷', label: 'Instagram' };
                    if (p.includes('facebook')) return { emoji: '📘', label: 'Facebook' };
                    if (p.includes('youtube')) return { emoji: '📺', label: 'YouTube' };
                    if (p.includes('dribbble')) return { emoji: '🏀', label: 'Dribbble' };
                    if (p.includes('behance')) return { emoji: '🎨', label: 'Behance' };
                    if (p.includes('medium')) return { emoji: '📝', label: 'Medium' };
                    if (p.includes('dev.to')) return { emoji: '👨‍💻', label: 'Dev.to' };
                    return { emoji: '🔗', label: platform };
                  };

                  const config = getPlatformConfig(link.platform);

                  return (
                    <a 
                      key={link.platform}
                      href={link.url} 
                      className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors group"
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Follow me on ${config.label}`}
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform">
                        {config.emoji}
                      </span>
                    </a>
                  );
                })
              ) : (
                // Fallback social links
                <>
                  <a href="https://github.com" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors" title="GitHub">
                    <span className="text-lg">🐙</span>
                  </a>
                  <a href="https://linkedin.com" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors" title="LinkedIn">
                    <span className="text-lg">💼</span>
                  </a>
                  <a href="https://twitter.com" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors" title="Twitter">
                    <span className="text-lg">🐦</span>
                  </a>
                </>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/about" className="block text-gray-400 hover:text-white">About</Link>
              <Link href="/projects" className="block text-gray-400 hover:text-white">Projects</Link>
              <Link href="/services" className="block text-gray-400 hover:text-white">Services</Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <div className="space-y-2">
              <p className="text-gray-400">Web Development</p>
              <p className="text-gray-400">Mobile Apps</p>
              <p className="text-gray-400">API Development</p>
              <p className="text-gray-400">Consulting</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {currentYear} {displayName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}