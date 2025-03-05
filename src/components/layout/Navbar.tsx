import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, LayoutDashboard, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import LocalImage from '@/components/ui/LocalImage';

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
  const { siteSettings, loading } = useSiteSettings();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isBannerEnabled = !loading && siteSettings.features?.enableMvpBanner;

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

  // Get the corresponding admin route for the current public page
  const getAdminEditRoute = () => {
    const path = location.pathname;
    if (path === '/') return '/admin/home';
    if (path.startsWith('/projects/')) {
      const projectId = path.split('/').pop();
      return `/admin/projects/edit/${projectId}`;
    }
    if (path.startsWith('/blog/')) {
      const blogId = path.split('/').pop();
      return `/admin/blog/edit/${blogId}`;
    }
    // For regular pages like /about, /projects, /blog, /contact
    return `/admin${path}`;
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
      {!loading && siteSettings.features.enableProjects && (
        <NavLink to="/admin/projects" isActive={location.pathname === '/admin/projects' || location.pathname.startsWith('/admin/projects/')}>
          Projects
        </NavLink>
      )}
      {!loading && siteSettings.features.enableBlog && (
        <NavLink to="/admin/blog" isActive={location.pathname === '/admin/blog' || location.pathname.startsWith('/admin/blog/')}>
          Blog
        </NavLink>
      )}
      {!loading && siteSettings.features.enableContactForm && (
        <NavLink to="/admin/contact" isActive={location.pathname === '/admin/contact'}>
          Contact
        </NavLink>
      )}
      <NavLink to="/" isActive={location.pathname === '/'}>
        Return to Portfolio
      </NavLink>
    </>
  );

  // Public navigation links
  const renderPublicLinks = () => (
    <div className="flex items-center space-x-1 md:space-x-2">
      <NavLink to="/" isActive={location.pathname === '/'}>
        Home
      </NavLink>
      <NavLink to="/about" isActive={location.pathname === '/about'}>
        About
      </NavLink>
      {!loading && siteSettings.features.enableProjects && (
        <NavLink to="/projects" isActive={location.pathname === '/projects'}>
          Projects
        </NavLink>
      )}
      {!loading && siteSettings.features.enableBlog && (
        <NavLink to="/blog" isActive={location.pathname === '/blog'}>
          Blog
        </NavLink>
      )}
      {!loading && siteSettings.features.enableContactForm && (
        <NavLink to="/contact" isActive={location.pathname === '/contact'}>
          Contact
        </NavLink>
      )}
      <div className="mx-2">
        <ThemeToggle />
      </div>
      {isAuthenticated ? (
        <div className="flex items-center space-x-1 md:space-x-2">
          {/* Edit Page button - only shows for authenticated users on public pages */}
          <Link to={getAdminEditRoute()} className="px-3 py-2 rounded-lg hover:neu-flat transition-medium text-primary" title="Edit this page">
            <Edit className="h-5 w-5" />
          </Link>
          <Link to="/admin" className="px-3 py-2 rounded-lg hover:neu-flat transition-medium">
            <LayoutDashboard className="h-5 w-5" />
          </Link>
          <button 
            onClick={handleLogout}
            className="px-3 py-2 rounded-lg hover:neu-flat transition-medium text-red-500"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <Link to="/login" className="px-3 py-2 rounded-lg hover:neu-flat transition-medium">
          <LogIn className="h-5 w-5" />
        </Link>
      )}
    </div>
  );

  const siteName = loading ? 'Loading...' : (siteSettings.general.siteName || 'My Portfolio');
  const siteIcon = !loading && siteSettings.general.siteIcon ? siteSettings.general.siteIcon : '';

  return (
    <header className={cn(
      "fixed left-0 right-0 top-0 z-40 transition-medium px-4 py-4 pt-6",
      isScrolled ? "bg-background/90 backdrop-blur-sm border-b border-border" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          {siteIcon && (
            <div className="w-8 h-8 overflow-hidden rounded-md">
              <LocalImage 
                src={siteIcon} 
                alt="Site Icon" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <span className="text-xl font-semibold">{siteName}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          {isAdminRoute ? renderAdminLinks() : renderPublicLinks()}
        </nav>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg neu-flat"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[var(--navbar-height)] z-50 p-4 bg-background">
            <nav className="flex flex-col items-center space-y-4 mt-8">
              {isAdminRoute ? (
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
                  {!loading && siteSettings.features.enableProjects && (
                    <NavLink to="/admin/projects" isActive={location.pathname === '/admin/projects' || location.pathname.startsWith('/admin/projects/')}>
                      Projects
                    </NavLink>
                  )}
                  {!loading && siteSettings.features.enableBlog && (
                    <NavLink to="/admin/blog" isActive={location.pathname === '/admin/blog' || location.pathname.startsWith('/admin/blog/')}>
                      Blog
                    </NavLink>
                  )}
                  {!loading && siteSettings.features.enableContactForm && (
                    <NavLink to="/admin/contact" isActive={location.pathname === '/admin/contact'}>
                      Contact
                    </NavLink>
                  )}
                  <NavLink to="/" isActive={location.pathname === '/'}>
                    Return to Portfolio
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/" isActive={location.pathname === '/'}>
                    Home
                  </NavLink>
                  <NavLink to="/about" isActive={location.pathname === '/about'}>
                    About
                  </NavLink>
                  {!loading && siteSettings.features.enableProjects && (
                    <NavLink to="/projects" isActive={location.pathname === '/projects'}>
                      Projects
                    </NavLink>
                  )}
                  {!loading && siteSettings.features.enableBlog && (
                    <NavLink to="/blog" isActive={location.pathname === '/blog'}>
                      Blog
                    </NavLink>
                  )}
                  {!loading && siteSettings.features.enableContactForm && (
                    <NavLink to="/contact" isActive={location.pathname === '/contact'}>
                      Contact
                    </NavLink>
                  )}
                  {isAuthenticated ? (
                    <div className="flex items-center space-x-4 mt-4">
                      {/* Edit Page button for mobile - only shows for authenticated users */}
                      <Link to={getAdminEditRoute()} className="px-3 py-2 rounded-lg neu-flat transition-medium flex items-center text-primary">
                        <Edit className="h-5 w-5 mr-2" />
                        Edit Page
                      </Link>
                      <Link to="/admin" className="px-3 py-2 rounded-lg neu-flat transition-medium flex items-center">
                        <LayoutDashboard className="h-5 w-5 mr-2" />
                        Admin
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="px-3 py-2 rounded-lg neu-flat transition-medium text-red-500 flex items-center"
                      >
                        <LogOut className="h-5 w-5 mr-2" />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Link to="/login" className="px-3 py-2 rounded-lg neu-flat transition-medium flex items-center mt-4">
                      <LogIn className="h-5 w-5 mr-2" />
                      Login
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
