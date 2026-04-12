import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import PackageCard from "@/components/PackageCard";
import RevealInit from "@/components/RevealInit";
import type { PackageWithPlayer } from "@/lib/types";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: featuredPkgs }, { data: topPlayers }] = await Promise.all([
    supabase
      .from("packages")
      .select("*, profiles(*)")
      .in("status", ["open", "active"])
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("profiles")
      .select("*, player_stats(*)")
      .eq("role", "player")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return (
    <>
      <RevealInit />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-5 pt-14 relative overflow-hidden">
          {/* Floating suit symbols */}
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none">
            <span className="suit-float absolute text-[9rem] font-serif"
              style={{ top: "10%", left: "5%", "--rot": "-15deg", color: "#c9a84c" } as React.CSSProperties}>♠</span>
            <span className="suit-float absolute text-[7rem] font-serif" style={{ top: "65%", left: "8%", "--rot": "10deg", animationDelay: "1.5s", color: "#c0392b" } as React.CSSProperties}>♥</span>
            <span className="suit-float absolute text-[8rem] font-serif" style={{ top: "15%", right: "7%", "--rot": "12deg", animationDelay: "0.8s", color: "#c0392b" } as React.CSSProperties}>♦</span>
            <span className="suit-float absolute text-[6rem] font-serif"
              style={{ top: "72%", right: "10%", "--rot": "-8deg", animationDelay: "2.2s", color: "#c9a84c" } as React.CSSProperties}>♣</span>
            {/* Radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_55%,rgba(201,168,76,0.06),transparent)]" />
          </div>

          <div className="relative max-w-3xl mx-auto">
            <p className="eyebrow text-xs font-semibold tracking-widest uppercase text-gold mb-6">
              Poker staking platform — België &amp; Nederland
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-cream leading-tight mb-6">
              Stake poker players,<br />
              <em className="text-gradient not-italic">share their winnings</em>
            </h1>

            <p className="text-lg text-cream-muted max-w-xl mx-auto mb-10 leading-relaxed">
              Koop een percentage van een speler&apos;s buy-in. Volg hun toernooi live.
              Ontvang jouw deel van de winst als ze in the money finishen.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/marketplace" className="btn-primary px-8 py-4 rounded-full text-sm font-semibold tracking-wide">
                Bekijk marketplace →
              </Link>
              <Link href="/login?tab=register" className="btn-ghost px-8 py-4 rounded-full text-sm">
                Word player
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-6 max-w-sm mx-auto">
              {[
                { v: "3%", l: "Platform commissie" },
                { v: "Live", l: "Resultaten" },
                { v: "Direct", l: "Uitbetaling" },
              ].map(({ v, l }) => (
                <div key={l} className="text-center">
                  <div className="text-2xl font-bold text-gold">{v}</div>
                  <div className="text-xs text-muted mt-1 uppercase tracking-wider">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <div aria-hidden="true" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs text-muted tracking-widest uppercase">Scroll</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M4 9l4 4 4-4" stroke="#6a7a6c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </section>

        {/* Featured packages */}
        {featuredPkgs && featuredPkgs.length > 0 && (
          <section className="py-20 px-5 sm:px-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8 reveal">
              <div>
                <h2 className="text-2xl font-bold text-cream">Actieve packages</h2>
                <div className="gold-divider mt-3 ml-0" style={{ margin: "0.75rem 0 0" }} />
                <p className="text-sm text-muted mt-2">Koop een stake in een van deze toernooien</p>
              </div>
              <Link href="/marketplace" className="text-sm text-gold hover:text-gold-light transition-colors">
                Alle packages →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(featuredPkgs as PackageWithPlayer[]).map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </section>
        )}

        {/* Top players */}
        {topPlayers && topPlayers.length > 0 && (
          <section className="py-20 px-5 sm:px-8 max-w-6xl mx-auto border-t border-border">
            <div className="flex items-center justify-between mb-8 reveal">
              <div>
                <h2 className="text-2xl font-bold text-cream">Players</h2>
                <div className="gold-divider mt-3 ml-0" style={{ margin: "0.75rem 0 0" }} />
                <p className="text-sm text-muted mt-2">Bekende spelers op het platform</p>
              </div>
              <Link href="/players" className="text-sm text-gold hover:text-gold-light transition-colors">
                Alle players →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topPlayers.map((player) => {
                const stats = Array.isArray(player.player_stats) ? player.player_stats[0] : player.player_stats;
                return (
                  <Link
                    key={player.id}
                    href={`/players/${player.slug ?? player.id}`}
                    className="card card-lift p-5 rounded-xl flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-lg font-bold text-cream shrink-0">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-cream truncate">{player.name}</p>
                      <p className="text-xs text-muted">{player.country ?? "BE"}</p>
                      {stats && (
                        <p className="text-xs text-gold mt-1">
                          €{Number(stats.total_earnings).toFixed(0)} earnings · {stats.total_cashes} cashes
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* How it works */}
        <section className="py-20 px-5 sm:px-8 border-t border-border">
          <div className="max-w-4xl mx-auto text-center mb-12 reveal">
            <p className="eyebrow text-xs font-semibold tracking-widest uppercase text-gold mb-4">Werkwijze</p>
            <h2 className="text-2xl font-bold text-cream mb-3">Hoe werkt Pokerbacking?</h2>
            <div className="gold-divider mt-4" />
          </div>
          <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6">
            {[
              { step: "01", icon: "♠", title: "Kies een package", desc: "Browse alle beschikbare toernooien en spelers. Filter op buy-in, markup of ROI." },
              { step: "02", icon: "♦", title: "Koop je stake", desc: "Kies hoeveel % je wil kopen. Betaal via overschrijving of PayPal. Bevestiging volgt snel." },
              { step: "03", icon: "♣", title: "Volg & ontvang", desc: "Volg het toernooi live. Bij een cash ontvang jij automatisch jouw percentage van de payout." },
            ].map(({ step, icon, title, desc }, i) => (
              <div key={step} className={`card card-lift p-7 rounded-2xl reveal reveal-d${i + 1} flex flex-col gap-5`}>
                <div className="flex items-center justify-between">
                  <span className="text-5xl font-bold text-gold/20 leading-none select-none">{step}</span>
                  <span className="text-3xl text-gold/60 leading-none select-none" aria-hidden="true">{icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-cream mb-2">{title}</h3>
                  <p className="text-sm text-cream-muted leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-5 text-center border-t border-border">
          <div className="reveal">
            <h2 className="text-3xl font-bold text-cream mb-4">Klaar om mee te spelen?</h2>
            <div className="gold-divider mb-6" />
            <p className="text-cream-muted mb-8 max-w-md mx-auto">
              Registreer gratis als backer of player en start vandaag nog.
            </p>
            <Link href="/login?tab=register" className="btn-primary inline-block px-8 py-4 rounded-full text-sm font-semibold tracking-wide">
              Maak een gratis account
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p><span className="text-gradient font-bold">Pokerbacking</span> — Poker staking platform</p>
          <div className="flex items-center gap-4">
            <Link href="/algemene-voorwaarden" className="hover:text-cream-muted transition-colors">Algemene voorwaarden</Link>
            <Link href="/privacybeleid" className="hover:text-cream-muted transition-colors">Privacybeleid</Link>
            <p>© {new Date().getFullYear()} Pokerbacking · België</p>
          </div>
        </div>
      </footer>
    </>
  );
}
