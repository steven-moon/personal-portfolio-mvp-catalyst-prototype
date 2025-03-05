import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { User, UserRole } from '@/types/user';
import { User as UserIcon, Mail, Key } from 'lucide-react';
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Local storage key for users
const USERS_STORAGE_KEY = 'portfolio_users';

const ProfileSettingsSection: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    setLoading(true);
    try {
      // In a real app, this would come from an authentication context or API
      // For this prototype, we'll assume the admin user is the current user
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const adminUser = users.find((user: User) => user.role === UserRole.ADMIN);
        if (adminUser) {
          setCurrentUser(adminUser);
        }
      }
    } catch (error) {
      console.error('Error loading current user:', error);
      toast.error('Failed to load profile information');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (!currentUser) return;
    
    setCurrentUser({
      ...currentUser,
      [name]: value,
    });

    // Clear error for this field
    if (name in errors) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateProfile = () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
    };
    
    if (!currentUser?.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!currentUser?.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(currentUser.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    
    return !Object.values(newErrors).some(error => error !== '');
  };

  const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSaveProfile = async () => {
    if (!validateProfile() || !currentUser) return;
    
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const updatedUsers = users.map((user: User) => 
          user.id === currentUser.id ? currentUser : user
        );
        
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const validatePasswordChange = () => {
    // For demo purposes, we're not actually checking the current password
    // In a real app, this would validate against the stored (hashed) password
    
    if (!passwords.new) {
      setErrors({
        ...errors,
        password: 'New password is required',
      });
      return false;
    }
    
    if (passwords.new.length < 6) {
      setErrors({
        ...errors,
        password: 'Password must be at least 6 characters',
      });
      return false;
    }
    
    if (passwords.new !== passwords.confirm) {
      setErrors({
        ...errors,
        password: 'Passwords do not match',
      });
      return false;
    }
    
    return true;
  };

  const handlePasswordChange = () => {
    if (!validatePasswordChange()) return;
    
    // In a real app, you would update the user's password in the database
    // For this demo, we'll just show a success message
    
    toast.success('Password changed successfully');
    setShowPasswordModal(false);
    setPasswords({
      current: '',
      new: '',
      confirm: '',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-foreground">User profile not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Profile Settings</h2>
      </div>

      <div className="neu-flat p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-6 neu-flat">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <UserIcon size={48} className="text-primary" />
            </div>
            <p className="text-lg font-semibold">{currentUser.name}</p>
            <p className="text-sm text-muted-foreground">{currentUser.role}</p>
            <p className="text-xs text-muted-foreground mt-2">Last login: {new Date(currentUser.lastLogin).toLocaleDateString()}</p>
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  name="name"
                  value={currentUser.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={currentUser.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <input
                type="text"
                value={currentUser.role}
                readOnly
                disabled
                className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none opacity-70"
              />
              <p className="mt-1 text-xs text-muted-foreground">Role cannot be changed from this screen.</p>
            </div>
            
            <div className="pt-4">
              <NeumorphicButton
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center gap-2"
                variant="secondary"
              >
                <Key className="h-4 w-4" />
                Change Password
              </NeumorphicButton>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <NeumorphicButton
            onClick={handleSaveProfile}
            className="px-4 py-2"
          >
            Save Profile
          </NeumorphicButton>
        </div>
      </div>

      {/* Password Change Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and a new password.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Password</label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none"
                placeholder="Your current password"
              />
              <p className="text-xs text-muted-foreground">
                For this demo, any current password will work
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <input
                type="password"
                value={passwords.new}
                onChange={(e) => {
                  setPasswords({...passwords, new: e.target.value});
                  setErrors({...errors, password: ''});
                }}
                className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none"
                placeholder="New password"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => {
                  setPasswords({...passwords, confirm: e.target.value});
                  setErrors({...errors, password: ''});
                }}
                className="w-full p-2 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none"
                placeholder="Confirm new password"
              />
            </div>
            
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          
          <DialogFooter className="flex justify-between sm:justify-end pt-4">
            <NeumorphicButton
              onClick={() => {
                setShowPasswordModal(false);
                setPasswords({current: '', new: '', confirm: ''});
                setErrors({...errors, password: ''});
              }}
              className="px-3 py-2 text-sm"
              variant="secondary"
            >
              Cancel
            </NeumorphicButton>
            <NeumorphicButton
              onClick={handlePasswordChange}
              className="px-3 py-2 text-sm ml-2"
            >
              Update Password
            </NeumorphicButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileSettingsSection; 