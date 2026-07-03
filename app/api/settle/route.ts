import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { MATCHES } from "@/lib/matches";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const db = getAdminDb();
  let settled = 0;

  for (const match of MATCHES) {
    if (new Date(match.date) > new Date()) continue;

    const resultDoc = await db.doc(`results/${match.id}`).get();
    if (!resultDoc.exists) continue;

    const result = resultDoc.data() as {
      homeScore: number;
      awayScore: number;
      tiebreaker?: "home" | "away";
    };

    const betsSnap = await db
      .collection("bets")
      .where("matchId", "==", match.id)
      .where("settled", "==", false)
      .get();

    if (betsSnap.empty) continue;

    const batch = db.batch();

    const actualIsDraw = result.homeScore === result.awayScore;
    const actualOutcome = Math.sign(result.homeScore - result.awayScore);

    for (const betDoc of betsSnap.docs) {
      const bet = betDoc.data() as {
        userId: string;
        homeScore: number;
        awayScore: number;
        tiebreaker?: "home" | "away";
      };

      const betOutcome = Math.sign(bet.homeScore - bet.awayScore);
      const exactScore = bet.homeScore === result.homeScore && bet.awayScore === result.awayScore;

      let pts = 0;
      if (exactScore) {
        // Exact score in regular time: 4 pts, or 1 pt if the match went to
        // extra time and the wrong side was picked to advance.
        pts = actualIsDraw
          ? result.tiebreaker && bet.tiebreaker === result.tiebreaker
            ? 4
            : 1
          : 4;
      } else if (!actualIsDraw && betOutcome === actualOutcome) {
        // Wrong score, but the correct side was picked to win.
        pts = 1;
      }

      batch.update(betDoc.ref, { settled: true, points: pts });

      if (pts > 0) {
        batch.update(db.doc(`users/${bet.userId}`), { points: FieldValue.increment(pts) });
      }
    }

    await batch.commit();
    settled++;
  }

  return NextResponse.json({ ok: true, settled });
}
