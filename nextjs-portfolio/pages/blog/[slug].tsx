import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { portfolioService } from '../../lib/supabase';
import { BlogPost } from '../../types/portfolio';
import { Calendar, Tag, Clock, ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

interface BlogPostProps {
    post: BlogPost | null;
}

export default function BlogPostDetail({ post }: BlogPostProps) {
    if (!post) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-black uppercase mb-8">Report Not Found</h1>
                        <Link href="/blog" className="text-accent font-black uppercase tracking-widest underline underline-offset-8">
                            Return to Archive
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title={`${post.title} - Ephraim Umunnakwe`}>
            <Head>
                <meta name="description" content={post.excerpt} />
            </Head>

            {/* Hero Section */}
            <section className="mt-16 py-32 px-4 bg-secondary dark:bg-primary border-b border-neutral-200 dark:border-neutral-800">
                <div className="max-w-4xl mx-auto">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-accent mb-12 hover:text-neutral-900 dark:hover:text-white transition-colors">
                        <ArrowLeft size={16} /> / Back to Journal
                    </Link>

                    <div className="space-y-6 mb-12">
                        <div className="flex items-center gap-4">
                            <span className="bg-neutral-900 text-white dark:bg-accent px-4 py-2 text-[10px] font-black uppercase tracking-widest">
                                {post.category}
                            </span>
                            <span className="h-[2px] w-12 bg-neutral-200 dark:border-neutral-800"></span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tightest text-neutral-900 dark:text-secondary uppercase leading-none">
                            {post.title}
                        </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-10 text-xs font-black uppercase tracking-widest text-neutral-400">
                        <div className="flex items-center gap-3">
                            <Calendar size={16} className="text-accent" />
                            {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock size={16} className="text-accent" />
                            {post.read_time} Min Read
                        </div>
                        <button className="flex items-center gap-3 hover:text-neutral-900 dark:hover:text-white transition-colors">
                            <Share2 size={16} className="text-accent" />
                            Share Report
                        </button>
                    </div>
                </div>
            </section>

            {/* Featured Image */}
            {post.featured_image && (
                <section className="px-4 -mt-16 mb-20">
                    <div className="max-w-6xl mx-auto border-8 border-neutral-900 dark:border-neutral-800 shadow-[32px_32px_0px_0px_rgba(0,0,0,0.1)]">
                        <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700"
                        />
                    </div>
                </section>
            )}

            {/* Content Section */}
            <section className="py-20 px-4 bg-white dark:bg-primary">
                <div className="max-w-3xl mx-auto">
                    <div className="prose prose-neutral dark:prose-invert prose-2xl max-w-none 
            prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter
            prose-p:font-medium prose-p:leading-relaxed prose-p:text-neutral-600 dark:prose-p:text-neutral-400
            prose-a:text-accent prose-a:no-underline hover:prose-a:underline
            prose-strong:font-black prose-strong:text-neutral-900 dark:prose-strong:text-white
            prose-blockquote:border-l-8 prose-blockquote:border-accent prose-blockquote:bg-neutral-50 dark:prose-blockquote:bg-neutral-900 prose-blockquote:p-8 prose-blockquote:font-bold prose-blockquote:not-italic py-10">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>

                    <div className="mt-20 pt-20 border-t-4 border-neutral-900 dark:border-neutral-800">
                        <div className="flex justify-between items-center">
                            <div className="space-y-4">
                                <p className="text-xs font-black uppercase tracking-widest text-neutral-400">Written By</p>
                                <p className="text-2xl font-black uppercase tracking-tightest">Ephraim Umunnakwe</p>
                                <p className="text-sm font-bold text-neutral-500 uppercase">Architectural Software Engineer</p>
                            </div>
                            <Link
                                href="/blog"
                                className="bg-neutral-900 text-white dark:bg-accent px-10 py-5 font-black uppercase tracking-widest text-xs border-4 border-neutral-900 dark:border-accent hover:bg-transparent hover:text-neutral-900 dark:hover:text-white transition-all"
                            >
                                Journal Archive
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 px-4 bg-accent text-white">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 uppercase">HAVE A VISION?</h2>
                    <p className="text-xl md:text-2xl text-white/80 mb-12 font-medium max-w-2xl mx-auto">
                        Let's discuss how we can build your next high-performance solution.
                    </p>
                    <Link
                        href="/contact"
                        className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-12 py-5 border-4 border-neutral-900 dark:border-white font-black text-xl uppercase tracking-widest hover:bg-white hover:text-accent dark:hover:bg-neutral-900 dark:hover:text-white transition-all inline-block"
                    >
                        Start Conversation
                    </Link>
                </div>
            </section>
        </Layout>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    try {
        const posts = await portfolioService.getBlogPosts();
        const paths = posts.map((post) => ({
            params: { slug: post.slug },
        }));

        return { paths, fallback: false };
    } catch (error) {
        return { paths: [], fallback: false };
    }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const slug = params?.slug as string;
    try {
        const post = await portfolioService.getBlogPostBySlug(slug);

        if (!post) {
            return { notFound: true };
        }

        return {
            props: { post },
        };
    } catch (error) {
        return { notFound: true };
    }
};
