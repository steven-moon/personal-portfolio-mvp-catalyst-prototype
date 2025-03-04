import React from 'react';
import { toast } from "sonner";

const AboutEditor = () => {
  return (
    <div className="container py-12 mx-auto page-transition">
      <h1 className="text-3xl font-bold mb-8 text-neu-accent">About Editor</h1>
      <p className="mb-6">This is a placeholder for the About page editor. In a complete implementation, this would allow editing of the About page content.</p>
      
      <div className="neu-flat p-6">
        <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
        <p>The full implementation of this editor would include:</p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>Personal bio editor</li>
          <li>Skills management</li>
          <li>Experience timeline</li>
          <li>Education details</li>
          <li>Image uploads</li>
        </ul>
        
        <button 
          className="mt-6 neu-flat px-4 py-2 hover:shadow-neu-convex transition-medium"
          onClick={() => toast.info('This functionality is not yet implemented')}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AboutEditor; 