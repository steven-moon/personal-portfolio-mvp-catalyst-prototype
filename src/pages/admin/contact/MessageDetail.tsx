import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { ContactService } from '@/lib/apiService';
import NeumorphicCard from '@/components/ui/NeumorphicCard';
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import { ArrowLeft, Mail, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

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

const MessageDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState<ContactMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessageDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const response = await ContactService.getContactMessageById(parseInt(id));
        setMessage(response);
        
        // If message is not marked as read, mark it as read
        if (response && !response.isRead) {
          try {
            await ContactService.updateContactMessage(response.id, { isRead: true });
          } catch (updateError) {
            console.error('Error marking message as read:', updateError);
            // Continue even if marking as read fails
          }
        }
      } catch (error) {
        console.error('Error fetching message details:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to load message details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessageDetails();
  }, [id]);

  const handleBack = () => {
    navigate('/admin/messages');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <NeumorphicCard className="p-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Message not found.</p>
              <NeumorphicButton className="mt-4" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Messages
              </NeumorphicButton>
            </div>
          </NeumorphicCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <NeumorphicButton onClick={handleBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </NeumorphicButton>
          <h1 className="text-2xl font-bold text-foreground">Message Details</h1>
        </div>

        <NeumorphicCard className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">{message.subject}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-2 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">From</p>
                  <p className="text-muted-foreground">{message.name}</p>
                  <p className="text-muted-foreground">{message.email}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-2 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Received</p>
                  <p className="text-muted-foreground">
                    {format(new Date(message.createdAt), 'PPP p')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Message</h3>
              <div className="bg-background p-4 rounded-xl shadow-inner">
                <p className="whitespace-pre-wrap">{message.message}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-primary" />
              <p>{message.isRead ? 'Read' : 'Unread'}</p>
            </div>
          </div>
          
          <div className="flex justify-between">
            <NeumorphicButton onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Messages
            </NeumorphicButton>
            
            <NeumorphicButton 
              onClick={() => window.location.href = `mailto:${message.email}?subject=Re: ${message.subject}`}
            >
              <Mail className="h-4 w-4 mr-2" />
              Reply via Email
            </NeumorphicButton>
          </div>
        </NeumorphicCard>
      </div>
    </div>
  );
};

export default MessageDetail; 