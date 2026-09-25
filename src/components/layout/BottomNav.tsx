"use client";

import { Home, Activity, BookOpen, Pill, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { icon: Home,      label: "Ana Sayfa",     href: "/" },
  { icon: Activity,  label: "Skalalar",      href: "/skalalar" },
  { icon: BookOpen,  label: "Protokoller",   href: "/vaka-protokolleri" },
  { icon: Pill,      label: "İlaç",          href: "/ilac-doz" },
  { icon: Package,   label: "Envanter",      href: "/envanter" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    /* Safe-area padding for iPhone notch */
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none pb-[env(safe-area-inset-bottom,12px)] px-4">
      <nav
        className="pointer-events-auto glass flex items-center justify-between w-full max-w-sm px-2 py-2 rounded-[2rem]"
        style={{ borderColor: "var(--glass-border)" }}
      >
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-12 h-12 rounded-full"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: "var(--primary-glow)" }}
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                />
              )}
              <Icon
                className="relative z-10 transition-colors duration-200"
                style={{
                  width: 22,
                  height: 22,
                  color: isActive ? "var(--primary-light)" : "var(--fg-subtle)",
                  strokeWidth: isActive ? 2.5 : 1.8,
                }}
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
