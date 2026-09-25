"use client";

import { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  /** Extra className for the scroll container */
  className?: string;
  /** Padding bottom to avoid BottomNav overlap (default: pb-28) */
  bottomPadding?: string;
}

/**
 * PageShell — wraps every page.
 * Handles min-height, scroll, and bottom nav clearance.
 * Usage:
 *   <PageShell>
 *     <AppHeader ... />
 *     <div className="p-4 max-w-xl mx-auto"> ... </div>
 *   </PageShell>
 */
export function PageShell({ children, className = "", bottomPadding = "pb-28" }: PageShellProps) {
  return (
    <div
      className={`flex flex-col min-h-[100svh] overflow-y-auto ${bottomPadding} ${className}`}
    >
      {children}
    </div>
  );
}
