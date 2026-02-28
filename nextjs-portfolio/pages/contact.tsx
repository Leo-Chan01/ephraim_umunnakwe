import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import Layout from '../components/Layout';
import { portfolioService } from '../lib/supabase';
import { PersonalInfo, SocialLink } from '../types/portfolio';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, CheckCircle, Instagram, Facebook, Globe, Youtube } from 'lucide-react';

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
    if (p.includes('github')) return <Github size={20} />;
    if (p.includes('linkedin')) return <Linkedin size={20} />;
    if (p.includes('twitter') || p.includes('x.com')) return <Twitter size={20} />;
    if (p.includes('instagram')) return <Instagram size={20} />;
    if (p.includes('facebook')) return <Facebook size={20} />;
    if (p.includes('youtube')) return <Youtube size={20} />;
    if (p.includes('dribbble')) return <Globe size={20} />;
    if (p.includes('behance')) return <Globe size={20} />;
    if (p.includes('medium')) return <Mail size={20} />;
    if (p.includes('dev.to')) return <Globe size={20} />;
    if (p.includes('discord')) return <Globe size={20} />;
    if (p.includes('reddit')) return <Globe size={20} />;
    if (p.includes('stackoverflow')) return <Globe size={20} />;
    return <Globe size={20} />;
  };

  return (
    <Layout title={`Contact - ${personalInfo?.name || 'Ephraim Umunnakwe'}`}>
      {/* Hero Section */}
      <section className="mt-16 py-32 px-4 bg-secondary dark:bg-primary border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black tracking-tightest text-neutral-900 dark:text-secondary mb-8 uppercase leading-tight">
            Get In<br />Touch
          </h1>
          <p className="text-2xl text-neutral-600 dark:text-neutral-400 max-w-3xl font-medium leading-relaxed">
            Have a project in mind? Let's discuss how we can build your vision
            using high-performance architectural engineering.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-32 px-4 bg-neutral-50 dark:bg-primary border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Contact Info */}
            <div>
              <h2 className="text-4xl font-black text-neutral-900 dark:text-white mb-12 uppercase tracking-tight">Connect</h2>
              <div className="space-y-12">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-neutral-900 dark:bg-accent flex items-center justify-center shrink-0">
                    <Mail className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">Email Address</h3>
                    <p className="text-2xl font-black text-neutral-900 dark:text-secondary break-all">{personalInfo?.email || 'ephraimumunnakwe3@gmail.com'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 flex items-center justify-center shrink-0">
                    <Phone className="text-neutral-900 dark:text-secondary" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">Quick Call</h3>
                    <p className="text-2xl font-black text-neutral-900 dark:text-secondary">{personalInfo?.phone || '+1 (555) 123-4567'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 flex items-center justify-center shrink-0">
                    <MapPin className="text-neutral-900 dark:text-secondary" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">Location</h3>
                    <p className="text-2xl font-black text-neutral-900 dark:text-secondary">{personalInfo?.location || 'Remote / Worldwide'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-20 pt-20 border-t-2 border-neutral-200 dark:border-neutral-800">
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-8">Elsewhere</h3>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.filter(link => link.is_visible).length > 0 ? (
                    socialLinks
                      .filter(link => link.is_visible)
                      .map((link) => (
                        <a
                          key={link.platform}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-neutral-900 text-white font-black uppercase tracking-widest text-xs hover:bg-accent transition-all flex items-center gap-3"
                          title={`Follow me on ${link.platform}`}
                        >
                          {link.platform.toLowerCase().includes('github') && <Github size={16} />}
                          {link.platform.toLowerCase().includes('linkedin') && <Linkedin size={16} />}
                          {link.platform.toLowerCase().includes('twitter') && <Twitter size={16} />}
                          <span>{link.platform}</span>
                        </a>
                      ))
                  ) : (
                    <>
                      <a href="#" className="px-6 py-3 bg-neutral-900 text-white font-black uppercase tracking-widest text-xs hover:bg-accent transition-all" title="GitHub">GITHUB</a>
                      <a href="#" className="px-6 py-3 bg-neutral-900 text-white font-black uppercase tracking-widest text-xs hover:bg-accent transition-all" title="LinkedIn">LINKEDIN</a>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-primary p-10 md:p-16 border-4 border-neutral-900 dark:border-neutral-800">
              {submitted ? (
                <div className="text-center py-20">
                  <CheckCircle className="w-24 h-24 text-accent mx-auto mb-8" />
                  <h3 className="text-4xl font-black text-neutral-900 dark:text-white mb-4 uppercase tracking-tighter">Transmission Sent</h3>
                  <p className="text-neutral-500 font-medium text-lg mb-10">I will respond to your inquiry shortly.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-accent font-black uppercase tracking-widest underline underline-offset-8 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="space-y-4">
                    <label htmlFor="name" className="text-xs font-black uppercase tracking-tightest text-neutral-400">
                      IDENTIFICATION / NAME
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-300 dark:placeholder-neutral-700 px-6 py-5 focus:outline-none focus:border-accent font-bold transition-all"
                      placeholder="YOUR FULL NAME"
                    />
                  </div>

                  <div className="space-y-4">
                    <label htmlFor="email" className="text-xs font-black uppercase tracking-tightest text-neutral-400">
                      ELECTRONIC MAIL / EMAIL
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-300 dark:placeholder-neutral-700 px-6 py-5 focus:outline-none focus:border-accent font-bold transition-all"
                      placeholder="EMAIL@EXAMPLE.COM"
                    />
                  </div>

                  <div className="space-y-4">
                    <label htmlFor="subject" className="text-xs font-black uppercase tracking-tightest text-neutral-400">
                      TOPIC / SUBJECT
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-300 dark:placeholder-neutral-700 px-6 py-5 focus:outline-none focus:border-accent font-bold transition-all"
                      placeholder="GENERAL INQUIRY"
                    />
                  </div>

                  <div className="space-y-4">
                    <label htmlFor="message" className="text-xs font-black uppercase tracking-tightest text-neutral-400">
                      MESSAGE / CONTENT
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-300 dark:placeholder-neutral-700 px-6 py-5 focus:outline-none focus:border-accent font-bold transition-all resize-none"
                      placeholder="DESCRIBE YOUR PROJECT OR VISION..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-neutral-900 dark:bg-accent text-white py-6 border-4 border-neutral-900 dark:border-accent font-black text-xl uppercase tracking-widest hover:bg-transparent hover:text-neutral-900 dark:hover:text-white transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'TRANSMITTING...' : 'SEND MESSAGE'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
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