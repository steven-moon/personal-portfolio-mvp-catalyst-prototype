import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import NewsletterSection from "./components/layout/NewsletterSection";
import Index from "./pages/Index";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SiteSettingsProvider } from "./contexts/SiteSettingsContext";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <SiteSettingsProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <div className="flex-grow pt-16 pb-16">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/project/:id" element={<ProjectDetail />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:id" element={<BlogDetail />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/admin/*" element={<Admin />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                  <NewsletterSectionWrapper />
                  <Footer />
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </SiteSettingsProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

// Conditionally render the newsletter section based on site settings
const NewsletterSectionWrapper = () => {
  const { siteSettings } = require("./contexts/SiteSettingsContext").useSiteSettings();
  
  if (!siteSettings.features?.enableNewsletter) {
    return null;
  }
  
  return <NewsletterSection />;
};

export default App;
