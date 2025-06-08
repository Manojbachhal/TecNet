
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <LogoIcon />
      <LogoText />
    </Link>
  );
};

const LogoIcon = ({ className }: { className?: string }) => (
  <div className={cn("relative h-8 w-8", className)}>
    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-purple-800 shadow-lg" />
    <div className="absolute inset-1 rounded-full bg-black/80" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-glow-sm" />
    </div>
    <div className="absolute inset-0 rounded-full ring-1 ring-white/10" />
  </div>
);

const LogoText = ({ className }: { className?: string }) => (
  <span className={cn("text-xl font-bold text-white", className)}>
    TacNet<span className="text-sm text-purple-400">™</span>
  </span>
);
