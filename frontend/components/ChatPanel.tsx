"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useConversations, Message } from "@/lib/conversations";
import { UserAvatar, AssistantAvatar } from "./ui/Avatar";
import { TypingIndicator } from "./ui/TypingIndicator";
import { IconButton } from "./ui/Button";
import Image from "next/image";
import {
  SendIcon,
  PaperclipIcon,
  CopyIcon,
  RefreshIcon,
  Sparkles,
  FileText,
  Search,
  Pencil,
  CheckCircle,
  ChevronRight
} from "./ui/Icons";
import { CircuitLines } from "./aceternity";

interface ChatPanelProps {
  onOpenCanvas: () => void;
  conversationId?: string;
}

export function ChatPanel({ onOpenCanvas, conversationId }: ChatPanelProps) {
  const { conversations, currentConversation, addMessage, createConversation, setCurrentConversation } = useConversations();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync messages from current conversation
  useEffect(() => {
    if (conversationId) {
      const conv = conversations.find((c) => c.id === conversationId);
      if (conv) {
        setLocalMessages(conv.messages);
        setCurrentConversation(conversationId);
      }
    }
  }, [conversationId, conversations, setCurrentConversation]);

  // Get current active conversation ID
  const activeConversationId = conversationId || currentConversation?.id;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages, isTyping]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Enhance Prompt Handler
  const handleEnhancePrompt = async () => {
    if (!input.trim()) return;
    setIsEnhancing(true);
    try {
      const response = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      
      if (!response.ok) throw new Error("Enhancement failed");
      
      const data = await response.json();
      // Replace input with enhanced version
      setInput(data.enhanced_prompt);
      // Focus back on textarea
      textareaRef.current?.focus();
    } catch (error) {
      console.error("Enhance error:", error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Create conversation if needed
    let convId = activeConversationId;
    if (!convId) {
      const newConv = createConversation();
      convId = newConv.id;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    // Add to local state and conversation store
    setLocalMessages((prev) => [...prev, userMessage]);
    addMessage(convId, userMessage);
    setInput("");
    setIsTyping(true);

    try {
      // Build message history for API
      const apiMessages = [...localMessages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Call the chat API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: apiMessages,
          conversation_id: convId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message.content,
        timestamp: new Date(),
        artifact: data.artifact
          ? {
              id: data.artifact.id,
              title: data.artifact.title,
              type: data.artifact.type as "document" | "code" | "table",
            }
          : undefined,
      };

      setLocalMessages((prev) => [...prev, aiMessage]);
      addMessage(convId, aiMessage);
    } catch (error) {
      console.error("Chat error:", error);
      // Fallback error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setLocalMessages((prev) => [...prev, errorMessage]);
      addMessage(convId, errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasMessages = localMessages.length > 0;

  return (
    <div className="flex flex-col h-full w-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {hasMessages ? (
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            <AnimatePresence initial={false}>
              {localMessages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onArtifactClick={onOpenCanvas}
                />
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <TypingIndicator />
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        ) : (
          <WelcomeScreen onSuggestionClick={setInput} />
        )}
      </div>

      {/* Input Area */}
      <div className="p-4">
        <div className="max-w-3xl mx-auto">
          <div
            className={cn(
              "relative flex items-end gap-2 rounded-2xl",
              "glass-card transition-all duration-300 border border-primary/10",
              "focus-within:border-primary/30 focus-within:glow-gold"
            )}
          >
            {/* Attachment Button */}
            <IconButton
              className="ml-2 mb-2 hover:text-primary"
              title="Attach file"
            >
              <PaperclipIcon className="h-5 w-5" />
            </IconButton>

            {/* Enhance Button */}
            <IconButton
              onClick={handleEnhancePrompt}
              disabled={!input.trim() || isEnhancing}
              className={cn(
                "mb-2 hover:text-amber-500 transition-colors",
                isEnhancing && "animate-pulse text-amber-500"
              )}
              title="Enhance Prompt (AI Architect)"
            >
              <Sparkles className="h-5 w-5" />
            </IconButton>

            {/* Text Input */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about KPIs, performance goals, APS levels..."
              rows={1}
              className={cn(
                "flex-1 resize-none bg-transparent py-4 pr-2",
                "text-sm placeholder:text-muted-foreground",
                "focus:outline-none",
                "max-h-[200px]"
              )}
            />

            {/* Send Button with 3D effect */}
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={cn(
                "mr-2 mb-2 p-2.5 rounded-xl transition-all duration-200",
                input.trim()
                  ? "bg-gradient-to-b from-primary to-amber-600 text-primary-foreground shadow-button-3d hover:shadow-elevated"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              <SendIcon className="h-5 w-5" />
            </button>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-2">
            AI responses are guidance only. Verify with official APS frameworks.
          </p>
        </div>
      </div>
    </div>
  );
}

// Welcome screen for empty chat state
function WelcomeScreen({ onSuggestionClick }: { onSuggestionClick: (text: string) => void }) {
  const suggestions = [
    { icon: FileText, text: "Help me write SMART goals for my performance agreement", color: "from-primary to-accent" },
    { icon: Sparkles, text: "What are the key capabilities for APS Level 6?", color: "from-primary to-accent" },
    { icon: Search, text: "How do I demonstrate leadership at my current level?", color: "from-secondary to-silver" },
    { icon: Pencil, text: "Review my self-assessment for my performance cycle", color: "from-secondary to-silver" },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-12 relative">
      {/* Circuit background effect */}
      <CircuitLines className="opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl relative z-10"
      >
        {/* Logo - 3D Pop Effect */}
        <div className="flex justify-center mb-6">
          <motion.div
            className="relative"
            initial={{ scale: 0.9, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {/* Logo image with realistic 3D shadow */}
            <div className="relative h-32 w-32 rounded-2xl overflow-hidden shadow-logo animate-float border border-primary/20">
              {/* Top highlight reflection */}
              <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent z-10 pointer-events-none" />
              <Image
                src="/logo.png"
                alt="APS Assistant Logo"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>

        <h1 className="text-3xl font-bold mb-3 gradient-text-gold">
          How can I help you today?
        </h1>
        <p className="text-muted-foreground mb-8">
          Your AI assistant for APS performance, career advancement, and achieving higher KPIs.
        </p>

        {/* Suggestion cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestions.map((suggestion, i) => {
            const Icon = suggestion.icon;
            return (
              <motion.button
                key={i}
                onClick={() => onSuggestionClick(suggestion.text)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl text-left group",
                  "glass-card hover:scale-[1.02] transition-all duration-300",
                  "hover:glow-gold border border-transparent hover:border-primary/20"
                )}
              >
                <div className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  "bg-gradient-to-br shadow-lg",
                  suggestion.color,
                  i < 2 ? "text-primary-foreground" : "text-foreground"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm">{suggestion.text}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all ml-auto" />
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  onArtifactClick: () => void;
}

function MessageBubble({ message, onArtifactClick }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("group flex gap-4", isUser && "flex-row-reverse")}
    >
      {/* Avatar */}
      {isUser ? <UserAvatar /> : <AssistantAvatar />}

      {/* Content */}
      <div className={cn("flex-1 space-y-3", isUser && "flex flex-col items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white max-w-[85%] shadow-lg shadow-violet-500/20"
              : "glass-card max-w-full"
          )}
        >
          <div className="space-y-2">
            {message.content.split("\n").map((line, i) => (
              <p key={i} className={line.startsWith("•") ? "ml-2" : ""}>
                {formatLine(line)}
              </p>
            ))}
          </div>
        </div>

        {/* Artifact Card */}
        {message.artifact && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={onArtifactClick}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl cursor-pointer",
              "glass-card hover:scale-[1.02]",
              "transition-all duration-300",
              "max-w-[320px] group/artifact"
            )}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/20">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{message.artifact.title}</p>
              <p className="text-xs text-muted-foreground">Click to open in Canvas</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover/artifact:text-primary group-hover/artifact:translate-x-1 transition-all" />
          </motion.div>
        )}

        {/* Action Buttons */}
        {!isUser && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <IconButton onClick={handleCopy} title={copied ? "Copied!" : "Copy"}>
              {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
            </IconButton>
            <IconButton title="Regenerate">
              <RefreshIcon />
            </IconButton>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function formatLine(line: string) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
