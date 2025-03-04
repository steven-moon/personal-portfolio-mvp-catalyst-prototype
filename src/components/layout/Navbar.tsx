import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  isActive: boolean;
}

const NavLink = ({ to, children, isActive }: NavLinkProps) => {
  return (
    <Link 
      to={to}
      className={cn(
        "px-3 py-2 rounded-lg transition-medium font-medium",
        isActive ? "neu-pressed" : "hover:neu-flat"
      )}
    >
      {children}
    </Link>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    // No need for navigation as the AuthContext will handle the state change
    // and the protected routes will redirect accordingly
  };

  // Admin navigation links
  const renderAdminLinks = () => (
    <>
      <NavLink to="/admin" isActive={location.pathname === '/admin'}>
        Dashboard
      </NavLink>
      <NavLink to="/admin/home" isActive={location.pathname === '/admin/home'}>
        Home
      </NavLink>
      <NavLink to="/admin/about" isActive={location.pathname === '/admin/about'}>
        About
      </NavLink>
      <NavLink to="/admin/projects" isActive={location.pathname === '/admin/projects' || location.pathname.startsWith('/admin/projects/')}>
        Projects
      </NavLink>
      <NavLink to="/admin/blog" isActive={location.pathname === '/admin/blog' || location.pathname.startsWith('/admin/blog/')}>
        Blog
      </NavLink>
      <NavLink to="/admin/contact" isActive={location.pathname === '/admin/contact'}>
        Contact
      </NavLink>
    </>
  );

  // Public navigation links
  const renderPublicLinks = () => (
    <>
      <NavLink to="/" isActive={location.pathname === '/'}>
        Home
      </NavLink>
      <NavLink to="/about" isActive={location.pathname === '/about'}>
        About
      </NavLink>
      <NavLink to="/projects" isActive={location.pathname === '/projects'}>
        Projects
      </NavLink>
      <NavLink to="/blog" isActive={location.pathname === '/blog' || (location.pathname.startsWith('/blog/') && !location.pathname.includes('/admin/'))}>
        Blog
      </NavLink>
      <NavLink to="/contact" isActive={location.pathname === '/contact'}>
        Contact
      </NavLink>
    </>
  );

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-medium",
        isScrolled ? "bg-neu-bg/80 backdrop-blur-md shadow-md" : "bg-transparent",
        isAdminRoute && isAuthenticated ? "bg-neu-accent/10" : ""
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to={isAuthenticated && isAdminRoute ? "/admin" : "/"} className="font-bold text-2xl text-neu-accent">
          {isAuthenticated && isAdminRoute ? "Admin Portal" : "Portfolio"}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          <nav className="flex items-center space-x-2 mr-4">
            {isAuthenticated && isAdminRoute ? renderAdminLinks() : renderPublicLinks()}
          </nav>

          {/* Auth Button - Desktop */}
          {isAuthenticated ? (
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1 neu-flat px-3 py-2 text-neu-accent hover:shadow-neu-convex transition-medium"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center gap-1 neu-flat px-3 py-2 text-neu-accent hover:shadow-neu-convex transition-medium"
            >
              <LogIn size={18} />
              <span>Login</span>
            </Link>
          )}

          {/* Admin Dashboard Link - Desktop (only show if logged in but on public pages) */}
          {isAuthenticated && !isAdminRoute && (
            <Link 
              to="/admin" 
              className="flex items-center gap-1 neu-flat px-3 py-2 ml-2 text-neu-accent hover:shadow-neu-convex transition-medium"
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 neu-flat rounded-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden py-4 px-6 bg-neu-bg mt-2 rounded-xl neu-flat animate-fade-in">
          <div className="flex flex-col space-y-2">
            {isAuthenticated && isAdminRoute ? renderAdminLinks() : renderPublicLinks()}
            
            {/* Auth Button - Mobile */}
            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 neu-flat px-3 py-2 text-neu-accent mt-2"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-1 neu-flat px-3 py-2 text-neu-accent mt-2"
              >
                <LogIn size={18} />
                <span>Login</span>
              </Link>
            )}

            {/* Admin Dashboard Link - Mobile (only show if logged in but on public pages) */}
            {isAuthenticated && !isAdminRoute && (
              <Link 
                to="/admin" 
                className="flex items-center gap-1 neu-flat px-3 py-2 mt-2 text-neu-accent"
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
