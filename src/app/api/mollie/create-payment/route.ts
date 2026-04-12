import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  // Haal package op en valideer
  const { data: pkg } = await supabase
    .from("packages")
    .select("*")
    .eq("id", package_id)
    .single();

  if (!pkg || !["open", "active"].includes(pkg.status)) {
    return NextResponse.json({ error: "Package niet beschikbaar" }, { status: 400 });
  }

  // Maak stake aan met status pending
  const { data: stake, error: stakeError } = await supabase
    .from("stakes")
    .insert({
      package_id,
      backer_id: user.id,
      percent,
      amount_paid: parseFloat(Number(amount_paid).toFixed(2)),
      notes: notes || null,
      payment_method: "mollie",
      status: "pending",
    })
    .select()
    .single();

  if (stakeError || !stake) {
    return NextResponse.json({ error: stakeError?.message ?? "Stake aanmaken mislukt" }, { status: 500 });
  }

  // Maak Mollie betaling aan
  const mollieKey = process.env.MOLLIE_API_KEY!;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

  const mollieRes = await fetch("https://api.mollie.com/v2/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${mollieKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: {
        currency: "EUR",
        value: Number(amount_paid).toFixed(2),
      },
      description: `Pokerbacking — ${percent}% stake in ${pkg.name}`,
      redirectUrl: `${baseUrl}/payment/success?stake_id=${stake.id}`,
      cancelUrl:   `${baseUrl}/payment/cancel?package_id=${package_id}`,
      webhookUrl:  `${baseUrl}/api/mollie/webhook`,
      metadata: { stake_id: stake.id },
    }),
  });

  if (!mollieRes.ok) {
    const err = await mollieRes.json().catch(() => ({}));
    await supabase.from("stakes").delete().eq("id", stake.id);
    return NextResponse.json({ error: err.detail ?? "Mollie fout" }, { status: 500 });
  }

  const molliePayment = await mollieRes.json();

  // Sla Mollie payment ID op
  await supabase
    .from("stakes")
    .update({ mollie_payment_id: molliePayment.id })
    .eq("id", stake.id);

  return NextResponse.json({ checkoutUrl: molliePayment._links.checkout.href });
}
