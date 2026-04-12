import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { package_id, percent, amount_paid, notes } = await req.json();

  if (!package_id || !percent || !amount_paid) {
    return NextResponse.json({ error: "Ontbrekende velden" }, { status: 400 });
  }

  const { data: pkg } = await supabase
    .from("packages")
    .select("*")
    .eq("id", package_id)
    .single();

  if (!pkg || !["open", "active"].includes(pkg.status)) {
    return NextResponse.json({ error: "Package niet beschikbaar" }, { status: 400 });
  }

  // Maak pending stake aan
  const { data: stake, error: stakeError } = await supabase
    .from("stakes")
    .insert({
      package_id,
      backer_id: user.id,
      percent,
      amount_paid: parseFloat(Number(amount_paid).toFixed(2)),
      notes: notes || null,
      payment_method: "mollie", // bestaand enum-veld, blijft "mollie" als fallback
      status: "pending",
    })
    .select()
    .single();

  if (stakeError || !stake) {
    return NextResponse.json({ error: stakeError?.message ?? "Stake aanmaken mislukt" }, { status: 500 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const paypalBase = process.env.PAYPAL_BASE_URL ?? "https://api-m.sandbox.paypal.com";

  try {
    const token = await getPayPalToken();

    const orderRes = await fetch(`${paypalBase}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "EUR",
              value: Number(amount_paid).toFixed(2),
            },
            description: `Pokerbacking — ${percent}% stake in ${pkg.name}`,
            custom_id: stake.id,
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              return_url: `${baseUrl}/payment/success`,
              cancel_url: `${baseUrl}/payment/cancel?package_id=${package_id}`,
              brand_name: "Pokerbacking",
              locale: "nl-BE",
              landing_page: "LOGIN",
              user_action: "PAY_NOW",
            },
          },
        },
      }),
    });

    if (!orderRes.ok) {
      const err = await orderRes.json().catch(() => ({}));
      await supabase.from("stakes").delete().eq("id", stake.id);
      return NextResponse.json({ error: err.message ?? "PayPal order aanmaken mislukt" }, { status: 500 });
    }

    const order = await orderRes.json();

    // Sla PayPal order ID op
    await supabase
      .from("stakes")
      .update({ mollie_payment_id: order.id })
      .eq("id", stake.id);

    const approveLink = order.links?.find((l: { rel: string }) => l.rel === "payer-action");
    if (!approveLink) {
      await supabase.from("stakes").delete().eq("id", stake.id);
      return NextResponse.json({ error: "Geen PayPal approval URL" }, { status: 500 });
    }

    return NextResponse.json({ checkoutUrl: approveLink.href });
  } catch (e) {
    await supabase.from("stakes").delete().eq("id", stake.id);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
