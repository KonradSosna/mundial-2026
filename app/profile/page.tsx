"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Bet, getUserBets } from "@/lib/bets";
import { MATCHES } from "@/lib/matches";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "@/components/Spinner";

type MatchResult = { homeScore: number; awayScore: number };

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [bets, setBets] = useState<Bet[]>([]);
  const [results, setResults] = useState<Record<string, MatchResult>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    Promise.all([
      getUserBets(user.uid),
      getDocs(collection(db, "results")).then((snap) => {
        const map: Record<string, MatchResult> = {};
        snap.docs.forEach((d) => {
          const data = d.data();
          map[d.id] = { homeScore: data.homeScore, awayScore: data.awayScore };
        });
        return map;
      }),
    ])
      .then(([betsData, resultsData]) => {
        setBets(betsData);
        setResults(resultsData);
      })
      .finally(() => setLoading(false));
  }, [user, router]);

  const matchMap = Object.fromEntries(MATCHES.map((m) => [m.id, m]));

  const settled = bets.filter((b) => b.settled);
  const pending = bets.filter((b) => !b.settled);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-green-800 to-green-600 rounded-2xl p-6 text-white mb-6">
        <h1 className="text-xl font-bold">{profile?.displayName}</h1>
        <p className="text-green-200 text-sm">{profile?.email}</p>
        <div className="mt-3 flex gap-6">
          <div>
            <p className="text-3xl font-bold">{profile?.points ?? 0}</p>
            <p className="text-green-300 text-sm">punktów</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{bets.length}</p>
            <p className="text-green-300 text-sm">typów</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{settled.filter((b) => (b.points ?? 0) > 0).length}</p>
            <p className="text-green-300 text-sm">trafień</p>
          </div>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          {pending.length > 0 && (
            <div className="mb-6">
              <h2 className="font-bold text-gray-700 mb-3">Oczekujące ({pending.length})</h2>
              <div className="space-y-2">
                {pending.map((bet) => {
                  const match = matchMap[bet.matchId];
                  if (!match) return null;
                  return (
                    <div key={bet.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <span>{match.homeFlag}</span>
                        <span className="font-medium">{match.home}</span>
                        <span className="text-gray-400">vs</span>
                        <span className="font-medium">{match.away}</span>
                        <span>{match.awayFlag}</span>
                      </div>
                      <span className="font-bold text-green-700 text-sm">
                        {bet.homeScore} – {bet.awayScore}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {settled.length > 0 && (
            <div>
              <h2 className="font-bold text-gray-700 mb-3">Rozliczone ({settled.length})</h2>
              <div className="space-y-2">
                {settled.map((bet) => {
                  const match = matchMap[bet.matchId];
                  const result = results[bet.matchId];
                  if (!match) return null;
                  return (
                    <div key={bet.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <span>{match.homeFlag}</span>
                        <span className="font-medium">{match.home}</span>
                        <span className="text-gray-400">vs</span>
                        <span className="font-medium">{match.away}</span>
                        <span>{match.awayFlag}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        {result && (
                          <span className="text-gray-500">
                            Wynik: <strong>{result.homeScore}–{result.awayScore}</strong>
                          </span>
                        )}
                        <span className="text-gray-700">
                          Typ: <strong>{bet.homeScore}–{bet.awayScore}</strong>
                        </span>
                        <span className={`font-bold ${(bet.points ?? 0) > 0 ? "text-green-600" : "text-gray-400"}`}>
                          +{bet.points ?? 0} pkt
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {bets.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              Nie masz jeszcze żadnych typów.{" "}
              <Link href="/matches" className="text-green-600 hover:underline">Obstaw pierwszy mecz!</Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
