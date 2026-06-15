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

    const result = resultDoc.data() as { homeScore: number; awayScore: number };

    const betsSnap = await db
      .collection("bets")
      .where("matchId", "==", match.id)
      .where("settled", "==", false)
      .get();

    if (betsSnap.empty) continue;

    const batch = db.batch();

    for (const betDoc of betsSnap.docs) {
      const bet = betDoc.data() as { userId: string; homeScore: number; awayScore: number };

      const actualResult = Math.sign(result.homeScore - result.awayScore);
      const betResult = Math.sign(bet.homeScore - bet.awayScore);

      let pts = 0;
      if (bet.homeScore === result.homeScore && bet.awayScore === result.awayScore) {
        pts = 3;
      } else if (betResult === actualResult) {
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
