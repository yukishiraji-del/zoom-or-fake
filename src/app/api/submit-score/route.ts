import { NextRequest, NextResponse } from "next/server";

const leaderboard: { playerId: string; handle: string; score: number; accuracy: number; week: string }[] = [];

function currentWeek(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

function shortAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function cleanHandle(value: unknown): string {
  if (typeof value !== "string") return "Demo Player";
  return value.replace(/[^\w .-]/g, "").trim().slice(0, 32) || "Demo Player";
}

export async function POST(req: NextRequest) {
  const { score, correct, total, handle } = await req.json();

  if (typeof score !== "number") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const sessionAddress = req.cookies.get("for_session")?.value;
  const playerId = sessionAddress ?? cleanHandle(handle);
  const displayHandle = sessionAddress ? shortAddress(sessionAddress) : cleanHandle(handle);
  const week = currentWeek();
  const accuracy =
    typeof correct === "number" && typeof total === "number" && total > 0
      ? Math.round((correct / total) * 100)
      : 0;

  const existing = leaderboard.findIndex((entry) => entry.playerId === playerId && entry.week === week);

  if (existing >= 0) {
    if (score > leaderboard[existing].score) {
      leaderboard[existing].score = score;
      leaderboard[existing].accuracy = accuracy;
      leaderboard[existing].handle = displayHandle;
    }
  } else {
    leaderboard.push({ playerId, handle: displayHandle, score, accuracy, week });
  }

  return NextResponse.json({ ok: true, score, accuracy });
}

export async function GET() {
  const week = currentWeek();
  const entries = leaderboard
    .filter((entry) => entry.week === week)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((entry, index) => ({
      rank: index + 1,
      handle: entry.handle,
      score: entry.score,
      accuracy: entry.accuracy,
    }));

  return NextResponse.json({ week, entries });
}
