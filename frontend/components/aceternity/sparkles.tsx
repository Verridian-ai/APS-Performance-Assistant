"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

interface SparkleProps {
  id: string;
  x: string;
  y: string;
  color: string;
  delay: number;
  scale: number;
  duration: number;
}

const generateSparkle = (): SparkleProps => {
  return {
    id: Math.random().toString(36).substr(2, 9),
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    color: Math.random() > 0.5 ? "#D4AF37" : "#F5D061", // Gold colors
    delay: Math.random() * 2,
    scale: Math.random() * 0.5 + 0.5,
    duration: Math.random() * 1 + 1,
  };
};

const Sparkle = ({ x, y, color, delay, scale, duration }: Omit<SparkleProps, "id">) => {
  return (
    <motion.svg
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      width={24 * scale}
      height={24 * scale}
      viewBox="0 0 24 24"
      fill="none"
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, scale, 0],
        rotate: [0, 180],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 3 + 1,
        ease: "easeInOut",
      }}
    >
      <path
        d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
        fill={color}
      />
    </motion.svg>
  );
};

export const SparklesCore = ({
  className,
  background,
  minSize = 0.4,
  maxSize = 1,
  particleDensity = 50,
  particleColor = "#D4AF37",
  particleSpeed = 1,
}: {
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  particleColor?: string;
  particleSpeed?: number;
}) => {
  const [sparkles, setSparkles] = useState<SparkleProps[]>([]);

  useEffect(() => {
    const newSparkles = Array.from({ length: particleDensity }, () => generateSparkle());
    setSparkles(newSparkles);
  }, [particleDensity]);

  return (
    <div
      className={cn("absolute inset-0 overflow-hidden", className)}
      style={{ background }}
    >
      {sparkles.map((sparkle) => (
        <Sparkle key={sparkle.id} {...sparkle} />
      ))}
    </div>
  );
};

// Simplified sparkles that wrap content
export const Sparkles = ({
  children,
  className,
  sparklesCount = 15,
}: {
  children: React.ReactNode;
  className?: string;
  sparklesCount?: number;
}) => {
  const [sparkles, setSparkles] = useState<SparkleProps[]>([]);

  useEffect(() => {
    const newSparkles = Array.from({ length: sparklesCount }, () => generateSparkle());
    setSparkles(newSparkles);

    // Regenerate sparkles periodically
    const interval = setInterval(() => {
      setSparkles((prev) => {
        const updated = [...prev];
        const indexToUpdate = Math.floor(Math.random() * updated.length);
        updated[indexToUpdate] = generateSparkle();
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sparklesCount]);

  return (
    <span className={cn("relative inline-block", className)}>
      <span className="relative z-10">{children}</span>
      {sparkles.map((sparkle) => (
        <Sparkle key={sparkle.id} {...sparkle} />
      ))}
    </span>
  );
};

