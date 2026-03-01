import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Edit, Trash2, Plus, Star, Award, Zap } from 'lucide-react';
import { isAuthenticated, isAuthenticatedSync } from '../../lib/auth';
import { AdminLayout } from '../../components/admin';
import { Skill } from '../../types/portfolio';
import { portfolioService } from '../../lib/supabase';
import { SortableList } from '../../components/admin/SortableList';

export default function AdminSkills() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
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
            loadSkills();
        };

        checkAuth();
    }, [router, mounted]);

    const loadSkills = async () => {
        setIsLoading(true);
        try {
            const data = await portfolioService.getSkills();
            setSkills(data);
        } catch (error) {
            console.error('Error loading skills:', error);
        }
        setIsLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this skill?')) {
            try {
                await portfolioService.deleteSkill(id);
                setSkills(skills.filter(s => s.id !== id));
            } catch (error) {
                console.error('Error deleting skill:', error);
                alert('Failed to delete skill');
            }
        }
    };

    const handleEdit = (skill: Skill) => {
        setEditingSkill(skill);
        setShowForm(true);
    };

    const handleSave = async (skill: Skill) => {
        try {
            if (editingSkill?.id) {
                const updated = await portfolioService.updateSkill(editingSkill.id, skill);
                setSkills(skills.map(s => s.id === editingSkill.id ? updated : s));
            } else {
                // Set order_index for new skill
                const newSkill = {
                    ...skill,
                    order_index: skills.length > 0 ? Math.max(...skills.map(s => s.order_index || 0)) + 1 : 0
                };
                const created = await portfolioService.createSkill(newSkill);
                setSkills([...skills, created]);
            }
            setShowForm(false);
            setEditingSkill(null);
        } catch (error) {
            console.error('Error saving skill:', error);
            alert('Failed to save skill');
        }
    };

    const handleReorder = async (reorderedSkills: Skill[]) => {
        const originalSkills = [...skills];
        setSkills(reorderedSkills);

        try {
            const updates = reorderedSkills.map((s, index) => ({
                id: s.id!,
                order_index: index,
            }));

            await portfolioService.updateOrder('skills', updates);
        } catch (error) {
            console.error('Error updating skill order:', error);
            setSkills(originalSkills);
            alert('Failed to save skill order');
        }
    };

    if (!mounted || !isAuthenticatedSync()) {
        return (
            <div className="min-h-screen bg-white dark:bg-primary flex items-center justify-center">
                <div className="text-neutral-900 dark:text-white font-black uppercase tracking-widest animate-pulse">Initializing Skills...</div>
            </div>
        );
    }

    return (
        <AdminLayout title="Skills Matrix">
            <div className="mb-12 flex justify-between items-end">
                <div className="space-y-4">
                    <div className="w-16 h-2 bg-accent"></div>
                    <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Technical Arsenal</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-neutral-900 dark:bg-white text-white dark:text-primary px-8 py-4 border-4 border-neutral-900 dark:border-white font-black text-xs uppercase tracking-widest hover:bg-accent dark:hover:bg-accent transition-all flex items-center gap-3"
                >
                    <Plus size={16} />
                    Acquire Skill
                </button>
            </div>

            {isLoading ? (
                <div className="py-20 text-center border-4 border-dashed border-neutral-100 dark:border-neutral-800">
                    <div className="animate-spin w-12 h-12 border-t-4 border-accent mx-auto mb-6"></div>
                    <p className="text-neutral-400 font-black uppercase tracking-widest text-xs">Syncing artifacts...</p>
                </div>
            ) : (
                <SortableList
                    items={skills}
                    onReorder={handleReorder}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    renderItem={(skill) => (
                        <div className="bg-white dark:bg-primary border-4 border-neutral-900 dark:border-neutral-800 p-8 hover:translate-x-1 hover:-translate-y-1 transition-transform h-full group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="bg-neutral-900 dark:bg-accent p-3 text-white">
                                    <Award size={20} />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(skill)}
                                        className="p-2 border-2 border-neutral-100 dark:border-neutral-800 text-neutral-400 hover:text-accent hover:border-accent transition-all"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(skill.id!)}
                                        className="p-2 border-2 border-neutral-100 dark:border-neutral-800 text-neutral-400 hover:text-red-500 hover:border-red-500 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter mb-2">{skill.name}</h3>
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">{skill.category || 'GENERAL'}</p>
                                <span className="text-[10px] text-neutral-300">ORD: {skill.order_index}</span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-black uppercase tracking-widest text-neutral-400">Mastery</span>
                                    <span className="text-accent font-black">{skill.level}%</span>
                                </div>
                                <div className="w-full h-3 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700">
                                    <div
                                        className="h-full bg-accent transition-all duration-1000"
                                        style={{ width: `${skill.level}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )}
                />
            )}

            {showForm && (
                <SkillForm
                    skill={editingSkill}
                    onSave={handleSave}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingSkill(null);
                    }}
                />
            )}
        </AdminLayout>
    );
}

function SkillForm({ skill, onSave, onCancel }: {
    skill: Skill | null;
    onSave: (skill: Skill) => Promise<void>;
    onCancel: () => void;
}) {
    const [formData, setFormData] = useState<Skill>(
        skill || {
            name: '',
            level: 80,
            category: 'TechStack',
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
            console.error('Error in SkillForm handleSubmit:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-primary border-8 border-neutral-900 dark:border-neutral-800 p-12 max-w-xl w-full shadow-[32px_32px_0px_0px_rgba(0,0,0,0.2)]">
                <h2 className="text-4xl font-black text-neutral-900 dark:text-white mb-10 uppercase tracking-tighter">
                    {skill ? 'Skill Calibration' : 'New Ability Input'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">SKILL NOMENCLATURE</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                            placeholder="e.g. Flutter, Next.js"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">TAXONOMY / CAT</label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                                placeholder="MOBILE, WEB, etc."
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">RANK ORDER</label>
                            <input
                                type="number"
                                value={formData.order_index}
                                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                                className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">MASTERY LEVEL ({formData.level}%)</label>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={formData.level}
                            onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                            className="w-full h-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-accent"
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
