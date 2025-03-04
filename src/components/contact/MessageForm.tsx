
import React, { useState } from 'react';
import NeumorphicCard from '../ui/NeumorphicCard';
import NeumorphicButton from '../ui/NeumorphicButton';
import { toast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

const MessageForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message sent!",
      description: "Thank you for your message. I'll get back to you soon.",
    });
    
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    setIsSubmitting(false);
  };

  return (
    <NeumorphicCard>
      <h2 className="text-2xl font-semibold mb-6">Send Me a Message</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl neu-pressed bg-transparent focus:outline-none focus:ring-2 focus:ring-neu-accent"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl neu-pressed bg-transparent focus:outline-none focus:ring-2 focus:ring-neu-accent"
              placeholder="Your email"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="subject" className="block text-sm font-medium mb-2">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl neu-pressed bg-transparent focus:outline-none focus:ring-2 focus:ring-neu-accent"
            placeholder="What is this regarding?"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl neu-pressed bg-transparent focus:outline-none focus:ring-2 focus:ring-neu-accent resize-none"
            placeholder="Your message here..."
          />
        </div>
        
        <div>
          <NeumorphicButton
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
            <Send size={16} />
          </NeumorphicButton>
        </div>
      </form>
    </NeumorphicCard>
  );
};

export default MessageForm;
