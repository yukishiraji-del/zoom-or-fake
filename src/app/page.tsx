import Link from "next/link";

function VideoIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.5 9.4V7.2c0-.7-.5-1.2-1.2-1.2H4.2C3.5 6 3 6.5 3 7.2v9.6c0 .7.5 1.2 1.2 1.2h11.1c.7 0 1.2-.5 1.2-1.2v-2.2l4.5 3.1V6.3l-4.5 3.1Z" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 4h2a1 1 0 0 1 1 1v2a5 5 0 0 1-4.2 4.9A6 6 0 0 1 13 15.9V18h3v2H8v-2h3v-2.1a6 6 0 0 1-3.8-4A5 5 0 0 1 3 7V5a1 1 0 0 1 1-1h2V3h12v1ZM6 6H5v1a3 3 0 0 0 1.4 2.5A7.8 7.8 0 0 1 6 7V6Zm12 1c0 .9-.1 1.7-.4 2.5A3 3 0 0 0 19 7V6h-1v1Z" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0f1117] px-5 pb-5 pt-4 text-white">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2d8cff]">
            <VideoIcon />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-white/40">World Mini App</p>
            <p className="text-sm font-bold text-white/70">Video Call Game</p>
          </div>
        </div>
        <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[11px] font-bold text-emerald-200">
          10 rounds
        </div>
      </header>

      <section className="flex flex-1 flex-col justify-center gap-5 py-6">
        <div className="space-y-3">
          <h1 className="text-5xl font-black leading-[0.95] tracking-normal">
            Fake
            <br />
            or Real?
          </h1>
          <p className="max-w-[320px] text-base font-medium leading-relaxed text-white/60">
            A 10-round video-call game where you spot whether each participant is real or a deepfake.
          </p>
        </div>

        <div className="space-y-5 rounded-[24px] border border-white/10 bg-white/[0.045] px-4 py-5 text-center shadow-[0_22px_70px_rgba(0,0,0,.28)]">
          <div className="relative mx-auto aspect-square w-full max-w-[236px] overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_18px_60px_rgba(0,0,0,.34)]">
            <img
              src="/images/app-icon.png"
              alt="Fake or Real app icon"
              className="h-full w-full rounded-[22px] object-cover"
            />
            <div className="absolute left-6 top-6 flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-[9px] font-black uppercase tracking-[.16em] text-white/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,.8)]" />
              Waiting room
            </div>
            <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-2 text-sm font-semibold text-white/75 backdrop-blur">
              <div className="flex justify-center">Mic</div>
              <div className="flex justify-center">Cam</div>
              <div className="flex justify-center text-emerald-200">ID</div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-black uppercase tracking-[.22em] text-[#8cc5ff]">Deepfake challenge</p>
            <h2 className="text-[28px] font-black leading-tight text-white">
              Can you really tell whether the person on the other side of the screen is who they claim to be?
            </h2>
            <p className="mx-auto max-w-[310px] text-sm font-semibold leading-relaxed text-white/50">
              You have 10 rounds, 3 lives, and only a few seconds to decide.
            </p>
          </div>
        </div>
      </section>

      <footer className="space-y-3">
        <Link
          href="/game"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2d8cff] py-4 text-base font-black text-white shadow-[0_18px_48px_rgba(45,140,255,.28)] transition hover:bg-blue-400 active:scale-[0.99]"
        >
          <VideoIcon />
          Start Game
        </Link>
        <Link
          href="/leaderboard"
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 text-sm font-bold text-white/70 transition hover:border-white/25 hover:text-white"
        >
          <TrophyIcon />
          Leaderboard
        </Link>
      </footer>
    </div>
  );
}
