
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Menu, X, LogIn } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "./Logo";
import { NavItems } from "./NavItems";
import { ProfileMenu } from "./ProfileMenu";
import { MobileMenu } from "./MobileMenu";
import { useProfileData } from "./useProfileData";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { session, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { userInitial, avatarUrl } = useProfileData(user);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-lg shadow-sm border-b border-primary/10" : "bg-background/90 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Logo />
          </div>

          {isMobile ? (
            <div className="flex items-center gap-2">
              {session && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/profile')}
                  className="text-foreground hover:text-primary hover:bg-primary/20"
                >
                  <User size={40} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
                className="text-foreground hover:text-primary hover:bg-primary/20"
              >
                {mobileMenuOpen ? <X size={44} /> : <Menu size={44} />}
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <nav className="flex items-center">
                <NavItems />
              </nav>
              
              {session ? (
                <ProfileMenu userInitial={userInitial} avatarUrl={avatarUrl} />
              ) : (
                <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <MobileMenu 
        isOpen={isMobile && mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        isAuthenticated={!!session}
        userInitial={userInitial}
        avatarUrl={avatarUrl}
      />
    </header>
  );
};

export default Navbar;
