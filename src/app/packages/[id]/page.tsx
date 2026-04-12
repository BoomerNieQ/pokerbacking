import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import StakeForm from "./StakeForm";
import Link from "next/link";

const BADGE: Record<string, string> = {
  open: "badge-open", closed: "badge-closed", active: "badge-active",
  completed: "badge-completed", cancelled: "badge-cancelled",
};
const BADGE_LABEL: Record<string, string> = {
  open: "Open", closed: "Gesloten", active: "Bezig", completed: "Afgerond", cancelled: "Geannuleerd",
};

export default async function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: pkg }, { data: { user } }] = await Promise.all([
    supabase.from("packages").select("*, profiles(*)").eq("id", id).single(),
    supabase.auth.getUser(),
  ]);

  if (!pkg) notFound();

  const available = Number(pkg.total_percent) - Number(pkg.sold_percent);
  const costPer1 = Number(pkg.buy_in) * Number(pkg.markup) / 100;

  let existingStake = null;
  if (user) {
    const { data } = await supabase
      .from("stakes")
      .select("*")
      .eq("package_id", id)
      .eq("backer_id", user.id)
      .neq("status", "cancelled")
      .maybeSingle();
    existingStake = data;
  }

  const player = pkg.profiles as { name: string; slug: string | null; bio: string | null } | null;

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16 min-h-screen max-w-4xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <Link href="/marketplace" className="text-xs text-muted hover:text-cream-muted transition-colors">
                ← Marketplace
              </Link>
              <div className="flex items-center gap-2 mt-3 mb-2">
                <span className={`text-xs border px-2 py-0.5 rounded-full font-medium ${BADGE[pkg.status]}`}>
                  {BADGE_LABEL[pkg.status]}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-cream">{pkg.name}</h1>
              <p className="text-cream-muted mt-1">{pkg.venue}</p>
              <p className="text-cream-muted text-sm">
                {new Date(pkg.date_start).toLocaleDateString("nl-BE", { day: "numeric", month: "long", year: "numeric" })}
                {pkg.date_end ? ` – ${new Date(pkg.date_end).toLocaleDateString("nl-BE", { day: "numeric", month: "long" })}` : ""}
              </p>
              {pkg.tournament_url && (
                <a href={pkg.tournament_url} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-gold/70 hover:text-gold mt-1 inline-block transition-colors">
                  Officiële toernooi-info ↗
                </a>
              )}
            </div>

            {/* Player */}
            {player && (
              <div className="card p-4 rounded-xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-bg-elevated border border-border flex items-center justify-center font-bold text-cream shrink-0">
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-muted">Player</p>
                  <Link href={`/players/${player.slug ?? ""}`} className="text-sm font-semibold text-cream hover:text-gold transition-colors">
                    {player.name}
                  </Link>
                </div>
              </div>
            )}

            {/* Description */}
            {pkg.description && (
              <div className="card p-5 rounded-xl">
                <p className="text-sm text-cream-muted leading-relaxed">{pkg.description}</p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { v: `€${Number(pkg.buy_in).toFixed(0)}`, l: "Buy-in" },
                { v: `${pkg.markup}x`, l: "Markup" },
                { v: `${available.toFixed(0)}%`, l: "Beschikbaar" },
              ].map(({ v, l }) => (
                <div key={l} className="card p-4 rounded-xl text-center">
                  <div className="text-xl font-bold text-gold">{v}</div>
                  <div className="text-xs text-muted mt-1">{l}</div>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="card p-5 rounded-xl">
              <div className="flex justify-between text-xs text-muted mb-2">
                <span>Verkoop voortgang</span>
                <span>{Number(pkg.sold_percent).toFixed(0)}% / {pkg.total_percent}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${Math.min((Number(pkg.sold_percent) / pkg.total_percent) * 100, 100)}%` }} />
              </div>
            </div>

            {/* Pricing table */}
            <div className="card p-5 rounded-xl">
              <h2 className="font-semibold text-cream mb-4 text-sm">Pakketprijzen bij {pkg.markup}x markup</h2>
              <div className="space-y-2">
                {[5, 10, 15, 20, 25].map((pct) => {
                  const cost = costPer1 * pct;
                  const avail = pct <= available;
                  return (
                    <div key={pct} className={`flex justify-between items-center py-2 border-b border-border last:border-0 ${!avail ? "opacity-40" : ""}`}>
                      <span className="text-sm text-cream-muted">{pct}% van de actie</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gold">€{cost.toFixed(2)}</span>
                        {!avail && <span className="text-xs text-red border border-red/30 px-1.5 py-0.5 rounded">vol</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted mt-3">Bij winst ontvang je jouw % van het bruto payout-bedrag.</p>
            </div>

            {/* Result (if completed) */}
            {pkg.status === "completed" && (
              <div className={`card p-5 rounded-xl border ${pkg.prize_won ? "border-green/30" : "border-border"}`}>
                <h2 className="font-semibold text-cream mb-2 text-sm">Resultaat</h2>
                {pkg.prize_won ? (
                  <p className="text-2xl font-bold text-green">€{Number(pkg.prize_won).toFixed(2)}</p>
                ) : (
                  <p className="text-cream-muted text-sm">Niet gecasht</p>
                )}
              </div>
            )}
          </div>

          {/* Right: stake form */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <StakeForm pkg={pkg} user={user} existingStake={existingStake} available={available} costPer1={costPer1} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
