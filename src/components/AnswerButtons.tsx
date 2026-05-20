import { ParticipantType } from "@/data/questions";

interface AnswerButtonsProps {
  onAnswer: (guess: ParticipantType) => void;
  disabled: boolean;
}

function PersonIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 12.4a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Zm-7.2 7.1c.8-3.6 3.5-5.4 7.2-5.4s6.4 1.8 7.2 5.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7V5.5A1.5 1.5 0 0 1 5.5 4H7m10 0h1.5A1.5 1.5 0 0 1 20 5.5V7M4 17v1.5A1.5 1.5 0 0 0 5.5 20H7m10 0h1.5a1.5 1.5 0 0 0 1.5-1.5V17M8 12h8m-7-3.2 6 6.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AnswerButtons({ onAnswer, disabled }: AnswerButtonsProps) {
  const base =
    "flex min-h-[92px] flex-col items-center justify-center gap-1.5 rounded-[18px] border px-3 text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-white/[0.08] disabled:text-white/30";

  return (
    <div className="grid w-full grid-cols-2 gap-3">
      <button
        onClick={() => onAnswer("real")}
        disabled={disabled}
        className={`${base} border-emerald-300/30 bg-emerald-500/90 shadow-[0_16px_40px_rgba(16,185,129,.22)] hover:bg-emerald-400`}
      >
        <PersonIcon />
        <span className="text-lg font-black leading-none">REAL</span>
        <span className="text-xs font-medium text-emerald-950/70">Real participant</span>
      </button>

      <button
        onClick={() => onAnswer("fake")}
        disabled={disabled}
        className={`${base} border-rose-300/30 bg-rose-500/90 shadow-[0_16px_40px_rgba(244,63,94,.22)] hover:bg-rose-400`}
      >
        <ScanIcon />
        <span className="text-lg font-black leading-none">FAKE</span>
        <span className="text-xs font-medium text-rose-950/70">Deepfake</span>
      </button>
    </div>
  );
}
