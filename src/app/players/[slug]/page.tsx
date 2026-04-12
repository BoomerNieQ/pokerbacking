import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import PackageCard from "@/components/PackageCard";
import Link from "next/link";
import type { PackageWithPlayer } from "@/lib/types";

export default async function PlayerProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  // Try slug first, then id
  let { data: player } = await supabase
    .from("profiles")
    .select("*, player_stats(*)")
    .eq("slug", slug)
    .maybeSingle();

  if (!player) {
    const { data } = await supabase
      .from("profiles")
      .select("*, player_stats(*)")
      .eq("id", slug)
      .maybeSingle();
    player = data;
  }

  if (!player || player.role !== "player") notFound();

  const { data: packages } = await supabase
    .from("packages")
    .select("*, profiles(*)")
    .eq("player_id", player.id)
    .order("created_at", { ascending: false });

  const stats = Array.isArray(player.player_stats)
    ? player.player_stats[0]
    : player.player_stats;

  const open = (packages ?? []).filter(p => p.status === "open" || p.status === "active");
  const past = (packages ?? []).filter(p => p.status === "completed" || p.status === "cancelled");

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16 min-h-screen max-w-5xl mx-auto px-5 sm:px-8">
        {/* Profile header */}
        <div className="flex flex-col sm:flex-row items-start gap-6 mb-10">
          <div className="w-20 h-20 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-3xl font-bold text-cream shrink-0">
            {player.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-cream">{player.name}</h1>
            <p className="text-cream-muted text-sm mt-0.5">{player.country ?? "België"}</p>
            {player.bio && (
              <p className="text-cream-muted mt-3 leading-relaxed max-w-xl text-sm">{player.bio}</p>
            )}
            <div className="flex gap-3 mt-4">
              {player.hendon_url && (
                <a href={player.hendon_url} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-gold/70 hover:text-gold transition-colors border border-gold/20 px-3 py-1.5 rounded-lg">
                  Hendon Mob ↗
                </a>
              )}
              {player.twitter_url && (
                <a href={player.twitter_url} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-cream-muted hover:text-cream border border-border px-3 py-1.5 rounded-lg transition-colors">
                  Twitter ↗
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
            {[
              { v: `€${Number(stats.total_earnings).toFixed(0)}`, l: "Live earnings" },
              { v: String(stats.total_packages),                   l: "Packages" },
              { v: String(stats.total_cashes),                     l: "Cashes" },
              { v: `${Number(stats.avg_roi).toFixed(1)}%`,         l: "Gem. ROI" },
            ].map(({ v, l }) => (
              <div key={l} className="card p-4 rounded-xl text-center">
                <div className="text-xl font-bold text-gold">{v}</div>
                <div className="text-xs text-muted mt-1">{l}</div>
              </div>
            ))}
          </div>
        )}

        {/* Open packages */}
        {open.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-cream mb-4">Beschikbare packages</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(open as PackageWithPlayer[]).map(pkg => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </div>
        )}

        {/* Past packages */}
        {past.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-cream mb-4">Resultaten</h2>
            <div className="space-y-2">
              {past.map((pkg) => (
                <Link key={pkg.id} href={`/packages/${pkg.id}`}
                  className="card flex items-center justify-between p-4 rounded-xl hover:border-border-light transition-colors">
                  <div>
                    <p className="text-sm font-medium text-cream">{pkg.name}</p>
                    <p className="text-xs text-muted">{new Date(pkg.date_start).toLocaleDateString("nl-BE", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <div className="text-right">
                    {pkg.prize_won !== null ? (
                      <p className={`text-sm font-semibold ${Number(pkg.prize_won) > Number(pkg.buy_in) ? "text-green" : "text-red"}`}>
                        €{Number(pkg.prize_won).toFixed(0)}
                      </p>
                    ) : (
                      <p className="text-xs text-muted">Geen cash</p>
                    )}
                    <p className="text-xs text-muted">€{Number(pkg.buy_in).toFixed(0)} buy-in</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {(packages ?? []).length === 0 && (
          <div className="text-center py-16 border border-dashed border-border rounded-xl">
            <p className="text-cream-muted">Nog geen packages aangemaakt.</p>
          </div>
        )}
      </main>
    </>
  );
}
