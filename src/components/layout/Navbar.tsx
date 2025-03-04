
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-medium",
        isScrolled ? "bg-neu-bg/80 backdrop-blur-md shadow-md" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="font-bold text-2xl text-neu-accent">
          Portfolio
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          <NavLink to="/" isActive={location.pathname === '/'}>
            Home
          </NavLink>
          <NavLink to="/about" isActive={location.pathname === '/about'}>
            About
          </NavLink>
          <NavLink to="/projects" isActive={location.pathname === '/projects'}>
            Projects
          </NavLink>
          <NavLink to="/blog" isActive={location.pathname === '/blog' || location.pathname.startsWith('/blog/')}>
            Blog
          </NavLink>
          <NavLink to="/contact" isActive={location.pathname === '/contact'}>
            Contact
          </NavLink>
        </nav>

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
            <NavLink to="/" isActive={location.pathname === '/'}>
              Home
            </NavLink>
            <NavLink to="/about" isActive={location.pathname === '/about'}>
              About
            </NavLink>
            <NavLink to="/projects" isActive={location.pathname === '/projects'}>
              Projects
            </NavLink>
            <NavLink to="/blog" isActive={location.pathname === '/blog' || location.pathname.startsWith('/blog/')}>
              Blog
            </NavLink>
            <NavLink to="/contact" isActive={location.pathname === '/contact'}>
              Contact
            </NavLink>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
