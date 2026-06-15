"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Match, StaticMatch, MatchStatus, MATCHES } from "@/lib/matches";
import { Bet, getUserBets } from "@/lib/bets";
import { useAuth } from "@/lib/auth-context";
import MatchCard from "@/components/MatchCard";

type MatchResult = { homeScore: number; awayScore: number };

const MATCH_DURATION_MS = 110 * 60 * 1000;

function computeStatus(matchDate: string, hasResult: boolean): MatchStatus {
  const now = Date.now();
  const start = new Date(matchDate).getTime();
  if (hasResult || now >= start + MATCH_DURATION_MS) return "finished";
  if (now >= start) return "live";
  return "upcoming";
}

export default function HomePage() {
  const { user } = useAuth();
  const [bets, setBets] = useState<Record<string, Bet>>({});
  const [results, setResults] = useState<Record<string, MatchResult>>({});
  const [filter, setFilter] = useState<"all" | "upcoming" | "finished">("all");

  useEffect(() => {
    getDocs(collection(db, "results")).then((snap) => {
      const map: Record<string, MatchResult> = {};
      snap.docs.forEach((d) => {
        const data = d.data();
        map[d.id] = { homeScore: data.homeScore, awayScore: data.awayScore };
      });
      setResults(map);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    getUserBets(user.uid).then((list) => {
      const map: Record<string, Bet> = {};
      for (const b of list) map[b.matchId] = b;
      setBets(map);
    });
  }, [user]);

  // Merge static matches with dynamic status + Firestore results
  const mergedMatches: Match[] = MATCHES.map((m: StaticMatch) => {
    const result = results[m.id];
    const status = computeStatus(m.date, !!result);
    return result
      ? { ...m, status, homeScore: result.homeScore, awayScore: result.awayScore }
      : { ...m, status };
  });

  const filtered = mergedMatches.filter((m) => {
    if (filter === "upcoming") return m.status === "upcoming";
    if (filter === "finished") return m.status === "finished";
    return true;
  });

  const byDate = new Map<string, Match[]>();
  for (const m of [...filtered].sort((a, b) => a.date.localeCompare(b.date))) {
    const day = m.date.slice(0, 10);
    if (!byDate.has(day)) byDate.set(day, []);
    byDate.get(day)!.push(m);
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-green-800 to-green-600 rounded-2xl p-6 mb-6 text-white text-center">
        <h1 className="text-3xl font-bold mb-1">⚽ Mundial 2026</h1>
        <p className="text-green-200">USA · Kanada · Meksyk</p>
        <p className="text-sm text-green-300 mt-2">
          Typuj wyniki i zdobywaj punkty —{" "}
          <strong className="text-white">3 pkt</strong> za dokładny wynik,{" "}
          <strong className="text-white">1 pkt</strong> za poprawnego zwycięzcę
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {(["all", "upcoming", "finished"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? "bg-green-700 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-green-400"
            }`}
          >
            {f === "all" ? "Wszystkie" : f === "upcoming" ? "Nadchodzące" : "Zakończone"}
          </button>
        ))}
      </div>

      {Array.from(byDate.entries()).map(([day, matches]) => (
        <div key={day} className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {new Date(day).toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "long" })}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((m) => (
              <MatchCard key={m.id} match={m} existingBet={bets[m.id] ?? null} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
