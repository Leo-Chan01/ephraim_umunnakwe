import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ImagePlus, Loader2 } from 'lucide-react';
import { BlogPost } from '../../types/portfolio';
import { portfolioService } from '../../lib/supabase';
import MarkdownEditor, { countWords } from './MarkdownEditor';

export default function BlogForm({ post, onSave }: {
    post: BlogPost | null;
    onSave: (post: BlogPost) => Promise<void>;
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
    const [saveError, setSaveError] = useState<string | null>(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const imageInputRef = React.useRef<HTMLInputElement>(null);

    const estimatedReadTime = Math.max(1, Math.round(countWords(formData.content) / 230));

    const handleFeaturedImage = async (file?: File) => {
        if (!file) return;
        setImageError(null);
        setImageUploading(true);
        try {
            const url = await portfolioService.uploadBlogImage(file);
            setFormData((prev) => ({ ...prev, featured_image: url }));
        } catch (err: any) {
            setImageError(err?.message || 'Upload failed');
        } finally {
            setImageUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaveError(null);
        if (!formData.content.trim()) {
            setSaveError('Content is required');
            return;
        }
        setUploading(true);
        try {
            await onSave(formData);
        } catch (error: any) {
            console.error('Error in form submission:', error);
            setSaveError(error?.message || 'Failed to save post');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <Link
                href="/admin/blog"
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-accent mb-8 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
                <ArrowLeft size={16} /> Back to Journal Repository
            </Link>

            <div className="bg-white dark:bg-primary border-4 border-neutral-900 dark:border-neutral-800 p-6 md:p-10">
                <h2 className="text-3xl md:text-4xl font-black text-neutral-900 dark:text-white mb-10 uppercase tracking-tighter">
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
                                        // Only auto-generate the slug for new posts, so editing a title never breaks shared links
                                        const slug = post
                                            ? formData.slug
                                            : title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/-+/g, '-');
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
                                        min={1}
                                        value={formData.read_time}
                                        onChange={(e) => setFormData({ ...formData, read_time: parseInt(e.target.value) || 1 })}
                                        className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold"
                                    />
                                    {formData.read_time !== estimatedReadTime && formData.content.trim() && (
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, read_time: estimatedReadTime })}
                                            className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline"
                                        >
                                            Use estimate: {estimatedReadTime} min
                                        </button>
                                    )}
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

                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">
                                    FEATURED IMAGE <span className="text-neutral-300">· SHOWN ON THE POST AND IN LINK PREVIEWS</span>
                                </label>
                                {formData.featured_image ? (
                                    <div className="relative border-4 border-neutral-200 dark:border-neutral-800 group/img">
                                        <img src={formData.featured_image} alt="Featured" className="w-full aspect-[1.91/1] object-cover" />
                                        <div className="absolute inset-0 bg-neutral-900/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => imageInputRef.current?.click()}
                                                className="bg-white text-neutral-900 px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-white"
                                            >
                                                Replace
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, featured_image: '' })}
                                                className="bg-white text-neutral-900 px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        {imageUploading && (
                                            <div className="absolute inset-0 bg-white/80 dark:bg-primary/80 flex items-center justify-center">
                                                <Loader2 className="animate-spin text-accent" />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => imageInputRef.current?.click()}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            handleFeaturedImage(e.dataTransfer.files[0]);
                                        }}
                                        disabled={imageUploading}
                                        className="w-full aspect-[1.91/1] border-4 border-dashed border-neutral-200 dark:border-neutral-800 hover:border-accent text-neutral-400 hover:text-accent transition-colors flex flex-col items-center justify-center gap-3"
                                    >
                                        {imageUploading ? <Loader2 className="animate-spin" /> : <ImagePlus size={28} />}
                                        <span className="text-[10px] font-black uppercase tracking-widest">
                                            {imageUploading ? 'Uploading…' : 'Click or drop an image · 1200×630 works best'}
                                        </span>
                                    </button>
                                )}
                                {imageError && <p className="text-[10px] font-black uppercase tracking-widest text-red-500">{imageError}</p>}
                                <input
                                    ref={imageInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        handleFeaturedImage(e.target.files?.[0]);
                                        e.target.value = '';
                                    }}
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
                                    PUBLISH TO LIVE FEED
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">CONTENT</label>
                        <MarkdownEditor
                            value={formData.content}
                            onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
                            placeholder="Write your report… Use the toolbar, Markdown, or paste images straight in."
                        />
                    </div>

                    {/* Sticky so Save is always reachable while writing long posts */}
                    <div className="sticky bottom-0 -mx-6 md:-mx-10 -mb-6 md:-mb-10 px-6 md:px-10 py-6 bg-white/95 dark:bg-primary/95 backdrop-blur border-t-4 border-neutral-900 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center gap-4">
                        {saveError && (
                            <p className="sm:mr-auto text-xs font-black uppercase tracking-widest text-red-500">{saveError}</p>
                        )}
                        <div className="flex gap-4 sm:ml-auto">
                            <Link
                                href="/admin/blog"
                                className="px-8 py-4 bg-neutral-100 dark:bg-neutral-900 text-neutral-500 border-4 border-neutral-100 dark:border-neutral-800 font-black text-sm uppercase tracking-widest hover:bg-red-500 hover:border-red-500 hover:text-white transition-all"
                            >
                                ABORT
                            </Link>
                            <button
                                type="submit"
                                disabled={uploading || imageUploading}
                                className="px-10 py-4 bg-neutral-900 dark:bg-accent text-white border-4 border-neutral-900 dark:border-accent font-black text-sm uppercase tracking-widest hover:bg-transparent hover:text-neutral-900 dark:hover:text-white transition-all disabled:opacity-50"
                            >
                                {uploading ? 'PROCESSING...' : 'SYNC ENTRY'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
