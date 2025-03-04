import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ContactInfoItemProps {
  icon: LucideIcon;
  title: string;
  content: React.ReactNode;
}

const ContactInfoItem = ({ icon: Icon, title, content }: ContactInfoItemProps) => {
  return (
    <div className="flex items-start">
      <div className="p-3 neu-pressed dark:shadow-dark-neu-pressed rounded-lg mr-4">
        <Icon className="text-primary" size={20} />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-1 text-foreground">{title}</h3>
        {content}
      </div>
    </div>
  );
};

export default ContactInfoItem;
