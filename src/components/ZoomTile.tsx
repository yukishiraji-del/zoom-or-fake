"use client";

import { useRef, useState } from "react";
import { ParticipantType, Question } from "@/data/questions";
import { FeedbackState } from "@/hooks/useGame";
import { GAME_CONFIG } from "@/lib/scoring";
import { VideoCallChrome } from "@/components/VideoCallFrame";

interface ZoomTileProps {
  question: Question;
  timeRemaining: number;
  feedback: FeedbackState | null;
  disabled?: boolean;
  onSwipe?: (guess: ParticipantType) => void;
}

export function ZoomTile({
  question,
  timeRemaining,
  feedback,
  disabled = false,
  onSwipe,
}: ZoomTileProps) {
  const startX = useRef<number | null>(null);
  const [dragX, setDragX] = useState(0);
  const timerPct = Math.max(0, (timeRemaining / GAME_CONFIG.TOTAL_TIME) * 100);
  const timerColor = timerPct > 62 ? "#2d8cff" : timerPct > 34 ? "#f59e0b" : "#ef4444";

  function handlePointerUp() {
    if (!disabled && onSwipe && Math.abs(dragX) > 78) {
      onSwipe(dragX < 0 ? "fake" : "real");
    }
    startX.current = null;
    setDragX(0);
  }

  const answerLabel = feedback?.actualType === "real" ? "REAL" : "FAKE";
  const feedbackTone = feedback?.correct
    ? "from-emerald-500/95 to-emerald-700/95"
    : "from-rose-500/95 to-rose-700/95";

  return (
    <div
      className="relative h-full min-h-[300px] w-full touch-pan-y overflow-hidden rounded-2xl bg-black shadow-[0_18px_70px_rgba(0,0,0,.35)]"
      style={{ aspectRatio: "4 / 3" }}
      onPointerDown={(event) => {
        startX.current = event.clientX;
      }}
      onPointerMove={(event) => {
        if (startX.current === null || disabled) return;
        const delta = event.clientX - startX.current;
        setDragX(Math.max(-120, Math.min(120, delta)));
      }}
      onPointerCancel={handlePointerUp}
      onPointerUp={handlePointerUp}
    >
      <img
        src={question.imageUrl}
        alt={`${question.displayName} video call participant`}
        className="h-full w-full select-none object-cover"
        draggable={false}
      />

      <div
        className="pointer-events-none absolute inset-0 transition-transform duration-150"
        style={{ transform: `translateX(${dragX * 0.08}px)` }}
      />

      <div className="absolute left-0 right-0 top-0 h-1.5 bg-black/75">
        <div
          className="h-full transition-all duration-100 ease-linear"
          style={{ width: `${timerPct}%`, backgroundColor: timerColor }}
        />
      </div>

      <VideoCallChrome
        name={question.displayName}
        role={question.jobTitle}
        label="Live meeting"
        statusRight={`${Math.ceil(timeRemaining)}s`}
        showToolbar
      />

      {Math.abs(dragX) > 18 && !disabled && (
        <div
          className={`absolute inset-y-0 flex w-32 items-center justify-center text-sm font-black tracking-[.16em] text-white transition-opacity ${
            dragX > 0 ? "left-0 bg-emerald-500/30" : "right-0 bg-rose-500/30"
          }`}
        >
          {dragX > 0 ? "REAL" : "FAKE"}
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-[#2d8cff]/40" />

      {feedback && (
        <div className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-b ${feedbackTone} p-4 animate-pop-in`}>
          <div className="mb-auto mt-10 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-5xl font-black text-white">
              {feedback.correct ? "✓" : "×"}
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[.2em] text-white/70">
              {feedback.correct ? "Correct" : feedback.guess === "timeout" ? "Time out" : "Miss"}
            </p>
            <p className="mt-1 text-4xl font-black leading-none text-white">{answerLabel}</p>
            {feedback.correct && (
              <p className="mt-3 text-lg font-black text-yellow-200">+{feedback.pointsEarned} pts</p>
            )}
          </div>

          <div className="rounded-2xl bg-black/25 p-3 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-white/60">Signal</p>
            <p className="mt-1 text-sm font-bold leading-snug text-white">{feedback.signal}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-white/70">{feedback.explanation}</p>
            {feedback.streakBonus && (
              <p className="mt-2 rounded-full bg-yellow-300 px-3 py-1 text-center text-xs font-black text-slate-950">
                STREAK BONUS +50
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
