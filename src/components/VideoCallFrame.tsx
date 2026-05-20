import type { ReactNode } from "react";

interface VideoCallChromeProps {
  name: string;
  role?: string;
  label?: string;
  statusRight?: ReactNode;
  compact?: boolean;
  showToolbar?: boolean;
}

function MicIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1a7 7 0 0 0 6-6.9h-2Z" />
    </svg>
  );
}

function CameraIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.5 9.4V7.2c0-.7-.5-1.2-1.2-1.2H4.2C3.5 6 3 6.5 3 7.2v9.6c0 .7.5 1.2 1.2 1.2h11.1c.7 0 1.2-.5 1.2-1.2v-2.2l4.5 3.1V6.3l-4.5 3.1Z" />
    </svg>
  );
}

function ShieldIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2 5 5v6.2c0 4.3 2.8 8.3 7 10.8 4.2-2.5 7-6.5 7-10.8V5l-7-3Zm3.7 7.6-4.4 4.4-2.1-2.1 1.2-1.2.9.9 3.2-3.2 1.2 1.2Z" />
    </svg>
  );
}

function DotGrid() {
  return (
    <div className="absolute right-3 top-11 grid grid-cols-2 gap-1 opacity-70">
      {Array.from({ length: 4 }).map((_, index) => (
        <span key={index} className="h-1 w-1 rounded-full bg-white/45" />
      ))}
    </div>
  );
}

export function VideoCallChrome({
  name,
  role,
  label = "Live call",
  statusRight = "HD",
  compact = false,
  showToolbar = false,
}: VideoCallChromeProps) {
  const nameSize = compact ? "text-[10px]" : "text-base";
  const roleSize = compact ? "text-[9px]" : "text-xs";

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 rounded-[inherit] ring-2 ring-white/10" />
      <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/75 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

      <div className={`absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-black/55 text-white/85 backdrop-blur ${compact ? "px-2 py-0.5 text-[8px]" : "px-3 py-1 text-[11px]"} font-semibold uppercase tracking-[.14em]`}>
        <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,.8)]" />
        {label}
      </div>

      <div className={`absolute right-2 top-2 rounded-full bg-black/55 text-white/75 backdrop-blur ${compact ? "px-2 py-0.5 text-[8px]" : "px-3 py-1 text-xs"} font-semibold`}>
        {statusRight}
      </div>

      {!compact && <DotGrid />}

      <div className={compact ? "absolute inset-x-2 bottom-2" : "absolute inset-x-4 bottom-4"}>
        <div className="flex items-center gap-2">
          <div className={`flex flex-none items-center justify-center rounded-full bg-white/12 text-white ${compact ? "h-5 w-5" : "h-7 w-7"}`}>
            <MicIcon className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
          </div>
          <div className="min-w-0">
            <p className={`truncate font-bold leading-tight text-white ${nameSize}`}>{name}</p>
            {role && <p className={`truncate leading-tight text-white/50 ${roleSize}`}>{role}</p>}
          </div>
        </div>

        {showToolbar && (
          <div className="mt-3 grid grid-cols-3 gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-2 backdrop-blur">
            <div className="flex items-center justify-center text-white/75">
              <MicIcon />
            </div>
            <div className="flex items-center justify-center text-white/75">
              <CameraIcon />
            </div>
            <div className="flex items-center justify-center text-emerald-200">
              <ShieldIcon />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
