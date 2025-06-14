import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RoleProvider } from "@/contexts/RoleContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import RoleProtectedRoute from "@/components/auth/RoleProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Inventory from "./pages/Inventory";
import Trading from "./pages/Trading";
import Classifieds from "./pages/Classifieds";
import RangeFinder from "./pages/RangeFinder";
import Ballistics from "./pages/Ballistics";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import News from "./pages/News";
import Profile from "./pages/Profile";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Messages from "./pages/Messages";
import Footer from "./components/layout/Footer";
import Admin from "./pages/Admin";
import Navbar from "@/components/layout/Navbar";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <RoleProvider>
            {/* <StorageSetup /> */}
            <Toaster />
            <Sonner />
            <div className="content-container min-h-screen flex flex-col">
              <Navbar />
              <div className="flex-grow">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/features" element={<Features />} />
                  <Route
                    path="/inventory"
                    element={
                      <ProtectedRoute>
                        <Inventory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/trading"
                    element={
                      <ProtectedRoute>
                        <Trading />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/classifieds"
                    element={
                      <ProtectedRoute>
                        <Classifieds />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/range-finder"
                    element={
                      <ProtectedRoute>
                        <RangeFinder />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/ballistics"
                    element={
                      <ProtectedRoute>
                        <Ballistics />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/messages"
                    element={
                      <ProtectedRoute>
                        <Messages />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <RoleProtectedRoute allowedRoles={['admin']}>
                        <Admin />
                      </RoleProtectedRoute>
                    }
                  />
                  <Route path="/news" element={<News />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </RoleProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
