import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(req: NextRequest) {
  // Mollie stuurt form-encoded body met "id"
  const text = await req.text();
  const params = new URLSearchParams(text);
  const mollieId = params.get("id");

  if (!mollieId) {
    return NextResponse.json({ error: "Geen payment ID" }, { status: 400 });
  }

  // Haal betaalstatus op bij Mollie
  const mollieRes = await fetch(`https://api.mollie.com/v2/payments/${mollieId}`, {
    headers: { Authorization: `Bearer ${process.env.MOLLIE_API_KEY}` },
  });

  if (!mollieRes.ok) {
    return NextResponse.json({ error: "Mollie fetch mislukt" }, { status: 500 });
  }

  const payment = await mollieRes.json();

  // Alleen verdergaan als betaald
  if (payment.status !== "paid") {
    return NextResponse.json({ ok: true });
  }

  const stakeId = payment.metadata?.stake_id;
  if (!stakeId) {
    return NextResponse.json({ error: "Geen stake_id in metadata" }, { status: 400 });
  }

  // Service client omzeilt RLS (geen user session in webhook)
  const supabase = createServiceClient();

  const { data: stake } = await supabase
    .from("stakes")
    .select("*, packages(*)")
    .eq("id", stakeId)
    .single();

  if (!stake) {
    return NextResponse.json({ error: "Stake niet gevonden" }, { status: 404 });
  }

  // Zet stake op confirmed
  await supabase
    .from("stakes")
    .update({ status: "confirmed" })
    .eq("id", stakeId);

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
}
