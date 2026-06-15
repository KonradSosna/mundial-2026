import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Bet {
  id: string;
  userId: string;
  matchId: string;
  homeScore: number;
  awayScore: number;
  placedAt: string;
  points?: number;
  settled?: boolean;
}

export async function placeBet(
  userId: string,
  matchId: string,
  homeScore: number,
  awayScore: number
): Promise<void> {
  const betId = `${userId}_${matchId}`;
  await setDoc(doc(db, "bets", betId), {
    id: betId,
    userId,
    matchId,
    homeScore,
    awayScore,
    placedAt: new Date().toISOString(),
    settled: false,
    points: 0,
  });
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
  actualAway: number
): Promise<void> {
  // Save result first so the cron can always re-run if something fails
  await setDoc(doc(db, "results", matchId), {
    matchId,
    homeScore: actualHome,
    awayScore: actualAway,
    settledAt: new Date().toISOString(),
  });

  const q = query(
    collection(db, "bets"),
    where("matchId", "==", matchId),
    where("settled", "==", false)
  );
  const snap = await getDocs(q);
  if (snap.empty) return;

  const actualResult = Math.sign(actualHome - actualAway);

  // Batch all writes for atomicity
  const { writeBatch } = await import("firebase/firestore");
  const batch = writeBatch(db);

  for (const betDoc of snap.docs) {
    const bet = betDoc.data() as Bet;
    const betResult = Math.sign(bet.homeScore - bet.awayScore);

    let pts = 0;
    if (bet.homeScore === actualHome && bet.awayScore === actualAway) {
      pts = 3;
    } else if (betResult === actualResult) {
      pts = 1;
    }

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
