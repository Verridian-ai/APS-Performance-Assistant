"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AssistantAvatar } from "./Avatar";
import { Loader2, Brain, Sparkles } from "lucide-react";

interface TypingIndicatorProps {
  className?: string;
  showAvatar?: boolean;
}

export function TypingIndicator({ className, showAvatar = true }: TypingIndicatorProps) {
  return (
    <div className={cn("flex items-start gap-4 py-4", className)}>
      {showAvatar && <AssistantAvatar />}
      <div className="flex items-center gap-1.5 py-3 px-4 rounded-2xl glass-card">
        <motion.span
          className="h-2 w-2 rounded-full bg-violet-500"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
        />
        <motion.span
          className="h-2 w-2 rounded-full bg-violet-500"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        />
        <motion.span
          className="h-2 w-2 rounded-full bg-violet-500"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
        />
      </div>
    </div>
  );
}

// Thinking indicator with shimmer effect for "deep thinking" mode
export function ThinkingIndicator({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-start gap-4 py-4", className)}>
      <div className="relative">
        <AssistantAvatar />
        {/* Pulsing glow ring */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 blur-md"
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="h-4 w-4 text-violet-400" />
          </motion.div>
          <span>Thinking deeply...</span>
          <Sparkles className="h-3 w-3 text-violet-400" />
        </div>
        <motion.div
          className="h-4 w-48 rounded-lg glass"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className="h-4 w-32 rounded-lg glass"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
        />
      </div>
    </div>
  );
}

