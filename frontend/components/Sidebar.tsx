"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useConversations, getDateGroup } from "@/lib/conversations";
import {
  PlusIcon,
  MessageSquareIcon,
  Home,
  MessagesSquare
} from "./ui/Icons";
import { ThemeToggle } from "./ui/ThemeToggle";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { conversations, createConversation } = useConversations();

  // Group conversations by date
  const groupedConversations = conversations.reduce(
    (acc, conv) => {
      const group = getDateGroup(conv.updatedAt);
      if (!acc[group]) acc[group] = [];
      acc[group].push({
        id: conv.id,
        title: conv.title,
        date: group,
      });
      return acc;
    },
    {} as Record<string, { id: string; title: string; date: string }[]>
  );

  const todayConvos = groupedConversations["Today"] || [];
  const yesterdayConvos = groupedConversations["Yesterday"] || [];
  const olderConvos = groupedConversations["Previous 7 Days"] || [];

  const hasConversations = conversations.length > 0;

  const handleNewChat = () => {
    const newConvo = createConversation();
    router.push(`/chat/${newConvo.id}`);
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-screen",
        "w-[280px] shrink-0 transition-all duration-300 ease-in-out",
        "fixed lg:relative z-40",
        "glass border-r border-white/10",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* Header with Logo and New Chat */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3 p-2 rounded-xl mb-4">
          {/* Logo with 3D shadow */}
          <div className="relative h-12 w-12 rounded-xl overflow-hidden shadow-logo border border-primary/20">
            {/* Top highlight */}
            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/15 to-transparent z-10 pointer-events-none" />
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-semibold text-lg gradient-text-gold">APS Performance</span>
        </div>

        <button
          onClick={handleNewChat}
          className={cn(
            "flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl",
            "bg-gradient-to-b from-primary to-amber-600",
            "text-primary-foreground font-medium text-sm",
            "shadow-button-3d transition-all duration-200",
            "group"
          )}
        >
          <PlusIcon className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Conversation History */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 scrollbar-hide">
        {hasConversations ? (
          <div className="space-y-4">
            {todayConvos.length > 0 && (
              <ConversationGroup title="Today" conversations={todayConvos} currentPath={pathname} />
            )}
            {yesterdayConvos.length > 0 && (
              <ConversationGroup title="Yesterday" conversations={yesterdayConvos} currentPath={pathname} />
            )}
            {olderConvos.length > 0 && (
              <ConversationGroup title="Previous 7 Days" conversations={olderConvos} currentPath={pathname} />
            )}
          </div>
        ) : (
          <EmptyState />
        )}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 space-y-2">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm",
            "text-muted-foreground hover:text-foreground",
            "hover:bg-white/5 transition-all duration-200"
          )}
        >
          <Home className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>

        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-xs text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mb-4">
        <MessagesSquare className="h-6 w-6 text-primary" />
      </div>
      <h3 className="font-medium text-sm mb-1">No conversations yet</h3>
      <p className="text-xs text-muted-foreground">
        Start a new chat to begin
      </p>
    </div>
  );
}

interface ConversationItem {
  id: string;
  title: string;
  date: string;
}

interface ConversationGroupProps {
  title: string;
  conversations: ConversationItem[];
  currentPath: string;
}

function ConversationGroup({ title, conversations, currentPath }: ConversationGroupProps) {
  return (
    <div>
      <h3 className="px-3 py-2 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
        {title}
      </h3>
      <ul className="space-y-1">
        {conversations.map((convo) => {
          const isActive = currentPath === `/chat/${convo.id}`;
          return (
            <li key={convo.id}>
              <Link
                href={`/chat/${convo.id}`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm",
                  "transition-all duration-200 group",
                  isActive
                    ? "bg-white/10 text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <MessageSquareIcon className="h-4 w-4 shrink-0 opacity-50 group-hover:opacity-80" />
                <span className="truncate flex-1">{convo.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
