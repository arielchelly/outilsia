/**
 * Pure-CSS decorative shapes that drift slowly in the background.
 * Server component — zero JS, zero re-renders. Each shape uses CSS
 * @keyframes (declared in globals.css under .shape-drift-1/2/3) and
 * sits on top of the WebGL background but below all page content
 * (z-index: 2). Pointer-events disabled, aria-hidden — purely decorative.
 */
export function FloatingShapes() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 2 }}
    >
      {/* Top-right thin gold ring */}
      <div className="absolute top-[15vh] right-[8vw] w-32 h-32 rounded-full border border-gold/15 shape-drift-1" />

      {/* Mid-left tiny diamond */}
      <div className="absolute top-[60vh] left-[5vw] w-3 h-3 rotate-45 border border-gold/30 shape-drift-2" />

      {/* Bottom-right hexagon (clip-path) */}
      <div
        className="absolute top-[180vh] right-[15vw] w-20 h-20 bg-gold/8 shape-drift-3"
        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
      />

      {/* Far down — gold dot cluster */}
      <div className="absolute top-[300vh] left-[12vw] flex gap-3 shape-drift-2">
        <div className="w-1.5 h-1.5 rounded-full bg-gold/50" />
        <div className="w-1.5 h-1.5 rounded-full bg-gold/30" />
        <div className="w-1.5 h-1.5 rounded-full bg-gold/40" />
      </div>

      {/* Mid-right line accent */}
      <div className="absolute top-[120vh] right-[6vw] w-12 h-px bg-gold/35 shape-drift-1" />

      {/* Bottom — cross / plus mark */}
      <div className="absolute top-[400vh] right-[22vw] shape-drift-3 text-gold/25 font-mono text-2xl select-none">
        +
      </div>
    </div>
  );
}
