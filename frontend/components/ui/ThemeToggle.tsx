"use client";

import { useContext, createContext, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Try to import useTheme, but provide fallback
let useThemeFromProvider: () => { theme: string; toggleTheme: () => void } | undefined;
try {
  const mod = require("@/components/ThemeProvider");
  useThemeFromProvider = mod.useTheme;
} catch {
  useThemeFromProvider = undefined;
}

interface ThemeToggleProps {
  className?: string;
}

function useThemeSafe() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for class on html element
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return { theme, toggleTheme, mounted };
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useThemeSafe();

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-xl",
        "glass-subtle hover:bg-sidebar-hover transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        className
      )}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <div className="relative h-5 w-5">
        {/* Sun icon */}
        <motion.svg
          className="absolute inset-0 h-5 w-5 text-amber-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{
            scale: theme === "light" ? 1 : 0,
            rotate: theme === "light" ? 0 : 90,
            opacity: theme === "light" ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </motion.svg>

        {/* Moon icon - Blue */}
        <motion.svg
          className="absolute inset-0 h-5 w-5 text-blue-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{
            scale: theme === "dark" ? 1 : 0,
            rotate: theme === "dark" ? 0 : -90,
            opacity: theme === "dark" ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </motion.svg>
      </div>
    </button>
  );
}

// Larger toggle for settings or header
export function ThemeToggleLarge({ className }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useThemeSafe();

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative flex items-center gap-3 px-4 py-2.5 rounded-xl",
        "glass-subtle hover:bg-sidebar-hover transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        "text-sm font-medium",
        className
      )}
    >
      <div className="relative h-5 w-5">
        <motion.svg
          className="absolute inset-0 h-5 w-5 text-amber-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          animate={{
            scale: theme === "light" ? 1 : 0,
            opacity: theme === "light" ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </motion.svg>
        <motion.svg
          className="absolute inset-0 h-5 w-5 text-blue-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          animate={{
            scale: theme === "dark" ? 1 : 0,
            opacity: theme === "dark" ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </motion.svg>
      </div>
      <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
    </button>
  );
}

