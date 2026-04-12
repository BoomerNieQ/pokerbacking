"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Package, Stake } from "@/lib/types";
import type { User } from "@supabase/supabase-js";

type PaymentMethod = "mollie" | "manual";

export default function StakeForm({
  pkg, user, existingStake, available, costPer1,
}: {
  pkg: Package;
  user: User | null;
  existingStake: Stake | null;
  available: number;
  costPer1: number;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [percent, setPercent] = useState(Math.min(10, Math.floor(available)));
  const [notes, setNotes] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("mollie");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cost = costPer1 * percent;
  const canBuy = (pkg.status === "open" || pkg.status === "active") && available > 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { router.push("/login"); return; }
    setError(null);
    setLoading(true);

    if (method === "mollie") {
      // Mollie betaling via API route
      const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          package_id: pkg.id,
          percent,
          amount_paid: parseFloat(cost.toFixed(2)),
          notes: notes || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Betaling aanmaken mislukt");
        setLoading(false);
        return;
      }

      // Doorsturen naar Mollie checkout
      window.location.href = data.checkoutUrl;
      return;
    }

    // Manuele betaling
    const { error: err } = await supabase.from("stakes").insert({
      package_id: pkg.id,
      backer_id: user.id,
      percent,
      amount_paid: parseFloat(cost.toFixed(2)),
      notes: notes || null,
      payment_method: "manual",
    });

    if (err) { setError(err.message); setLoading(false); return; }
    setSuccess(true);
    setLoading(false);
  }

  if (existingStake) {
    return (
      <div className="card p-5 rounded-xl border border-gold/20">
        <p className="text-sm font-semibold text-cream mb-1">Je hebt al een stake</p>
        <p className="text-xs text-muted">
          {existingStake.percent}% · €{Number(existingStake.amount_paid).toFixed(2)} ·{" "}
          <span className="text-gold capitalize">{existingStake.status}</span>
        </p>
        <Link href="/dashboard" className="text-xs text-gold hover:text-gold-light mt-3 inline-block transition-colors">
          Bekijk in dashboard →
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="card p-6 rounded-xl text-center">
        <div className="text-3xl mb-3">✓</div>
        <p className="font-semibold text-cream mb-1">Stake aangevraagd!</p>
        <p className="text-xs text-cream-muted mb-2">
          De player bevestigt je stake en stuurt betalingsinstructies.
        </p>
        <div className="bg-bg-elevated rounded-xl p-4 text-left mb-4">
          <p className="text-xs text-muted uppercase tracking-wider mb-2">Betaalinstructies</p>
          <p className="text-xs text-cream-muted leading-relaxed">
            Maak <span className="text-gold font-semibold">€{cost.toFixed(2)}</span> over naar de player.
            Vermeld je naam en het package als mededeling.
            Je stake wordt bevestigd na ontvangst van de betaling.
          </p>
        </div>
        <Link href="/dashboard" className="btn-primary block py-2.5 rounded-xl text-sm">
          Naar dashboard
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="card p-6 rounded-xl text-center">
        <p className="font-semibold text-cream mb-2">Inloggen vereist</p>
        <p className="text-xs text-cream-muted mb-5">Maak een gratis account aan om te staken.</p>
        <Link href="/login" className="btn-primary block py-3 rounded-xl text-sm mb-2">Inloggen</Link>
        <Link href="/login?tab=register" className="btn-ghost block py-3 rounded-xl text-sm">Registreren</Link>
      </div>
    );
  }

  if (!canBuy) {
    return (
      <div className="card p-5 rounded-xl text-center">
        <p className="text-cream-muted text-sm">
          {available <= 0 ? "Package is uitverkocht." : "Package is niet meer beschikbaar."}
        </p>
      </div>
    );
  }

  return (
    <div className="card p-5 rounded-xl">
      <h2 className="font-semibold text-cream mb-5">Stake kopen</h2>
      <form onSubmit={submit} className="space-y-4">

        {/* Slider */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-xs text-muted uppercase tracking-wider">Percentage</label>
            <span className="text-sm font-bold text-gold">{percent}%</span>
          </div>
          <input
            type="range" min={1} max={Math.min(Math.floor(available), 25)}
            value={percent} onChange={e => setPercent(parseInt(e.target.value))}
            className="w-full accent-amber-400"
          />
          <div className="flex justify-between text-xs text-muted mt-1">
            <span>1%</span><span>{Math.min(Math.floor(available), 25)}%</span>
          </div>
        </div>

        {/* Quick select */}
        <div className="flex gap-1.5 flex-wrap">
          {[5, 10, 15, 20].filter(p => p <= Math.min(Math.floor(available), 25)).map(p => (
            <button key={p} type="button" onClick={() => setPercent(p)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                percent === p ? "bg-gold text-black" : "bg-bg-elevated border border-border text-cream-muted hover:text-cream"
              }`}>
              {p}%
            </button>
          ))}
        </div>

        {/* Cost */}
        <div className="bg-bg-elevated rounded-xl p-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Jij betaalt</span>
            <span className="text-gold font-bold text-lg">€{cost.toFixed(2)}</span>
          </div>
          <p className="text-xs text-muted mt-1">Bij winst: {percent}% van payout</p>
        </div>

        {/* Betaalmethode */}
        <div>
          <label className="block text-xs text-muted mb-2 uppercase tracking-wider">Betaalmethode</label>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setMethod("mollie")}
              className={`py-3 px-3 rounded-xl border text-xs font-medium transition-colors text-left ${
                method === "mollie"
                  ? "border-gold bg-gold/5 text-gold"
                  : "border-border text-muted hover:text-cream-muted hover:border-border-light"
              }`}>
              <span className="block font-semibold mb-0.5">PayPal</span>
              <span className="text-[10px] opacity-70">Veilig via PayPal — direct bevestigd</span>
            </button>
            <button type="button" onClick={() => setMethod("manual")}
              className={`py-3 px-3 rounded-xl border text-xs font-medium transition-colors text-left ${
                method === "manual"
                  ? "border-gold bg-gold/5 text-gold"
                  : "border-border text-muted hover:text-cream-muted hover:border-border-light"
              }`}>
              <span className="block font-semibold mb-0.5">Manuele overschrijving</span>
              <span className="text-[10px] opacity-70">Player bevestigt na ontvangst</span>
            </button>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs text-muted mb-1.5 uppercase tracking-wider">Notitie (optioneel)</label>
          <input type="text" value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="bv. extra info voor de player" className="input text-sm" />
        </div>

        {error && (
          <p className="text-red text-xs bg-red/10 border border-red/20 rounded-lg px-3 py-2">{error}</p>
        )}

        <button type="submit" disabled={loading}
          className="btn-primary w-full py-3.5 rounded-xl text-sm font-semibold disabled:opacity-60">
          {loading
            ? (method === "mollie" ? "Doorsturen naar PayPal…" : "Aanvragen…")
            : `${percent}% kopen voor €${cost.toFixed(2)}`}
        </button>

        {method === "mollie" && (
          <p className="text-xs text-muted text-center">
            Je wordt doorgestuurd naar PayPal voor een veilige betaling.
          </p>
        )}
        {method === "manual" && (
          <p className="text-xs text-muted text-center">
            Na aanvraag ontvang je betalingsinstructies van de player.
          </p>
        )}
      </form>
    </div>
  );
}
