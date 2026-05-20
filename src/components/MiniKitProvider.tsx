"use client";

import { MiniKitProvider as WorldMiniKitProvider } from "@worldcoin/minikit-js/minikit-provider";
import type { ReactNode } from "react";

export function MiniKitProvider({ children }: { children: ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_WLD_APP_ID;

  if (!appId) {
    return <>{children}</>;
  }

  return (
    <WorldMiniKitProvider props={{ appId }}>
      {children}
    </WorldMiniKitProvider>
  );
}
