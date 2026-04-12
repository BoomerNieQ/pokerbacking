import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import StakeManager from "./StakeManager";
import PackageSettings from "./PackageSettings";

export default async function PlayerPackageDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: pkg }, { data: stakes }] = await Promise.all([
    supabase.from("packages").select("*").eq("id", id).eq("player_id", user!.id).single(),
    supabase.from("stakes").select("*, profiles(name)").eq("package_id", id).order("created_at"),
  ]);

  if (!pkg) notFound();

  const sold = Number(pkg.sold_percent);
  const pct = pkg.total_percent > 0 ? (sold / pkg.total_percent) * 100 : 0;

  return (
    <div className="space-y-8">
      <div>
        <a href="/dashboard/player/packages" className="text-xs text-muted hover:text-cream-muted transition-colors">← Packages</a>
        <h1 className="text-2xl font-bold text-cream mt-2">{pkg.name}</h1>
        <p className="text-cream-muted text-sm">{pkg.venue}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { v: `€${Number(pkg.buy_in).toFixed(0)}`, l: "Buy-in" },
          { v: `${pkg.markup}x`, l: "Markup" },
          { v: `${sold.toFixed(0)}%`, l: "Verkocht" },
          { v: `${(pkg.total_percent - sold).toFixed(0)}%`, l: "Beschikbaar" },
        ].map(({ v, l }) => (
          <div key={l} className="card p-4 rounded-xl">
            <div className="text-2xl font-bold text-gold">{v}</div>
            <div className="text-xs text-muted mt-1">{l}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="card p-5 rounded-xl">
        <div className="flex justify-between text-xs text-muted mb-2">
          <span>Voortgang</span>
          <span>{sold.toFixed(0)}% van {pkg.total_percent}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
      </div>

      <StakeManager stakes={stakes ?? []} pkg={pkg} />
      <PackageSettings pkg={pkg} />
    </div>
  );
}
