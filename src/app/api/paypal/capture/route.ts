import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

async function getPayPalToken(): Promise<string> {
  const base = process.env.PAYPAL_BASE_URL ?? "https://api-m.sandbox.paypal.com";
  const credentials = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error("PayPal token ophalen mislukt");
  const data = await res.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  const { order_id } = await req.json();

  if (!order_id) {
    return NextResponse.json({ error: "Geen order_id" }, { status: 400 });
  }

  const paypalBase = process.env.PAYPAL_BASE_URL ?? "https://api-m.sandbox.paypal.com";
  const supabase = createServiceClient();

  try {
    const token = await getPayPalToken();

    // Capture de betaling
    const captureRes = await fetch(`${paypalBase}/v2/checkout/orders/${order_id}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const capture = await captureRes.json();

    // Al gecaptured is ook OK
    if (!captureRes.ok && capture.name !== "ORDER_ALREADY_CAPTURED") {
      return NextResponse.json({ error: capture.message ?? "Capture mislukt" }, { status: 500 });
    }

    if (capture.status !== "COMPLETED" && capture.name !== "ORDER_ALREADY_CAPTURED") {
      return NextResponse.json({ error: "Betaling niet voltooid" }, { status: 400 });
    }

    // Zoek stake op via het opgeslagen PayPal order ID
    const { data: stake } = await supabase
      .from("stakes")
      .select("*, packages(*)")
      .eq("mollie_payment_id", order_id)
      .single();

    if (!stake) {
      return NextResponse.json({ error: "Stake niet gevonden" }, { status: 404 });
    }

    // Zet stake op confirmed
    await supabase
      .from("stakes")
      .update({ status: "confirmed" })
      .eq("id", stake.id);

    // Update sold_percent op package
    const pkg = Array.isArray(stake.packages) ? stake.packages[0] : stake.packages;
    if (pkg) {
      const newSold = Math.min(
        Number(pkg.sold_percent) + Number(stake.percent),
        pkg.total_percent
      );
      await supabase
        .from("packages")
        .update({ sold_percent: newSold })
        .eq("id", pkg.id);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
