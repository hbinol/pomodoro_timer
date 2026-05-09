import PomodoroTimer from "@/components/PomodoroTimer";

export default function Home() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, #1a3a6b 0%, #0f2744 45%, #081525 100%)",
      }}
    >
      {/* Subtle aurora shimmer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 left-1/4 w-[600px] h-[400px] rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(ellipse, #38bdf8, transparent 70%)" }}
        />
        <div
          className="absolute top-20 right-1/4 w-[400px] h-[300px] rounded-full opacity-[0.08] blur-3xl"
          style={{ background: "radial-gradient(ellipse, #6ee7b7, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-light tracking-widest text-white/90 uppercase">
            Penguin Focus
          </h1>
          <p className="text-sm text-white/30 mt-1 tracking-wide">
            deep work, one session at a time
          </p>
        </div>

        {/* Glassmorphism card */}
        <div
          className="w-full rounded-3xl p-8 backdrop-blur-md border border-white/10"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <PomodoroTimer />
        </div>
      </div>
    </main>
  );
}
