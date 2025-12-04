"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const GlowingEffect = ({
  children,
  className,
  containerClassName,
  blur = 20,
  spread = 40,
  glow = true,
  disabled = false,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  blur?: number;
  spread?: number;
  glow?: boolean;
  disabled?: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    if (!disabled) setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn("relative overflow-hidden", containerClassName)}
    >
      {/* Glow effect */}
      {glow && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300"
          style={{
            opacity,
            background: `radial-gradient(${spread}px circle at ${position.x}px ${position.y}px, rgba(212, 175, 55, 0.4), transparent 40%)`,
            filter: `blur(${blur}px)`,
          }}
        />
      )}

      {/* Border glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[inherit]"
        style={{
          opacity,
          background: `radial-gradient(${spread * 2}px circle at ${position.x}px ${position.y}px, rgba(212, 175, 55, 0.3), transparent 40%)`,
        }}
      />

      <div className={cn("relative", className)}>{children}</div>
    </div>
  );
};

// Animated border glow that follows the perimeter
export const MovingBorder = ({
  children,
  duration = 2000,
  className,
  containerClassName,
  borderClassName,
  as: Component = "div",
  ...props
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  as?: React.ElementType;
  [key: string]: unknown;
}) => {
  return (
    <Component
      className={cn(
        "relative p-[1px] overflow-hidden rounded-2xl",
        containerClassName
      )}
      {...props}
    >
      {/* Animated border */}
      <div
        className={cn(
          "absolute inset-0",
          borderClassName
        )}
        style={{
          background: `linear-gradient(90deg, transparent, #D4AF37, #F5D061, #D4AF37, transparent)`,
          backgroundSize: "200% 100%",
          animation: `movingBorder ${duration}ms linear infinite`,
        }}
      />

      {/* Content */}
      <div
        className={cn(
          "relative rounded-[inherit] bg-background",
          className
        )}
      >
        {children}
      </div>

      <style jsx>{`
        @keyframes movingBorder {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </Component>
  );
};

