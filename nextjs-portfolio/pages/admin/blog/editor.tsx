import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { isAuthenticated, isAuthenticatedSync } from '../../../lib/auth';
import { AdminLayout } from '../../../components/admin';
import BlogForm from '../../../components/admin/BlogForm';
import { BlogPost } from '../../../types/portfolio';
import { portfolioService } from '../../../lib/supabase';
import { adminService } from '../../../lib/admin-service';

// New post:  /admin/blog/editor/
// Edit post: /admin/blog/editor/?id=123
// (A query param rather than /admin/blog/[id] because the site is a static export.)
export default function BlogEditorPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
    const [post, setPost] = useState<BlogPost | null>(null);
    const [status, setStatus] = useState<'loading' | 'ready' | 'not-found'>('loading');

    const idParam = router.query.id;
    const postId = typeof idParam === 'string' && idParam ? Number(idParam) : null;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !router.isReady) return;

        const load = async () => {
            if (!(await isAuthenticated())) {
                router.push('/admin/login');
                return;
            }
            const posts = await portfolioService.getBlogPosts(false);
            setAllPosts(posts);

            if (postId === null) {
                setPost(null);
                setStatus('ready');
                return;
            }
            const existing = posts.find((p) => p.id === postId);
            setPost(existing || null);
            setStatus(existing ? 'ready' : 'not-found');
        };

        load();
    }, [mounted, router.isReady, postId]);

    const handleSave = async (data: BlogPost) => {
        if (post?.id) {
            await adminService.updateBlogPost(post.id, data);
        } else {
            await adminService.createBlogPost({
                ...data,
                order_index: allPosts.length > 0 ? Math.max(...allPosts.map((p) => p.order_index || 0)) + 1 : 0,
            });
        }
        router.push('/admin/blog');
    };

    if (!mounted || !isAuthenticatedSync()) {
        return (
            <div className="min-h-screen bg-white dark:bg-primary flex items-center justify-center">
                <div className="text-neutral-900 dark:text-white font-black uppercase tracking-widest animate-pulse">Initializing Editor...</div>
            </div>
        );
    }

    return (
        <AdminLayout title={postId ? 'Edit Entry' : 'New Entry'}>
            {status === 'loading' && (
                <div className="py-20 text-center border-4 border-dashed border-neutral-100 dark:border-neutral-800">
                    <div className="animate-spin w-12 h-12 border-t-4 border-accent mx-auto mb-6"></div>
                    <p className="text-neutral-400 font-black uppercase tracking-widest text-xs">Loading entry...</p>
                </div>
            )}

            {status === 'not-found' && (
                <div className="py-20 text-center border-4 border-dashed border-neutral-100 dark:border-neutral-800 space-y-6">
                    <p className="text-neutral-400 font-black uppercase tracking-widest text-xs">Entry not found.</p>
                    <Link href="/admin/blog" className="text-accent font-black uppercase tracking-widest text-xs underline underline-offset-8">
                        Back to Journal Repository
                    </Link>
                </div>
            )}

            {/* key forces a fresh form when switching between posts */}
            {status === 'ready' && <BlogForm key={post?.id ?? 'new'} post={post} onSave={handleSave} />}
        </AdminLayout>
    );
}
