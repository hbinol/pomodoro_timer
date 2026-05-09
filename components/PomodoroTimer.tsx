"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";

type Phase = "focus" | "break";

const DURATIONS: Record<Phase, number> = {
  focus: 25 * 60,
  break: 5 * 60,
};

const TOTAL_JOURNEY_STEPS = 8;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function playChime() {
  try {
    const ctx = new AudioContext();
    const frequencies = [523, 659, 784, 1047];
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      const t = ctx.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.3, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.start(t);
      osc.stop(t + 0.5);
    });
  } catch {}
}

export default function PomodoroTimer() {
  const [phase, setPhase] = useState<Phase>("focus");
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS.focus);
  const [running, setRunning] = useState(false);
  const [tripProgress, setTripProgress] = useState(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("penguinTrip") ?? 0);
    }
    return 0;
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = DURATIONS[phase];
  const elapsed = total - secondsLeft;
  const progressPct = (elapsed / total) * 100;
  const penguinPct = (tripProgress / TOTAL_JOURNEY_STEPS) * 100;

  const advancePhase = useCallback(() => {
    playChime();
    if (phase === "focus") {
      const next = Math.min(tripProgress + 1, TOTAL_JOURNEY_STEPS);
      setTripProgress(next);
      localStorage.setItem("penguinTrip", String(next));
      setPhase("break");
      setSecondsLeft(DURATIONS.break);
    } else {
      setPhase("focus");
      setSecondsLeft(DURATIONS.focus);
    }
    setRunning(false);
  }, [phase, tripProgress]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current!);
          advancePhase();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [running, advancePhase]);

  const toggle = () => setRunning((r) => !r);

  const reset = () => {
    setRunning(false);
    setSecondsLeft(DURATIONS[phase]);
  };

  const isFocus = phase === "focus";

  return (
    <div className="flex flex-col items-center gap-10 w-full max-w-md mx-auto">

      {/* Phase badge */}
      <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide backdrop-blur-sm border transition-colors duration-700 ${
        isFocus
          ? "bg-blue-500/20 border-blue-400/40 text-blue-200"
          : "bg-emerald-500/20 border-emerald-400/40 text-emerald-200"
      }`}>
        {isFocus ? <Brain size={14} /> : <Coffee size={14} />}
        {isFocus ? "Focus Session" : "Break Time"}
      </div>

      {/* Timer ring */}
      <div className="relative w-64 h-64">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          {/* Track */}
          <circle cx="100" cy="100" r="88" fill="none"
            stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
          {/* Progress arc */}
          <circle cx="100" cy="100" r="88" fill="none"
            stroke={isFocus ? "#60a5fa" : "#34d399"}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 88}`}
            strokeDashoffset={`${2 * Math.PI * 88 * (1 - progressPct / 100)}`}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span className="text-6xl font-mono font-light tracking-tight text-white">
            {formatTime(secondsLeft)}
          </span>
          <span className="text-xs text-white/40 uppercase tracking-widest">
            {isFocus ? "until break" : "until focus"}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={reset}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all"
          aria-label="Reset"
        >
          <RotateCcw size={18} />
        </button>

        <button
          onClick={toggle}
          className={`w-20 h-20 rounded-full flex items-center justify-center border-2 text-white font-medium text-lg shadow-lg transition-all duration-200 active:scale-95 ${
            running
              ? "bg-white/15 border-white/30 hover:bg-white/20"
              : isFocus
              ? "bg-blue-500/80 border-blue-400 hover:bg-blue-500 shadow-blue-500/30"
              : "bg-emerald-500/80 border-emerald-400 hover:bg-emerald-500 shadow-emerald-500/30"
          }`}
          aria-label={running ? "Pause" : "Start"}
        >
          {running ? <Pause size={28} /> : <Play size={28} className="translate-x-0.5" />}
        </button>

        <div className="w-12 h-12" /> {/* spacer to center the play button */}
      </div>

      {/* Journey map */}
      <div className="w-full rounded-2xl p-5 bg-white/5 backdrop-blur-sm border border-white/10">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-white/50 uppercase tracking-widest">Arctic Journey</span>
          <span className="text-xs text-white/50">{tripProgress} / {TOTAL_JOURNEY_STEPS} sessions</span>
        </div>

        {/* Track */}
        <div className="relative h-2 bg-white/10 rounded-full overflow-visible">
          {/* Fill */}
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${penguinPct}%` }}
          />
          {/* Waypoint dots */}
          {Array.from({ length: TOTAL_JOURNEY_STEPS + 1 }, (_, i) => (
            <div
              key={i}
              className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border transition-colors duration-500 ${
                i <= tripProgress
                  ? "bg-cyan-300 border-cyan-300"
                  : "bg-white/10 border-white/20"
              }`}
              style={{ left: `calc(${(i / TOTAL_JOURNEY_STEPS) * 100}% - 4px)` }}
            />
          ))}
          {/* Penguin */}
          <div
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
            style={{ left: `calc(${penguinPct}% - 12px)` }}
          >
            <span className="text-2xl select-none drop-shadow-lg" role="img" aria-label="penguin">🐧</span>
          </div>
        </div>

        {/* Landmarks */}
        <div className="flex justify-between mt-2 text-lg">
          {["🌊", "🧊", "⛄", "🏔️", "🌌"].map((emoji, i) => (
            <span
              key={i}
              className={`transition-opacity duration-500 ${
                tripProgress >= Math.round((i / 4) * TOTAL_JOURNEY_STEPS) ? "opacity-100" : "opacity-25"
              }`}
              role="img"
            >
              {emoji}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
