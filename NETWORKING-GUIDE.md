# Network API Guide

This guide explains how to use and extend the network API architecture in our application.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Using Existing APIs](#using-existing-apis)
- [Adding New Data Objects](#adding-new-data-objects)
- [API Configuration](#api-configuration)
- [Mock API Development](#mock-api-development)
- [Best Practices](#best-practices)

## Architecture Overview

Our application uses a multi-layered API architecture:

1. **Base API Layer** (`src/lib/api.ts`): Core utility functions for making HTTP requests
2. **Entity-specific API Layers** (`src/lib/blogApi.ts`, `src/lib/projectApi.ts`): Entity-specific endpoint implementations
3. **API Service Layer** (`src/lib/apiService.ts`): Configures which implementation to use (mock vs real)
4. **Mock API Layer** (`src/lib/mockApi.ts`): In-memory implementation for development/testing
5. **Custom Hooks** (`src/hooks/useBlogPosts.ts`, `src/hooks/useProjects.ts`): React hooks for consuming APIs

## Using Existing APIs

To use the existing APIs in your components:

### 1. Import the appropriate hook:

```typescript
import { useBlogPosts } from '../hooks/useBlogPosts';
// OR
import { useProjects } from '../hooks/useProjects';
```

### 2. Use the hook in your component:

```typescript
function BlogList() {
  const { 
    posts, 
    loading, 
    error, 
    refetch, 
    createPost, 
    updatePost, 
    deletePost 
  } = useBlogPosts();

  // Use the data and functions in your component
}
```

### 3. Passing options:

```typescript
// For filtering blog posts by category:
const { posts, loading } = useBlogPosts({ category: 'technology' });

// For searching blog posts:
const { posts, loading } = useBlogPosts({ searchQuery: 'react' });

// For filtering projects by tag:
const { projects, loading } = useProjects({ tag: 'React' });
```

## Adding New Data Objects

To add API support for a new data type (e.g., "Comments"), follow these steps:

### 1. Create the data interface and sample data:

Create a new file `src/data/commentData.ts`:

```typescript
export interface Comment {
  id: number;
  postId: number;
  author: string;
  content: string;
  date: string;
}

// Sample data for development/testing
export const COMMENTS: Comment[] = [
  // Add sample comments
];
```

### 2. Create the real API implementation:

Create a new file `src/lib/commentApi.ts`:

```typescript
import { Comment } from '../data/commentData';
import { apiGet, apiPost, apiPut, apiDelete } from './api';

const COMMENT_ENDPOINT = '/comments';

export async function getAllComments(): Promise<Comment[]> {
  return apiGet<Comment[]>(COMMENT_ENDPOINT);
}

export async function getCommentById(id: number): Promise<Comment> {
  return apiGet<Comment>(`${COMMENT_ENDPOINT}/${id}`);
}

export async function createComment(comment: Omit<Comment, 'id'>): Promise<Comment> {
  return apiPost<Comment, Omit<Comment, 'id'>>(COMMENT_ENDPOINT, comment);
}

export async function updateComment(
  id: number,
  comment: Partial<Omit<Comment, 'id'>>
): Promise<Comment> {
  return apiPut<Comment, Partial<Omit<Comment, 'id'>>>(`${COMMENT_ENDPOINT}/${id}`, comment);
}

export async function deleteComment(id: number): Promise<void> {
  return apiDelete<void>(`${COMMENT_ENDPOINT}/${id}`);
}

// Add any other specific methods you need
export async function getCommentsByPostId(postId: number): Promise<Comment[]> {
  return apiGet<Comment[]>(`${COMMENT_ENDPOINT}?postId=${postId}`);
}
```

### 3. Add mock API implementation:

Add the following to `src/lib/mockApi.ts`:

```typescript
import { Comment, COMMENTS } from '../data/commentData';

// Add to existing in-memory stores
let comments = [...COMMENTS];

// Then add to the mockApi export
export const mockCommentApi = {
  async getAllComments(): Promise<Comment[]> {
    await delay();
    return [...comments];
  },
  
  async getCommentById(id: number): Promise<Comment> {
    await delay();
    const comment = comments.find(c => c.id === id);
    if (!comment) throw new Error(`Comment with ID ${id} not found`);
    return {...comment};
  },
  
  async createComment(comment: Omit<Comment, 'id'>): Promise<Comment> {
    await delay();
    const newComment = {
      ...comment,
      id: getNextId(comments)
    };
    comments.push(newComment);
    return {...newComment};
  },
  
  async updateComment(id: number, commentUpdate: Partial<Omit<Comment, 'id'>>): Promise<Comment> {
    await delay();
    const index = comments.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Comment with ID ${id} not found`);
    
    comments[index] = {
      ...comments[index],
      ...commentUpdate
    };
    return {...comments[index]};
  },
  
  async deleteComment(id: number): Promise<void> {
    await delay();
    const index = comments.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Comment with ID ${id} not found`);
    comments.splice(index, 1);
  },
  
  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    await delay();
    return [...comments.filter(c => c.postId === postId)];
  }
};
```

### 4. Update the API service:

Update `src/lib/apiService.ts` to include your new API:

```typescript
import * as commentApi from './commentApi';
import { mockCommentApi } from './mockApi';

// Add to existing exports
export const CommentService = USE_MOCK_API ? mockCommentApi : {
  getAllComments: commentApi.getAllComments,
  getCommentById: commentApi.getCommentById,
  createComment: commentApi.createComment,
  updateComment: commentApi.updateComment,
  deleteComment: commentApi.deleteComment,
  getCommentsByPostId: commentApi.getCommentsByPostId,
};
```

### 5. Create a custom hook:

Create a new file `src/hooks/useComments.ts`:

```typescript
import { useState, useEffect } from 'react';
import { Comment } from '../data/commentData';
import { CommentService } from '../lib/apiService';

interface UseCommentsOptions {
  postId?: number;
  initialLoading?: boolean;
}

export function useComments(options: UseCommentsOptions = {}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(options.initialLoading ?? true);
  const [error, setError] = useState<Error | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data: Comment[];
      if (options.postId) {
        data = await CommentService.getCommentsByPostId(options.postId);
      } else {
        data = await CommentService.getAllComments();
      }
      
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [options.postId]);

  const refetch = () => fetchComments();

  const createComment = async (comment: Omit<Comment, 'id'>) => {
    try {
      setError(null);
      const newComment = await CommentService.createComment(comment);
      setComments(prevComments => [...prevComments, newComment]);
      return newComment;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  };

  const updateComment = async (id: number, comment: Partial<Omit<Comment, 'id'>>) => {
    try {
      setError(null);
      const updatedComment = await CommentService.updateComment(id, comment);
      setComments(prevComments => 
        prevComments.map(c => c.id === id ? updatedComment : c)
      );
      return updatedComment;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  };

  const deleteComment = async (id: number) => {
    try {
      setError(null);
      await CommentService.deleteComment(id);
      setComments(prevComments => prevComments.filter(c => c.id !== id));
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  };

  return {
    comments,
    loading,
    error,
    refetch,
    createComment,
    updateComment,
    deleteComment
  };
}
```

## API Configuration

The application supports both real API endpoints and mock implementations for development/testing.

### Switching between real and mock APIs:

In `src/lib/apiService.ts`, you can configure which implementation to use:

```typescript
// Set to false to use real API
const USE_MOCK_API = true;
```

For more advanced configuration, use the `configureApi` function:

```typescript
import { configureApi } from './lib/apiService';

// In your application initialization
configureApi({ useMockApi: process.env.NODE_ENV === 'development' });
```

### Setting API base URL:

In `src/lib/api.ts`, update the `API_URL` constant:

```typescript
// Define API URL - in a real app, this would come from environment variables
const API_URL = 'https://api.example.com';
```

In a production application, use environment variables:

```typescript
const API_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';
```

## Mock API Development

The mock API implementation (`src/lib/mockApi.ts`) provides in-memory storage for development and testing.

### Benefits of the mock implementation:

1. Development without a backend dependency
2. Faster development cycles
3. Ability to test edge cases and error scenarios
4. Consistent data for UI development

### Customizing mock behavior:

You can customize the mock implementation to simulate specific scenarios:

```typescript
// Add delay to simulate network latency
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate errors
async getAllProjects(): Promise<Project[]> {
  await delay();
  // Simulate error
  if (Math.random() > 0.8) {
    throw new Error('Network error');
  }
  return [...projects];
}
```

## Best Practices

Follow these best practices when working with the API architecture:

1. **Always use typed responses**: Use TypeScript generics for type safety
2. **Handle errors properly**: Always include try/catch blocks
3. **Show loading states**: Use the loading state to display loading indicators
4. **Provide refetch capabilities**: Allow users to retry failed requests
5. **Optimize data fetching**: Only fetch data when needed
6. **Use appropriate HTTP methods**: GET for retrieving, POST for creating, PUT for updating, DELETE for deleting
7. **Include authentication**: Add authorization headers to requests
8. **Implement request timeouts**: Prevent hanging requests
9. **Add retry logic**: Automatically retry transient failures
10. **Cache responses**: Minimize unnecessary network requests

Following these guidelines will ensure a consistent, maintainable, and robust API implementation. 