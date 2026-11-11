import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { portfolioService } from '../../lib/supabase';
import { BlogPost } from '../../types/portfolio';
import { Calendar, Tag, Clock, ArrowLeft } from 'lucide-react';
import ShareButtons from '../../components/ShareButtons';
import Link from 'next/link';
import MarkdownContent from '../../components/MarkdownContent';

interface BlogPostProps {
    post: BlogPost | null;
    fallbackImage?: string | null;
}

// Placeholder page generated at build time. Firebase serves it for any
// /blog/<slug> that didn't exist at build time, and the post is fetched client-side.
const PLACEHOLDER_SLUG = '_';

function getSlugFromLocation(): string | null {
    const match = window.location.pathname.match(/^\/blog\/([^/]+)\/?$/);
    if (!match) return null;
    const slug = decodeURIComponent(match[1]);
    return slug === PLACEHOLDER_SLUG ? null : slug;
}

export default function BlogPostDetail({ post: initialPost, fallbackImage }: BlogPostProps) {
    const router = useRouter();
    const [post, setPost] = React.useState<BlogPost | null>(initialPost ?? null);
    const [loading, setLoading] = React.useState(!initialPost);

    React.useEffect(() => {
        const slug = getSlugFromLocation();
        if (!slug) {
            setLoading(false);
            return;
        }

        let cancelled = false;
        if (!initialPost || initialPost.slug !== slug) {
            setPost(null);
            setLoading(true);
        }

        // Always refetch so edits made after the last build show up
        portfolioService.getBlogPostBySlug(slug).then((fresh) => {
            if (cancelled) return;
            if (fresh) setPost(fresh);
            else if (!initialPost || initialPost.slug !== slug) setPost(null);
            setLoading(false);
        });

        return () => {
            cancelled = true;
        };
    }, [router.asPath, initialPost]);

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-xs font-black uppercase tracking-widest text-neutral-400 animate-pulse">
                        Retrieving Report...
                    </p>
                </div>
            </Layout>
        );
    }

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
        <Layout
            title={`${post.title} - Ephraim Umunnakwe`}
            description={post.excerpt || undefined}
            image={post.featured_image || fallbackImage || undefined}
            path={`/blog/${encodeURIComponent(post.slug)}/`}
            type="article"
        >
            <Head>
                {post.created_at && (
                    <meta key="article:published_time" property="article:published_time" content={post.created_at} />
                )}
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
                    </div>
                    <div className="mt-10">
                        <ShareButtons slug={post.slug} title={post.title} excerpt={post.excerpt} />
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
                    <MarkdownContent content={post.content} className="py-10" />

                    <div className="mt-16 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <p className="text-xs font-black uppercase tracking-widest text-neutral-400">Found this useful? Share it</p>
                        <ShareButtons slug={post.slug} title={post.title} excerpt={post.excerpt} />
                    </div>

                    <div className="mt-16 pt-20 border-t-4 border-neutral-900 dark:border-neutral-800">
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
        const paths = posts
            .filter((post) => post.slug && post.slug !== PLACEHOLDER_SLUG)
            .map((post) => ({ params: { slug: post.slug } }));

        return { paths: [...paths, { params: { slug: PLACEHOLDER_SLUG } }], fallback: false };
    } catch (error) {
        return { paths: [{ params: { slug: PLACEHOLDER_SLUG } }], fallback: false };
    }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const slug = params?.slug as string;
    if (slug === PLACEHOLDER_SLUG) {
        return { props: { post: null } };
    }

    try {
        const [post, personalInfo] = await Promise.all([
            portfolioService.getBlogPostBySlug(slug),
            portfolioService.getPersonalInfo().catch(() => null),
        ]);
        return {
            props: {
                post: post ?? null,
                fallbackImage: personalInfo?.profile_image_url || null,
            },
        };
    } catch (error) {
        return { props: { post: null } };
    }
};
