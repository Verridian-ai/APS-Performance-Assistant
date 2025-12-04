import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ConversationsProvider } from "@/lib/conversations";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "APS Assistant - Broadband Advancement",
  description: "AI-powered assistant for Broadband Advancement Workbooks and APS compliance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <ThemeProvider>
            <ConversationsProvider>{children}</ConversationsProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
