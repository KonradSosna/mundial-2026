"use client";

import { useState, useEffect } from "react";
import { Match } from "@/lib/matches";
import { Bet, BetWithUser, placeBet, getMatchBetsWithUsers } from "@/lib/bets";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

interface Props {
  match: Match;
  existingBet?: Bet | null;
}

export default function MatchCard({ match, existingBet }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const [showBet, setShowBet] = useState(false);
  const [home, setHome] = useState(existingBet?.homeScore ?? 0);
  const [away, setAway] = useState(existingBet?.awayScore ?? 0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [bet, setBet] = useState<Bet | null>(existingBet ?? null);
  const [allBets, setAllBets] = useState<BetWithUser[]>([]);

  const matchStarted = new Date(match.date) <= new Date();
  const canBet = match.status === "upcoming" && !matchStarted && user;

  const dateStr = new Date(match.date).toLocaleString("pl-PL", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  // sync when parent loads bets from Firestore after auth resolves
  useEffect(() => {
    if (existingBet != null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBet(existingBet);
      setHome(existingBet.homeScore);
      setAway(existingBet.awayScore);
    }
  }, [existingBet]);

  useEffect(() => {
    if (!matchStarted) return;
    getMatchBetsWithUsers(match.id).then(setAllBets);
  }, [matchStarted, match.id]);

  const statusColors = {
    upcoming: "bg-blue-100 text-blue-800",
    live: "bg-red-100 text-red-800 animate-pulse",
    finished: "bg-gray-100 text-gray-600",
  };

  const statusLabel = {
    upcoming: "Nadchodzący",
    live: "LIVE",
    finished: "Zakończony",
  };

  const handleBet = async () => {
    if (!user) return router.push("/login");
    setSaving(true);
    try {
      await placeBet(user.uid, match.id, home, away);
      setBet({
        id: `${user.uid}_${match.id}`,
        userId: user.uid,
        matchId: match.id,
        homeScore: home,
        awayScore: away,
        placedAt: new Date().toISOString(),
        settled: false,
        points: 0,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setShowBet(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 px-4 py-2 flex justify-between items-center text-xs text-green-200">
        <span>{match.group ? `Grupa ${match.group}` : match.stage}</span>
        <span>{dateStr}</span>
      </div>

      {/* Teams */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col items-center flex-1">
            <span className="text-4xl mb-1">{match.homeFlag}</span>
            <span className="font-semibold text-center text-sm">{match.home}</span>
          </div>

          <div className="flex flex-col items-center">
            {match.status === "finished" ? (
              <span className="text-2xl font-bold text-gray-800">
                {match.homeScore} - {match.awayScore}
              </span>
            ) : (
              <span className="text-xl font-light text-gray-400">vs</span>
            )}
            <span className={`mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[match.status]}`}>
              {statusLabel[match.status]}
            </span>
          </div>

          <div className="flex flex-col items-center flex-1">
            <span className="text-4xl mb-1">{match.awayFlag}</span>
            <span className="font-semibold text-center text-sm">{match.away}</span>
          </div>
        </div>

      </div>

      {/* Bet area */}
      <div className="px-4 pb-4">
        {bet && (
          <div className="mb-2 text-center text-xs bg-yellow-50 border border-yellow-200 rounded-lg py-1.5 text-yellow-800">
            Twój typ: <strong>{bet.homeScore} – {bet.awayScore}</strong>
            {bet.settled && bet.points !== undefined && (
              <span className="ml-2 font-bold text-green-700">+{bet.points} pkt</span>
            )}
          </div>
        )}

        {user && matchStarted && match.status === "upcoming" && (
          <p className="text-xs text-center text-gray-400 mb-1">Mecz się rozpoczął — typowanie zablokowane</p>
        )}

        {canBet && !showBet && (
          <button
            onClick={() => setShowBet(true)}
            className="w-full text-sm bg-green-700 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-colors"
          >
            {bet ? "Zmień typ" : "Obstaw wynik"}
          </button>
        )}

        {canBet && showBet && (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 mb-1">{match.home}</span>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={home}
                  onChange={(e) => setHome(Number(e.target.value))}
                  className="w-16 h-10 text-center text-lg font-bold text-black border-2 border-green-600 rounded-lg focus:outline-none focus:border-green-800"
                />
              </div>
              <span className="text-xl font-light text-gray-400 mt-4">:</span>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 mb-1">{match.away}</span>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={away}
                  onChange={(e) => setAway(Number(e.target.value))}
                  className="w-16 h-10 text-center text-lg font-bold text-black border-2 border-green-600 rounded-lg focus:outline-none focus:border-green-800"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowBet(false)}
                className="flex-1 text-sm border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={handleBet}
                disabled={saving}
                className="flex-1 text-sm bg-green-700 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-60"
              >
                {saving ? "Zapisuję..." : saved ? "Zapisano!" : "Zapisz typ"}
              </button>
            </div>
          </div>
        )}

        {!user && match.status === "upcoming" && (
          <button
            onClick={() => router.push("/login")}
            className="w-full text-sm border border-green-700 text-green-700 hover:bg-green-50 py-2 rounded-lg font-medium transition-colors"
          >
            Zaloguj się, by obstawiać
          </button>
        )}

        {matchStarted && allBets.length > 0 && (
          <div className="mt-3 border-t border-gray-100 pt-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Typy graczy</p>
            <div className="space-y-1">
              {allBets.map((b) => (
                <div key={b.userId} className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">{b.displayName}</span>
                  <span className="font-bold text-gray-800">{b.homeScore} – {b.awayScore}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
