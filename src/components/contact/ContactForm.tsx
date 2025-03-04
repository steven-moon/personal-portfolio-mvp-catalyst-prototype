import React, { useState } from 'react';
import NeumorphicCard from '../ui/NeumorphicCard';
import NeumorphicButton from '../ui/NeumorphicButton';
import { toast } from '@/hooks/use-toast';
import { Send, Github, Linkedin, Mail, MapPin } from 'lucide-react';

const ContactForm = () => {
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
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-4xl font-bold mb-4">Get In Touch</h1>
          <p className="text-xl text-neu-text-secondary max-w-2xl mx-auto">
            I'm always open to new opportunities and collaborations. Feel free to reach out!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
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
          </div>
          
          <div className="md:col-span-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <NeumorphicCard className="h-full">
              <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="p-3 neu-pressed rounded-lg mr-4">
                    <Mail className="text-neu-accent" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Email</h3>
                    <a href="mailto:hello@example.com" className="text-neu-text-secondary hover:text-neu-accent transition-medium">
                      hello@example.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-3 neu-pressed rounded-lg mr-4">
                    <MapPin className="text-neu-accent" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Location</h3>
                    <p className="text-neu-text-secondary">San Francisco, CA</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-3 neu-pressed rounded-lg mr-4">
                    <Github className="text-neu-accent" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">GitHub</h3>
                    <a 
                      href="https://github.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-neu-text-secondary hover:text-neu-accent transition-medium"
                    >
                      github.com/johndoe
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-3 neu-pressed rounded-lg mr-4">
                    <Linkedin className="text-neu-accent" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">LinkedIn</h3>
                    <a 
                      href="https://linkedin.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-neu-text-secondary hover:text-neu-accent transition-medium"
                    >
                      linkedin.com/in/johndoe
                    </a>
                  </div>
                </div>
              </div>
            </NeumorphicCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
