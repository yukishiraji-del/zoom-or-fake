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
          World login
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

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_22px_70px_rgba(0,0,0,.28)]">
          <div className="grid aspect-[4/3] grid-cols-2 gap-3 bg-[#1f2937] p-4">
            {[
              ["/images/photos/real/real-03.jpg", "Sora"],
              ["/images/photos/fake/fake-04.jpg", "Mika"],
              ["/images/photos/real/real-07.jpg", "Leo"],
              ["/images/photos/fake/fake-09.jpg", "Rio"],
            ].map(([src, name]) => (
              <div key={src} className="relative overflow-hidden rounded-xl bg-[#0b1220]">
                <img src={src} alt={`${name} preview`} className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-black/50 px-2 py-1">
                  <p className="truncate text-[10px] font-black text-white">{name}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 border-t border-white/10 text-center">
            <div className="py-3">
              <p className="text-xl font-black text-white">10</p>
              <p className="text-[11px] font-semibold text-white/40">Rounds</p>
            </div>
            <div className="border-x border-white/10 py-3">
              <p className="text-xl font-black text-[#2d8cff]">3</p>
              <p className="text-[11px] font-semibold text-white/40">Lives</p>
            </div>
            <div className="py-3">
              <p className="text-xl font-black text-yellow-300">300</p>
              <p className="text-[11px] font-semibold text-white/40">Max pts</p>
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          {[
            "Watch screen noise, face edges, and light direction",
            "Answer faster to score more points",
            "In the Mini App, sign in first with World wallet",
          ].map((item, index) => (
            <div key={item} className="flex items-center gap-3 rounded-xl bg-white/[0.06] px-3 py-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-black text-white/70">
                {index + 1}
              </span>
              <span className="text-sm font-semibold text-white/70">{item}</span>
            </div>
          ))}
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
