"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ParticipantType, Question, getShuffledQuestions } from "@/data/questions";
import { GAME_CONFIG, calculateScore } from "@/lib/scoring";

export type GamePhase = "idle" | "playing" | "feedback" | "gameover";

export interface FeedbackState {
  correct: boolean;
  pointsEarned: number;
  actualType: ParticipantType;
  guess: ParticipantType | "timeout";
  streakBonus: boolean;
  signal: string;
  explanation: string;
}

export interface GameState {
  phase: GamePhase;
  questions: Question[];
  currentIndex: number;
  score: number;
  lives: number;
  streak: number;
  bestStreak: number;
  correctCount: number;
  timeRemaining: number;
  feedback: FeedbackState | null;
}

function freshState(): GameState {
  return {
    phase: "idle",
    questions: getShuffledQuestions(GAME_CONFIG.TOTAL_ROUNDS),
    currentIndex: 0,
    score: 0,
    lives: GAME_CONFIG.MAX_LIVES,
    streak: 0,
    bestStreak: 0,
    correctCount: 0,
    timeRemaining: GAME_CONFIG.TOTAL_TIME,
    feedback: null,
  };
}

export function useGame() {
  const [state, setState] = useState<GameState>(freshState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.phase !== "playing") return prev;
        const next = prev.timeRemaining - 0.1;
        if (next <= 0) {
          // Time's up — lose a life, show feedback
          return {
            ...prev,
            phase: "feedback",
            timeRemaining: 0,
            lives: prev.lives - 1,
            streak: 0,
            feedback: {
              correct: false,
              pointsEarned: 0,
              actualType: prev.questions[prev.currentIndex].type,
              guess: "timeout",
              streakBonus: false,
              signal: prev.questions[prev.currentIndex].signal,
              explanation: prev.questions[prev.currentIndex].explanation,
            },
          };
        }
        return { ...prev, timeRemaining: next };
      });
    }, 100);
  }, [clearTimer]);

  // Start/stop timer based on phase
  useEffect(() => {
    if (state.phase === "playing") {
      startTimer();
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [state.phase, state.currentIndex, startTimer, clearTimer]);

  const startGame = useCallback(() => {
    setState({ ...freshState(), phase: "playing" });
  }, []);

  const answer = useCallback((guess: ParticipantType) => {
    clearTimer();
    setState((prev) => {
      if (prev.phase !== "playing") return prev;
      const q = prev.questions[prev.currentIndex];
      const correct = guess === q.type;
      const points = correct ? calculateScore(prev.timeRemaining) : 0;
      const newStreak = correct ? prev.streak + 1 : 0;
      const isStreakMilestone =
        correct && newStreak > 0 && newStreak % GAME_CONFIG.STREAK_THRESHOLD === 0;
      const bonus = isStreakMilestone ? GAME_CONFIG.STREAK_BONUS : 0;
      return {
        ...prev,
        phase: "feedback",
        score: prev.score + points + bonus,
        lives: correct ? prev.lives : prev.lives - 1,
        streak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        correctCount: prev.correctCount + (correct ? 1 : 0),
        timeRemaining: 0,
        feedback: {
          correct,
          pointsEarned: points + bonus,
          actualType: q.type,
          guess,
          streakBonus: isStreakMilestone,
          signal: q.signal,
          explanation: q.explanation,
        },
      };
    });
  }, [clearTimer]);

  const nextRound = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== "feedback") return prev;
      if (prev.lives <= 0) return { ...prev, phase: "gameover", feedback: null };
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.questions.length) return { ...prev, phase: "gameover", feedback: null };
      return {
        ...prev,
        phase: "playing",
        currentIndex: nextIndex,
        timeRemaining: GAME_CONFIG.TOTAL_TIME,
        feedback: null,
      };
    });
  }, []);

  return { state, startGame, answer, nextRound };
}
