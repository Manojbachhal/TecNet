import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { CloudCog, Target } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

export default function Auth() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  
  // Check if user is already authenticated
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/inventory');
      }
    };
    
    checkSession();
  }, [navigate]);
  
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (mode === 'signin') {
        // Sign in with email and password
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        
        navigate('/inventory');
      } else {
        // Validate passwords match for signup
        if (password !== confirmPassword) {
          toast({
            title: "Passwords don't match",
            description: "Please make sure your passwords match.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        // Validate password strength
        if (password.length < 8) {
          toast({
            title: "Password too short",
            description: "Password must be at least 8 characters long.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        // Sign up with email and password
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Account created",
          description: "Check your email for the confirmation link.",
        });
        
        // Switch to sign in mode after successful signup
        setMode('signin');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication failed",
        description: error.message || "An error occurred during authentication",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 auth-background">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted opacity-90"></div>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/10"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <motion.div 
            className="text-3xl font-bold flex items-center floating-logo"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Target className="h-8 w-8 text-purple-500 mr-2" />
            <span className="text-purple-500">Tac</span>
            <span className="text-foreground">Net</span>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="auth-card border-primary/20 bg-card/30">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center animated-gradient-text">
                {mode === 'signin' ? 'Sign In' : 'Create an Account'}
              </CardTitle>
              <CardDescription className="text-center text-foreground/70">
                {mode === 'signin' 
                  ? 'Enter your credentials to access your inventory' 
                  : 'Sign up for a new account to manage your firearms'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="your.email@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="auth-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password"
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="auth-input"
                  />
                  {mode === 'signup' && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Password must be at least 8 characters long
                    </div>
                  )}
                </div>
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input 
                      id="confirmPassword"
                      type="password" 
                      placeholder="••••••••" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="auth-input"
                    />
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full mt-6 glow-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                      Processing...
                    </>
                  ) : (
                    mode === 'signin' ? 'Sign In' : 'Sign Up'
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="text-center text-sm mt-2">
                {mode === 'signin' ? (
                  <p>
                    Don't have an account?{' '}
                    <button 
                      type="button"
                      onClick={switchMode}
                      className="text-primary underline hover:text-primary/80 font-medium"
                    >
                      Sign up
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button 
                      type="button"
                      onClick={switchMode}
                      className="text-primary underline hover:text-primary/80 font-medium"
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
