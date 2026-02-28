import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Edit, Trash2, Plus, FileText, Calendar, Tag, Check, X, Eye } from 'lucide-react';
import { isAuthenticated, isAuthenticatedSync } from '../../lib/auth';
import { AdminLayout } from '../../components/admin';
import { BlogPost } from '../../types/portfolio';
import { portfolioService } from '../../lib/supabase';
import { adminService } from '../../lib/admin-service';

export default function AdminBlog() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
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
            const data = await portfolioService.getBlogPosts(false);
            setPosts(data);
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

    const handleEdit = (post: BlogPost) => {
        setEditingPost(post);
        setShowForm(true);
    };

    const handleSave = async (post: BlogPost) => {
        try {
            if (editingPost) {
                const updated = await adminService.updateBlogPost(post.id!, post);
                setPosts(posts.map(p => p.id === post.id ? updated : p));
            } else {
                const created = await adminService.createBlogPost(post);
                setPosts([...posts, created]);
            }
            setShowForm(false);
            setEditingPost(null);
        } catch (error) {
            console.error('Error saving post:', error);
            alert('Failed to save post');
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
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-neutral-900 dark:bg-white text-white dark:text-primary px-8 py-4 border-4 border-neutral-900 dark:border-white font-black text-xs uppercase tracking-widest hover:bg-accent dark:hover:bg-accent transition-all flex items-center gap-3"
                >
                    <Plus size={16} />
                    Create Entry
                </button>
            </div>

            {isLoading ? (
                <div className="py-20 text-center border-4 border-dashed border-neutral-100 dark:border-neutral-800">
                    <div className="animate-spin w-12 h-12 border-t-4 border-accent mx-auto mb-6"></div>
                    <p className="text-neutral-400 font-black uppercase tracking-widest text-xs">Syncing reports...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white dark:bg-primary border-4 border-neutral-900 dark:border-neutral-800 p-8 flex flex-col md:flex-row justify-between items-center group hover:bg-neutral-900 transition-all duration-300">
                            <div className="flex items-center gap-8 w-full md:w-auto">
                                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center shrink-0 border-2 border-neutral-200 dark:border-neutral-800 group-hover:bg-white transition-colors">
                                    <FileText className="text-neutral-400 group-hover:text-accent" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter group-hover:text-white">{post.title}</h3>
                                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                                        <span className="flex items-center gap-2"><Calendar size={12} /> {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Draft'} </span>
                                        <span className="flex items-center gap-2"><Tag size={12} /> {post.category || 'Uncategorized'}</span>
                                        <span className={`flex items-center gap-2 ${post.is_published ? 'text-green-500' : 'text-orange-500'}`}>
                                            {post.is_published ? <Check size={12} /> : <X size={12} />}
                                            {post.is_published ? 'Published' : 'Draft'}
                                        </span>
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
                                <button
                                    onClick={() => handleEdit(post)}
                                    className="p-4 border-2 border-neutral-100 dark:border-neutral-800 text-neutral-400 hover:text-accent hover:border-accent transition-all"
                                    title="Edit Entry"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(post.id!)}
                                    className="p-4 border-2 border-neutral-100 dark:border-neutral-800 text-neutral-400 hover:text-red-500 hover:border-red-500 transition-all"
                                    title="Purge Entry"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {posts.length === 0 && (
                        <div className="py-20 text-center border-4 border-dashed border-neutral-100 dark:border-neutral-800">
                            <p className="text-neutral-400 font-black uppercase tracking-widest text-xs">No entries found in archive.</p>
                        </div>
                    )}
                </div>
            )}

            {showForm && (
                <BlogForm
                    post={editingPost}
                    onSave={handleSave}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingPost(null);
                    }}
                />
            )}
        </AdminLayout>
    );
}

function BlogForm({ post, onSave, onCancel }: {
    post: BlogPost | null;
    onSave: (post: BlogPost) => void;
    onCancel: () => void;
}) {
    const [formData, setFormData] = useState<BlogPost>(
        post || {
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            category: 'Technology',
            is_published: false,
            read_time: 5,
            featured_image: '',
        }
    );
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        try {
            await onSave(formData);
        } catch (error) {
            console.error('Error in form submission:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-primary border-8 border-neutral-900 dark:border-neutral-800 p-12 max-w-5xl w-full shadow-[32px_32px_0px_0px_rgba(0,0,0,0.2)] overflow-y-auto max-h-[90vh]">
                <h2 className="text-4xl font-black text-neutral-900 dark:text-white mb-10 uppercase tracking-tighter">
                    {post ? 'Editorial Revision' : 'New Journal Entry'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">ENTRY TITLE</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => {
                                        const title = e.target.value;
                                        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                                        setFormData({ ...formData, title, slug });
                                    }}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                                    placeholder="HEADING OF THE REPORT"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">URL SLUG</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                                    placeholder="URL-FRIENDLY-SLUG"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">CATEGORY</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="Technology">TECHNOLOGY</option>
                                        <option value="Design">DESIGN</option>
                                        <option value="Engineering">ENGINEERING</option>
                                        <option value="Career">CAREER</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">READ TIME (MIN)</label>
                                    <input
                                        type="number"
                                        value={formData.read_time}
                                        onChange={(e) => setFormData({ ...formData, read_time: parseInt(e.target.value) })}
                                        className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">EXCERPT (BRIEF)</label>
                                <textarea
                                    rows={4}
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all resize-none"
                                    placeholder="SUMMARIZE THE ENTRY..."
                                />
                            </div>

                            <div className="flex items-center gap-6 p-6 border-4 border-neutral-100 dark:border-neutral-800">
                                <input
                                    type="checkbox"
                                    id="is_published"
                                    checked={formData.is_published}
                                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                    className="w-8 h-8 accent-accent cursor-pointer"
                                />
                                <label htmlFor="is_published" className="text-sm font-black uppercase tracking-widest text-neutral-900 dark:text-white cursor-pointer select-none">
                                    PUBLISH TO ARCHIVE
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">CONTENT (MARKDOWN SUPPORTED)</label>
                        <textarea
                            required
                            rows={12}
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-8 focus:outline-none focus:border-accent font-medium leading-relaxed transition-all resize-y min-h-[400px]"
                            placeholder="WRITE YOUR REPORT..."
                        />
                    </div>

                    <div className="flex gap-6 pt-10 border-t-4 border-neutral-900 dark:border-neutral-800">
                        <button
                            type="submit"
                            disabled={uploading}
                            className="flex-1 bg-neutral-900 dark:bg-accent text-white py-6 border-4 border-neutral-900 dark:border-accent font-black text-2xl uppercase tracking-widest hover:bg-transparent hover:text-neutral-900 dark:hover:text-white transition-all shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] disabled:opacity-50"
                        >
                            {uploading ? 'PROCESSING...' : 'SYNC ENTRY'}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-12 bg-neutral-100 dark:bg-neutral-900 text-neutral-500 py-6 border-4 border-neutral-100 dark:border-neutral-800 font-black text-2xl uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                        >
                            ABORT
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
