
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import NeumorphicButton from '@/components/ui/NeumorphicButton';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // For demo purposes, we'll use a simple check
    // In a real app, this would be an API call to your auth system
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'admin@example.com' && password === 'password') {
        // Success login
        toast.success('Login successful!');
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/admin');
      } else {
        // Failed login
        toast.error('Invalid credentials. Try admin@example.com / password');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-12 max-w-md mx-auto page-transition">
      <div className="neu-flat p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-neu-accent">Login</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-neu-text">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-neu-bg shadow-neu-pressed rounded-lg focus:outline-none"
              placeholder="admin@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2 text-neu-text">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-neu-bg shadow-neu-pressed rounded-lg focus:outline-none"
              placeholder="password"
              required
            />
          </div>
          
          <NeumorphicButton
            type="submit"
            className="w-full mt-6"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </NeumorphicButton>
        </form>
        
        <div className="mt-6 text-center text-sm text-neu-text-secondary">
          <p>For demo purposes, use:</p>
          <p className="font-mono mt-1">admin@example.com / password</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
