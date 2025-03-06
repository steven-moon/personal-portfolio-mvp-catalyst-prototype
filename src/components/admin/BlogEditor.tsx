import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "sonner";
import { Save, ArrowLeft, ImagePlus, Bold, Italic, List, Heading, Link as LinkIcon, Calendar as CalendarIcon, Trash, Upload, X, Check, Crop as CropIcon } from 'lucide-react';
import { format, parse, parseISO, isValid } from 'date-fns';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { BlogService, configureApi } from '@/lib/apiService';
import { BlogPost, Category, Author } from '@/data/blogData';
import { cn } from '@/lib/utils';
import { storeImageLocally, STORAGE_KEYS } from '@/lib/localStorageUtils';
import LocalImage from '@/components/ui/LocalImage';
import { Button } from "@/components/ui/button";
import { UserService } from '@/lib/apiService';
import { formatDate, toISODate } from '@/lib/dateUtils';
import ImageUploader from '@/components/ui/ImageUploader';
import { API_CONFIG } from '@/config';

// Types
interface BlogFormData extends Omit<BlogPost, 'id'> {}

// Constants
const BLANK_POST: BlogFormData = {
  title: "",
  excerpt: "",
  content: "",
  date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  author: "Jane Doe", // Ideally this would come from the user profile
  category: "",
  imageUrl: ""
};

// Add this placeholder URL constant near the top of the file
const PLACEHOLDER_IMAGE_URLS = [
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1488229297570-58520851e868?auto=format&fit=crop&q=80'
];

// Date picker component
const DatePickerDemo = ({ 
  date,
  onDateChange
}: { 
  date: string,
  onDateChange: (value: string) => void
}) => {
  // Parse the string date to a Date object for the calendar using our utility
  const parseDate = (dateStr: string): Date | undefined => {
    if (!dateStr) return new Date();
    
    try {
      // If it's an ISO date
      if (dateStr.includes('T')) {
        const parsedDate = parseISO(dateStr);
        if (isValid(parsedDate)) return parsedDate;
      }
      
      // Try to parse from 'MMMM d, yyyy' format
      const parsedDate = parse(dateStr, 'MMMM d, yyyy', new Date());
      if (isValid(parsedDate)) return parsedDate;
      
      // Last resort - try to make a date from whatever we have
      const fallbackDate = new Date(dateStr);
      return isValid(fallbackDate) ? fallbackDate : new Date();
    } catch (error) {
      console.error('Error parsing date:', error);
      return new Date();
    }
  };

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(parseDate(date));

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      // Use our formatDate utility to ensure consistent formatting
      onDateChange(formatDate(date));
    }
  };
  
  const getDisplayDate = (): string => {
    if (!selectedDate) return 'Select a date';
    // Use our formatDate utility here too
    return formatDate(selectedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="w-full p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none text-foreground flex items-center justify-between"
          type="button"
        >
          <span className={cn("text-left", !date && "text-muted-foreground")}>
            {getDisplayDate()}
          </span>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

// Replace the old ImageUploader with this simplified component
const BlogImageSection = ({ 
  imageUrl, 
  onImageChange 
}: { 
  imageUrl: string, 
  onImageChange: (url: string) => void 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  
  // Clear the selected image
  const clearImage = useCallback(() => {
    onImageChange('');
    toast.success('Image removed');
  }, [onImageChange]);

  // Handle when an image is uploaded
  const handleImageUploaded = (url: string) => {
    console.log('🔍 DEBUG - BlogEditor - Image uploaded, URL:', url);
    
    // Remove any query parameters or timestamps from the URL
    let cleanUrl = url.split('?')[0];
    
    // Check if the URL includes a timestamp and remove it
    if (cleanUrl.includes('/images/')) {
      const parts = cleanUrl.split('/images/');
      if (parts.length > 1) {
        const filename = parts[1];
        // If filename has timestamp pattern (numbers followed by dash)
        if (/^\d+-/.test(filename)) {
          // Remove the timestamp prefix from the filename
          const cleanFilename = filename.replace(/^\d+-/, '');
          cleanUrl = `/images/${cleanFilename}`;
          console.log('🔍 DEBUG - BlogEditor - Removed timestamp from URL:', cleanUrl);
        }
      }
    }
    
    console.log('🔍 DEBUG - BlogEditor - Clean URL after processing:', cleanUrl);
    onImageChange(cleanUrl);
    toast.success('Image uploaded successfully');
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-lg mb-4 ${
        isDragging ? 'border-2 border-dashed border-primary' : ''
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
      }}
    >
      {imageUrl ? (
        <div className="relative h-48 overflow-hidden">
          <LocalImage 
            src={imageUrl} 
            alt="Blog post image" 
            className="w-full h-full object-contain object-center"
            fallbackSrc="/assets/images/placeholder.jpg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
            <div className="flex gap-2">
              <ImageUploader 
                onImageUploaded={handleImageUploaded}
                title="Blog Featured Image"
                description="Crop the image to fit a 16:9 aspect ratio for best results"
                aspect={16/9}
                storageKey="IMAGES"
              />
              <button 
                onClick={clearImage}
                className="p-2 rounded-full bg-red-500 text-white"
                title="Remove image"
              >
                <Trash size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-muted-foreground rounded-lg h-48 bg-muted/20">
          <ImageUploader 
            onImageUploaded={handleImageUploaded}
            title="Blog Featured Image"
            description="Crop the image to fit a 16:9 aspect ratio for best results"
            aspect={16/9}
            storageKey="IMAGES"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Click or drag & drop to upload image
          </p>
        </div>
      )}
    </div>
  );
};

// Custom hook for blog form state management
const useBlogForm = (postId: number, isEditMode: boolean) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    excerpt: '',
    content: '',
    date: formatDate(new Date()),
    author: '',
    category: '',
    imageUrl: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  // Handle form field changes
  const handleChange = (field: keyof BlogFormData, value: string | any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Fetch post data when editing
  useEffect(() => {
    const fetchPost = async () => {
      if (isEditMode && postId) {
        try {
          setIsLoading(true);
          const data = await BlogService.getBlogPostById(postId);
          
          // Create a properly formatted form data object
          setFormData({
            ...data,
            // Format the date using our utility
            date: formatDate(data.date),
            // Make sure category and author are preserved as objects if they came from the API that way
            category: data.category || '',
            author: data.author || ''
          });
          
          setIsLoading(false);
        } catch (err) {
          console.error('Error fetching blog post:', err);
          setError('Failed to load blog post. Please try again.');
          setIsLoading(false);
        }
      }
    };

    fetchPost();
  }, [isEditMode, postId]);

  // Save the blog post
  const savePost = async () => {
    console.log('🔴 SAVE POST - START of savePost function');
    try {
      setIsSaving(true);
      console.log('🔴 SAVE POST - Set isSaving to true');
      
      // Create a copy of the form data for processing
      const postData: BlogFormData & {
        categoryId?: number;
        authorId?: number;
      } = { ...formData };
      console.log('🔴 SAVE POST - Created postData copy:', postData);
      
      // Handle category data
      if (typeof postData.category === 'object' && postData.category !== null) {
        // If it's an object with id, use the id
        if ('id' in postData.category && postData.category.id) {
          console.log('Using category ID from object:', postData.category.id);
          postData.categoryId = postData.category.id;
        }
        // Remove the category object to avoid confusion
        delete postData.category;
      } else if (typeof postData.category === 'string' && postData.category.trim() !== '') {
        // If it's just a string, look for a matching category
        console.log('Category is a string:', postData.category);
        
        try {
          // Get all categories and try to find a match
          const categories = await BlogService.getAllCategories();
          const matchingCategory = categories.find(
            cat => typeof cat.name === 'string' && 
                  cat.name.toLowerCase() === postData.category.toString().toLowerCase()
          );
          
          if (matchingCategory) {
            console.log('Found matching category:', matchingCategory);
            postData.categoryId = matchingCategory.id;
          } else {
            // Default to first category if no match
            console.log('No matching category found, using default');
            postData.categoryId = 1;
          }
        } catch (err) {
          console.error('Error finding category:', err);
          postData.categoryId = 1;
        }
        
        delete postData.category;
      }
      
      // Handle author data
      if (typeof postData.author === 'object' && postData.author !== null) {
        // If it's an object with id, use the id
        if ('id' in postData.author && postData.author.id) {
          console.log('Using author ID from object:', postData.author.id);
          postData.authorId = postData.author.id;
        }
        // Remove the author object to avoid confusion
        delete postData.author;
      } else if (typeof postData.author === 'string' && postData.author.trim() !== '') {
        console.log('Author is a string:', postData.author);
        // Get the current user from auth context or localStorage
        const userData = localStorage.getItem('auth_user');
        if (userData) {
          try {
            const user = JSON.parse(userData);
            postData.authorId = user.id;
            console.log('Using current user as author:', user.id);
          } catch (err) {
            console.error('Error parsing user data:', err);
            postData.authorId = 1;
          }
        } else {
          postData.authorId = 1; // Default to first user
        }
        delete postData.author;
      }
      
      // Handle date formatting
      if (postData.date) {
        // Convert the date to ISO format using our utility
        postData.date = toISODate(postData.date);
        console.log('Formatted date for API:', postData.date);
      } else {
        // If no date is provided, use the current date
        postData.date = new Date().toISOString();
      }
      
      // Final check for required fields
      if (!postData.categoryId) {
        console.warn('No categoryId set, using default');
        postData.categoryId = 1;
      }
      
      if (!postData.authorId) {
        console.warn('No authorId set, using default');
        postData.authorId = 1;
      }
      
      // Ensure these fields are included in the final data
      console.log('Final post data:', {
        title: postData.title,
        excerpt: postData.excerpt,
        content: postData.content,
        date: postData.date,
        imageUrl: postData.imageUrl,
        categoryId: postData.categoryId,
        authorId: postData.authorId
      });
      
      // Handle image URL based on network status and mock API settings
      const isOnline = window.navigator.onLine;
      const { useMockApi } = configureApi();
      
      // Provide a default image URL if none is provided
      if (!postData.imageUrl || postData.imageUrl.trim() === '') {
        console.log('🔴 SAVE POST - No image URL provided, using placeholder');
        // Use a default placeholder image instead of blocking the save
        postData.imageUrl = 'https://placehold.co/600x400?text=Blog+Post+Image';
      }
      
      console.log('🔴 SAVE POST - Saving blog post with data:', postData);
      
      // Check for auth token
      const authToken = localStorage.getItem(API_CONFIG.STORAGE_KEYS.TOKEN);
      if (!authToken) {
        console.warn('🔴 SAVE POST - No auth token found, creating a dummy one for development');
        // For development purposes, create a dummy token
        localStorage.setItem(API_CONFIG.STORAGE_KEYS.TOKEN, 'dev-token-123456789');
        console.log('🔴 SAVE POST - Added dummy auth token to localStorage');
        toast.info('Created a temporary authentication token for development');
      }
      
      // Save to the API
      console.log('🔴 SAVE POST - BEFORE API CALL - Mode:', isEditMode ? 'UPDATE' : 'CREATE');
      try {
        if (isEditMode) {
          console.log('🔴 SAVE POST - Calling BlogService.updateBlogPost');
          const result = await BlogService.updateBlogPost(postId, postData);
          console.log('🔴 SAVE POST - API UPDATE RESULT:', result);
          toast.success('Blog post updated successfully');
        } else {
          console.log('🔴 SAVE POST - Calling BlogService.createBlogPost with:', postData);
          const result = await BlogService.createBlogPost(postData);
          console.log('🔴 SAVE POST - API CREATE RESULT:', result);
          toast.success('Blog post created successfully');
        }
        console.log('🔴 SAVE POST - AFTER API CALL - SUCCESS');
        
        navigate('/admin/blog');
      } catch (innerErr: any) {
        console.error('🔴 SAVE POST - INNER ERROR during API call:', innerErr);
        console.error('🔴 SAVE POST - INNER ERROR details:', {
          name: innerErr.name,
          message: innerErr.message,
          stack: innerErr.stack
        });
        throw innerErr; // Re-throw to be caught by the outer catch
      }
    } catch (err: any) {
      console.error('🔴 SAVE POST - OUTER ERROR:', err);
      // Log additional details about the error
      console.error('🔴 SAVE POST - OUTER ERROR details:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      toast.error(`Failed to save blog post. ${err.message || 'Please try again.'}`);
    } finally {
      console.log('🔴 SAVE POST - In finally block, setting isSaving to false');
      setIsSaving(false);
    }
    console.log('🔴 SAVE POST - END of savePost function');
  };

  return {
    formData,
    handleChange,
    savePost,
    isSaving,
    isLoading,
    error
  };
};

// Editor Toolbar Component
const EditorToolbar = ({ onInsertFormatting }: { onInsertFormatting: (type: string) => void }) => {
  return (
    <div className="flex space-x-2">
      <NeumorphicButton 
        size="sm" 
        variant="secondary"
        onClick={() => onInsertFormatting('bold')}
        className="p-1"
      >
        <Bold size={16} />
      </NeumorphicButton>
      <NeumorphicButton 
        size="sm" 
        variant="secondary"
        onClick={() => onInsertFormatting('italic')}
        className="p-1"
      >
        <Italic size={16} />
      </NeumorphicButton>
      <NeumorphicButton 
        size="sm" 
        variant="secondary"
        onClick={() => onInsertFormatting('heading')}
        className="p-1"
      >
        <Heading size={16} />
      </NeumorphicButton>
      <NeumorphicButton 
        size="sm" 
        variant="secondary"
        onClick={() => onInsertFormatting('list')}
        className="p-1"
      >
        <List size={16} />
      </NeumorphicButton>
      <NeumorphicButton 
        size="sm" 
        variant="secondary"
        onClick={() => onInsertFormatting('link')}
        className="p-1"
      >
        <LinkIcon size={16} />
      </NeumorphicButton>
    </div>
  );
};

// Post Content Editor Component
const PostContentEditor = ({ 
  formData, 
  handleChange 
}: { 
  formData: BlogFormData, 
  handleChange: (field: keyof BlogFormData, value: string | any) => void 
}) => {
  const insertFormatting = (type: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let formattedText = '';
    let newCursorPos = 0;
    
    switch (type) {
      case 'bold':
        formattedText = `<strong>${selectedText}</strong>`;
        newCursorPos = start + formattedText.length;
        break;
      case 'italic':
        formattedText = `<em>${selectedText}</em>`;
        newCursorPos = start + formattedText.length;
        break;
      case 'heading':
        formattedText = `<h2>${selectedText}</h2>`;
        newCursorPos = start + formattedText.length;
        break;
      case 'list':
        formattedText = `<ul>\n  <li>${selectedText || 'List item'}</li>\n  <li>List item</li>\n</ul>`;
        newCursorPos = start + formattedText.length;
        break;
      case 'link':
        const url = prompt('Enter URL:') || '#';
        formattedText = `<a href="${url}">${selectedText || 'Link text'}</a>`;
        newCursorPos = start + formattedText.length;
        break;
      default:
        return;
    }
    
    const newContent = 
      formData.content.substring(0, start) + formattedText + formData.content.substring(end);
    handleChange('content', newContent);
    
    // Reset cursor position after state update
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = newCursorPos;
      textarea.selectionEnd = newCursorPos;
    }, 0);
  };

  return (
    <NeumorphicCard className="mb-6">
      <div className="mb-4">
        <label className="block mb-2 text-foreground font-medium">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none text-foreground"
          placeholder="Enter post title..."
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 text-foreground font-medium">Excerpt</label>
        <textarea
          rows={3}
          value={formData.excerpt}
          onChange={(e) => handleChange('excerpt', e.target.value)}
          className="w-full p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none text-foreground"
          placeholder="Write a short excerpt..."
        ></textarea>
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <label className="text-foreground font-medium">Content</label>
          <EditorToolbar onInsertFormatting={insertFormatting} />
        </div>
        <textarea
          id="content"
          rows={20}
          value={formData.content}
          onChange={(e) => handleChange('content', e.target.value)}
          className="w-full p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none text-foreground font-mono"
          placeholder="Write your blog post content here..."
        ></textarea>
        <p className="mt-1 text-xs text-muted-foreground">HTML tags are supported for formatting.</p>
      </div>
    </NeumorphicCard>
  );
};

// Post Settings Component
const PostSettings = ({ 
  formData, 
  handleChange 
}: { 
  formData: BlogFormData, 
  handleChange: (field: keyof BlogFormData, value: string | any) => void 
}) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingAuthors, setLoadingAuthors] = useState(false);
  
  // Fetch categories and authors on component mount
  useEffect(() => {
    fetchCategories();
    fetchAuthors();
  }, []);
  
  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const fetchedCategories = await BlogService.getAllCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      toast.error('Failed to load categories');
    } finally {
      setLoadingCategories(false);
    }
  };
  
  // Fetch all users for author selection
  const fetchAuthors = async () => {
    try {
      setLoadingAuthors(true);
      // Use the UserService to get all users
      const fetchedAuthors = await UserService.getAllUsers();
      setAuthors(fetchedAuthors);
    } catch (err) {
      console.error('Error fetching authors:', err);
      toast.error('Failed to load authors');
    } finally {
      setLoadingAuthors(false);
    }
  };
  
  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === 'new') {
      setIsNewCategoryDialogOpen(true);
    } else if (categoryId) {
      const selectedCategory = categories.find(cat => cat.id.toString() === categoryId);
      if (selectedCategory) {
        // Pass the category object directly to the parent component
        handleChange('category', selectedCategory);
      }
    } else {
      handleChange('category', '');
    }
  };
  
  // Handle author selection
  const handleAuthorChange = (authorId: string) => {
    if (authorId) {
      const selectedAuthor = authors.find(author => author.id.toString() === authorId);
      if (selectedAuthor) {
        // Pass the author object directly to the parent component
        handleChange('author', selectedAuthor);
      }
    } else {
      handleChange('author', '');
    }
  };
  
  // Handle creating a new category
  const handleCreateNewCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }
    
    try {
      // In a real app, this would call an API to create the category
      // For now, we'll just add it to the UI and use a dummy ID
      const newCategory = {
        id: Math.max(0, ...categories.map(c => c.id)) + 1,
        name: newCategoryName.trim()
      };
      
      // Add to local state
      setCategories([...categories, newCategory]);
      
      // Set as selected category - passing the object directly
      handleChange('category', newCategory);
      
      // Close dialog and reset input
      setIsNewCategoryDialogOpen(false);
      setNewCategoryName('');
      
      toast.success('New category created');
    } catch (err) {
      console.error('Error creating category:', err);
      toast.error('Failed to create category');
    }
  };
  
  // Get category display text
  const getCategoryDisplay = () => {
    if (!formData.category) return '';
    
    if (typeof formData.category === 'string') {
      return formData.category;
    }
    
    return formData.category.name || '';
  };
  
  // Get author display text
  const getAuthorDisplay = () => {
    if (!formData.author) return '';
    
    if (typeof formData.author === 'string') {
      return formData.author;
    }
    
    return formData.author.username || '';
  };
  
  // Get selected category ID or empty string
  const getSelectedCategoryId = () => {
    if (typeof formData.category === 'object' && formData.category && 'id' in formData.category) {
      return formData.category.id.toString();
    }
    return '';
  };
  
  // Get selected author ID or empty string
  const getSelectedAuthorId = () => {
    if (typeof formData.author === 'object' && formData.author && 'id' in formData.author) {
      return formData.author.id.toString();
    }
    return '';
  };
  
  return (
    <NeumorphicCard className="mb-6">
      <h3 className="font-medium mb-4 text-foreground">Post Settings</h3>
      
      <div className="mb-4">
        <label className="block text-foreground font-medium mb-2">
          Category *
        </label>
        {loadingCategories ? (
          <div className="w-full p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg text-muted-foreground">
            Loading categories...
          </div>
        ) : (
          <>
            <select
              value={getSelectedCategoryId()}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none text-foreground"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
              <option value="new" className="font-semibold text-primary">+ Create new category</option>
            </select>
            {typeof formData.category === 'string' && formData.category && (
              <p className="mt-1 text-xs text-yellow-500">
                Using custom category name. Consider creating a proper category.
              </p>
            )}
          </>
        )}
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 text-sm text-foreground">Publication Date</label>
        <DatePickerDemo 
          date={formData.date}
          onDateChange={(value) => handleChange('date', value)}
        />
        <p className="mt-1 text-xs text-muted-foreground">Default is today's date</p>
      </div>
      
      <div className="mb-4">
        <label className="block text-foreground font-medium mb-2">
          Author *
        </label>
        {loadingAuthors ? (
          <div className="w-full p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg text-muted-foreground">
            Loading authors...
          </div>
        ) : (
          <>
            <select
              value={getSelectedAuthorId()}
              onChange={(e) => handleAuthorChange(e.target.value)}
              className="w-full p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none text-foreground"
            >
              <option value="">Select an author</option>
              {authors.map(author => (
                <option key={author.id} value={author.id.toString()}>
                  {author.username}
                </option>
              ))}
            </select>
            {typeof formData.author === 'string' && formData.author && (
              <p className="mt-1 text-xs text-yellow-500">
                Using custom author name. Consider selecting a user account.
              </p>
            )}
          </>
        )}
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 text-sm text-foreground">Featured Image</label>
        <BlogImageSection 
          imageUrl={formData.imageUrl}
          onImageChange={(url) => handleChange('imageUrl', url)}
        />
      </div>
      
      {/* Dialog for creating a new category */}
      <Dialog open={isNewCategoryDialogOpen} onOpenChange={setIsNewCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none text-foreground"
              placeholder="e.g. Development, Design, etc."
            />
          </div>
          <DialogFooter>
            <button
              onClick={() => setIsNewCategoryDialogOpen(false)}
              className="px-4 py-2 rounded-lg shadow-neu dark:shadow-dark-neu hover:shadow-neu-pressed dark:hover:shadow-dark-neu-pressed transition-shadow duration-200 bg-background"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateNewCategory}
              className="px-4 py-2 rounded-lg shadow-neu dark:shadow-dark-neu hover:shadow-neu-pressed dark:hover:shadow-dark-neu-pressed transition-shadow duration-200 bg-primary text-white"
            >
              Create
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </NeumorphicCard>
  );
};

// Main BlogEditor Component
const BlogEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postId = parseInt(id || '0', 10);
  const isEditMode = !!id;
  
  const { 
    formData, 
    handleChange, 
    savePost, 
    isSaving, 
    isLoading, 
    error
  } = useBlogForm(postId, isEditMode);
  
  const handleSave = async () => {
    await savePost();
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="container py-8 mx-auto bg-background">
        <div className="text-center py-12">
          <p className="text-lg">Loading blog post data...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="container py-8 mx-auto bg-background">
        <div className="text-center py-12">
          <p className="text-lg text-red-500">{error}</p>
          <NeumorphicButton 
            onClick={() => navigate('/admin/blog')}
            className="mt-4"
          >
            Back to Blog Posts
          </NeumorphicButton>
        </div>
      </div>
    );
  }
  
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
          <PostContentEditor 
            formData={formData} 
            handleChange={handleChange} 
          />
        </div>
        
        <div>
          <PostSettings 
            formData={formData} 
            handleChange={handleChange} 
          />
          
          <NeumorphicButton 
            className="w-full flex items-center justify-center gap-2"
            disabled={isSaving}
            onClick={handleSave}
          >
            {isSaving ? 'Saving...' : 'Save Post'}
            <Save size={16} />
          </NeumorphicButton>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
