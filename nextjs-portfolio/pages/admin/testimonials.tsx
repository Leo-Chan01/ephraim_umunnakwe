import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Edit, Trash2, Plus, Star, User, Quote } from 'lucide-react';
import { isAuthenticated, isAuthenticatedSync } from '../../lib/auth';
import { AdminLayout } from '../../components/admin';
import { Testimonial } from '../../types/portfolio';
import { portfolioService } from '../../lib/supabase';
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
      if (editingTestimonial) {
        const updated = await adminService.updateTestimonial(testimonial.id!, testimonial);
        setTestimonials(testimonials.map(t => t.id === testimonial.id ? updated : t));
      } else {
        const created = await adminService.createTestimonial(testimonial);
        setTestimonials([...testimonials, created]);
      }
      setShowForm(false);
      setEditingTestimonial(null);
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert('Failed to save testimonial');
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
          <p className="text-neutral-400 font-black uppercase tracking-widest text-xs">Retrieving database items...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white dark:bg-primary p-10 border-4 border-neutral-900 dark:border-neutral-800 group hover:translate-x-1 hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-neutral-900 dark:bg-accent flex items-center justify-center text-white border-2 border-neutral-800">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">{testimonial.author}</h3>
                    <p className="text-xs font-black text-accent uppercase tracking-widest">{testimonial.role}</p>
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

              <div className="relative mb-8">
                <Quote className="absolute -top-4 -left-4 text-neutral-100 dark:text-neutral-900 w-12 h-12 -z-10" />
                <p className="text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed italic line-clamp-4 text-lg">
                  "{testimonial.message}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-8 border-t-2 border-neutral-50 dark:border-neutral-900">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < testimonial.rating ? 'text-accent fill-accent' : 'text-neutral-200 dark:text-neutral-800'}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  Registered: {testimonial.created_at ? new Date(testimonial.created_at).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
          ))}
        </div>
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