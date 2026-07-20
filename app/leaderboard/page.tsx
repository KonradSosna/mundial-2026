import { redirect } from "next/navigation";

// The ranking now lives at the homepage since the tournament has finished.
export default function LeaderboardRedirect() {
  redirect("/");
}
