import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Edit, Trash2, Plus, Globe, Smartphone as Mobile, Zap, ShoppingCart, Lightbulb, Wrench } from 'lucide-react';
import { isAuthenticated, isAuthenticatedSync } from '../../lib/auth';
import { AdminLayout } from '../../components/admin';
import { ServiceItem } from '../../types/portfolio';
import { portfolioService } from '../../lib/supabase';
import { SortableList } from '../../components/admin/SortableList';

export default function AdminServices() {
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingService, setEditingService] = useState<ServiceItem | null>(null);
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
            loadServices();
        };

        checkAuth();
    }, [router, mounted]);

    const loadServices = async () => {
        setIsLoading(true);
        try {
            const data = await portfolioService.getServices();
            setServices(data);
        } catch (error) {
            console.error('Error loading services:', error);
        }
        setIsLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this service?')) {
            try {
                await portfolioService.deleteService(id);
                setServices(services.filter(s => s.id !== id));
            } catch (error) {
                console.error('Error deleting service:', error);
                alert('Failed to delete service');
            }
        }
    };

    const handleEdit = (service: ServiceItem) => {
        setEditingService(service);
        setShowForm(true);
    };

    const handleSave = async (service: ServiceItem) => {
        try {
            if (editingService?.id) {
                const updated = await portfolioService.updateService(editingService.id, service);
                setServices(services.map(s => s.id === editingService.id ? updated : s));
            } else {
                // Set order_index for new service
                const newService = {
                    ...service,
                    order_index: services.length > 0 ? Math.max(...services.map(s => s.order_index || 0)) + 1 : 0
                };
                const created = await portfolioService.createService(newService);
                setServices([...services, created]);
            }
            setShowForm(false);
            setEditingService(null);
        } catch (error) {
            console.error('Error saving service:', error);
            alert('Failed to save service');
        }
    };

    const handleReorder = async (reorderedServices: ServiceItem[]) => {
        const originalServices = [...services];
        setServices(reorderedServices);

        try {
            const updates = reorderedServices.map((s, index) => ({
                id: s.id!,
                order_index: index,
            }));

            await portfolioService.updateOrder('services', updates);
        } catch (error) {
            console.error('Error updating service order:', error);
            setServices(originalServices);
            alert('Failed to save service order');
        }
    };

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Globe': return <Globe size={20} />;
            case 'Mobile': return <Mobile size={20} />;
            case 'Zap': return <Zap size={20} />;
            case 'ShoppingCart': return <ShoppingCart size={20} />;
            case 'Lightbulb': return <Lightbulb size={20} />;
            case 'Wrench': return <Wrench size={20} />;
            default: return <Globe size={20} />;
        }
    };

    if (!mounted || !isAuthenticatedSync()) {
        return (
            <div className="min-h-screen bg-white dark:bg-primary flex items-center justify-center">
                <div className="text-neutral-900 dark:text-white font-black uppercase tracking-widest animate-pulse">Initializing Services...</div>
            </div>
        );
    }

    return (
        <AdminLayout title="Services Manifest">
            <div className="mb-12 flex justify-between items-end">
                <div className="space-y-4">
                    <div className="w-16 h-2 bg-accent"></div>
                    <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Service Inventory</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-neutral-900 dark:bg-white text-white dark:text-primary px-8 py-4 border-4 border-neutral-900 dark:border-white font-black text-xs uppercase tracking-widest hover:bg-accent dark:hover:bg-accent transition-all flex items-center gap-3"
                >
                    <Plus size={16} />
                    Register Service
                </button>
            </div>

            {isLoading ? (
                <div className="py-20 text-center border-4 border-dashed border-neutral-100 dark:border-neutral-800">
                    <div className="animate-spin w-12 h-12 border-t-4 border-accent mx-auto mb-6"></div>
                    <p className="text-neutral-400 font-black uppercase tracking-widest text-xs">Syncing artifacts...</p>
                </div>
            ) : (
                <SortableList
                    items={services}
                    onReorder={handleReorder}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10"
                    renderItem={(service) => (
                        <div className="bg-white dark:bg-primary border-4 border-neutral-900 dark:border-neutral-800 flex flex-col h-full group hover:translate-x-1 hover:-translate-y-1 transition-transform p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-neutral-900 dark:bg-accent flex items-center justify-center text-white">
                                    {getIcon(service.icon)}
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(service)}
                                        className="p-2 border-2 border-neutral-100 dark:border-neutral-800 text-neutral-400 hover:text-accent hover:border-accent transition-all"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service.id!)}
                                        className="p-2 border-2 border-neutral-100 dark:border-neutral-800 text-neutral-400 hover:text-red-500 hover:border-red-500 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter mb-4">{service.title}</h3>
                            <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-8 text-sm flex-1">
                                {service.description}
                            </p>

                            <div className="space-y-4 pt-6 border-t-2 border-neutral-50 dark:border-neutral-900">
                                <div className="flex flex-wrap gap-2">
                                    {service.features.map((feature, idx) => (
                                        <span key={idx} className="bg-neutral-100 dark:bg-neutral-900 text-[10px] font-black uppercase tracking-widest px-2 py-1 border border-neutral-200 dark:border-neutral-800 text-neutral-400">
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-accent">
                                    <span>{service.price}</span>
                                    <span className="text-neutral-300">ORD: {service.order_index}</span>
                                </div>
                            </div>
                        </div>
                    )}
                />
            )}

            {showForm && (
                <ServiceForm
                    service={editingService}
                    onSave={handleSave}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingService(null);
                    }}
                />
            )}
        </AdminLayout>
    );
}

function ServiceForm({ service, onSave, onCancel }: {
    service: ServiceItem | null;
    onSave: (service: ServiceItem) => Promise<void>;
    onCancel: () => void;
}) {
    const [formData, setFormData] = useState<ServiceItem>(
        service || {
            title: '',
            description: '',
            features: [],
            icon: 'Globe',
            price: '',
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
            console.error('Error in ServiceForm handleSubmit:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-primary border-8 border-neutral-900 dark:border-neutral-800 p-12 max-w-2xl w-full shadow-[32px_32px_0px_0px_rgba(0,0,0,0.2)] overflow-y-auto max-h-[90vh]">
                <h2 className="text-4xl font-black text-neutral-900 dark:text-white mb-10 uppercase tracking-tighter">
                    {service ? 'Service Revision' : 'New Service Draft'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">SERVICE TITLE</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                            placeholder="SERVICE NAME"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">DESCRIPTION</label>
                        <textarea
                            required
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all resize-none"
                            placeholder="BRIEF OVERVIEW..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">ICON ARCHETYPE</label>
                            <select
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all appearance-none cursor-pointer"
                            >
                                <option value="Globe">GLOBE</option>
                                <option value="Mobile">MOBILE</option>
                                <option value="Zap">ZAP</option>
                                <option value="ShoppingCart">SHOPPING</option>
                                <option value="Lightbulb">IDEATION</option>
                                <option value="Wrench">MAINTENANCE</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">PRICE TAG</label>
                            <input
                                type="text"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                                placeholder="e.g. Starting at $1,000"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">FEATURES (COMMA SEP)</label>
                        <input
                            type="text"
                            value={formData.features.join(', ')}
                            onChange={(e) => setFormData({ ...formData, features: e.target.value.split(',').map(f => f.trim()).filter(f => f !== '') })}
                            className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                            placeholder="FEATURE 1, FEATURE 2..."
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
