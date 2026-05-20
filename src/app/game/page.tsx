"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { MiniKit } from "@worldcoin/minikit-js";
import { ParticipantType } from "@/data/questions";
import { AnswerButtons } from "@/components/AnswerButtons";
import { GameHUD } from "@/components/GameHUD";
import { ZoomTile } from "@/components/ZoomTile";
import { useGame } from "@/hooks/useGame";
import { GAME_CONFIG } from "@/lib/scoring";

function VideoIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.5 9.4V7.2c0-.7-.5-1.2-1.2-1.2H4.2C3.5 6 3 6.5 3 7.2v9.6c0 .7.5 1.2 1.2 1.2h11.1c.7 0 1.2-.5 1.2-1.2v-2.2l4.5 3.1V6.3l-4.5 3.1Z" />
    </svg>
  );
}

function ToolbarIcon({ children, label }: { children: ReactNode; label: string }) {
  return (
    <button className="flex min-w-12 flex-col items-center gap-1 text-white/40" disabled>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">{children}</span>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function OpeningScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0f1117] px-5 pb-5 pt-4 text-white">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2d8cff] text-white">
            <VideoIcon />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-white/40">meeting room</p>
            <h1 className="text-base font-black leading-none text-white">Fake or Real?</h1>
          </div>
        </div>
        <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[11px] font-bold text-emerald-200">
          Challenge
        </div>
      </header>

      <section className="flex flex-1 flex-col justify-center gap-6 py-6">
        <div className="relative mx-auto aspect-square w-full max-w-[270px] overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_24px_80px_rgba(0,0,0,.38)]">
          <img
            src="/images/app-icon.png"
            alt="Fake or Real app icon"
            className="h-full w-full rounded-[24px] object-cover"
          />
          <div className="absolute left-6 top-6 flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-[10px] font-black uppercase tracking-[.16em] text-white/80 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            Waiting room
          </div>
          <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-2 text-white/75 backdrop-blur">
            <div className="flex justify-center">Mic</div>
            <div className="flex justify-center">Cam</div>
            <div className="flex justify-center text-emerald-200">ID</div>
          </div>
        </div>

        <div className="space-y-4 text-center">
          <p className="text-[11px] font-black uppercase tracking-[.2em] text-[#8cc5ff]">Deepfake challenge</p>
          <h2 className="text-3xl font-black leading-tight text-white">
            Can you really tell whether the person on the other side of the screen is who they claim to be?
          </h2>
          <p className="mx-auto max-w-[310px] text-sm font-medium leading-relaxed text-white/55">
            You have 10 rounds, 3 lives, and only a few seconds to decide.
          </p>
        </div>
      </section>

      <button
        onClick={onStart}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2d8cff] py-4 text-base font-black text-white shadow-[0_18px_48px_rgba(45,140,255,.28)] transition hover:bg-blue-400 active:scale-[0.99]"
      >
        <VideoIcon />
        Start Challenge
      </button>
    </div>
  );
}

export default function GamePage() {
  const { state, startGame, answer, nextRound } = useGame();
  const router = useRouter();

  useEffect(() => {
    if (state.phase !== "feedback") return;
    const timer = setTimeout(nextRound, GAME_CONFIG.FEEDBACK_DURATION);
    return () => clearTimeout(timer);
  }, [state.phase, state.feedback, nextRound]);

  useEffect(() => {
    if (state.phase !== "gameover") return;
    sessionStorage.setItem("for_score", state.score.toString());
    sessionStorage.setItem("for_best_streak", state.bestStreak.toString());
    sessionStorage.setItem("for_correct", state.correctCount.toString());
    sessionStorage.setItem("for_total", state.questions.length.toString());
    router.push("/result");
  }, [state.phase, state.score, state.bestStreak, state.correctCount, state.questions.length, router]);

  function answerRound(guess: ParticipantType) {
    if (process.env.NEXT_PUBLIC_WLD_APP_ID && MiniKit.isInstalled()) {
      void MiniKit.commandsAsync
        .sendHapticFeedback({ hapticsType: "selection-changed" })
        .catch(() => undefined);
    }
    answer(guess);
  }

  function startChallenge() {
    if (process.env.NEXT_PUBLIC_WLD_APP_ID && MiniKit.isInstalled()) {
      void MiniKit.commandsAsync
        .sendHapticFeedback({ hapticsType: "impact", style: "medium" })
        .catch(() => undefined);
    }
    startGame();
  }

  if (state.phase === "idle") {
    return <OpeningScreen onStart={startChallenge} />;
  }

  const question = state.questions[state.currentIndex];

  return (
    <div className="flex min-h-screen flex-col gap-3 bg-[#0f1117] px-4 pb-4 pt-3">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2d8cff] text-white">
            <VideoIcon />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-white/40">meeting room</p>
            <h1 className="text-base font-black leading-none text-white">Fake or Real?</h1>
          </div>
        </div>
        <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[11px] font-bold text-emerald-200">
          Signed in
        </div>
      </header>

      <div className="flex items-center justify-between rounded-full border border-white/10 bg-white/[0.06] px-3 py-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          Real participant or deepfake?
        </div>
        <span className="font-mono text-xs font-black text-white">{Math.ceil(state.timeRemaining)}s</span>
      </div>

      <div className="flex-1">
        <ZoomTile
          question={question}
          timeRemaining={state.timeRemaining}
          feedback={state.feedback}
          disabled={state.phase !== "playing"}
          onSwipe={answerRound}
        />
      </div>

      <GameHUD
        score={state.score}
        lives={state.lives}
        streak={state.streak}
        currentRound={state.currentIndex + 1}
      />

      <AnswerButtons onAnswer={answerRound} disabled={state.phase !== "playing"} />

      <div className="grid grid-cols-4 items-center gap-4 rounded-2xl bg-white/[0.05] px-4 py-3">
        <ToolbarIcon label="Mute">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1a7 7 0 0 0 6-6.9h-2Z" />
          </svg>
        </ToolbarIcon>
        <ToolbarIcon label="Video">
          <VideoIcon />
        </ToolbarIcon>
        <ToolbarIcon label="Share">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18 16.1c-.8 0-1.5.3-2 .8L8.9 12.7a3 3 0 0 0 0-1.4L16 7.1a3 3 0 1 0-1-1.7L7.9 9.6a3 3 0 1 0 0 4.8l7.1 4.2a3 3 0 1 0 3-2.5Z" />
          </svg>
        </ToolbarIcon>
        <ToolbarIcon label="End">
          <svg className="h-4 w-4 text-rose-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6.6 10.8a12.2 12.2 0 0 1 10.8 0l1.5-2.5a15.2 15.2 0 0 0-13.8 0l1.5 2.5Zm-3.1 2.1 3.2 3.2 2.7-2.7a7.3 7.3 0 0 1 5.2 0l2.7 2.7 3.2-3.2c-4.6-4.7-12.4-4.7-17 0Z" />
          </svg>
        </ToolbarIcon>
      </div>
    </div>
  );
}
