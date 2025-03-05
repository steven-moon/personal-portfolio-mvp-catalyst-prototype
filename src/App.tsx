import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import NewsletterSection from "./components/layout/NewsletterSection";
import Banner from "./components/layout/Banner";
import Index from "./pages/Index";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SiteSettingsProvider, useSiteSettings } from "./contexts/SiteSettingsContext";
import { cn } from "@/lib/utils";

const queryClient = new QueryClient();

// Layout component that has access to all context providers
const AppLayout = () => {
  const { siteSettings } = useSiteSettings();
  const isBannerEnabled = siteSettings.features?.enableMvpBanner;
  
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <div className={cn(
        "flex-grow",
        "pt-[calc(var(--navbar-height)+1.5rem)]",
        isBannerEnabled ? "pb-[calc(var(--banner-height)+5rem)]" : "pb-20"
      )}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {siteSettings.features?.enableNewsletter && <NewsletterSection />}
      <div className={isBannerEnabled ? "mb-[var(--banner-height)]" : ""}>
        <Footer />
      </div>
      {isBannerEnabled && <Banner />}
    </div>
  );
};

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
                <AppLayout />
              </BrowserRouter>
            </TooltipProvider>
          </SiteSettingsProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
