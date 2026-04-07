import { NextResponse } from "next/server";

export async function POST() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const key = process.env.PAYMENT_GATEWAY_PUBLISHABLE_KEY;

  if (!apiUrl || !key) {
    return NextResponse.json(
      { error: "Gateway not configured" },
      { status: 500 }
    );
  }

  const res = await fetch(`${apiUrl}/api/v1/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      amount: 0.02,
      currency: "ETH",
      description: "Pro Course — lifetime access",
    }),
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    return NextResponse.json(
      { error: json.error || `Gateway error ${res.status}` },
      { status: res.status }
    );
  }

  // Return only what the client needs — key never leaves the server
  const { id, address, amount, currency, expiresAt } = json.data;
  return NextResponse.json({ id, address, amount, currency, expiresAt });
}
