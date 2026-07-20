"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { MATCHES, StaticMatch } from "@/lib/matches";
import { settleMatch, getMatchResult } from "@/lib/bets";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";

interface Result { homeScore: number; awayScore: number; tiebreaker?: "home" | "away" }
interface ScoreInput { homeScore: string; awayScore: string }

function groupByDate(matches: StaticMatch[]): [string, StaticMatch[]][] {
  const map = new Map<string, StaticMatch[]>();
  for (const m of matches) {
    const day = m.date.slice(0, 10);
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
  const [scores, setScores] = useState<Record<string, ScoreInput>>({});
  const [tiebreakers, setTiebreakers] = useState<Record<string, "home" | "away">>({});
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
    const homeScore = s.homeScore === "" ? 0 : Number(s.homeScore);
    const awayScore = s.awayScore === "" ? 0 : Number(s.awayScore);
    const isKnockout = match.stage !== "group";
    const isDraw = homeScore === awayScore;
    const tiebreaker = tiebreakers[match.id];
    if (isKnockout && isDraw && !tiebreaker) return;
    setSettling(match.id);
    try {
      await settleMatch(match.id, homeScore, awayScore, isKnockout && isDraw ? tiebreaker : undefined);
      setSettled((prev) => ({ ...prev, [match.id]: true }));
      setResults((prev) => ({ ...prev, [match.id]: { homeScore, awayScore, tiebreaker: isKnockout && isDraw ? tiebreaker : undefined } }));
    } finally {
      setSettling(null);
    }
  };

  if (loading) return <Spinner />;
  if (!profile?.isAdmin) return null;

  const sortedMatches = [...MATCHES].sort((a, b) => a.date.localeCompare(b.date));
  const unsettledByDate = groupByDate(sortedMatches.filter((m) => !results[m.id]));
  const settledByDate = groupByDate(sortedMatches.filter((m) => !!results[m.id]));

  const renderMatch = (match: StaticMatch) => {
    const existingResult = results[match.id];
    const current = scores[match.id] ?? { homeScore: "", awayScore: "" };
    const isKnockout = match.stage !== "group";
    const enteredDraw = current.homeScore !== "" && current.awayScore !== "" &&
      Number(current.homeScore) === Number(current.awayScore);
    const needsTiebreaker = isKnockout && enteredDraw;
    const tb = tiebreakers[match.id];

    return (
      <div key={match.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-gray-400 text-xs w-10 shrink-0">{formatTime(match.date)}</span>
            <span className="text-black">{match.homeFlag} {match.home}</span>
            <span className="text-gray-400">vs</span>
            <span className="text-black">{match.away} {match.awayFlag}</span>
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
                {existingResult.tiebreaker && (
                  <span className="font-normal text-gray-500 ml-1 text-xs">
                    (d: {existingResult.tiebreaker === "home" ? match.home : match.away})
                  </span>
                )}
              </span>
              <span className="text-green-500 text-xs">✓ Rozliczono</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2 items-end">
              <div className="flex items-center gap-2">
                <input
                  type="number" min={0} max={20}
                  value={current.homeScore}
                  placeholder="0"
                  onChange={(e) =>
                    setScores((prev) => ({
                      ...prev,
                      [match.id]: { ...current, homeScore: e.target.value },
                    }))
                  }
                  className="w-12 h-8 text-center text-black border-2 border-gray-200 rounded focus:border-green-500 focus:outline-none"
                />
                <span className="text-gray-400">:</span>
                <input
                  type="number" min={0} max={20}
                  value={current.awayScore}
                  placeholder="0"
                  onChange={(e) =>
                    setScores((prev) => ({
                      ...prev,
                      [match.id]: { ...current, awayScore: e.target.value },
                    }))
                  }
                  className="w-12 h-8 text-center text-black border-2 border-gray-200 rounded focus:border-green-500 focus:outline-none"
                />
                <button
                  onClick={() => handleSettle(match)}
                  disabled={settling === match.id || (needsTiebreaker && !tb)}
                  className="bg-green-700 hover:bg-green-600 text-white text-sm px-3 py-1.5 rounded-lg disabled:opacity-60 transition-colors"
                >
                  {settling === match.id ? "..." : settled[match.id] ? "✓" : "Zapisz"}
                </button>
              </div>
              {needsTiebreaker && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-400">Zwycięzca po dogrywce:</span>
                  <button
                    onClick={() => setTiebreakers((p) => ({ ...p, [match.id]: "home" }))}
                    className={`px-2 py-1 rounded border transition-colors ${tb === "home" ? "bg-green-700 text-white border-green-700" : "border-gray-300 text-gray-700 hover:border-green-500"}`}
                  >
                    {match.homeFlag} {match.home}
                  </button>
                  <button
                    onClick={() => setTiebreakers((p) => ({ ...p, [match.id]: "away" }))}
                    className={`px-2 py-1 rounded border transition-colors ${tb === "away" ? "bg-green-700 text-white border-green-700" : "border-gray-300 text-gray-700 hover:border-green-500"}`}
                  >
                    {match.away} {match.awayFlag}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDayGroup = ([day, matches]: [string, StaticMatch[]]) => (
    <div key={day}>
      <h2 className="text-sm font-semibold text-white uppercase tracking-wide mb-3">
        {formatDay(day)}
      </h2>
      <div className="space-y-2">
        {matches.map(renderMatch)}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Panel administratora</h1>
      <p className="text-sm text-white mb-6">
        Wprowadź wyniki zakończonych meczów. System automatycznie przyzna punkty użytkownikom.
      </p>

      <div className="space-y-8">
        {unsettledByDate.map(renderDayGroup)}

        {settledByDate.length > 0 && (
          <>
            <div className="border-t border-gray-200 pt-6">
              <p className="text-xs font-semibold text-white uppercase tracking-wide mb-6">Rozliczone</p>
              <div className="space-y-8">
                {settledByDate.map(renderDayGroup)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
