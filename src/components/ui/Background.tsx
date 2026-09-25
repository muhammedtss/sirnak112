"use client";

import { motion } from "framer-motion";

export function Background() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* Primary indigo orb — top left */}
      <motion.div
        animate={{ y: [0, -24, 0], x: [0, 12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[15%] -left-[15%] w-[70vw] h-[70vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(99,102,241,0.22) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      {/* Violet orb — bottom right */}
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -14, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-[20%] -right-[10%] w-[80vw] h-[80vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(139,92,246,0.16) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      {/* Subtle teal accent — center */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[35%] left-[50%] -translate-x-1/2 w-[50vw] h-[50vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(52,211,153,0.07) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      {/* Ultra-subtle dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}
