
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="bg-background border-t border-primary/10 py-2 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center text-xs">
        <p className="text-xs text-center text-gray-500">
          <span className="text-primary font-semibold">TacNet™</span> | Range Finder © {currentYear}
        </p>
        <div className="mt-1 md:mt-0 flex gap-3 text-xs text-gray-500">
          <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
          <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
          <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
