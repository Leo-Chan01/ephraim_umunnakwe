import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import Layout from '../components/Layout';
import { portfolioService } from '../lib/supabase';
import { PersonalInfo, SocialLink } from '../types/portfolio';

interface ContactProps {
  personalInfo: PersonalInfo | null;
  socialLinks: SocialLink[];
}

export default function Contact({ personalInfo, socialLinks }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate form submission - in a real app, this would send to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting message:', error);
      alert('Failed to send message. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Get appropriate emoji for each platform
  const getPlatformEmoji = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('github')) return '🐙';
    if (p.includes('linkedin')) return '💼';
    if (p.includes('twitter') || p.includes('x.com')) return '🐦';
    if (p.includes('instagram')) return '📷';
    if (p.includes('facebook')) return '📘';
    if (p.includes('youtube')) return '📺';
    if (p.includes('dribbble')) return '🏀';
    if (p.includes('behance')) return '🎨';
    if (p.includes('medium')) return '📝';
    if (p.includes('dev.to')) return '👨‍💻';
    if (p.includes('discord')) return '🎮';
    if (p.includes('reddit')) return '🤖';
    if (p.includes('stackoverflow')) return '📚';
    return '🔗';
  };

  return (
    <Layout title={`Contact - ${personalInfo?.name || 'Ephraim Umunnakwe'}`}>
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Have a project in mind? Let's discuss how we can work together to bring your ideas to life.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-8">Let's Connect</h2>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📧</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Email</h3>
                      <p className="text-gray-300">{personalInfo?.email || 'ephraimumunnakwe3@gmail.com'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📱</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Phone</h3>
                      <p className="text-gray-300">{personalInfo?.phone || '+1 (555) 123-4567'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📍</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Location</h3>
                      <p className="text-gray-300">{personalInfo?.location || 'Remote / Available Worldwide'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-white font-semibold mb-4">Follow Me</h3>
                  <div className="flex space-x-4">
                    {socialLinks.filter(link => link.is_visible).length > 0 ? (
                      socialLinks
                        .filter(link => link.is_visible)
                        .map((link) => (
                          <a
                            key={link.platform}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors group"
                            title={`Follow me on ${link.platform}`}
                          >
                            <span className="text-lg group-hover:scale-110 transition-transform">
                              {getPlatformEmoji(link.platform)}
                            </span>
                          </a>
                        ))
                    ) : (
                      // Fallback social links
                      <>
                        <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors group" title="GitHub">
                          <span className="text-lg group-hover:scale-110 transition-transform">🐙</span>
                        </a>
                        <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors group" title="LinkedIn">
                          <span className="text-lg group-hover:scale-110 transition-transform">💼</span>
                        </a>
                        <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors group" title="Twitter">
                          <span className="text-lg group-hover:scale-110 transition-transform">🐦</span>
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white/5 p-8 rounded-lg">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-gray-300">Thank you for reaching out. I'll get back to you soon.</p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-4 text-blue-400 hover:text-blue-300"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-white font-medium mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-white font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-white font-medium mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="What's this about?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-white font-medium mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                        placeholder="Tell me about your project..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-semibold disabled:opacity-50"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const [personalInfo, socialLinks] = await Promise.all([
      portfolioService.getPersonalInfo(),
      portfolioService.getSocialLinks(),
    ]);

    return {
      props: {
        personalInfo,
        socialLinks,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching contact page data:', error);
    return {
      props: {
        personalInfo: null,
        socialLinks: [],
      },
    };
  }
};