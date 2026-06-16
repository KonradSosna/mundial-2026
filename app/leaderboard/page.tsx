"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import Spinner from "@/components/Spinner";

interface UserRow {
  uid: string;
  displayName: string;
  points: number;
  email: string;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("points", "desc"));
    getDocs(q)
      .then((snap) => setRows(snap.docs.map((d) => d.data() as UserRow)))
      .finally(() => setLoading(false));
  }, []);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🏆 Ranking typerów</h1>
        <p className="text-gray-500 text-sm mt-1">Mundial 2026</p>
      </div>

      {loading ? (
        <Spinner />
      ) : rows.length === 0 ? (
        <div className="text-center py-10 text-gray-400">Nikt jeszcze nie zdobył punktów.</div>
      ) : (
        <div className="space-y-2">
          {rows.map((row, i) => (
            <div
              key={row.uid}
              className={`flex items-center gap-4 bg-white rounded-xl px-5 py-4 shadow-sm border ${
                row.uid === user?.uid ? "border-green-400 bg-green-50" : "border-gray-100"
              }`}
            >
              <span className="text-2xl w-8 text-center">{medals[i] ?? `${i + 1}.`}</span>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{row.displayName}</p>
                {row.uid === user?.uid && (
                  <span className="text-xs text-green-600 font-medium">To Ty!</span>
                )}
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-green-700">{row.points}</span>
                <span className="text-gray-500 text-sm ml-1">pkt</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
