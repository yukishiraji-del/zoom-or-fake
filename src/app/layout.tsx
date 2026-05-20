import type { Metadata } from "next";
import "./globals.css";
import { AuthGate } from "@/components/AuthGate";
import { MiniKitProvider } from "@/components/MiniKitProvider";

export const metadata: Metadata = {
  title: "Fake or Real?",
  description: "A World Mini App game about spotting deepfakes in video calls.",
  applicationName: "Fake or Real",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <MiniKitProvider>
          <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-[#0f1117]">
            <AuthGate>{children}</AuthGate>
          </main>
        </MiniKitProvider>
      </body>
    </html>
  );
}
