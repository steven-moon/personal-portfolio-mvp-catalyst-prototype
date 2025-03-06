/**
 * Project related type definitions
 */

export interface Tag {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectImage {
  id?: number;
  projectId?: number;
  imageUrl: string;
  isMain?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  images: (string | ProjectImage)[];
  tags: (string | Tag)[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  tags: string[];
  featured?: boolean;
  link?: string;
  githubLink?: string;
} 