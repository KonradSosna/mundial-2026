"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MATCHES } from "@/lib/matches";

const FINAL = MATCHES.find((m) => m.id === "FIN")!;

const CONFETTI_COLORS = ["#facc15", "#22c55e", "#ef4444", "#3b82f6", "#ffffff", "#f97316"];

// Fixed, deterministic layout so there's no server/client mismatch —
// only randomizing per-render would break hydration.
const CONFETTI = Array.from({ length: 30 }, (_, i) => ({
  left: (i * 33.7) % 100,
  delay: (i * 0.29) % 3,
  duration: 2.8 + ((i * 0.53) % 2.4),
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  size: 6 + (i % 4) * 3,
}));

interface Winner {
  name: string;
  flag: string;
}

interface FinalResult {
  homeScore: number;
  awayScore: number;
  tiebreaker?: "home" | "away";
}

export default function WinnerBanner() {
  const [winner, setWinner] = useState<Winner | null>(null);

  useEffect(() => {
    getDoc(doc(db, "results", FINAL.id))
      .then((snap) => {
        if (!snap.exists()) return;
        const data = snap.data() as FinalResult;

        let side: "home" | "away" | null = null;
        if (data.homeScore !== data.awayScore) {
          side = data.homeScore > data.awayScore ? "home" : "away";
        } else if (data.tiebreaker) {
          side = data.tiebreaker;
        }
        if (!side) return;

        setWinner(
          side === "home"
            ? { name: FINAL.home, flag: FINAL.homeFlag }
            : { name: FINAL.away, flag: FINAL.awayFlag }
        );
      })
      .catch(() => {});
  }, []);

  if (!winner) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl mb-8 p-8 sm:p-10 text-center bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-600 shadow-lg">
      <div className="pointer-events-none absolute inset-0">
        {CONFETTI.map((c, i) => (
          <span
            key={i}
            className="absolute top-0 rounded-sm"
            style={{
              left: `${c.left}%`,
              width: c.size,
              height: c.size * 0.4,
              backgroundColor: c.color,
              animation: `confetti-fall ${c.duration}s linear ${c.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative">
        <div
          className="text-7xl mb-2"
          style={{ animation: "trophy-pop 0.7s ease-out, trophy-float 3s ease-in-out 0.7s infinite" }}
        >
          🏆
        </div>
        <p className="text-yellow-900/80 text-sm font-bold tracking-widest uppercase mb-2">
          Mistrz Świata 2026
        </p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-5xl" style={{ animation: "trophy-pop 0.8s ease-out 0.15s both" }}>
            {winner.flag}
          </span>
          <span className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-md">
            {winner.name}
          </span>
        </div>
      </div>
    </div>
  );
}
