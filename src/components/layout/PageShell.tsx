"use client";

import { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  /** Extra className for the scroll container */
  className?: string;
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
export function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <div
      className={`flex flex-col w-full min-h-full ${className}`}
    >
      {children}
    </div>
  );
}
