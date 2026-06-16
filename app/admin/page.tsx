"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { MATCHES, StaticMatch } from "@/lib/matches";
import { settleMatch, getMatchResult } from "@/lib/bets";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";

interface Result { homeScore: number; awayScore: number }

function groupByDate(matches: StaticMatch[]): [string, StaticMatch[]][] {
  const map = new Map<string, StaticMatch[]>();
  for (const m of matches) {
    const day = m.date.slice(0, 10); // "2026-06-11"
    if (!map.has(day)) map.set(day, []);
    map.get(day)!.push(m);
  }
  return Array.from(map.entries());
}

function formatDay(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pl-PL", {
    weekday: "long", day: "numeric", month: "long",
  });
}

function formatTime(isoStr: string) {
  return new Date(isoStr).toLocaleTimeString("pl-PL", {
    hour: "2-digit", minute: "2-digit",
  });
}

export default function AdminPage() {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const [scores, setScores] = useState<Record<string, Result>>({});
  const [results, setResults] = useState<Record<string, Result>>({});
  const [settling, setSettling] = useState<string | null>(null);
  const [settled, setSettled] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!loading && !profile?.isAdmin) router.push("/");
  }, [loading, profile, router]);

  useEffect(() => {
    MATCHES.forEach(async (m) => {
      const r = await getMatchResult(m.id);
      if (r) setResults((prev) => ({ ...prev, [m.id]: r as Result }));
    });
  }, []);

  const handleSettle = async (match: StaticMatch) => {
    const s = scores[match.id];
    if (!s) return;
    setSettling(match.id);
    try {
      await settleMatch(match.id, s.homeScore, s.awayScore);
      setSettled((prev) => ({ ...prev, [match.id]: true }));
      setResults((prev) => ({ ...prev, [match.id]: s }));
    } finally {
      setSettling(null);
    }
  };

  if (loading) return <Spinner />;
  if (!profile?.isAdmin) return null;

  const byDate = groupByDate([...MATCHES].sort((a, b) => a.date.localeCompare(b.date)));

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Panel administratora</h1>
      <p className="text-sm text-gray-500 mb-6">
        Wprowadź wyniki zakończonych meczów. System automatycznie przyzna punkty użytkownikom.
      </p>

      <div className="space-y-8">
        {byDate.map(([day, matches]) => (
          <div key={day}>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {formatDay(day)}
            </h2>
            <div className="space-y-2">
              {matches.map((match) => {
                const existingResult = results[match.id];
                const current = scores[match.id] ?? { homeScore: 0, awayScore: 0 };

                return (
                  <div key={match.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <span className="text-gray-400 text-xs w-10 shrink-0">{formatTime(match.date)}</span>
                        <span>{match.homeFlag} {match.home}</span>
                        <span className="text-gray-400">vs</span>
                        <span>{match.away} {match.awayFlag}</span>
                        {match.group && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                            Gr. {match.group}
                          </span>
                        )}
                      </div>

                      {existingResult ? (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-bold text-green-700">
                            {existingResult.homeScore} – {existingResult.awayScore}
                          </span>
                          <span className="text-green-500 text-xs">✓ Rozliczono</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input
                            type="number" min={0} max={20}
                            value={current.homeScore}
                            onChange={(e) =>
                              setScores((prev) => ({
                                ...prev,
                                [match.id]: { ...current, homeScore: Number(e.target.value) },
                              }))
                            }
                            className="w-12 h-8 text-center text-black border-2 border-gray-200 rounded focus:border-green-500 focus:outline-none"
                          />
                          <span className="text-gray-400">:</span>
                          <input
                            type="number" min={0} max={20}
                            value={current.awayScore}
                            onChange={(e) =>
                              setScores((prev) => ({
                                ...prev,
                                [match.id]: { ...current, awayScore: Number(e.target.value) },
                              }))
                            }
                            className="w-12 h-8 text-center text-black border-2 border-gray-200 rounded focus:border-green-500 focus:outline-none"
                          />
                          <button
                            onClick={() => handleSettle(match)}
                            disabled={settling === match.id}
                            className="bg-green-700 hover:bg-green-600 text-white text-sm px-3 py-1.5 rounded-lg disabled:opacity-60 transition-colors"
                          >
                            {settling === match.id ? "..." : settled[match.id] ? "✓" : "Zapisz"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
