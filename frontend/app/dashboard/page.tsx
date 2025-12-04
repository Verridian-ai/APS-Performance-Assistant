"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Plus,
  BarChart2,
  CheckCircle,
  Files,
  Sparkles
} from "lucide-react";
import { CircuitLines, TiltCard } from "@/components/aceternity";

export default function Dashboard() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Circuit background */}
      <CircuitLines className="opacity-30" />

      {/* Background decorations - Gold theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto p-6 lg:p-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            {/* Logo with 3D shadow */}
            <div className="relative h-16 w-16 rounded-xl overflow-hidden shadow-logo border border-primary/20">
              {/* Top highlight */}
              <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/15 to-transparent z-10 pointer-events-none" />
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text-gold">Dashboard</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Track your performance goals and career progress
              </p>
            </div>
          </div>
          <Link
            href="/chat/new"
            className={cn(
              "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl",
              "bg-gradient-to-b from-primary to-amber-600 text-primary-foreground font-medium text-sm",
              "shadow-button-3d transition-all duration-200"
            )}
          >
            <Sparkles className="h-4 w-4" />
            New Project
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard delay={0.1} title="Active Goals" value="0" icon={<BarChart2 className="h-7 w-7 text-primary" />} change="Set your first performance goal" />
          <StatCard delay={0.2} title="Completed" value="0" icon={<CheckCircle className="h-7 w-7 text-emerald-400" />} change="No completed goals yet" />
          <StatCard delay={0.3} title="Assessments" value="0" icon={<Files className="h-7 w-7 text-secondary" />} change="Start your self-assessment" />
        </div>

        {/* Empty State */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-semibold mb-4">Performance & Goals</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Create New Card - Featured with TiltCard */}
            <TiltCard className="min-h-[220px] border-2 border-dashed border-primary/30 hover:border-primary/50">
              <Link
                href="/chat/new"
                className="flex flex-col items-center justify-center gap-4 h-full group"
              >
                <div className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-2xl",
                  "bg-gradient-to-br from-primary/20 to-accent/20",
                  "group-hover:from-primary/30 group-hover:to-accent/30",
                  "transition-all duration-300"
                )}>
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <span className="font-semibold text-lg block mb-1">New Performance Goal</span>
                  <span className="text-sm text-muted-foreground">Start setting goals for your next cycle</span>
                </div>
              </Link>
            </TiltCard>

            {/* Placeholder cards */}
            <div className="glass-card p-6 rounded-2xl opacity-50 min-h-[220px] flex items-center justify-center border border-primary/10">
              <p className="text-sm text-muted-foreground text-center">
                Your goals and assessments will appear here
              </p>
            </div>
            <div className="glass-card p-6 rounded-2xl opacity-30 min-h-[220px] hidden lg:flex items-center justify-center border border-primary/10">
              <p className="text-sm text-muted-foreground text-center">
                Track your APS career progress
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  change,
  delay = 0,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-5 rounded-2xl hover:scale-[1.02] transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl glass">{icon}</div>
        <span className="text-3xl font-bold gradient-text">{value}</span>
      </div>
      <h3 className="font-medium">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{change}</p>
    </motion.div>
  );
}
