import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function PlayerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: packages }, { data: stakes }, { data: stats }] = await Promise.all([
    supabase.from("packages").select("*").eq("player_id", user!.id).order("created_at", { ascending: false }).limit(5),
    supabase.from("stakes").select("*, packages(name)").in("package_id",
      (await supabase.from("packages").select("id").eq("player_id", user!.id)).data?.map(p => p.id) ?? []
    ).eq("status", "pending"),
    supabase.from("player_stats").select("*").eq("player_id", user!.id).single(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cream">Player dashboard</h1>
          <p className="text-sm text-muted mt-1">Beheer je packages en stakes</p>
        </div>
        <Link href="/dashboard/player/packages/new" className="btn-primary px-5 py-2.5 rounded-xl text-sm">
          + Nieuw package
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { v: `€${Number(stats?.total_earnings ?? 0).toFixed(0)}`, l: "Live earnings" },
          { v: String(stats?.total_packages ?? 0),                   l: "Packages" },
          { v: String(stats?.total_cashes ?? 0),                     l: "Cashes" },
          { v: `${Number(stats?.avg_roi ?? 0).toFixed(1)}%`,         l: "Gem. ROI" },
        ].map(({ v, l }) => (
          <div key={l} className="card p-4 rounded-xl">
            <div className="text-2xl font-bold text-gold">{v}</div>
            <div className="text-xs text-muted mt-1">{l}</div>
          </div>
        ))}
      </div>

      {/* Pending stakes */}
      {(stakes ?? []).length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-cream mb-3">Openstaande stake-aanvragen</h2>
          <div className="space-y-2">
            {(stakes ?? []).map((s) => (
              <Link key={s.id} href={`/dashboard/player/packages/${s.package_id}`}
                className="card flex items-center justify-between p-4 rounded-xl border-gold/20 hover:border-gold/40 transition-colors">
                <div>
                  <p className="text-sm text-cream font-medium">{s.percent}% aangevraagd</p>
                  <p className="text-xs text-muted">{(s.packages as { name: string } | null)?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gold">€{Number(s.amount_paid).toFixed(2)}</p>
                  <p className="text-xs text-muted">Bevestigen →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent packages */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-cream">Recente packages</h2>
          <Link href="/dashboard/player/packages" className="text-xs text-gold hover:text-gold-light transition-colors">Alle packages →</Link>
        </div>
        <div className="space-y-2">
          {(packages ?? []).map((pkg) => {
            const pct = pkg.total_percent > 0 ? (Number(pkg.sold_percent) / pkg.total_percent) * 100 : 0;
            return (
              <Link key={pkg.id} href={`/dashboard/player/packages/${pkg.id}`}
                className="card block p-4 rounded-xl hover:border-border-light transition-colors">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <p className="text-sm font-medium text-cream">{pkg.name}</p>
                  <span className="text-xs text-muted">€{Number(pkg.buy_in).toFixed(0)} · {pkg.markup}x</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
                <p className="text-xs text-muted mt-1">{Number(pkg.sold_percent).toFixed(0)}% / {pkg.total_percent}% verkocht</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
