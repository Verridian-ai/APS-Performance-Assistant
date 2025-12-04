"use client";

import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-6 w-6 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-11 w-11 text-base",
};

export function Avatar({ src, alt, fallback, size = "md", className }: AvatarProps) {
  const initials = fallback || alt?.charAt(0).toUpperCase() || "?";

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-xl",
        "bg-muted items-center justify-center font-medium text-muted-foreground",
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

// Special styled avatars for the chat
export function UserAvatar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
        "bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-sm",
        "shadow-lg shadow-blue-500/20",
        className
      )}
    >
      U
    </div>
  );
}

export function AssistantAvatar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
        "bg-gradient-to-br from-violet-500 to-purple-600 text-white",
        "shadow-lg shadow-violet-500/20",
        className
      )}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    </div>
  );
}

