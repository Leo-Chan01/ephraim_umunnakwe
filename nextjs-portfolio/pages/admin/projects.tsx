import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Edit, Trash2, Plus, ExternalLink, Github, Layout, Calendar, Layers } from 'lucide-react';
import { isAuthenticated, isAuthenticatedSync } from '../../lib/auth';
import { AdminLayout } from '../../components/admin';
import { Project } from '../../types/portfolio';
import { portfolioService } from '../../lib/supabase';
import { adminService } from '../../lib/admin-service';

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
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
      loadProjects();
    };

    checkAuth();
  }, [router, mounted]);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await portfolioService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const project = projects.find(p => p.id === id);
        if (project?.preview_image) {
          try {
            await portfolioService.deleteProjectImage(project.preview_image);
          } catch (error) {
            console.warn('Failed to delete project image:', error);
          }
        }
        await adminService.deleteProject(id);
        setProjects(projects.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project');
      }
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleSave = async (project: Project) => {
    try {
      if (editingProject) {
        const updated = await adminService.updateProject(project.id!, project);
        setProjects(projects.map(p => p.id === project.id ? updated : p));
      } else {
        const created = await adminService.createProject(project);
        setProjects([...projects, created]);
      }
      setShowForm(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    }
  };

  if (!mounted || !isAuthenticatedSync()) {
    return (
      <div className="min-h-screen bg-white dark:bg-primary flex items-center justify-center">
        <div className="text-neutral-900 dark:text-white font-black uppercase tracking-widest animate-pulse">Initializing Projects...</div>
      </div>
    );
  }

  return (
    <AdminLayout title="Project Repository">
      <div className="mb-12 flex justify-between items-end">
        <div className="space-y-4">
          <div className="w-16 h-2 bg-accent"></div>
          <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Portfolio Manifest</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-neutral-900 dark:bg-white text-white dark:text-primary px-8 py-4 border-4 border-neutral-900 dark:border-white font-black text-xs uppercase tracking-widest hover:bg-accent dark:hover:bg-accent transition-all flex items-center gap-3"
        >
          <Plus size={16} />
          Register Project
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center border-4 border-dashed border-neutral-100 dark:border-neutral-800">
          <div className="animate-spin w-12 h-12 border-t-4 border-accent mx-auto mb-6"></div>
          <p className="text-neutral-400 font-black uppercase tracking-widest text-xs">Syncing artifacts...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {projects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-primary border-4 border-neutral-900 dark:border-neutral-800 flex flex-col group hover:translate-x-1 hover:-translate-y-1 transition-transform">
              {/* Preview image block */}
              <div className="h-48 bg-neutral-100 dark:bg-neutral-900 border-b-4 border-neutral-900 dark:border-neutral-800 relative overflow-hidden">
                {project.preview_image ? (
                  <img
                    src={project.preview_image}
                    alt={project.name}
                    className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Layout size={48} className="text-neutral-300 dark:text-neutral-800" />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2 border-neutral-900">
                  {project.status}
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter leading-none">{project.name}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 border-2 border-neutral-100 dark:border-neutral-800 text-neutral-400 hover:text-accent hover:border-accent transition-all"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id!)}
                      className="p-2 border-2 border-neutral-100 dark:border-neutral-800 text-neutral-400 hover:text-red-500 hover:border-red-500 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-8 line-clamp-3 text-sm">
                  {project.description}
                </p>

                <div className="mt-auto space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span key={tech} className="bg-neutral-100 dark:bg-neutral-900 text-[10px] font-black uppercase tracking-widest px-2 py-1 border border-neutral-200 dark:border-neutral-800 text-neutral-400">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-[10px] font-black text-accent">+{project.technologies.length - 4} MORE</span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 pt-6 border-t-2 border-neutral-50 dark:border-neutral-900">
                    {project.project_url && (
                      <a href={project.project_url} target="_blank" className="text-neutral-400 hover:text-accent transition-colors">
                        <ExternalLink size={18} />
                      </a>
                    )}
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" className="text-neutral-400 hover:text-accent transition-colors">
                        <Github size={18} />
                      </a>
                    )}
                    <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-neutral-300">
                      PRTY: {project.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ProjectForm
          project={editingProject}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingProject(null);
          }}
        />
      )}
    </AdminLayout>
  );
}

function ProjectForm({ project, onSave, onCancel }: {
  project: Project | null;
  onSave: (project: Project) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Project>(
    project || {
      name: '',
      description: '',
      status: 'Planning',
      priority: 'Medium',
      technologies: [],
      role: '',
      preview_image: '',
      project_url: '',
      github_url: '',
      start_date: '',
      end_date: '',
    }
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (project?.preview_image) {
      setImagePreview(project.preview_image);
    }
  }, [project]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let finalFormData = { ...formData };
      if (imageFile) {
        const imageUrl = await portfolioService.uploadProjectImage(imageFile);
        finalFormData.preview_image = imageUrl;
      }
      await onSave(finalFormData);
    } catch (error) {
      console.error('Error in form submission:', error);
      alert('Error saving project. Check console.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-primary border-8 border-neutral-900 dark:border-neutral-800 p-12 max-w-4xl w-full shadow-[32px_32px_0px_0px_rgba(0,0,0,0.2)] overflow-y-auto max-h-[90vh]">
        <h2 className="text-4xl font-black text-neutral-900 dark:text-white mb-10 uppercase tracking-tighter">
          {project ? 'Architectural Revision' : 'New Project Draft'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">PROJECT IDENTITY</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                  placeholder="NAME OF THE BUILD"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">CORE DESCRIPTION</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all resize-none"
                  placeholder="PROJECT SPECIFICATIONS..."
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">SYSTEM STATUS</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all appearance-none cursor-pointer"
                  >
                    <option value="Planning">PLANNING</option>
                    <option value="In Progress">IN DEVELOPMENT</option>
                    <option value="Completed">LIVE / STABLE</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">PRIORITY LEVEL</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all appearance-none cursor-pointer"
                  >
                    <option value="Low">LOW</option>
                    <option value="Medium">MEDIUM</option>
                    <option value="High">CRITICAL</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">IMAGE UPLOAD (VISUAL ASSET)</label>
                <div className="relative border-4 border-dashed border-neutral-200 dark:border-neutral-800 p-4 min-h-[160px] flex flex-col items-center justify-center group overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="Preview" />
                  ) : null}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <Layers className="text-neutral-300 mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">CLICK OR DRAG ASSET</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">TECHNOLOGY STACK (COMMA SEP)</label>
                <input
                  type="text"
                  value={formData.technologies.join(', ')}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value.split(',').map(t => t.trim()) })}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-6 py-4 focus:outline-none focus:border-accent font-bold transition-all"
                  placeholder="REACT, TYPESCRIPT, NEXTJS..."
                />
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-tightest text-neutral-400">EXTERNAL CONNECTIONS</label>
                  <div className="flex gap-4">
                    <input
                      type="url"
                      value={formData.project_url || ''}
                      onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                      className="flex-1 bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-4 py-3 focus:outline-none focus:border-accent font-bold"
                      placeholder="LIVE URL"
                    />
                    <input
                      type="url"
                      value={formData.github_url || ''}
                      onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                      className="flex-1 bg-neutral-50 dark:bg-neutral-900 border-4 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-4 py-3 focus:outline-none focus:border-accent font-bold"
                      placeholder="GITHUB URL"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-6 pt-10 border-t-4 border-neutral-900 dark:border-neutral-800">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 bg-neutral-900 dark:bg-accent text-white py-6 border-4 border-neutral-900 dark:border-accent font-black text-2xl uppercase tracking-widest hover:bg-transparent hover:text-neutral-900 dark:hover:text-white transition-all shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] disabled:opacity-50"
            >
              {uploading ? 'PROCESSING...' : 'INITIALIZE MODULE'}
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