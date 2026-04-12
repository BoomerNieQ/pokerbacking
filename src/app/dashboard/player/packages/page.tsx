import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function PlayerPackagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: packages } = await supabase
    .from("packages")
    .select("*")
    .eq("player_id", user!.id)
    .order("date_start", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-cream">Mijn packages</h1>
        <Link href="/dashboard/player/packages/new" className="btn-primary px-5 py-2.5 rounded-xl text-sm">
          + Nieuw
        </Link>
      </div>

      <div className="space-y-3">
        {(packages ?? []).map((pkg) => {
          const pct = pkg.total_percent > 0 ? (Number(pkg.sold_percent) / pkg.total_percent) * 100 : 0;
          return (
            <Link key={pkg.id} href={`/dashboard/player/packages/${pkg.id}`}
              className="card block p-5 rounded-xl hover:border-border-light transition-colors">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-semibold text-cream text-sm">{pkg.name}</p>
                  <p className="text-xs text-muted mt-0.5">{pkg.venue}</p>
                  <p className="text-xs text-muted">{new Date(pkg.date_start).toLocaleDateString("nl-BE", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <div className="text-right shrink-0 text-xs text-muted">
                  <p className="text-cream font-medium">€{Number(pkg.buy_in).toFixed(0)}</p>
                  <p>{pkg.markup}x markup</p>
                  <p className="mt-1 capitalize" style={{ color: pkg.status === "open" ? "var(--green)" : pkg.status === "completed" ? "var(--gold)" : "var(--cream-muted)" }}>
                    {pkg.status}
                  </p>
                </div>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
              <p className="text-xs text-muted mt-1">{Number(pkg.sold_percent).toFixed(0)}% / {pkg.total_percent}% verkocht</p>
            </Link>
          );
        })}
        {(!packages || packages.length === 0) && (
          <p className="text-center text-muted py-12">Nog geen packages. <Link href="/dashboard/player/packages/new" className="text-gold hover:text-gold-light">Maak er een aan →</Link></p>
        )}
      </div>
    </div>
  );
}
