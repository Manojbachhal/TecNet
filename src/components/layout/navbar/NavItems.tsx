import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";

export const NavItems = () => {
  const { session } = useAuth();
  const { role, loading } = useRole();
  const location = useLocation();

  // Define navigation items
  const navItems = [
    { to: "/", label: "Home", public: true },
    { to: "/trading", label: "Trading", requiresAuth: true },
    { to: "/inventory", label: "Inventory", requiresAuth: true },
    { to: "/classifieds", label: "Classifieds", public: true },
    { to: "/range-finder", label: "Ranges", requiresAuth: true },
    { to: "/ballistics", label: "Ballistics", requiresAuth: true },
    { to: "/messages", label: "Messages", requiresAuth: true },
    { to: "/news", label: "News", public: true },
  ];

  // Add Dashboard link for admin users
  if (role === 'admin') {
    navItems.push({ to: "/admin", label: "Dashboard", requiresAuth: true });
  }

  // Filter items based on authentication status
  const filteredItems = navItems.filter(
    item => (item.public || (item.requiresAuth && session))
  );

  if (loading) return null; // or a spinner

  return (
    <div className="flex items-center gap-1 md:gap-2">
      {filteredItems.map((item) => {
        const isActive = location.pathname === item.to || 
                        (item.to !== "/" && location.pathname.startsWith(item.to));
                        
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              relative px-3 py-2 text-sm font-medium transition-colors 
              ${isActive 
                ? "text-primary"
                : "text-foreground/70 hover:text-foreground"
              }
            `}
          >
            {({ isActive }) => (
              <>
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNavItem"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </div>
  );
};
