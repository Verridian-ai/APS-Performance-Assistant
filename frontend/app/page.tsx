"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  MessageSquare,
  Home as HomeIcon,
  FileText,
  Search,
  Pencil,
  Zap,
  LogIn,
  UserPlus
} from "lucide-react";
import { CircuitLines, TiltCard } from "@/components/aceternity";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
         <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Circuit pattern background */}
      <CircuitLines className="opacity-50" />

      {/* Background decorations - Gold/Amber theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-8 max-w-3xl w-full text-center relative z-10"
      >
        {/* Logo - 3D Pop Effect */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative"
        >
          {/* Logo image - Large with realistic 3D shadow */}
          <div className="relative h-40 w-40 rounded-3xl overflow-hidden shadow-logo animate-float border border-primary/20 bg-gradient-to-br from-white/10 to-transparent">
            {/* Top highlight reflection */}
            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent z-10 pointer-events-none" />
            <Image
              src="/logo.png"
              alt="APS Assistant Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        {/* Title */}
        <div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            <span className="gradient-text-gold">APS Performance Assistant</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Your AI-powered companion for Australian Public Service career advancement,
            KPI achievement, and performance excellence.
          </p>
        </div>

        {/* Feature Cards with TiltCard effect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TiltCard className="h-full">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Performance Goals</h3>
                <p className="text-sm text-muted-foreground">Create SMART goals and KPIs aligned to your APS level</p>
              </div>
            </TiltCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <TiltCard className="h-full">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Career Guidance</h3>
                <p className="text-sm text-muted-foreground">Understand requirements for promotion and pay advancement</p>
              </div>
            </TiltCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <TiltCard className="h-full">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                  <Pencil className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">Self-Assessment</h3>
                <p className="text-sm text-muted-foreground">Draft and refine your performance review responses</p>
              </div>
            </TiltCard>
          </motion.div>
        </div>

        {/* CTA Buttons - 3D Effect */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 mt-6"
        >
          {user ? (
            <>
              <Link
                href="/chat/new"
                className={cn(
                  "inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl",
                  "bg-gradient-to-b from-primary to-amber-600 text-primary-foreground font-medium",
                  "shadow-button-3d hover:shadow-elevated",
                  "transition-all duration-200"
                )}
              >
                <MessageSquare className="h-5 w-5" />
                Start New Chat
              </Link>
              <Link
                href="/dashboard"
                className={cn(
                  "inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl",
                  "glass-card font-medium border border-primary/20",
                  "shadow-card-3d transition-all duration-200"
                )}
              >
                <HomeIcon className="h-5 w-5" />
                Go to Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  "inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl",
                  "bg-gradient-to-b from-primary to-amber-600 text-primary-foreground font-medium",
                  "shadow-button-3d hover:shadow-elevated",
                  "transition-all duration-200"
                )}
              >
                <LogIn className="h-5 w-5" />
                Sign In
              </Link>
              <Link
                href="/register"
                className={cn(
                  "inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl",
                  "glass-card font-medium border border-primary/20",
                  "shadow-card-3d transition-all duration-200"
                )}
              >
                <UserPlus className="h-5 w-5" />
                Create Account
              </Link>
            </>
          )}
        </motion.div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground mt-8 flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          Powered by AI to help you excel in the Australian Public Service
        </p>
      </motion.div>
    </main>
  );
}
