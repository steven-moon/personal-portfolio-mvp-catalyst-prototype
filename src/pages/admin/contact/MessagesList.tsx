import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import { ContactService } from '@/lib/apiService';
import { MessageCircle, Eye, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Message interface
interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

const MessageItem = ({ message, onView }: { 
  message: ContactMessage; 
  onView: (id: number) => void;
}) => {
  return (
    <NeumorphicCard className={`mb-4 p-4 ${!message.isRead ? 'border-l-4 border-primary' : ''}`}>
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="w-full md:w-3/4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold mb-1 text-foreground">
              {message.subject}
            </h3>
            {!message.isRead && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                New
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-muted-foreground text-sm">
              From: {message.name} ({message.email})
            </span>
            <span className="text-muted-foreground text-sm">
              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2">{message.message}</p>
        </div>
        <div className="flex justify-end items-center mt-4 md:mt-0 md:w-1/4 gap-2">
          <NeumorphicButton
            size="sm"
            onClick={() => onView(message.id)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </NeumorphicButton>
        </div>
      </div>
    </NeumorphicCard>
  );
};

const MessagesList = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await ContactService.getContactMessages();
      setMessages(response);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleView = (id: number) => {
    navigate(`/admin/messages/${id}`);
  };

  const handleRefresh = () => {
    fetchMessages();
    toast.success('Messages refreshed');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <MessageCircle className="text-primary mr-2" />
            <h1 className="text-2xl font-bold text-foreground">Contact Messages</h1>
          </div>
          <NeumorphicButton onClick={handleRefresh} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </NeumorphicButton>
        </div>
        
        <NeumorphicCard className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No messages received yet.</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Showing {messages.length} message{messages.length !== 1 ? 's' : ''}
              </p>
              {messages.map((message) => (
                <MessageItem 
                  key={message.id} 
                  message={message} 
                  onView={handleView} 
                />
              ))}
            </div>
          )}
        </NeumorphicCard>
      </div>
    </div>
  );
};

export default MessagesList; 