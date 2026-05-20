import { NextRequest, NextResponse } from "next/server";
import { MiniAppWalletAuthSuccessPayload, verifySiweMessage } from "@worldcoin/minikit-js";

type RequestBody = {
  payload: MiniAppWalletAuthSuccessPayload;
  nonce: string;
  statement?: string;
};

export async function POST(req: NextRequest) {
  const { payload, nonce, statement } = (await req.json()) as RequestBody;
  const cookieNonce = req.cookies.get("for_siwe_nonce")?.value;

  if (!payload || !nonce || nonce !== cookieNonce) {
    return NextResponse.json({ isValid: false, error: "Invalid nonce" }, { status: 400 });
  }

  try {
    const verification = await verifySiweMessage(payload, nonce, statement);

    if (!verification.isValid) {
      return NextResponse.json({ isValid: false }, { status: 400 });
    }

    const address = verification.siweMessageData.address;
    if (!address) {
      return NextResponse.json({ isValid: false, error: "Missing address" }, { status: 400 });
    }

    const response = NextResponse.json({ isValid: true, address });

    response.cookies.set("for_session", address, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { isValid: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}
