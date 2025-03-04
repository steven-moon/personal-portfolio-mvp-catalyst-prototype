import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "sonner";
import { Save, X, Plus, Trash, ImagePlus, FileImage } from 'lucide-react';
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import { Project } from '@/components/projects/ProjectCard';

// Initial projects data
const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "A modern e-commerce platform with seamless checkout experience.",
    image: "/placeholder.svg",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    link: "https://example.com",
    fullDescription: "This comprehensive e-commerce solution features product browsing, cart management, secure checkout with Stripe integration, and a responsive design. The frontend is built with React and styled with Tailwind CSS, while the backend uses Node.js with Express and MongoDB for data storage. The site includes user authentication, order tracking, and an admin dashboard for product management.",
    images: [
      "/placeholder.svg",
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      "https://images.unsplash.com/photo-1518770660439-4636190af475"
    ]
  },
  {
    id: 2,
    title: "Task Management App",
    description: "A collaborative task management application for teams.",
    image: "/placeholder.svg",
    tags: ["React", "TypeScript", "Firebase", "TailwindCSS"],
    link: "https://example.com",
    fullDescription: "This task management application helps teams organize and track their projects effectively. Users can create tasks, assign them to team members, set deadlines, and track progress. The app features real-time updates using Firebase, drag-and-drop task organization, and customizable project boards. Built with React and TypeScript, the application implements robust state management and ensures type safety throughout the codebase."
  },
  {
    id: 3,
    title: "Finance Dashboard",
    description: "An interactive dashboard for personal finance tracking.",
    image: "/placeholder.svg",
    tags: ["React", "Redux", "Recharts", "Express"],
    link: "https://example.com",
    fullDescription: "This financial dashboard provides users with in-depth insights into their spending habits and financial health. The application visualizes data through interactive charts and graphs using Recharts, allowing users to understand their finances at a glance. Features include expense categorization, budget setting, goal tracking, and financial forecasting. The frontend is built with React and Redux, while the backend is powered by Express with secure authentication."
  }
];

const ProjectEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = id !== undefined && id !== 'new';

  const emptyProject: Project = {
    id: Date.now(),
    title: "",
    description: "",
    image: "/placeholder.svg",
    tags: [],
    link: "",
    fullDescription: "",
    images: ["/placeholder.svg"]
  };

  const [project, setProject] = useState<Project>(emptyProject);
  const [newTag, setNewTag] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    if (isEditMode) {
      const existingProject = INITIAL_PROJECTS.find(p => p.id === Number(id));
      if (existingProject) {
        setProject({
          ...existingProject,
          images: existingProject.images || [existingProject.image]
        });
      } else {
        toast.error("Project not found");
        navigate('/admin/projects');
      }
    }
  }, [id, isEditMode, navigate]);

  const handleSave = () => {
    if (!project.title.trim()) {
      toast.error("Project title is required");
      return;
    }

    if (!project.description.trim()) {
      toast.error("Project description is required");
      return;
    }

    if (!project.images || project.images.length === 0) {
      toast.error("At least one project image is required");
      return;
    }

    const updatedProject = {
      ...project,
      image: project.images[0]
    };

    toast.success(`Project ${isEditMode ? 'updated' : 'created'} successfully!`);
    navigate('/admin/projects');
  };

  const handleCancel = () => {
    navigate('/admin/projects');
  };

  const handleAddTag = () => {
    if (newTag.trim() && !project.tags.includes(newTag.trim())) {
      setProject({
        ...project,
        tags: [...project.tags, newTag.trim()]
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setProject({
      ...project,
      tags: project.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setProject({
        ...project,
        images: [...(project.images || []), newImageUrl.trim()]
      });
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...(project.images || [])];
    newImages.splice(index, 1);
    
    setProject({
      ...project,
      images: newImages.length > 0 ? newImages : ["/placeholder.svg"]
    });
  };

  const handleSetMainImage = (index: number) => {
    if (!project.images) return;
    
    const newImages = [...project.images];
    const [selectedImage] = newImages.splice(index, 1);
    newImages.unshift(selectedImage);
    
    setProject({
      ...project,
      images: newImages,
      image: selectedImage
    });
    
    toast.success("Main image updated");
  };

  return (
    <div className="container py-8 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neu-accent">
          {isEditMode ? 'Edit Project' : 'Create New Project'}
        </h1>
        <div className="flex gap-3">
          <NeumorphicButton 
            variant="secondary"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <X size={18} />
            Cancel
          </NeumorphicButton>
          <NeumorphicButton 
            onClick={handleSave}
            className="flex items-center gap-2"
          >
            <Save size={18} />
            Save Project
          </NeumorphicButton>
        </div>
      </div>

      <NeumorphicCard className="mb-6">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <div>
            <label className="block text-neu-text mb-2 font-medium">Project Title</label>
            <input
              type="text"
              className="w-full p-3 bg-neu-bg shadow-neu-pressed rounded-lg focus:outline-none"
              placeholder="Enter project title"
              value={project.title}
              onChange={(e) => setProject({ ...project, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-neu-text mb-2 font-medium">Short Description</label>
            <input
              type="text"
              className="w-full p-3 bg-neu-bg shadow-neu-pressed rounded-lg focus:outline-none"
              placeholder="Brief description of your project"
              value={project.description}
              onChange={(e) => setProject({ ...project, description: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-neu-text mb-2 font-medium">Project URL</label>
            <input
              type="url"
              className="w-full p-3 bg-neu-bg shadow-neu-pressed rounded-lg focus:outline-none"
              placeholder="https://your-project-url.com"
              value={project.link}
              onChange={(e) => setProject({ ...project, link: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-neu-text mb-2 font-medium">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {project.tags.map(tag => (
                <div 
                  key={tag} 
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-neu-bg shadow-neu-pressed"
                >
                  {tag}
                  <button 
                    type="button"
                    className="ml-1 text-neu-text-secondary hover:text-neu-accent"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-grow p-3 bg-neu-bg shadow-neu-pressed rounded-lg focus:outline-none"
                placeholder="Add technology tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <NeumorphicButton 
                type="button"
                variant="secondary"
                onClick={handleAddTag}
                className="flex items-center gap-1"
              >
                <Plus size={16} />
                Add
              </NeumorphicButton>
            </div>
          </div>

          <div>
            <label className="block text-neu-text mb-2 font-medium">Full Description</label>
            <textarea
              className="w-full p-3 bg-neu-bg shadow-neu-pressed rounded-lg focus:outline-none min-h-[200px]"
              placeholder="Detailed description of your project"
              value={project.fullDescription}
              onChange={(e) => setProject({ ...project, fullDescription: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-neu-text mb-2 font-medium">Project Images</label>
            <p className="text-neu-text-secondary text-sm mb-3">
              The first image will be used as the main project thumbnail. Click "Set as Main" to reorder.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
              {project.images && project.images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className={`h-24 w-full bg-gray-200 rounded-lg overflow-hidden ${index === 0 ? 'ring-2 ring-neu-accent' : ''}`}>
                    <img 
                      src={image} 
                      alt={`Project image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetMainImage(index)}
                        className="p-1.5 bg-white rounded-full text-gray-800"
                        title="Set as main image"
                      >
                        <FileImage size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-1.5 bg-white rounded-full text-red-500"
                      title="Remove image"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                  {index === 0 && (
                    <span className="absolute -top-2 -right-2 bg-neu-accent text-white text-xs py-0.5 px-2 rounded-full">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                className="flex-grow p-3 bg-neu-bg shadow-neu-pressed rounded-lg focus:outline-none"
                placeholder="Enter image URL"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
              />
              <NeumorphicButton 
                type="button"
                variant="secondary"
                onClick={handleAddImage}
                className="flex items-center gap-1"
              >
                <ImagePlus size={16} />
                Add Image
              </NeumorphicButton>
            </div>
            <p className="text-neu-text-secondary text-sm italic mt-2">
              Note: In a real application, you would have an image upload feature
            </p>
          </div>
        </form>
      </NeumorphicCard>

      <div className="flex justify-end gap-3">
        <NeumorphicButton 
          variant="secondary"
          onClick={handleCancel}
          className="flex items-center gap-2"
        >
          <X size={18} />
          Cancel
        </NeumorphicButton>
        <NeumorphicButton 
          onClick={handleSave}
          className="flex items-center gap-2"
        >
          <Save size={18} />
          Save Project
        </NeumorphicButton>
      </div>
    </div>
  );
};

export default ProjectEditor;
