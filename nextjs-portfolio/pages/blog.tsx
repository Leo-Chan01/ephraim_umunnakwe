import React, { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '../components/Layout';
import RefreshButton from '../components/RefreshButton';
import { portfolioService } from '../lib/supabase';
import { BlogPost } from '../types/portfolio';
import { FileText } from 'lucide-react';

interface BlogProps {
  posts: BlogPost[];
}

export default function Blog({ posts: initialPosts }: BlogProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [filter, setFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const data = await portfolioService.getBlogPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error refreshing blog posts:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const categories = ['All', ...Array.from(new Set(posts.map(post => post.category).filter(Boolean)))];

  const filteredPosts = filter === 'All'
    ? posts
    : posts.filter(post => post.category === filter);

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      await portfolioService.subscribeToNewsletter(email);
      setStatus('success');
      setMessage('SECURE TRANSMISSION SUCCESSFUL. WELCOME TO THE NETWORK.');
      setEmail('');
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'TRANSMISSION INTERRUPTED. PLEASE TRY AGAIN.');
    }
  };

  return (
    <Layout title="Blog - Ephraim Umunnakwe">
      <RefreshButton onRefresh={refreshData} isRefreshing={isRefreshing} />

      {/* Hero Section */}
      <section className="mt-16 py-32 px-4 bg-secondary dark:bg-primary border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black tracking-tightest text-neutral-900 dark:text-secondary mb-8 uppercase leading-tight">
            Journal<br />Entry
          </h1>
          <p className="text-2xl text-neutral-600 dark:text-neutral-400 max-w-3xl font-medium leading-relaxed">
            My thoughts on architectural engineering, design systems, and the future
            of high-performance digital products.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 bg-neutral-50 dark:bg-primary border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-xs font-black uppercase tracking-widest text-neutral-400 mr-4">Filter By</span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category!)}
                className={`px-8 py-3 border-2 font-black uppercase tracking-widest text-xs transition-all ${filter === category
                  ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-accent dark:border-accent'
                  : 'bg-white dark:bg-primary border-neutral-900 dark:border-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-900 hover:text-white dark:hover:bg-accent'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-32 px-4 bg-secondary dark:bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="border-4 border-neutral-900 dark:border-neutral-800 flex flex-col hover:bg-neutral-900 hover:text-white dark:hover:bg-secondary dark:hover:text-primary transition-all duration-300 group">
                <div className="h-64 bg-neutral-100 dark:bg-neutral-900 relative grayscale group-hover:grayscale-0 transition-all duration-500 overflow-hidden border-b-4 border-neutral-900 dark:border-neutral-800">
                  {post.featured_image ? (
                    <img src={post.featured_image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-300 dark:text-neutral-700">
                      <FileText size={64} />
                    </div>
                  )}
                  <div className="absolute top-0 right-0 p-4">
                    <span className="bg-accent text-white px-4 py-2 font-black uppercase tracking-widest text-[10px]">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-10 flex flex-col flex-grow">
                  <div className="flex items-center text-xs font-black uppercase tracking-tightest mb-6 opacity-60">
                    <span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : ''}</span>
                    <span className="mx-3">/</span>
                    <span>{post.read_time} MIN READ</span>
                  </div>

                  <h3 className="text-3xl font-black uppercase tracking-tight mb-6 leading-none">
                    {post.title}
                  </h3>

                  <p className="text-neutral-600 dark:text-neutral-400 font-medium text-lg mb-10 line-clamp-3 group-hover:text-neutral-300 transition-colors leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="text-accent font-black uppercase tracking-widest text-sm text-left mt-auto group-hover:text-white transition-colors">
                    Read Report <span className="ml-2">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-40 px-4 bg-neutral-50 dark:bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-neutral-900 dark:text-white mb-8 uppercase leading-tight">
                Get Daily<br />Insights
              </h2>
              <p className="text-2xl text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">
                Join my architectural network for technical deep-dives
                delivered straight to your inbox.
              </p>
            </div>
            <div className="bg-white dark:bg-primary p-12 border-4 border-neutral-900 dark:border-neutral-800">
              <form onSubmit={handleSubscribe} className="flex flex-col gap-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="USER@DOMAIN.COM"
                  required
                  className="w-full bg-neutral-100 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-300 dark:placeholder-neutral-700 px-6 py-5 focus:outline-none focus:border-accent font-bold transition-all"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-neutral-900 dark:bg-accent text-white py-6 border-4 border-neutral-900 dark:border-accent font-black text-xl uppercase tracking-widest hover:bg-transparent hover:text-neutral-900 dark:hover:text-white transition-all disabled:opacity-50"
                >
                  {status === 'loading' ? 'PROCESSING...' : 'Join Network'}
                </button>
              </form>
              {message && (
                <p className={`mt-6 text-xs font-black uppercase tracking-widest text-center ${status === 'error' ? 'text-red-500' : 'text-accent'
                  }`}>
                  {message}
                </p>
              )}
              {!message && (
                <p className="mt-6 text-xs font-black uppercase tracking-widest text-neutral-400 text-center">
                  Secure Transmission Guaranteed. No Spam.
                </p>
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
    const posts = await portfolioService.getBlogPosts();
    return {
      props: {
        posts,
      },
    };
  } catch (error) {
    return {
      props: {
        posts: [],
      },
    };
  }
};