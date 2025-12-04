"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ChatPanel } from "@/components/ChatPanel";
import { CanvasPanel } from "@/components/CanvasPanel";
import { cn } from "@/lib/utils";

interface PageProps {
  params: { conversationId: string };
}

export default function ChatPage({ params }: PageProps) {
  const [activeCanvas, setActiveCanvas] = useState(false);

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Chat Panel */}
      <div
        className={cn(
          "flex flex-col transition-all duration-300 ease-in-out",
          activeCanvas
            ? "w-[40%] min-w-[400px] hidden lg:flex"
            : "w-full"
        )}
      >
        <ChatPanel
          onOpenCanvas={() => setActiveCanvas(true)}
          conversationId={params.conversationId}
        />
      </div>

      {/* Canvas Panel */}
      <AnimatePresence>
        {activeCanvas && (
          <div className="flex-1 h-full overflow-hidden border-l border-border">
            <CanvasPanel onClose={() => setActiveCanvas(false)} />
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Canvas - Full screen overlay */}
      <AnimatePresence>
        {activeCanvas && (
          <div className="lg:hidden fixed inset-0 z-50 bg-background">
            <CanvasPanel onClose={() => setActiveCanvas(false)} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
