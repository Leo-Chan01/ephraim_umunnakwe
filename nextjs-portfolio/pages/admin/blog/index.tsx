import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Edit, Trash2, Plus, FileText, Calendar, Tag, Check, X, Eye, Users, Share2 } from 'lucide-react';
import { isAuthenticated, isAuthenticatedSync } from '../../../lib/auth';
import { AdminLayout } from '../../../components/admin';
import { BlogPost } from '../../../types/portfolio';
import { portfolioService } from '../../../lib/supabase';
import { adminService } from '../../../lib/admin-service';
import { SortableList } from '../../../components/admin/SortableList';
import { verticalListSortingStrategy } from '@dnd-kit/sortable';

export default function AdminBlog() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<Record<string, { views: number; unique_views: number; shares: number }>>({});
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const checkAuth = async () => {
            if (!(await isAuthenticated())) {
                router.push('/admin/login');
                return;
            }
            loadPosts();
        };

        checkAuth();
    }, [router, mounted]);

    const loadPosts = async () => {
        setIsLoading(true);
        try {
            // Fetch all posts, even unpublished ones
            const [data, postStats] = await Promise.all([
                portfolioService.getBlogPosts(false),
                portfolioService.getBlogPostStats(),
            ]);
            setPosts(data);
            setStats(postStats);
        } catch (error) {
            console.error('Error loading posts:', error);
        }
        setIsLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this report?')) {
            try {
                await adminService.deleteBlogPost(id);
                setPosts(posts.filter(p => p.id !== id));
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('Failed to delete post');
            }
        }
    };

    const handleReorder = async (reorderedPosts: BlogPost[]) => {
        const originalPosts = [...posts];
        setPosts(reorderedPosts);

        try {
            const updates = reorderedPosts.map((p, index) => ({
                id: p.id!,
                order_index: index,
            }));

            await portfolioService.updateOrder('blog_posts', updates);
        } catch (error) {
            console.error('Error updating blog order:', error);
            setPosts(originalPosts);
            alert('Failed to save blog order');
        }
    };

    if (!mounted || !isAuthenticatedSync()) {
        return (
            <div className="min-h-screen bg-white dark:bg-primary flex items-center justify-center">
                <div className="text-neutral-900 dark:text-white font-black uppercase tracking-widest animate-pulse">Initializing Archive...</div>
            </div>
        );
    }

    return (
        <AdminLayout title="Journal Repository">
            <div className="mb-12 flex justify-between items-end">
                <div className="space-y-4">
                    <div className="w-16 h-2 bg-accent"></div>
                    <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Editorial Manifest</p>
                </div>
                <Link
                    href="/admin/blog/editor"
                    className="bg-neutral-900 dark:bg-white text-white dark:text-primary px-8 py-4 border-4 border-neutral-900 dark:border-white font-black text-xs uppercase tracking-widest hover:bg-accent dark:hover:bg-accent transition-all flex items-center gap-3"
                >
                    <Plus size={16} />
                    Create Entry
                </Link>
            </div>

            {isLoading ? (
                <div className="py-20 text-center border-4 border-dashed border-neutral-100 dark:border-neutral-800">
                    <div className="animate-spin w-12 h-12 border-t-4 border-accent mx-auto mb-6"></div>
                    <p className="text-neutral-400 font-black uppercase tracking-widest text-xs">Syncing reports...</p>
                </div>
            ) : (
                <SortableList
                    items={posts}
                    onReorder={handleReorder}
                    strategy={verticalListSortingStrategy}
                    className="grid grid-cols-1 gap-6"
                    renderItem={(post) => (
                        <div className="bg-white dark:bg-primary border-4 border-neutral-900 dark:border-neutral-800 p-8 flex flex-col md:flex-row justify-between items-center group hover:bg-neutral-900 transition-all duration-300">
                            <div className="flex items-center gap-8 w-full md:w-auto">
                                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center shrink-0 border-2 border-neutral-200 dark:border-neutral-800 group-hover:bg-white transition-colors">
                                    <FileText className="text-neutral-400 group-hover:text-accent" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter group-hover:text-white">{post.title}</h3>
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                                        <span className="flex items-center gap-2"><Calendar size={12} /> {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Draft'} </span>
                                        <span className="flex items-center gap-2"><Tag size={12} /> {post.category || 'Uncategorized'}</span>
                                        <span className={`flex items-center gap-2 ${post.is_published ? 'text-green-500' : 'text-orange-500'}`}>
                                            {post.is_published ? <Check size={12} /> : <X size={12} />}
                                            {post.is_published ? 'Published' : 'Draft'}
                                        </span>
                                        <span className="flex items-center gap-2" title="Total views">
                                            <Eye size={12} /> {(stats[post.slug]?.views ?? 0).toLocaleString()} views
                                        </span>
                                        <span className="flex items-center gap-2" title="Unique readers (one per browser session)">
                                            <Users size={12} /> {(stats[post.slug]?.unique_views ?? 0).toLocaleString()} readers
                                        </span>
                                        <span className="flex items-center gap-2" title="Shares via the share buttons">
                                            <Share2 size={12} /> {(stats[post.slug]?.shares ?? 0).toLocaleString()} shares
                                        </span>
                                        <span className="text-[10px] text-neutral-300">ORD: {post.order_index}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8 md:mt-0">
                                <a
                                    href={`/blog/${post.slug}`}
                                    target="_blank"
                                    className="p-4 border-2 border-neutral-100 dark:border-neutral-800 text-neutral-400 hover:text-white hover:border-white transition-all"
                                    title="View Live"
                                >
                                    <Eye size={18} />
                                </a>
                                <Link
                                    href={`/admin/blog/editor?id=${post.id}`}
                                    className="p-4 border-2 border-neutral-100 dark:border-neutral-800 text-neutral-400 hover:text-accent hover:border-accent transition-all"
                                    title="Edit Entry"
                                >
                                    <Edit size={18} />
                                </Link>
                                <button
                                    onClick={() => handleDelete(post.id!)}
                                    className="p-4 border-2 border-neutral-100 dark:border-neutral-800 text-neutral-400 hover:text-red-500 hover:border-red-500 transition-all"
                                    title="Purge Entry"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                />
            )}

            {posts.length === 0 && !isLoading && (
                <div className="py-20 text-center border-4 border-dashed border-neutral-100 dark:border-neutral-800">
                    <p className="text-neutral-400 font-black uppercase tracking-widest text-xs">No entries found in archive.</p>
                </div>
            )}
        </AdminLayout>
    );
}
