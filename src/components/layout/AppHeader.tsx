"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { ThemeToggle } from "./ThemeToggle";

interface AppHeaderProps {
  /** Page title shown in the center/left */
  title: string;
  /** Optional lucide-react icon node */
  icon?: ReactNode;
  /** Show back button. Pass explicit href to navigate there, or true for router.back() */
  back?: boolean | string;
  /** Optional right-side slot */
  right?: ReactNode;
  /** Optional badge (e.g. item count) shown after title */
  badge?: string | number;
}

export function AppHeader({ title, icon, back, right, badge }: AppHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof back === "string") router.push(back);
    else router.back();
  };

  return (
    <header
      className="glass sticky top-0 z-20 flex items-center gap-3 px-4 py-3.5 border-b"
      style={{ borderColor: "var(--glass-border)" }}
    >
      {/* Back button */}
      {back && (
        <button
          onClick={handleBack}
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-transform active:scale-90"
          style={{ background: "rgba(255,255,255,0.06)" }}
          aria-label="Geri"
        >
          <ArrowLeft style={{ width: 18, height: 18, color: "var(--fg-muted)" }} strokeWidth={2.5} />
        </button>
      )}

      {/* Icon */}
      {icon && (
        <span
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl"
          style={{ background: "var(--primary-glow)" }}
        >
          <span style={{ color: "var(--primary-light)", display: "flex" }}>
            {icon}
          </span>
        </span>
      )}

      {/* Title */}
      <h1 className="flex-1 text-base font-bold tracking-tight leading-tight truncate">
        {title}
      </h1>

      {/* Badge */}
      {badge !== undefined && (
        <span
          className="shrink-0 text-[11px] font-bold px-2.5 py-0.5 rounded-full"
          style={{
            background: "var(--primary-glow)",
            color: "var(--primary-light)",
          }}
        >
          {badge}
        </span>
      )}

      {/* Right slot & Theme Toggle */}
      <div className="shrink-0 flex items-center gap-2 ml-1">
        {right}
        <ThemeToggle />
      </div>
    </header>
  );
}
