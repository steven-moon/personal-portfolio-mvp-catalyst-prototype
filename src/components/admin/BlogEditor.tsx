import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "sonner";
import { Save, ArrowLeft, ImagePlus, Bold, Italic, List, Heading, Link as LinkIcon } from 'lucide-react';
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import NeumorphicCard from '@/components/ui/NeumorphicCard';

// Mock data from the Blog page to use for editing
const BLOG_POSTS = [
  {
    id: 1,
    title: "Getting Started with React in 2023",
    excerpt: "A comprehensive guide to modern React development practices, state management, and component patterns for beginners and experienced developers alike.",
    content: `
      <p>React has evolved significantly since its release, and staying up to date with best practices is essential for any developer working with this library. In this article, we'll explore the most important concepts and tools in the React ecosystem in 2023.</p>
      
      <h2>Embracing Functional Components</h2>
      <p>Class components are now considered legacy code in many React projects. Functional components, combined with Hooks, provide a more concise and maintainable way to write React applications.</p>
      
      <pre><code>// Modern React component
const MyComponent = ({ title }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = title;
  }, [title]);
  
  return (
    <div>
      <h1>{title}</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};</code></pre>

      <h2>State Management in 2023</h2>
      <p>While Redux remains popular, many developers are now choosing alternatives like React Query for server state, and simpler solutions like Context API or Zustand for client state.</p>
      
      <h2>React 18 and Concurrent Features</h2>
      <p>React 18 introduced several new features, including automatic batching, concurrent rendering, and transitions. These features help improve the performance and user experience of React applications.</p>
      
      <h2>Conclusion</h2>
      <p>Modern React development is all about embracing functional programming concepts, leveraging the powerful Hook system, and using the right tools for state management. By following these principles, you can build maintainable and performant applications.</p>
    `,
    date: "May 15, 2023",
    author: "John Doe",
    category: "Development",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80"
  },
  // ... other posts would be here
];

const BlogEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  
  // Form state
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Load post data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const postId = parseInt(id, 10);
      const post = BLOG_POSTS.find(post => post.id === postId);
      
      if (post) {
        setTitle(post.title);
        setExcerpt(post.excerpt);
        setContent(post.content);
        setCategory(post.category);
        setImageUrl(post.imageUrl);
      } else {
        toast.error('Blog post not found');
        navigate('/admin/blog');
      }
    }
  }, [id, isEditMode, navigate]);
  
  // Handle text formatting buttons
  const insertFormatting = (type: string) => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let formattedText = '';
    
    switch (type) {
      case 'bold':
        formattedText = `<strong>${selectedText}</strong>`;
        break;
      case 'italic':
        formattedText = `<em>${selectedText}</em>`;
        break;
      case 'heading':
        formattedText = `<h2>${selectedText}</h2>`;
        break;
      case 'list':
        formattedText = `<ul>\n  <li>${selectedText}</li>\n  <li>New item</li>\n</ul>`;
        break;
      case 'link':
        const url = prompt('Enter URL:', 'https://');
        if (url) {
          formattedText = `<a href="${url}">${selectedText || 'Link text'}</a>`;
        } else {
          return;
        }
        break;
      default:
        return;
    }
    
    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
    
    // Focus and set cursor position after the inserted formatting
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + formattedText.length;
      textarea.selectionStart = newCursorPos;
      textarea.selectionEnd = newCursorPos;
    }, 0);
  };
  
  const handleSave = async () => {
    if (!title || !excerpt || !content || !category || !imageUrl) {
      toast.error('Please fill out all fields');
      return;
    }
    
    setIsSaving(true);
    try {
      // In a real app, this would be an API call to save the post
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Blog post ${isEditMode ? 'updated' : 'created'} successfully`);
      navigate('/admin/blog');
    } catch (error) {
      toast.error('Failed to save blog post');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="container py-8 mx-auto bg-background">
      <div className="flex items-center mb-6 space-x-4">
        <NeumorphicButton 
          variant="secondary" 
          size="sm"
          onClick={() => navigate('/admin/blog')}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </NeumorphicButton>
        <h1 className="text-2xl font-bold text-primary">
          {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <NeumorphicCard className="mb-6">
            <div className="mb-4">
              <label className="block mb-2 text-foreground font-medium">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none text-foreground"
                placeholder="Enter post title"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 text-foreground font-medium">Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none h-24 text-foreground"
                placeholder="Brief summary of your post (shown in blog list)"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-foreground font-medium">Content</label>
              <div className="mb-2 flex space-x-2">
                <button 
                  className="p-2 neu-pressed dark:shadow-dark-neu-pressed rounded-lg text-foreground" 
                  onClick={() => insertFormatting('bold')}
                  title="Bold"
                >
                  <Bold size={18} />
                </button>
                <button 
                  className="p-2 neu-pressed dark:shadow-dark-neu-pressed rounded-lg text-foreground" 
                  onClick={() => insertFormatting('italic')}
                  title="Italic"
                >
                  <Italic size={18} />
                </button>
                <button 
                  className="p-2 neu-pressed dark:shadow-dark-neu-pressed rounded-lg text-foreground" 
                  onClick={() => insertFormatting('heading')}
                  title="Heading"
                >
                  <Heading size={18} />
                </button>
                <button 
                  className="p-2 neu-pressed dark:shadow-dark-neu-pressed rounded-lg text-foreground" 
                  onClick={() => insertFormatting('list')}
                  title="List"
                >
                  <List size={18} />
                </button>
                <button 
                  className="p-2 neu-pressed dark:shadow-dark-neu-pressed rounded-lg text-foreground" 
                  onClick={() => insertFormatting('link')}
                  title="Link"
                >
                  <LinkIcon size={18} />
                </button>
              </div>
              <textarea
                id="content-editor"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none font-mono text-sm h-96 text-foreground"
                placeholder="Write your blog post content here (HTML supported)"
              />
            </div>
          </NeumorphicCard>
        </div>
        
        <div>
          <NeumorphicCard className="mb-6">
            <div className="mb-4">
              <label className="block mb-2 text-foreground font-medium">Featured Image URL</label>
              <div className="flex">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-l-lg focus:outline-none"
                  placeholder="Enter image URL"
                />
                <button className="p-3 bg-primary text-primary-foreground rounded-r-lg">
                  <ImagePlus size={18} />
                </button>
              </div>
            </div>
            
            {imageUrl && (
              <div className="mb-4">
                <label className="block mb-2 text-foreground font-medium">Image Preview</label>
                <div className="h-48 overflow-hidden rounded-lg bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed">
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/600x400?text=Invalid+Image+URL";
                    }}
                  />
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block mb-2 text-foreground font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none"
              >
                <option value="">Select a category</option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="CSS">CSS</option>
                <option value="JavaScript">JavaScript</option>
                <option value="React">React</option>
                <option value="TypeScript">TypeScript</option>
              </select>
            </div>
            
            <div className="mt-6">
              <NeumorphicButton
                className="w-full flex items-center justify-center gap-2"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save size={18} />
                {isSaving ? 'Saving...' : 'Save Post'}
              </NeumorphicButton>
            </div>
          </NeumorphicCard>
          
          <NeumorphicCard>
            <h3 className="text-lg font-semibold mb-2">Post Details</h3>
            <p className="text-foreground text-sm mb-4">
              This post will be saved as a {isEditMode ? 'draft update' : 'new draft'}.
            </p>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground">Author:</span>
                <span className="font-medium">John Doe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground">Date:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground">Status:</span>
                <span className="font-medium">Draft</span>
              </div>
            </div>
          </NeumorphicCard>
        </div>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <NeumorphicCard>
          {title ? (
            <div>
              <h1 className="text-2xl font-bold mb-3">{title}</h1>
              <div className="mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-background shadow-neu-pressed text-neu-accent">
                  {category || 'Uncategorized'}
                </span>
              </div>
              <p className="text-foreground mb-4">{excerpt}</p>
              {content && (
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              )}
            </div>
          ) : (
            <p className="text-foreground italic">Fill in the details above to see a preview</p>
          )}
        </NeumorphicCard>
      </div>
    </div>
  );
};

export default BlogEditor;
