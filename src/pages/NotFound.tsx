
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <motion.div
          className="flex items-center justify-center mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Shield className="h-12 w-12 text-primary mr-2" />
          <h1 className="text-3xl font-bold">
            <span className="text-primary">Ammo</span>
            <span className="text-foreground">Alley</span>
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-4xl font-bold mb-4 text-foreground">404</h2>
          <p className="text-xl text-muted-foreground mb-6">
            Oops! Page not found
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center justify-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Return to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
