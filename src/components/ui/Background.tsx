
export function Background() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* Primary indigo orb — top left */}
      <div
        className="absolute -top-[15%] -left-[15%] w-[70vw] h-[70vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(99,102,241,0.22) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      {/* Violet orb — bottom right */}
      <div
        className="absolute -bottom-[20%] -right-[10%] w-[80vw] h-[80vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(139,92,246,0.16) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      {/* Subtle teal accent — center (statik: sonsuz animasyon yok) */}
      <div
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
