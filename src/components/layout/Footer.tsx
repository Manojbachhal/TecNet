
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Mail,
  Github,
  Heart,
  Shield,
  Info,
  FileText,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t border-primary/10 pt-10 pb-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">TacNet™</h3>
            <p className="text-sm text-muted-foreground">
              Your comprehensive tactical network for firearms enthusiasts and range finders.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="mailto:info@tacnet.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</Link>
              </li>
              <li>
                <Link to="/range-finder" className="text-sm text-muted-foreground hover:text-primary transition-colors">Range Finder</Link>
              </li>
              <li>
                <Link to="/ballistics" className="text-sm text-muted-foreground hover:text-primary transition-colors">Ballistics</Link>
              </li>
              <li>
                <Link to="/news" className="text-sm text-muted-foreground hover:text-primary transition-colors">News</Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center">
                  <Info className="mr-2 h-4 w-4" />
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
          <p>© {currentYear} TacNet™ | All Rights Reserved</p>
          <p className="mt-2 md:mt-0 flex items-center">
            Made with <Heart className="h-3 w-3 mx-1 text-red-500" /> by <a href="https://github.com/tacnet" target="_blank" rel="noopener noreferrer" className="ml-1 inline-flex items-center hover:text-primary"><Github className="h-3 w-3 mr-1" /> TacNet Team</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
