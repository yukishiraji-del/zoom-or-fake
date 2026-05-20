"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MiniKit } from "@worldcoin/minikit-js";
import { formatScore } from "@/lib/scoring";

interface GameResult {
  score: number;
  bestStreak: number;
  correct: number;
  total: number;
}

type SubmitState = "idle" | "pending" | "success" | "error";
type ShareState = "idle" | "shared" | "error";

const WORLD_ID_BUSINESS_URL = "https://world.org/blog/announcements/zoom-docusign-world-id-for-business";

function VideoIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.5 9.4V7.2c0-.7-.5-1.2-1.2-1.2H4.2C3.5 6 3 6.5 3 7.2v9.6c0 .7.5 1.2 1.2 1.2h11.1c.7 0 1.2-.5 1.2-1.2v-2.2l4.5 3.1V6.3l-4.5 3.1Z" />
    </svg>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<GameResult | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [shareState, setShareState] = useState<ShareState>("idle");

  useEffect(() => {
    const score = Number.parseInt(sessionStorage.getItem("for_score") ?? "0", 10);
    const bestStreak = Number.parseInt(sessionStorage.getItem("for_best_streak") ?? "0", 10);
    const correct = Number.parseInt(sessionStorage.getItem("for_correct") ?? "0", 10);
    const total = Number.parseInt(sessionStorage.getItem("for_total") ?? "10", 10);
    setResult({ score, bestStreak, correct, total });
  }, []);

  const accuracy = useMemo(() => {
    if (!result || result.total === 0) return 0;
    return Math.round((result.correct / result.total) * 100);
  }, [result]);

  async function submitToLeaderboard() {
    if (!result) return;
    setSubmitState("pending");

    try {
      const res = await fetch("/api/submit-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: result.score,
          correct: result.correct,
          total: result.total,
          handle: sessionStorage.getItem("for_auth_label") ?? "Demo Player",
        }),
      });

      setSubmitState(res.ok ? "success" : "error");
    } catch {
      setSubmitState("error");
    }
  }

  async function shareResult() {
    if (!result) return;
    const title = "Fake or Real?";
    const text = `I scored ${formatScore(result.score)} pts with ${accuracy}% accuracy in Fake or Real?`;
    const url = window.location.origin;

    try {
      if (process.env.NEXT_PUBLIC_WLD_APP_ID && MiniKit.isInstalled()) {
        await MiniKit.commandsAsync.share({ title, text, url });
      } else if (navigator.share) {
        await navigator.share({ title, text, url });
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`);
      }
      setShareState("shared");
    } catch {
      setShareState("error");
    }
  }

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1117]">
        <div className="text-sm font-semibold text-white/40">Loading...</div>
      </div>
    );
  }

  const rank =
    accuracy >= 80
      ? "Deepfake Detective"
      : accuracy >= 60
        ? "Sharp Observer"
        : accuracy >= 40
          ? "Signal Hunter"
          : "Keep Training";

  return (
    <div className="flex min-h-screen flex-col gap-5 bg-[#0f1117] px-5 pb-5 pt-4 text-white">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2d8cff]">
            <VideoIcon />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-white/40">result</p>
            <h1 className="text-base font-black leading-none text-white">Fake or Real?</h1>
          </div>
        </div>
        <Link href="/" className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70">
          Home
        </Link>
      </header>

      <section className="rounded-[24px] border border-white/10 bg-white/[0.06] p-5 text-center shadow-[0_20px_70px_rgba(0,0,0,.28)]">
        <p className="text-sm font-bold text-white/40">Your Score</p>
        <p className="mt-2 text-6xl font-black leading-none text-white">{formatScore(result.score)}</p>
        <div className="mt-4 inline-flex rounded-full border border-[#2d8cff]/30 bg-[#2d8cff]/15 px-4 py-1 text-sm font-black text-[#8cc5ff]">
          {rank}
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3">
        {[
          { value: `${result.correct}/${result.total}`, label: "Correct", color: "text-emerald-300" },
          { value: `${accuracy}%`, label: "Accuracy", color: "text-[#8cc5ff]" },
          { value: `x${result.bestStreak}`, label: "Best streak", color: "text-yellow-300" },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl bg-white/[0.06] py-4 text-center">
            <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
            <p className="mt-1 text-[11px] font-semibold text-white/40">{item.label}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-[#2d8cff]/25 bg-[#2d8cff]/[0.12] p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-[#2d8cff] text-white">
            <VideoIcon />
          </div>
          <div>
            <p className="text-sm font-black leading-snug text-white">
              There should be a better way to verify that the person you’re talking to is real — and actually the intended person.
            </p>
            <a
              href={WORLD_ID_BUSINESS_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-950 transition hover:bg-[#dceeff]"
            >
              Read about World ID for business
            </a>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-base font-black text-white">Weekly Leaderboard</p>
            <p className="mt-1 text-xs leading-relaxed text-white/60">
              Submit your score as a signed-in player. No extra World ID verification is used after the game.
            </p>
          </div>
          <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[10px] font-black text-emerald-200">
            Login
          </span>
        </div>

        {submitState === "success" ? (
          <p className="mt-4 rounded-xl bg-emerald-300/10 px-3 py-2 text-sm font-bold text-emerald-200">
            Score submitted.
          </p>
        ) : (
          <button
            onClick={submitToLeaderboard}
            disabled={submitState === "pending"}
            className="mt-4 w-full rounded-2xl bg-[#2d8cff] py-3.5 text-sm font-black text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
          >
            {submitState === "pending" ? "Submitting..." : "Submit score"}
          </button>
        )}
        {submitState === "error" && (
          <p className="mt-2 text-xs font-semibold text-rose-300">Could not submit your score. Please try again.</p>
        )}
      </section>

      <div className="mt-auto space-y-3">
        <button
          onClick={() => router.push("/game")}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-base font-black text-white shadow-[0_18px_48px_rgba(16,185,129,.24)] transition hover:bg-emerald-400 active:scale-[0.99]"
        >
          <VideoIcon />
          Play Again
        </button>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/leaderboard"
            className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 text-sm font-bold text-white/70 transition hover:border-white/25"
          >
            Leaderboard
          </Link>
          <button
            onClick={shareResult}
            className="rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 text-sm font-bold text-white/70 transition hover:border-white/25"
          >
            Share
          </button>
        </div>
        {shareState === "shared" && <p className="text-center text-xs font-semibold text-emerald-200">Share text is ready.</p>}
        {shareState === "error" && <p className="text-center text-xs font-semibold text-rose-300">Could not share.</p>}
      </div>
    </div>
  );
}
