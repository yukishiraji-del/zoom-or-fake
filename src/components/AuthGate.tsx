"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { MiniAppWalletAuthSuccessPayload, MiniKit, WalletAuthInput } from "@worldcoin/minikit-js";

type AuthState = "checking" | "signed_in" | "needs_auth" | "signing" | "demo" | "error";

const SIGN_IN_STATEMENT = "Sign in to Fake or Real";

function shortAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function AuthGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>("checking");
  const [label, setLabel] = useState("Demo Player");

  useEffect(() => {
    const address = sessionStorage.getItem("for_auth_address");
    const storedLabel = sessionStorage.getItem("for_auth_label");

    if (address) {
      setLabel(storedLabel ?? shortAddress(address));
      setState(address === "demo" ? "demo" : "signed_in");
      return;
    }

    if (!process.env.NEXT_PUBLIC_WLD_APP_ID) {
      sessionStorage.setItem("for_auth_address", "demo");
      sessionStorage.setItem("for_auth_label", "Demo Player");
      setState("demo");
      return;
    }

    setState(MiniKit.isInstalled() ? "needs_auth" : "needs_auth");
  }, []);

  async function continueDemo() {
    sessionStorage.setItem("for_auth_address", "demo");
    sessionStorage.setItem("for_auth_label", "Demo Player");
    setLabel("Demo Player");
    setState("demo");
  }

  async function signIn() {
    if (!process.env.NEXT_PUBLIC_WLD_APP_ID || !MiniKit.isInstalled()) {
      await continueDemo();
      return;
    }

    setState("signing");

    try {
      const nonceRes = await fetch("/api/nonce", { method: "POST" });
      const { nonce } = await nonceRes.json();

      const input: WalletAuthInput = {
        nonce,
        statement: SIGN_IN_STATEMENT,
        expirationTime: new Date(Date.now() + 1000 * 60 * 20),
      };

      const { finalPayload } = await MiniKit.commandsAsync.walletAuth(input);

      if (finalPayload.status === "error") {
        setState("error");
        return;
      }

      const verifyRes = await fetch("/api/complete-siwe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payload: finalPayload as MiniAppWalletAuthSuccessPayload,
          nonce,
          statement: SIGN_IN_STATEMENT,
        }),
      });

      if (!verifyRes.ok) {
        setState("error");
        return;
      }

      const { address } = await verifyRes.json();
      const nextLabel = shortAddress(address);
      sessionStorage.setItem("for_auth_address", address);
      sessionStorage.setItem("for_auth_label", nextLabel);
      setLabel(nextLabel);
      setState("signed_in");
    } catch {
      setState("error");
    }
  }

  if (state === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1117]">
        <div className="text-sm font-semibold text-white/40">Loading...</div>
      </div>
    );
  }

  if (state === "signed_in" || state === "demo") {
    return (
      <>
        <div className="fixed left-1/2 top-2 z-50 w-full max-w-[430px] -translate-x-1/2 px-4">
          <div className="mx-auto w-fit rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-black text-emerald-100 backdrop-blur">
            {state === "demo" ? "Demo mode" : `Signed in ${label}`}
          </div>
        </div>
        {children}
      </>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#0f1117] px-5 text-white">
      <div className="space-y-5">
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#2d8cff]">World login</p>
          <h1 className="text-4xl font-black leading-none">Fake or Real?</h1>
          <p className="text-sm font-medium leading-relaxed text-white/60">
            In the World App Mini App, sign in with your World wallet before starting the game.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
          <p className="text-sm font-black text-white">How login works</p>
          <p className="mt-2 text-xs leading-relaxed text-white/60">
            World login is used only when the Mini App opens. There is no extra World ID verification after the game.
          </p>
        </div>

        {state === "error" && (
          <p className="rounded-xl bg-rose-300/10 px-3 py-2 text-xs font-semibold text-rose-200">
            Sign-in failed. Please try again.
          </p>
        )}

        <button
          onClick={signIn}
          disabled={state === "signing"}
          className="w-full rounded-2xl bg-[#2d8cff] py-4 text-base font-black text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
        >
          {state === "signing" ? "Signing in..." : "Sign in with World"}
        </button>

        <button
          onClick={continueDemo}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 text-sm font-bold text-white/70 transition hover:border-white/25"
        >
          Continue demo in browser
        </button>
      </div>
    </div>
  );
}
