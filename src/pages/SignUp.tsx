import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import NeumorphicButton from '@/components/ui/NeumorphicButton';
import { useAuth } from '@/contexts/AuthContext';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(''); // Clear any previous error messages
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setIsLoading(false);
      return;
    }
    
    try {
      // Use the signup function from auth context
      const success = await signup(username, email, password);
      
      if (success) {
        toast.success('Account created successfully!');
        navigate('/admin'); // Redirect to admin dashboard
      } else {
        setErrorMessage('Failed to create account. This email or username may already be in use.');
        toast.error('Signup failed.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('An error occurred during signup. Please try again later.');
      toast.error('An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-12 max-w-md mx-auto page-transition">
      <div className="neu-flat dark:bg-card p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary">Create Account</h1>
        
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-300 text-red-800 rounded-lg shadow-sm">
            <p className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
              </svg>
              {errorMessage}
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-foreground">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none"
              placeholder="Choose a username"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2 text-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2 text-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none"
              placeholder="Create a password"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2 text-foreground">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 bg-background shadow-neu-pressed dark:shadow-dark-neu-pressed rounded-lg focus:outline-none"
              placeholder="Confirm your password"
              required
            />
          </div>
          
          <NeumorphicButton
            type="submit"
            className="w-full mt-6"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </NeumorphicButton>
        </form>
      </div>
    </div>
  );
};

export default SignUp; 