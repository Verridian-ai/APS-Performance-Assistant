"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { IconButton, Button } from "./ui/Button";
import {
  XIcon,
  CopyIcon,
  FileText,
  Download,
  CheckCircle
} from "./ui/Icons";

interface CanvasPanelProps {
  onClose: () => void;
}

export function CanvasPanel({ onClose }: CanvasPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("Budget Draft v1 content...");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full flex flex-col glass"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/20">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold">Generated Document</h2>
            <p className="text-xs text-muted-foreground">Last edited just now</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-xs gap-1.5"
          >
            {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button
            size="sm"
            className="text-xs gap-1.5 bg-gradient-to-r from-violet-500 to-purple-600 border-0 shadow-lg shadow-violet-500/20"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <IconButton onClick={onClose} title="Close" className="hover:bg-white/10">
            <XIcon className="h-4 w-4" />
          </IconButton>
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-white/10">
        <ToolbarButton active>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
          </svg>
        </ToolbarButton>
        <ToolbarButton>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" x2="10" y1="4" y2="4" />
            <line x1="14" x2="5" y1="20" y2="20" />
            <line x1="15" x2="9" y1="4" y2="20" />
          </svg>
        </ToolbarButton>
        <ToolbarButton>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 4v16" />
            <path d="M18 4v16" />
            <path d="M6 12h12" />
          </svg>
        </ToolbarButton>
        <div className="w-px h-5 bg-white/10 mx-2" />
        <ToolbarButton>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" x2="21" y1="6" y2="6" />
            <line x1="8" x2="21" y1="12" y2="12" />
            <line x1="8" x2="21" y1="18" y2="18" />
            <line x1="3" x2="3.01" y1="6" y2="6" />
            <line x1="3" x2="3.01" y1="12" y2="12" />
            <line x1="3" x2="3.01" y1="18" y2="18" />
          </svg>
        </ToolbarButton>
      </div>

      {/* Document Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 min-h-[600px]"
          >
            {/* Document Header */}
            <div className="mb-8 pb-6 border-b border-border">
              <h1 className="text-2xl font-bold mb-2">Project Budget Estimate</h1>
              <p className="text-sm text-muted-foreground">
                Broadband Infrastructure Expansion - Region A
              </p>
            </div>

            {/* Summary Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 text-primary">Executive Summary</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                This budget estimate outlines the projected costs for the fiber optic
                infrastructure deployment project. All figures are based on current market
                rates and regulatory requirements as specified in the APS guidelines.
              </p>
            </div>

            {/* Budget Table */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 text-primary">Cost Breakdown</h2>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left py-3 px-4 font-semibold">Item</th>
                      <th className="text-left py-3 px-4 font-semibold">Description</th>
                      <th className="text-right py-3 px-4 font-semibold">Cost (AUD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium">Fiber Optic Cable</td>
                      <td className="py-3 px-4 text-muted-foreground">10km single-mode fiber</td>
                      <td className="py-3 px-4 text-right font-mono">$120,000</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium">Labor (Installation)</td>
                      <td className="py-3 px-4 text-muted-foreground">Trenching, laying, splicing</td>
                      <td className="py-3 px-4 text-right font-mono">$85,000</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium">Network Equipment</td>
                      <td className="py-3 px-4 text-muted-foreground">OLTs, ONTs, switches</td>
                      <td className="py-3 px-4 text-right font-mono">$45,000</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium">Permits & Fees</td>
                      <td className="py-3 px-4 text-muted-foreground">Council, regulatory</td>
                      <td className="py-3 px-4 text-right font-mono">$15,000</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium">Contingency</td>
                      <td className="py-3 px-4 text-muted-foreground">10% buffer</td>
                      <td className="py-3 px-4 text-right font-mono">$26,500</td>
                    </tr>
                    <tr className="bg-primary/10">
                      <td className="py-4 px-4 font-bold" colSpan={2}>Total Estimated Cost</td>
                      <td className="py-4 px-4 text-right font-bold font-mono text-lg">$291,500</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-2">Notes</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• All prices are GST exclusive</li>
                <li>• Estimates valid for 90 days from date of issue</li>
                <li>• Subject to site survey and final approval</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function ToolbarButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-2 rounded-lg transition-all duration-200",
        active
          ? "bg-white/10 text-foreground shadow-sm"
          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
