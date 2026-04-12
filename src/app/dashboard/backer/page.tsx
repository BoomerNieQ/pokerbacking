import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Stake, Package } from "@/lib/types";

type StakeWithPackage = Stake & { packages: Package | null };

const STATUS_LABEL: Record<string, string> = {
  pending: "In aanvraag", confirmed: "Bevestigd", paid_out: "Uitbetaald", cancelled: "Geannuleerd",
};
const STATUS_COLOR: Record<string, string> = {
  pending:   "text-amber-400 border-amber-400/30",
  confirmed: "text-green border-green/30",
  paid_out:  "text-gold border-gold/30",
  cancelled: "text-red border-red/30",
};

export default async function BackerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: rawStakes } = await supabase
    .from("stakes")
    .select("*, packages(*)")
    .eq("backer_id", user!.id)
    .order("created_at", { ascending: false });

  const stakes = (rawStakes ?? []) as StakeWithPackage[];

  const invested  = stakes.filter(s => s.status !== "cancelled").reduce((sum, s) => sum + Number(s.amount_paid), 0);
  const returned  = stakes.filter(s => s.status === "paid_out").reduce((sum, s) => sum + Number(s.payout_amount ?? 0), 0);
  const paidCost  = stakes.filter(s => s.status === "paid_out").reduce((sum, s) => sum + Number(s.amount_paid), 0);
  const profit    = returned - paidCost;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cream">Mijn portfolio</h1>
          <p className="text-sm text-muted mt-1">Jouw stakes en uitbetalingen</p>
        </div>
        <Link href="/marketplace" className="btn-primary px-5 py-2.5 rounded-xl text-sm">
          Marketplace
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { v: `€${invested.toFixed(2)}`, l: "Geïnvesteerd" },
          { v: `€${returned.toFixed(2)}`, l: "Ontvangen" },
          { v: `${profit >= 0 ? "+" : ""}€${profit.toFixed(2)}`, l: "Netto", color: profit >= 0 ? "text-green" : "text-red" },
        ].map(({ v, l, color }) => (
          <div key={l} className="card p-4 rounded-xl">
            <div className={`text-xl font-bold ${color ?? "text-gold"}`}>{v}</div>
            <div className="text-xs text-muted mt-1">{l}</div>
          </div>
        ))}
      </div>

      {/* Stakes */}
      {stakes.length > 0 ? (
        <div className="space-y-3">
          {stakes.map((stake) => {
            const pkg = stake.packages;
            return (
              <div key={stake.id} className="card p-5 rounded-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-cream text-sm">{pkg?.name ?? "Onbekend package"}</p>
                    <p className="text-xs text-muted">{pkg?.venue}</p>
                    <p className="text-xs text-muted">
                      {pkg ? new Date(pkg.date_start).toLocaleDateString("nl-BE", { day: "numeric", month: "long", year: "numeric" }) : ""}
                    </p>
                  </div>
                  <span className={`text-xs border px-2 py-0.5 rounded-full shrink-0 ${STATUS_COLOR[stake.status]}`}>
                    {STATUS_LABEL[stake.status]}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-border grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted">Aandeel</p>
                    <p className="font-medium text-cream">{stake.percent}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Betaald</p>
                    <p className="font-medium text-cream">€{Number(stake.amount_paid).toFixed(2)}</p>
                  </div>
                  {stake.payout_amount !== null && (
                    <div>
                      <p className="text-xs text-muted">Uitbetaling</p>
                      <p className="font-medium text-gold">€{Number(stake.payout_amount).toFixed(2)}</p>
                    </div>
                  )}
                </div>

                {pkg && (
                  <Link href={`/packages/${pkg.id}`} className="text-xs text-gold/60 hover:text-gold mt-3 inline-block transition-colors">
                    Bekijk package →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">♠</p>
          <p className="text-cream-muted mb-6">Je hebt nog geen stakes.</p>
          <Link href="/marketplace" className="btn-primary inline-block px-6 py-3 rounded-xl text-sm">
            Bekijk marketplace
          </Link>
        </div>
      )}
    </div>
  );
}
