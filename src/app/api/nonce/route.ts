import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

export async function POST() {
  const nonce = randomBytes(16).toString("hex");
  const response = NextResponse.json({ nonce });

  response.cookies.set("for_siwe_nonce", nonce, {
    httpOnly: true,
    maxAge: 60 * 10,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
