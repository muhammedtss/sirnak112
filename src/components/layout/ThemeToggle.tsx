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

  if (!mounted) return <div className="w-11 h-11 shrink-0" />; // Placeholder to prevent layout shift

  return (
    <button
      onClick={toggleTheme}
      className="header-icon-btn"
      aria-label={theme === "dark" ? "Açık temaya geç" : "Koyu temaya geç"}
      title={theme === "dark" ? "Açık temaya geç" : "Koyu temaya geç"}
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
