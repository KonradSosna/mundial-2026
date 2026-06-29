import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Bet {
  id: string;
  userId: string;
  matchId: string;
  homeScore: number;
  awayScore: number;
  tiebreaker?: "home" | "away";
  placedAt: string;
  points?: number;
  settled?: boolean;
}

export async function placeBet(
  userId: string,
  matchId: string,
  homeScore: number,
  awayScore: number,
  tiebreaker?: "home" | "away"
): Promise<void> {
  const betId = `${userId}_${matchId}`;
  const data: Record<string, unknown> = {
    id: betId,
    userId,
    matchId,
    homeScore,
    awayScore,
    placedAt: new Date().toISOString(),
    settled: false,
    points: 0,
  };
  if (tiebreaker) data.tiebreaker = tiebreaker;
  await setDoc(doc(db, "bets", betId), data);
}

export async function getUserBet(userId: string, matchId: string): Promise<Bet | null> {
  const snap = await getDoc(doc(db, "bets", `${userId}_${matchId}`));
  return snap.exists() ? (snap.data() as Bet) : null;
}

export async function getUserBets(userId: string): Promise<Bet[]> {
  const q = query(collection(db, "bets"), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Bet);
}

export async function settleMatch(
  matchId: string,
  actualHome: number,
  actualAway: number,
  actualTiebreaker?: "home" | "away"
): Promise<void> {
  // Save result first so the cron can always re-run if something fails
  const resultData: Record<string, unknown> = {
    matchId,
    homeScore: actualHome,
    awayScore: actualAway,
    settledAt: new Date().toISOString(),
  };
  if (actualTiebreaker) resultData.tiebreaker = actualTiebreaker;
  await setDoc(doc(db, "results", matchId), resultData);

  const q = query(
    collection(db, "bets"),
    where("matchId", "==", matchId),
    where("settled", "==", false)
  );
  const snap = await getDocs(q);
  if (snap.empty) return;

  const actualOutcome = Math.sign(actualHome - actualAway);

  // Batch all writes for atomicity
  const { writeBatch } = await import("firebase/firestore");
  const batch = writeBatch(db);

  for (const betDoc of snap.docs) {
    const bet = betDoc.data() as Bet;
    const betOutcome = Math.sign(bet.homeScore - bet.awayScore);

    let pts = 0;
    // 2 pts for exact score in regular time
    if (bet.homeScore === actualHome && bet.awayScore === actualAway) pts += 2;
    // 1 pt for correct outcome (win/draw)
    if (betOutcome === actualOutcome) pts += 1;
    // 1 pt for correct tiebreaker (who wins after extra time)
    if (actualTiebreaker && bet.tiebreaker && bet.tiebreaker === actualTiebreaker) pts += 1;

    batch.update(betDoc.ref, { settled: true, points: pts });

    if (pts > 0) {
      batch.update(doc(db, "users", bet.userId), { points: increment(pts) });
    }
  }

  await batch.commit();
}

export async function getMatchResult(matchId: string) {
  const snap = await getDoc(doc(db, "results", matchId));
  return snap.exists() ? snap.data() : null;
}

export interface BetWithUser extends Bet {
  displayName: string;
}

export async function getMatchBetsWithUsers(matchId: string): Promise<BetWithUser[]> {
  const q = query(collection(db, "bets"), where("matchId", "==", matchId));
  const snap = await getDocs(q);
  const bets = snap.docs.map((d) => d.data() as Bet);

  const withUsers = await Promise.all(
    bets.map(async (bet) => {
      const userSnap = await getDoc(doc(db, "users", bet.userId));
      const displayName = userSnap.exists()
        ? (userSnap.data() as { displayName: string }).displayName
        : "Gracz";
      return { ...bet, displayName };
    })
  );

  return withUsers.sort((a, b) => a.displayName.localeCompare(b.displayName));
}
