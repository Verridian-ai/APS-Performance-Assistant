"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const { register, error, clearError, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError(null);

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
        setValidationError("Password must be at least 6 characters");
        return;
    }

    await register(email, password, fullName);
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-background circuit-pattern overflow-hidden p-4 selection:bg-primary selection:text-primary-foreground">
       {/* Floating Orbs for ambient glow */}
       <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
       <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card p-8 md:p-10 w-full">
          <div className="text-center mb-8">
             <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 shadow-logo rotate-3"
             >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-primary-foreground">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            </motion.div>
            <h2 className="text-3xl font-bold tracking-tight gradient-text-gold mb-2">
              Create Account
            </h2>
            <p className="text-sm text-muted-foreground text-balance">
              Join the Broadband Advancement Assistant
            </p>
          </div>
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            {(error || validationError) && (
               <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive text-center font-medium"
              >
                {error || validationError}
              </motion.div>
            )}
            
            <div>
               <label htmlFor="full-name" className="block text-sm font-medium leading-6 text-foreground">
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="full-name"
                  name="full_name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full rounded-xl border border-input bg-background/50 py-2.5 px-3 text-foreground shadow-sm placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm sm:leading-6 transition-all duration-200"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email-address" className="block text-sm font-medium leading-6 text-foreground">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-input bg-background/50 py-2.5 px-3 text-foreground shadow-sm placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm sm:leading-6 transition-all duration-200"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-foreground">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-input bg-background/50 py-2.5 px-3 text-foreground shadow-sm placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm sm:leading-6 transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-foreground">
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  id="confirm-password"
                  name="confirm_password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-xl border border-input bg-background/50 py-2.5 px-3 text-foreground shadow-sm placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm sm:leading-6 transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-xl bg-primary px-3 py-3 text-sm font-bold text-primary-foreground shadow-button-3d hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 transform active:scale-[0.98]"
              >
                 {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </form>

           <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-primary hover:text-accent transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
