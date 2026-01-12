import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
      console.log(`Successfully loaded ${data.length} projects`);
      
      // Test storage access
      const storageAccessible = await portfolioService.testStorageAccess();
      console.log('Storage bucket accessible:', storageAccessible);
      if (!storageAccessible) {
        console.warn('Storage bucket may not be accessible. Image uploads might fail.');
        alert('Warning: Storage bucket access issue detected. Image uploads may fail. Please check your Supabase storage configuration.');
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      let contextualMessage = 'Failed to load projects';
      if (errorMessage.includes('Authentication required')) {
        contextualMessage = 'Authentication Error: Please log in again';
      } else if (errorMessage.includes('permission')) {
        contextualMessage = 'Permission Error: Database access denied';
      }
      
      alert(`${contextualMessage}\n\nDetailed Error: ${errorMessage}\n\nPlease refresh the page or contact support if the issue persists.`);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const project = projects.find(p => p.id === id);
        
        // Delete associated image if it exists
        if (project?.preview_image) {
          try {
            await portfolioService.deleteProjectImage(project.preview_image);
            console.log('Project image deleted successfully');
          } catch (error) {
            console.warn('Failed to delete project image:', error);
            // Continue with project deletion even if image deletion fails
          }
        }
        
        await adminService.deleteProject(id);
        setProjects(projects.filter(p => p.id !== id));
        alert('Project deleted successfully!');
      } catch (error) {
        console.error('Error deleting project:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        
        let contextualMessage = 'Failed to delete project';
        if (errorMessage.includes('Authentication required')) {
          contextualMessage = 'Authentication Error: Please make sure you\'re logged in as admin';
        } else if (errorMessage.includes('violates row-level security')) {
          contextualMessage = 'Database Security Error: RLS policies may not be properly configured';
        } else if (errorMessage.includes('foreign key')) {
          contextualMessage = 'Dependency Error: This project may be referenced by other data';
        }
        
        alert(`${contextualMessage}\n\nDetailed Error: ${errorMessage}`);
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
        alert('Project updated successfully!');
      } else {
        const created = await adminService.createProject(project);
        setProjects([...projects, created]);
        alert('Project created successfully!');
      }
      setShowForm(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Error saving project:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const errorDetails = error instanceof Error && error.stack ? `\n\nError Details:\n${error.stack}` : '';
      alert(`Failed to save project!\n\nReason: ${errorMessage}${errorDetails}`);
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
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-300">Manage your portfolio projects</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-all font-semibold border border-gray-300"
        >
          Add Project
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-300">Loading projects...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white/5 p-6 rounded-lg border border-white/10">
              {/* Preview Image */}
              {project.preview_image && (
                <div className="mb-4">
                  <img
                    src={project.preview_image}
                    alt={project.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">{project.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(project.id!)}
                    className="text-red-400 hover:text-red-300"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <p className="text-gray-300 mb-4">{project.description}</p>
              
              {/* Project Links */}
              {(project.project_url || project.github_url) && (
                <div className="flex space-x-2 mb-4">
                  {project.project_url && (
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm hover:bg-blue-500/30"
                    >
                      🌐 Live
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-500/20 text-gray-300 px-2 py-1 rounded text-sm hover:bg-gray-500/30"
                    >
                      📁 Code
                    </a>
                  )}
                </div>
              )}
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    project.status === 'Completed' ? 'bg-green-500/20 text-green-300' :
                    project.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-blue-500/20 text-blue-300'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Priority:</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    project.priority === 'High' ? 'bg-red-500/20 text-red-300' :
                    project.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-green-500/20 text-green-300'
                  }`}>
                    {project.priority}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {project.technologies.map((tech) => (
                  <span key={tech} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                    {tech}
                  </span>
                ))}
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

  // Set initial image preview if editing existing project
  useEffect(() => {
    if (project?.preview_image) {
      setImagePreview(project.preview_image);
    }
  }, [project]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let finalFormData = { ...formData };

      // Upload image if a new file was selected
      if (imageFile) {
        console.log('Starting image upload...');
        try {
          const imageUrl = await portfolioService.uploadProjectImage(imageFile);
          console.log('Image uploaded successfully:', imageUrl);
          finalFormData.preview_image = imageUrl;
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          const uploadErrorMessage = uploadError instanceof Error ? uploadError.message : 'Unknown upload error';
          throw new Error(`Image upload failed: ${uploadErrorMessage}`);
        }
      }

      console.log('Attempting to save project:', finalFormData);
      await onSave(finalFormData);
      console.log('Project save completed successfully');
    } catch (error) {
      console.error('Error in form submission:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Provide more specific error context
      let contextualMessage = 'Failed to save project';
      if (errorMessage.includes('Authentication required')) {
        contextualMessage = 'Authentication Error: Please make sure you\'re logged in as admin';
      } else if (errorMessage.includes('violates row-level security')) {
        contextualMessage = 'Database Security Error: RLS policies may not be properly configured';
      } else if (errorMessage.includes('Image upload failed')) {
        contextualMessage = 'Image Upload Error';
      } else if (errorMessage.includes('duplicate key')) {
        contextualMessage = 'Duplicate Entry Error: A project with this name may already exist';
      } else if (errorMessage.includes('null value')) {
        contextualMessage = 'Missing Required Field Error: Please check all required fields are filled';
      }
      
      alert(`${contextualMessage}\n\nDetailed Error: ${errorMessage}\n\nTip: Check the browser console for more technical details.`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-6">
          {project ? 'Edit Project' : 'Add Project'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Description</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3"
            />
          </div>

          {/* Preview Image Upload */}
          <div>
            <label className="block text-white font-medium mb-2">Preview Image</label>
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
              />
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-white/20"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                      setFormData({...formData, preview_image: ''});
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Project URL and GitHub URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">Project URL</label>
              <input
                type="url"
                value={formData.project_url || ''}
                onChange={(e) => setFormData({...formData, project_url: e.target.value})}
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3"
                placeholder="https://your-project.com"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">GitHub URL</label>
              <input
                type="url"
                value={formData.github_url || ''}
                onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3"
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3"
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Technologies (comma-separated)</label>
            <input
              type="text"
              value={formData.technologies.join(', ')}
              onChange={(e) => setFormData({...formData, technologies: e.target.value.split(',').map(t => t.trim())})}
              className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3"
              placeholder="React, Node.js, PostgreSQL"
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Role</label>
            <input
              type="text"
              required
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3"
              placeholder="Full Stack Developer"
            />
          </div>

          {/* Project Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={formData.start_date || ''}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">End Date</label>
              <input
                type="date"
                value={formData.end_date || ''}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3"
              />
            </div>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={uploading}
              className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
            >
              {uploading ? 'Saving...' : 'Save Project'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={uploading}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}