import React from 'react';
import ContactHeader from './ContactHeader';
import MessageForm from './MessageForm';
import ContactInfo from './ContactInfo';

const ContactForm = () => {
  return (
    <section className="py-8 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <ContactHeader />
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <MessageForm />
          </div>
          
          <div className="md:col-span-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <ContactInfo />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
