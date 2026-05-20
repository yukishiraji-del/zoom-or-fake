"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatScore } from "@/lib/scoring";

interface LeaderboardEntry {
  rank: number;
  handle: string;
  score: number;
  accuracy: number;
}

const fallbackLeaderboard: LeaderboardEntry[] = [
  { rank: 1, handle: "0x3f...a91b", score: 2980, accuracy: 100 },
  { rank: 2, handle: "0x7c...44d2", score: 2750, accuracy: 90 },
  { rank: 3, handle: "0x1a...98ff", score: 2640, accuracy: 90 },
  { rank: 4, handle: "0x9e...12ca", score: 2310, accuracy: 80 },
  { rank: 5, handle: "0xb2...6701", score: 2150, accuracy: 80 },
  { rank: 6, handle: "0x55...c3e4", score: 1980, accuracy: 70 },
  { rank: 7, handle: "0x2d...77bb", score: 1760, accuracy: 70 },
  { rank: 8, handle: "0xf3...2209", score: 1540, accuracy: 60 },
  { rank: 9, handle: "0x88...daf1", score: 1320, accuracy: 60 },
  { rank: 10, handle: "0x4c...e558", score: 1100, accuracy: 50 },
];

function BackIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20v-2Z" />
    </svg>
  );
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(fallbackLeaderboard);
  const [myScore, setMyScore] = useState<number | null>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const score = sessionStorage.getItem("for_score");
    if (score) setMyScore(Number.parseInt(score, 10));

    let cancelled = false;
    fetch("/api/submit-score")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.entries?.length) return;
        setEntries(data.entries);
        setIsLive(true);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  const myRank = useMemo(() => {
    if (myScore === null) return null;
    const rank = entries.findIndex((entry) => myScore > entry.score);
    return rank === -1 ? entries.length + 1 : rank + 1;
  }, [entries, myScore]);

  return (
    <div className="flex min-h-screen flex-col gap-5 bg-[#0f1117] px-5 pb-5 pt-4 text-white">
      <header className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-bold text-white/70">
          <BackIcon />
          Back
        </Link>
        <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[11px] font-black text-emerald-200">
          Logged-in players
        </div>
      </header>

      <section>
        <p className="text-[11px] font-bold uppercase tracking-[.18em] text-white/40">weekly ranking</p>
        <h1 className="mt-1 text-3xl font-black text-white">Leaderboard</h1>
        <p className="mt-1 text-sm font-medium text-white/50">
          {isLive ? "This week's scores from signed-in players." : "Demo scores are shown until you submit a live score."}
        </p>
      </section>

      {myScore !== null && (
        <section className="grid grid-cols-2 gap-3 rounded-2xl border border-[#2d8cff]/25 bg-[#2d8cff]/[0.12] p-4">
          <div>
            <p className="text-xs font-bold text-white/50">Your score</p>
            <p className="mt-1 text-2xl font-black text-white">{formatScore(myScore)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-white/50">Estimated rank</p>
            <p className="mt-1 text-2xl font-black text-[#8cc5ff]">#{myRank}</p>
          </div>
        </section>
      )}

      <section className="space-y-2">
        {entries.map((entry) => (
          <div
            key={`${entry.rank}-${entry.handle}`}
            className={`grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-2xl border px-3 py-3 ${
              entry.rank <= 3 ? "border-white/10 bg-white/[0.08]" : "border-white/5 bg-white/[0.04]"
            }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black ${
                entry.rank === 1
                  ? "bg-yellow-300 text-slate-950"
                  : entry.rank === 2
                    ? "bg-slate-200 text-slate-950"
                    : entry.rank === 3
                      ? "bg-orange-300 text-slate-950"
                      : "bg-white/10 text-white/50"
              }`}
            >
              {entry.rank}
            </div>

            <div className="min-w-0">
              <p className="truncate font-mono text-sm font-bold text-white">{entry.handle}</p>
              <p className="mt-0.5 text-xs font-medium text-white/40">{entry.accuracy}% accuracy</p>
            </div>

            <div className="text-right">
              <p className="text-base font-black text-white">{formatScore(entry.score)}</p>
              <p className="text-[11px] font-semibold text-white/30">pts</p>
            </div>
          </div>
        ))}
      </section>

      <footer className="mt-auto space-y-3">
        <p className="text-center text-xs font-medium leading-relaxed text-white/40">
          Rankings are designed to reset weekly. Connect a persistent database before production launch.
        </p>
        <Link
          href="/game"
          className="flex w-full items-center justify-center rounded-2xl bg-[#2d8cff] py-4 text-base font-black text-white transition hover:bg-blue-400 active:scale-[0.99]"
        >
          Play to climb
        </Link>
      </footer>
    </div>
  );
}
