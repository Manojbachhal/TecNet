import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Home,
  ShoppingBag,
  Package,
  MapPin,
  Crosshair,
  Newspaper,
  Settings,
  User,
  LogOut,
  LogIn,
  MessageSquare,
} from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  userInitial?: string;
  avatarUrl?: string;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  isAuthenticated,
  userInitial = "?",
  avatarUrl,
}) => {
  const navigate = useNavigate();

  // Define navigation items
  const navItems = [
    { to: '/', label: 'Home', icon: Home, public: true },
    { to: '/trading', label: 'Trading', icon: ShoppingBag, requiresAuth: true },
    { to: '/inventory', label: 'Inventory', icon: Package, requiresAuth: true },
    { to: '/range-finder', label: 'Range Finder', icon: MapPin, requiresAuth: true },
    { to: '/ballistics', label: 'Ballistics', icon: Crosshair, requiresAuth: true },
    { to: '/messages', label: 'Messages', icon: MessageSquare, requiresAuth: true },
    { to: '/news', label: 'News', icon: Newspaper, public: true },
  ];

  const accountItems = [
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  // Filter items based on authentication status
  const filteredItems = navItems.filter(
    item => (item.public || (item.requiresAuth && isAuthenticated))
  );

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleSignOut = async () => {
    navigate('/auth');
    onClose();
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={menuVariants}
          className="absolute top-16 left-0 w-full bg-background/95 backdrop-blur-lg border-b border-primary/10 shadow-lg z-50"
        >
          <div className="py-4 px-6">
            <nav className="flex flex-col gap-3 pb-6">
              {filteredItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) => `
                      flex items-center gap-3 p-2 rounded-md text-base
                      ${isActive ? 'bg-primary/10 text-primary' : 'text-foreground/70 hover:text-foreground hover:bg-accent/50'}
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>

            {isAuthenticated ? (
              <>
                <div className="border-t border-gray-800 my-2 pt-2">
                  <div className="flex items-center gap-3 p-3">
                    <Avatar className="h-10 w-10">
                      {avatarUrl ? (
                        <AvatarImage src={avatarUrl} alt="User" />
                      ) : (
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {userInitial}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Account</span>
                      <span className="text-xs text-muted-foreground">Manage your settings</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    {accountItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={onClose}
                          className={({ isActive }) => `
                            flex items-center gap-3 p-2 rounded-md text-base
                            ${isActive ? 'bg-primary/10 text-primary' : 'text-foreground/70 hover:text-foreground hover:bg-accent/50'}
                          `}
                        >
                          <Icon className="h-5 w-5" />
                          {item.label}
                        </NavLink>
                      );
                    })}

                    <Button
                      variant="ghost"
                      onClick={handleSignOut}
                      className="flex items-center justify-start gap-3 p-2 text-base text-foreground/70 hover:text-red-500"
                    >
                      <LogOut className="h-5 w-5" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="border-t border-gray-800 my-2 pt-4">
                <Button 
                  onClick={() => handleNavigation('/auth')}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
