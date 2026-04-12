import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default async function PlayersPage() {
  const supabase = await createClient();
  const { data: players } = await supabase
    .from("profiles")
    .select("*, player_stats(*)")
    .eq("role", "player")
    .order("created_at", { ascending: false });

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16 min-h-screen max-w-6xl mx-auto px-5 sm:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cream">Players</h1>
          <p className="text-cream-muted mt-1">Alle geregistreerde poker spelers op Pokerbacking</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(players ?? []).map((player) => {
            const stats = Array.isArray(player.player_stats)
              ? player.player_stats[0]
              : player.player_stats;

            return (
              <Link
                key={player.id}
                href={`/players/${player.slug ?? player.id}`}
                className="card card-lift p-5 rounded-xl"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-2xl font-bold text-cream shrink-0">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-semibold text-cream">{player.name}</h2>
                    <p className="text-xs text-muted">{player.country ?? "België"}</p>
                  </div>
                </div>

                {player.bio && (
                  <p className="text-xs text-cream-muted leading-relaxed mb-4 line-clamp-2">
                    {player.bio}
                  </p>
                )}

                {stats && (
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                    {[
                      { v: `€${Number(stats.total_earnings).toFixed(0)}`, l: "Earnings" },
                      { v: String(stats.total_cashes),                    l: "Cashes" },
                      { v: `${Number(stats.avg_roi).toFixed(1)}%`,        l: "ROI" },
                    ].map(({ v, l }) => (
                      <div key={l} className="text-center">
                        <div className="text-sm font-bold text-gold">{v}</div>
                        <div className="text-xs text-muted">{l}</div>
                      </div>
                    ))}
                  </div>
                )}

                {player.hendon_url && (
                  <p className="text-xs text-gold/50 mt-3">Hendon Mob profiel ↗</p>
                )}
              </Link>
            );
          })}
        </div>

        {(!players || players.length === 0) && (
          <div className="text-center py-20">
            <p className="text-3xl mb-4">♠</p>
            <p className="text-cream-muted">Nog geen players geregistreerd.</p>
            <Link href="/login?tab=register" className="btn-primary inline-block mt-6 px-6 py-3 rounded-xl text-sm">
              Registreer als player
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
