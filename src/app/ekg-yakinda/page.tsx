"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Construction, HeartPulse } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";

export default function EkgYakindaPage() {
  return (
    <PageShell>
      {/* Navbar */}
      <header className="sticky top-0 z-20 px-5 pt-5 pb-4 flex items-center justify-between"
        style={{ background: "linear-gradient(to bottom, var(--bg) 60%, transparent)" }}
      >
        <div className="flex items-center gap-3">
          <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-2xl glass-card glass-hover">
            <ChevronLeft style={{ width: 20, height: 20 }} />
          </Link>
          <div>
            <h1 className="text-xl font-bold leading-tight">EKG Eğitimi</h1>
            <p className="text-xs text-muted font-medium mt-0.5">Bakım & Güncelleme</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-5 py-10 flex flex-col items-center justify-center text-center min-h-[70vh]">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative w-32 h-32 mb-8 flex items-center justify-center"
        >
          {/* Outer glowing ring */}
          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: "#10B981", animationDuration: "3s" }} />
          
          <div className="relative w-24 h-24 rounded-3xl flex items-center justify-center glass-card z-10" style={{ border: "2px solid rgba(16, 185, 129, 0.3)", background: "rgba(16, 185, 129, 0.1)" }}>
            <HeartPulse style={{ width: 48, height: 48, color: "#10B981" }} />
            <motion.div 
              initial={{ rotate: -20 }}
              animate={{ rotate: 10 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5, ease: "easeInOut" }}
              className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center glass-card" 
              style={{ background: "#F59E0B" }}
            >
              <Construction style={{ width: 20, height: 20, color: "#fff" }} />
            </motion.div>
          </div>
        </motion.div>

        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-black mb-3"
        >
          Çok Yakında!
        </motion.h2>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm font-medium text-muted max-w-[280px] leading-relaxed mb-8"
        >
          EKG Eğitim ve Sınav modüllerimiz, daha kusursuz bir deneyim sunmak amacıyla güncellenmektedir.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link href="/">
            <button className="px-6 py-3 rounded-2xl font-bold text-sm text-white flex items-center gap-2 transition-transform hover:scale-105 active:scale-95" style={{ background: "linear-gradient(135deg, #10B981 0%, #059669 100%)", boxShadow: "0 8px 20px -6px rgba(16, 185, 129, 0.5)" }}>
              <ChevronLeft style={{ width: 18, height: 18 }} />
              Ana Sayfaya Dön
            </button>
          </Link>
        </motion.div>
      </div>
    </PageShell>
  );
}
