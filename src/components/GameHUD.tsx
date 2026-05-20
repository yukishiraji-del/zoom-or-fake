import { GAME_CONFIG, formatScore } from "@/lib/scoring";

interface GameHUDProps {
  score: number;
  lives: number;
  streak: number;
  currentRound: number;
}

function CameraIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`h-4 w-4 ${active ? "text-white" : "text-white/25"}`}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.5 9.4V7.2c0-.7-.5-1.2-1.2-1.2H4.2C3.5 6 3 6.5 3 7.2v9.6c0 .7.5 1.2 1.2 1.2h11.1c.7 0 1.2-.5 1.2-1.2v-2.2l4.5 3.1V6.3l-4.5 3.1Z" />
    </svg>
  );
}

export function GameHUD({ score, lives, streak, currentRound }: GameHUDProps) {
  return (
    <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: GAME_CONFIG.MAX_LIVES }).map((_, i) => {
          const active = i < lives;
          return (
            <div
              key={i}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                active ? "bg-[#2d8cff]" : "bg-white/10"
              }`}
            >
              <CameraIcon active={active} />
            </div>
          );
        })}
      </div>

      <div className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white/60">
        <span className="text-white">{currentRound}</span> / {GAME_CONFIG.TOTAL_ROUNDS}
      </div>

      <div className="text-right">
        <div className="text-xl font-black leading-none text-white">{formatScore(score)}</div>
        <div className="mt-0.5 h-4 text-xs font-bold leading-none text-yellow-300">
          {streak >= 2 ? `STREAK x${streak}` : ""}
        </div>
      </div>
    </div>
  );
}
