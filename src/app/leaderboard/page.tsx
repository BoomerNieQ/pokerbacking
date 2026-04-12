import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default async function LeaderboardPage() {
  const supabase = await createClient();

  const [{ data: players }, { data: topBackers }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*, player_stats(*)")
      .eq("role", "player")
      .order("created_at", { ascending: true }),
    supabase
      .from("stakes")
      .select("backer_id, amount_paid, payout_amount, status, profiles(name, slug)")
      .eq("status", "paid_out"),
  ]);

  // Sort players by total earnings
  const sortedPlayers = (players ?? [])
    .map((p) => {
      const stats = Array.isArray(p.player_stats) ? p.player_stats[0] : p.player_stats;
      return { ...p, stats };
    })
    .sort((a, b) => Number(b.stats?.total_earnings ?? 0) - Number(a.stats?.total_earnings ?? 0));

  // Aggregate backer stats
  const backerMap = new Map<string, { name: string; slug: string | null; invested: number; returned: number }>();
  for (const stake of (topBackers ?? [])) {
    const profile = stake.profiles as unknown as { name: string; slug: string | null } | null;
    if (!profile) continue;
    const existing = backerMap.get(stake.backer_id) ?? { name: profile.name, slug: profile.slug, invested: 0, returned: 0 };
    existing.invested += Number(stake.amount_paid);
    existing.returned += Number(stake.payout_amount ?? 0);
    backerMap.set(stake.backer_id, existing);
  }
  const sortedBackers = Array.from(backerMap.entries())
    .map(([id, b]) => ({ id, ...b, profit: b.returned - b.invested }))
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 10);

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16 min-h-screen max-w-5xl mx-auto px-5 sm:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-cream">Leaderboard</h1>
          <p className="text-cream-muted mt-1">Top players en backers op Pokerbacking</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Players */}
          <div>
            <h2 className="text-lg font-bold text-cream mb-4 flex items-center gap-2">
              ♠ Top Players
              <span className="text-xs text-muted font-normal">op earnings</span>
            </h2>
            <div className="space-y-2">
              {sortedPlayers.slice(0, 10).map((player, i) => (
                <Link
                  key={player.id}
                  href={`/players/${player.slug ?? player.id}`}
                  className="card flex items-center gap-4 p-4 rounded-xl hover:border-border-light transition-colors"
                >
                  <span className={`text-sm font-bold w-6 text-center ${i < 3 ? "text-gold" : "text-muted"}`}>
                    {i + 1}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-sm font-bold text-cream shrink-0">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-cream truncate">{player.name}</p>
                    {player.stats && (
                      <p className="text-xs text-muted">{player.stats.total_cashes} cashes</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-gold">
                      €{Number(player.stats?.total_earnings ?? 0).toFixed(0)}
                    </p>
                    <p className="text-xs text-muted">
                      {Number(player.stats?.avg_roi ?? 0).toFixed(1)}% ROI
                    </p>
                  </div>
                </Link>
              ))}
              {sortedPlayers.length === 0 && (
                <p className="text-muted text-sm py-6 text-center">Nog geen players.</p>
              )}
            </div>
          </div>

          {/* Top Backers */}
          <div>
            <h2 className="text-lg font-bold text-cream mb-4 flex items-center gap-2">
              🎯 Top Backers
              <span className="text-xs text-muted font-normal">op netto winst</span>
            </h2>
            <div className="space-y-2">
              {sortedBackers.map((backer, i) => (
                <div key={backer.id} className="card flex items-center gap-4 p-4 rounded-xl">
                  <span className={`text-sm font-bold w-6 text-center ${i < 3 ? "text-gold" : "text-muted"}`}>
                    {i + 1}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-sm font-bold text-cream shrink-0">
                    {backer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-cream truncate">{backer.name}</p>
                    <p className="text-xs text-muted">€{backer.invested.toFixed(0)} geïnvesteerd</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-semibold ${backer.profit >= 0 ? "text-green" : "text-red"}`}>
                      {backer.profit >= 0 ? "+" : ""}€{backer.profit.toFixed(0)}
                    </p>
                    <p className="text-xs text-muted">netto winst</p>
                  </div>
                </div>
              ))}
              {sortedBackers.length === 0 && (
                <p className="text-muted text-sm py-6 text-center">Nog geen uitbetalingen.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
