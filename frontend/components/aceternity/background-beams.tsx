"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const BackgroundBeams = ({
  className,
}: {
  className?: string;
}) => {
  const beams = [
    { initialX: 10, translateX: 10, duration: 7, repeatDelay: 3, delay: 2, className: "h-px" },
    { initialX: 600, translateX: 600, duration: 3, repeatDelay: 3, delay: 4, className: "h-px" },
    { initialX: 100, translateX: 100, duration: 7, repeatDelay: 7, className: "h-px" },
    { initialX: 400, translateX: 400, duration: 5, repeatDelay: 14, delay: 4, className: "h-px" },
    { initialX: 800, translateX: 800, duration: 11, repeatDelay: 2, className: "h-px" },
    { initialX: 1000, translateX: 1000, duration: 4, repeatDelay: 2, className: "h-px" },
    { initialX: 1200, translateX: 1200, duration: 6, repeatDelay: 4, delay: 2, className: "h-px" },
  ];

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {/* SVG filter for glow */}
      <svg className="absolute h-0 w-0">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {beams.map((beam, index) => (
        <motion.div
          key={index}
          initial={{ translateY: "-100%", translateX: beam.initialX }}
          animate={{ translateY: "200vh", translateX: beam.translateX }}
          transition={{
            duration: beam.duration,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            delay: beam.delay || 0,
            repeatDelay: beam.repeatDelay,
          }}
          className={cn(
            "absolute left-0 top-0 w-px bg-gradient-to-b from-transparent via-primary to-transparent",
            beam.className
          )}
          style={{
            height: "15vh",
            filter: "url(#glow)",
          }}
        />
      ))}

      {/* Horizontal beams */}
      {[0, 1, 2].map((index) => (
        <motion.div
          key={`h-${index}`}
          initial={{ translateX: "-100%", translateY: 100 + index * 200 }}
          animate={{ translateX: "200vw", translateY: 100 + index * 200 }}
          transition={{
            duration: 8 + index * 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            delay: index * 3,
            repeatDelay: 5,
          }}
          className="absolute top-0 left-0 h-px w-32 bg-gradient-to-r from-transparent via-accent to-transparent"
          style={{
            filter: "url(#glow)",
          }}
        />
      ))}
    </div>
  );
};

// Circuit-style animated lines
export const CircuitLines = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {/* Vertical pulsing lines */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent"
          style={{
            left: `${15 + i * 15}%`,
            height: "100%",
          }}
          animate={{
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Horizontal pulsing lines */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"
          style={{
            top: `${20 + i * 20}%`,
            width: "100%",
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.7,
          }}
        />
      ))}

      {/* Glowing nodes at intersections */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`node-${i}`}
          className="absolute w-1 h-1 rounded-full bg-primary"
          style={{
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

