import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Edit, Trash2 } from 'lucide-react';
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Testimonials</h1>
          <p className="text-gray-300">Manage client testimonials and reviews</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-semibold"
        >
          Add Testimonial
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-300">Loading testimonials...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white/5 p-6 rounded-lg border border-white/10">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-900 font-bold border-2 border-gray-300">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{testimonial.author}</h3>
                    <p className="text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id!)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-300 mb-4 italic">"{testimonial.message}"</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                  <span className="text-gray-400 ml-2">({testimonial.rating})</span>
                </div>
                <span className="text-gray-400 text-sm">
                  {testimonial.created_at ? new Date(testimonial.created_at).toLocaleDateString() : 'N/A'}
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 p-8 rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-white mb-6">
          {testimonial ? 'Edit Testimonial' : 'Add Testimonial'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">Author Name</label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Role/Position</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Message</label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3"
              placeholder="What did they say about your work?"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Rating</label>
            <select
              value={formData.rating}
              onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
              className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3"
            >
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Avatar URL (optional)</label>
            <input
              type="url"
              value={formData.avatar_url || ''}
              onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
              className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-all font-semibold border border-gray-300"
            >
              Save Testimonial
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}