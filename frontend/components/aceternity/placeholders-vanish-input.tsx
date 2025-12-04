"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
  className,
}: {
  placeholders: string[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (value: string) => void;
  className?: string;
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [value, setValue] = useState("");
  const [animating, setAnimating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Rotate placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholders.length]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!value.trim() || animating) return;
      
      setAnimating(true);
      
      // Vanish animation
      if (canvasRef.current && inputRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = inputRef.current.offsetWidth;
          canvas.height = inputRef.current.offsetHeight;
          
          ctx.font = getComputedStyle(inputRef.current).font;
          ctx.fillStyle = getComputedStyle(inputRef.current).color;
          ctx.textBaseline = "middle";
          ctx.fillText(value, 0, canvas.height / 2);
        }
      }

      setTimeout(() => {
        onSubmit?.(value);
        setValue("");
        setAnimating(false);
      }, 500);
    },
    [value, animating, onSubmit]
  );

  return (
    <form
      className={cn(
        "relative w-full rounded-2xl overflow-hidden glass-card",
        className
      )}
      onSubmit={handleSubmit}
    >
      <canvas
        ref={canvasRef}
        className={cn(
          "absolute inset-0 pointer-events-none opacity-0",
          animating && "animate-vanish opacity-100"
        )}
      />
      
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onChange?.(e);
          }}
          className={cn(
            "w-full bg-transparent py-4 px-6 text-foreground placeholder-transparent focus:outline-none",
            animating && "opacity-0"
          )}
        />
        
        {/* Animated placeholder */}
        {!value && (
          <div className="absolute left-6 pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentPlaceholder}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.5, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-muted-foreground"
              >
                {placeholders[currentPlaceholder]}
              </motion.p>
            </AnimatePresence>
          </div>
        )}

        {/* Submit button */}
        <motion.button
          type="submit"
          disabled={!value.trim() || animating}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "absolute right-3 p-2 rounded-xl transition-all",
            value.trim()
              ? "bg-gradient-to-r from-primary to-accent text-primary-foreground glow-gold"
              : "bg-muted text-muted-foreground"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </motion.button>
      </div>
    </form>
  );
}

