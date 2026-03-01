import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Edit, Trash2, Plus, Calendar, Briefcase, MapPin } from 'lucide-react';
import { isAuthenticated, isAuthenticatedSync } from '../../lib/auth';
import { AdminLayout } from '../../components/admin';
import { Experience } from '../../types/portfolio';
import { portfolioService } from '../../lib/supabase';
import { SortableList } from '../../components/admin/SortableList';
import { verticalListSortingStrategy } from '@dnd-kit/sortable';

export default function AdminExperiences() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
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
            loadExperiences();
        };

        checkAuth();
    }, [router, mounted]);

    const loadExperiences = async () => {
        setIsLoading(true);
        try {
            const data = await portfolioService.getExperiences();
            setExperiences(data);
        } catch (error) {
            console.error('Error loading experiences:', error);
        }
        setIsLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this experience?')) {
            try {
                await portfolioService.deleteExperience(id);
                setExperiences(experiences.filter(exp => exp.id !== id));
            } catch (error) {
                console.error('Error deleting experience:', error);
                alert('Failed to delete experience');
            }
        }
    };

    const handleEdit = (experience: Experience) => {
        setEditingExperience(experience);
        setShowForm(true);
    };

    const handleSave = async (experience: Experience) => {
        try {
            if (editingExperience?.id) {
                const updated = await portfolioService.updateExperience(editingExperience.id, experience);
                setExperiences(experiences.map(exp => exp.id === editingExperience.id ? updated : exp));
            } else {
                // Set order_index for new experience
                const newExperience = {
                    ...experience,
                    order_index: experiences.length > 0 ? Math.max(...experiences.map(e => e.order_index || 0)) + 1 : 0
                };
                const created = await portfolioService.createExperience(newExperience);
                setExperiences([...experiences, created]);
            }
            setShowForm(false);
            setEditingExperience(null);
        } catch (error) {
            console.error('Error saving experience:', error);
            alert('Failed to save experience');
        }
    };

    const handleReorder = async (reorderedExperiences: Experience[]) => {
        const originalExperiences = [...experiences];
        setExperiences(reorderedExperiences);

        try {
            const updates = reorderedExperiences.map((e, index) => ({
                id: e.id!,
                order_index: index,
            }));

            await portfolioService.updateOrder('experiences', updates);
        } catch (error) {
            console.error('Error updating experience order:', error);
            setExperiences(originalExperiences);
            alert('Failed to save experience order');
        }
    };

    if (!mounted || !isAuthenticatedSync()) {
        return (
            <div className="min-h-screen bg-white dark:bg-primary flex items-center justify-center">
                <div className="text-neutral-900 dark:text-white font-black uppercase tracking-widest animate-pulse">Initializing Experiences...</div>
            </div>
        );
    }

    return (
        <AdminLayout title="Experience Log">
            <div className="mb-12 flex justify-between items-end">
                <div className="space-y-4">
                    <div className="w-16 h-2 bg-accent"></div>
                    <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Professional History</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-neutral-900 dark:bg-white text-white dark:text-primary px-8 py-4 border-4 border-neutral-900 dark:border-white font-black text-xs uppercase tracking-widest hover:bg-accent dark:hover:bg-accent transition-all flex items-center gap-3"
                >
                    <Plus size={16} />
                    Add Experience
                </button>
            </div>

            {isLoading ? (
                <div className="py-20 text-center border-4 border-dashed border-neutral-100 dark:border-neutral-800">
                    <div className="animate-spin w-12 h-12 border-t-4 border-accent mx-auto mb-6"></div>
                    <p className="text-neutral-400 font-black uppercase tracking-widest text-xs">Syncing artifacts...</p>
                </div>
            ) : (
                <SortableList
                    items={experiences}
                    onReorder={handleReorder}
                    strategy={verticalListSortingStrategy}
                    className="space-y-6"
                    renderItem={(experience) => (
                        <div className="bg-white dark:bg-primary border-4 border-neutral-900 dark:border-neutral-800 p-8 hover:translate-x-1 hover:-translate-y-1 transition-transform group">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-neutral-900 dark:bg-accent p-3 text-white">
                                            <Briefcase size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter">{experience.title}</h3>
                                            <p className="text-accent font-bold uppercase tracking-widest text-xs">{experience.company}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-neutral-400 text-xs font-bold uppercase tracking-widest">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            {experience.period}
                                        </div>
                                        <div className="ml-auto text-[10px] text-neutral-300">ORD: {experience.order_index}</div>
                                    </div>
                                    <p className="text-neutral-500 dark:text-neutral-400 font-medium text-sm leading-relaxed max-w-4xl">
                                        {experience.description}
                                    </p>
                                </div>
                                <div className="flex md:flex-col gap-2">
                                    <button
                                        onClick={() => handleEdit(experience)}
                                        className="p-3 border-2 border-neutral-100 dark:border-neutral-800 text-neutral-400 hover:text-accent hover:border-accent transition-all flex items-center justify-center"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(experience.id!)}
                                        className="p-3 border-2 border-neutral-100 dark:border-neutral-800 text-neutral-400 hover:text-red-500 hover:border-red-500 transition-all flex items-center justify-center"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                />
            )}

            {showForm && (
                <ExperienceForm
                    experience={editingExperience}
                    onSave={handleSave}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingExperience(null);
                    }}
                />
            )}
        </AdminLayout>
    );
}

function ExperienceForm({ experience, onSave, onCancel }: {
    experience: Experience | null;
    onSave: (experience: Experience) => Promise<void>;
    onCancel: () => void;
}) {
    const [formData, setFormData] = useState<Experience>(
        experience || {
            title: '',
            company: '',
            period: '',
            description: '',
            order_index: 0,
        }
    );
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSave(formData);
        } catch (error) {
            console.error('Error in ExperienceForm handleSubmit:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-primary border-8 border-neutral-900 dark:border-neutral-800 p-12 max-w-2xl w-full shadow-[32px_32px_0px_0px_rgba(0,0,0,0.2)] overflow-y-auto max-h-[90vh]">
                <h2 className="text-4xl font-black text-neutral-900 dark:text-white mb-10 uppercase tracking-tighter">
                    {experience ? 'Refine Experience' : 'New Career Node'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">POSITION TITLE</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                            placeholder="e.g. Senior Flutter Developer"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">ORGANIZATION</label>
                            <input
                                type="text"
                                required
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                                placeholder="COMPANY NAME"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">TEMPORAL RANGE</label>
                            <input
                                type="text"
                                required
                                value={formData.period}
                                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                                placeholder="e.g. Apr 2025 – Present"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">MISSION DESCRIPTION</label>
                        <textarea
                            required
                            rows={5}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all resize-none"
                            placeholder="WHAT DID YOU ACCOMPLISH?"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">SEQUENTIAL ORDER</label>
                        <input
                            type="number"
                            value={formData.order_index}
                            onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                        />
                    </div>

                    <div className="flex gap-6 pt-10 border-t-4 border-neutral-900 dark:border-neutral-800">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-neutral-900 dark:bg-accent text-white py-6 border-4 border-neutral-900 dark:border-accent font-black text-2xl uppercase tracking-widest hover:bg-transparent hover:text-neutral-900 dark:hover:text-white transition-all shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                                    SYNCING...
                                </>
                            ) : 'COMMIT'}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="px-12 bg-neutral-100 dark:bg-neutral-900 text-neutral-500 py-6 border-4 border-neutral-100 dark:border-neutral-800 font-black text-2xl uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                        >
                            ABORT
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
