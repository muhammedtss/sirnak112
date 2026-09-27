"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const rawTheme = localStorage.getItem("theme");
    const isValidTheme = rawTheme === "dark" || rawTheme === "light";
    if (isValidTheme) {
      setTheme(rawTheme as "dark" | "light");
      document.documentElement.setAttribute("data-theme", rawTheme);
    } else {
      // Default to dark as per premium app requirements
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  if (!mounted) return <div className="w-9 h-9" />; // Placeholder to prevent layout shift

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full glass-hover hover:bg-white/10 text-white flex items-center justify-center transition-transform active:scale-90"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
