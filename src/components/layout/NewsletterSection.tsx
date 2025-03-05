import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import NeumorphicButton from '@/components/ui/NeumorphicButton';

// Helper function to validate email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Thank you for subscribing to our newsletter!');
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="w-full py-12 px-6 border-t border-gray-200 dark:border-gray-800 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-md mx-auto text-center">
          <h3 className="text-lg font-medium mb-2 text-foreground">Subscribe to Newsletter</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Stay updated with our latest projects and articles
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none text-foreground"
              required
            />
            <NeumorphicButton 
              type="submit" 
              size="sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Subscribe
                </>
              )}
            </NeumorphicButton>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection; 