import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Award, Plus, Trash2, Edit2, Save, X, Trophy, Target, Cpu, Cloud, Zap, History } from 'lucide-react';
import { AdminLayout } from '../../components/admin';
import { Achievement } from '../../types/portfolio';
import { portfolioService } from '../../lib/supabase';
import { isAuthenticated } from '../../lib/auth';

export default function AdminAchievements() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState<Achievement>({
        title: '',
        organization: '',
        year: new Date().getFullYear().toString(),
        description: '',
        icon: 'Award',
        order_index: 0
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        if (!isAuthenticated()) {
            router.push('/admin/login');
            return;
        }
        loadAchievements();
    }, [router, mounted]);

    const loadAchievements = async () => {
        setIsLoading(true);
        try {
            const data = await portfolioService.getAchievements();
            setAchievements(data);
        } catch (error) {
            console.error('Error loading achievements:', error);
        }
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (editingAchievement?.id) {
                await portfolioService.updateAchievement(editingAchievement.id, formData);
            } else {
                await portfolioService.createAchievement(formData);
            }
            setIsModalOpen(false);
            setEditingAchievement(null);
            resetForm();
            loadAchievements();
        } catch (error) {
            console.error('Error saving achievement:', error);
            alert('Failed to save achievement');
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this achievement?')) return;
        try {
            await portfolioService.deleteAchievement(id);
            loadAchievements();
        } catch (error) {
            console.error('Error deleting achievement:', error);
            alert('Failed to delete achievement');
        }
    };

    const openEditModal = (achievement: Achievement) => {
        setEditingAchievement(achievement);
        setFormData(achievement);
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            organization: '',
            year: new Date().getFullYear().toString(),
            description: '',
            icon: 'Award',
            order_index: achievements.length
        });
    };

    const icons = [
        { name: 'Award', icon: <Award size={20} /> },
        { name: 'Trophy', icon: <Trophy size={20} /> },
        { name: 'Target', icon: <Target size={20} /> },
        { name: 'Cpu', icon: <Cpu size={20} /> },
        { name: 'Cloud', icon: <Cloud size={20} /> },
        { name: 'Zap', icon: <Zap size={20} /> },
        { name: 'History', icon: <History size={20} /> },
    ];

    if (!mounted || !isAuthenticated()) return null;

    return (
        <AdminLayout title="Achievement Module">
            <div className="mb-12 flex justify-between items-end">
                <div className="space-y-4">
                    <div className="w-16 h-2 bg-accent"></div>
                    <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Recognition & Awards Node</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setEditingAchievement(null);
                        setIsModalOpen(true);
                    }}
                    className="bg-neutral-900 dark:bg-white text-white dark:text-primary px-10 py-5 border-4 border-neutral-900 dark:border-white font-black text-xl uppercase tracking-widest hover:bg-accent dark:hover:bg-accent transition-all flex items-center gap-4 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)]"
                >
                    <Plus size={24} />
                    ADD ACHIEVEMENT
                </button>
            </div>

            {isLoading ? (
                <div className="py-20 text-center border-4 border-dashed border-neutral-100 dark:border-neutral-800">
                    <div className="animate-spin w-12 h-12 border-t-4 border-accent mx-auto mb-6"></div>
                    <p className="text-neutral-400 font-black uppercase tracking-widest text-xs">Accessing achievement database...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {achievements.map((achievement) => (
                        <div key={achievement.id} className="bg-white dark:bg-primary border-4 border-neutral-900 dark:border-neutral-800 p-8 hover:translate-x-2 transition-transform shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-neutral-900 dark:bg-accent flex items-center justify-center text-white">
                                    {icons.find(i => i.name === achievement.icon)?.icon || <Award size={20} />}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openEditModal(achievement)} className="p-3 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-primary transition-all border-2 border-neutral-900 dark:border-neutral-800">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => achievement.id && handleDelete(achievement.id)} className="p-3 bg-neutral-100 dark:bg-neutral-900 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-all border-2 border-neutral-900 dark:border-neutral-800">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between items-end mb-4">
                                <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter">{achievement.title}</h3>
                                <span className="text-accent font-black">{achievement.year}</span>
                            </div>
                            <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs mb-4">{achievement.organization}</p>
                            <p className="text-neutral-600 dark:text-neutral-400 font-medium line-clamp-3">{achievement.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-neutral-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-primary border-8 border-neutral-900 dark:border-neutral-800 p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[20px_20px_0px_0px_rgba(0,0,0,0.3)]">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-neutral-900 dark:text-white">
                                {editingAchievement ? 'RECONFIGURE ACHIEVEMENT' : 'NEW ACHIEVEMENT INITIALIZATION'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900">
                                <X size={32} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">ACHIEVEMENT TITLE</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">ORGANIZATION</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.organization}
                                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                        className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">CONFERRAL YEAR</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                        className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                                        placeholder="2024"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">DISPLAY ICON</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {icons.map((item) => (
                                            <button
                                                key={item.name}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, icon: item.name })}
                                                className={`p-3 border-2 transition-all flex items-center justify-center ${formData.icon === item.name
                                                    ? 'border-accent bg-accent text-white'
                                                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-white'}`}
                                            >
                                                {item.icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">DETAILED DESCRIPTION</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all resize-none"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">ORDER INDEX</label>
                                <input
                                    type="number"
                                    value={formData.order_index}
                                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                                />
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 bg-neutral-900 dark:bg-white text-white dark:text-primary py-6 border-4 border-neutral-900 dark:border-white font-black text-xl uppercase tracking-widest hover:bg-accent dark:hover:bg-accent transition-all flex justify-center items-center gap-4 disabled:opacity-50"
                                >
                                    <Save size={24} />
                                    {isSaving ? 'COMMITTING...' : 'SAVE ACHIEVEMENT'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-10 py-6 border-4 border-neutral-200 dark:border-neutral-800 font-black text-xl uppercase tracking-widest hover:border-neutral-900 dark:hover:border-white transition-all"
                                >
                                    ABORT
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
