import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Edit, Trash2, Plus, Star, User, Quote } from 'lucide-react';
import { isAuthenticated, isAuthenticatedSync } from '../../lib/auth';
import { AdminLayout } from '../../components/admin';
import { Testimonial } from '../../types/portfolio';
import { portfolioService } from '../../lib/supabase';
import { SortableList } from '../../components/admin/SortableList';
import { adminService } from '../../lib/admin-service';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
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
      loadTestimonials();
    };

    checkAuth();
  }, [router, mounted]);

  const loadTestimonials = async () => {
    setIsLoading(true);
    try {
      const data = await portfolioService.getTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await adminService.deleteTestimonial(id);
        setTestimonials(testimonials.filter(t => t.id !== id));
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        alert('Failed to delete testimonial');
      }
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setShowForm(true);
  };

  const handleSave = async (testimonial: Testimonial) => {
    try {
      if (editingTestimonial?.id) {
        const updated = await portfolioService.updateTestimonial(editingTestimonial.id, testimonial);
        setTestimonials(testimonials.map(t => t.id === editingTestimonial.id ? updated : t));
      } else {
        // Set order_index for new testimonial
        const newTestimonial = {
          ...testimonial,
          order_index: testimonials.length > 0 ? Math.max(...testimonials.map(t => t.order_index || 0)) + 1 : 0
        };
        const created = await portfolioService.createTestimonial(newTestimonial);
        setTestimonials([...testimonials, created]);
      }
      setShowForm(false);
      setEditingTestimonial(null);
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert('Failed to save testimonial');
    }
  };

  const handleReorder = async (reorderedTestimonials: Testimonial[]) => {
    const originalTestimonials = [...testimonials];
    setTestimonials(reorderedTestimonials);

    try {
      const updates = reorderedTestimonials.map((t, index) => ({
        id: t.id!,
        order_index: index,
      }));

      await portfolioService.updateOrder('testimonials', updates);
    } catch (error) {
      console.error('Error updating testimonial order:', error);
      setTestimonials(originalTestimonials);
      alert('Failed to save testimonial order');
    }
  };

  if (!mounted || !isAuthenticatedSync()) {
    return (
      <div className="min-h-screen bg-white dark:bg-primary flex items-center justify-center">
        <div className="text-neutral-900 dark:text-white font-black uppercase tracking-widest animate-pulse">Initializing Testimonials...</div>
      </div>
    );
  }

  return (
    <AdminLayout title="Client Feedback">
      <div className="mb-12 flex justify-between items-end">
        <div className="space-y-4">
          <div className="w-16 h-2 bg-accent"></div>
          <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Testimonials Engine</p>
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
          <p className="text-neutral-400 font-black uppercase tracking-widest text-xs">Syncing artifacts...</p>
        </div>
      ) : (
        <SortableList
          items={testimonials}
          onReorder={handleReorder}
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
          renderItem={(testimonial) => (
            <div className="bg-white dark:bg-primary border-4 border-neutral-900 dark:border-neutral-800 p-8 flex flex-col h-full group hover:translate-x-1 hover:-translate-y-1 transition-transform relative">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  {testimonial.avatar_url ? (
                    <img src={testimonial.avatar_url} alt={testimonial.author} className="w-16 h-16 border-4 border-neutral-900 dark:border-neutral-800 object-cover" />
                  ) : (
                    <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-900 border-4 border-neutral-900 dark:border-neutral-800" />
                  )}
                  <div>
                    <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter">{testimonial.author}</h3>
                    <p className="text-accent font-bold uppercase tracking-widest text-[10px]">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="p-2 border-2 border-neutral-100 dark:border-neutral-800 text-neutral-400 hover:text-accent hover:border-accent transition-all"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id!)}
                    className="p-2 border-2 border-neutral-100 dark:border-neutral-800 text-neutral-400 hover:text-red-500 hover:border-red-500 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-neutral-500 dark:text-neutral-400 font-medium text-sm italic mb-8 flex-1">
                "{testimonial.message}"
              </p>
              <div className="flex justify-between items-center pt-6 border-t-2 border-neutral-50 dark:border-neutral-900">
                <div className="flex text-accent">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'fill-current' : 'text-neutral-200 dark:text-neutral-800'}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-[10px] text-neutral-300">ORD: {testimonial.order_index}</span>
              </div>
            </div>
          )}
        />
      )}

      {showForm && (
        <TestimonialForm
          testimonial={editingTestimonial}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingTestimonial(null);
          }}
        />
      )}
    </AdminLayout>
  );
}

function TestimonialForm({ testimonial, onSave, onCancel }: {
  testimonial: Testimonial | null;
  onSave: (testimonial: Testimonial) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Testimonial>(
    testimonial || {
      author: '',
      role: '',
      message: '',
      rating: 5,
      created_at: new Date().toISOString(),
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-primary border-8 border-neutral-900 dark:border-neutral-800 p-12 max-w-2xl w-full shadow-[32px_32px_0px_0px_rgba(0,0,0,0.2)]">
        <h2 className="text-4xl font-black text-neutral-900 dark:text-white mb-10 uppercase tracking-tighter">
          {testimonial ? 'Revise Entry' : 'Manual Entry'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">AUTHOR IDENTIFICATION</label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                placeholder="NAME OF CLIENT"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">CORE POSITION / ROLE</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                placeholder="CEO @ COMPANY"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">TESTIMONIAL CONTENT</label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all resize-none"
              placeholder="VERBATIM FEEDBACK..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">PERFORMANCE RATING</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all appearance-none cursor-pointer"
              >
                <option value={5}>5 STARS (OPTIMAL)</option>
                <option value={4}>4 STARS (STABLE)</option>
                <option value={3}>3 STARS (ADEQUATE)</option>
                <option value={2}>2 STARS (SUBOPTIMAL)</option>
                <option value={1}>1 STAR (CRITICAL)</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">AVATAR REFERENCE (URL)</label>
              <input
                type="url"
                value={formData.avatar_url || ''}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                placeholder="https://cloud.com/user.jpg"
              />
            </div>
          </div>

          <div className="flex gap-6 pt-6">
            <button
              type="submit"
              className="flex-1 bg-neutral-900 dark:bg-accent text-white py-5 border-4 border-neutral-900 dark:border-accent font-black text-xl uppercase tracking-widest hover:bg-transparent hover:text-neutral-900 dark:hover:text-white transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              COMMIT RECORD
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-10 bg-neutral-100 dark:bg-neutral-900 text-neutral-500 py-5 border-4 border-neutral-100 dark:border-neutral-800 font-black text-xl uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
            >
              ABORT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}