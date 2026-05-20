"use client";

import { useRef, useState } from "react";
import { ParticipantType, Question } from "@/data/questions";
import { FeedbackState } from "@/hooks/useGame";
import { GAME_CONFIG } from "@/lib/scoring";

interface ZoomTileProps {
  question: Question;
  timeRemaining: number;
  feedback: FeedbackState | null;
  disabled?: boolean;
  onSwipe?: (guess: ParticipantType) => void;
}

function MicIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1a7 7 0 0 0 6-6.9h-2Z" />
    </svg>
  );
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

      <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[.16em] text-white/80 backdrop-blur">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        Live meeting
      </div>

      <div className="absolute right-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white/75 backdrop-blur">
        {Math.ceil(timeRemaining)}s
      </div>

      {Math.abs(dragX) > 18 && !disabled && (
        <div
          className={`absolute inset-y-0 flex w-32 items-center justify-center text-sm font-black tracking-[.16em] text-white transition-opacity ${
            dragX > 0 ? "left-0 bg-emerald-500/30" : "right-0 bg-rose-500/30"
          }`}
        >
          {dragX > 0 ? "REAL" : "FAKE"}
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-4 pb-4 pt-20">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-white/10 text-white">
            <MicIcon />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-bold leading-tight text-white">{question.displayName}</p>
            <p className="truncate text-xs leading-tight text-white/50">{question.jobTitle}</p>
          </div>
        </div>
      </div>

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
