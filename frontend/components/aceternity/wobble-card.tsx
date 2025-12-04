"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

export const WobbleCard = ({
  children,
  containerClassName,
  className,
}: {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left - width / 2) / 25;
    const y = (clientY - top - height / 2) / 25;
    setMousePosition({ x, y });
  };

  return (
    <motion.section
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      style={{
        transform: isHovering
          ? `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) scale3d(1.02, 1.02, 1)`
          : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
        transition: "transform 0.15s ease-out",
      }}
      className={cn(
        "relative rounded-2xl overflow-hidden",
        containerClassName
      )}
    >
      <div
        className="relative h-full"
        style={{
          transform: isHovering
            ? `translate3d(${-mousePosition.x * 1.5}px, ${-mousePosition.y * 1.5}px, 0)`
            : "translate3d(0px, 0px, 0)",
          transition: "transform 0.15s ease-out",
        }}
      >
        <div className={cn("relative h-full", className)}>
          {children}
        </div>
      </div>

      {/* Gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isHovering
            ? `radial-gradient(circle at ${mousePosition.x * 20 + 50}% ${mousePosition.y * 20 + 50}%, rgba(212, 175, 55, 0.15) 0%, transparent 50%)`
            : "none",
        }}
      />
    </motion.section>
  );
};

// Simpler hover card with tilt effect
export const TiltCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = ((clientY - top) / height - 0.5) * 10;
    const y = ((clientX - left) / width - 0.5) * -10;
    setRotate({ x, y });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotate.x,
        rotateY: rotate.y,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ transformStyle: "preserve-3d" }}
      className={cn(
        "relative rounded-2xl glass-card p-6 cursor-pointer",
        className
      )}
    >
      <div style={{ transform: "translateZ(50px)" }}>{children}</div>
    </motion.div>
  );
};

