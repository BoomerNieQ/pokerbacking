"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function NewPackagePage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    name: "", venue: "", date_start: "", date_end: "",
    buy_in: "", markup: "1.2", total_percent: "50",
    description: "", tournament_url: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const buyIn = parseFloat(form.buy_in) || 0;
  const markup = parseFloat(form.markup) || 1;
  const costPer1 = buyIn * markup / 100;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { error: err } = await supabase.from("packages").insert({
      player_id: user!.id,
      name: form.name,
      venue: form.venue,
      date_start: form.date_start,
      date_end: form.date_end || null,
      buy_in: parseFloat(form.buy_in),
      markup: parseFloat(form.markup),
      total_percent: parseInt(form.total_percent),
      description: form.description || null,
      tournament_url: form.tournament_url || null,
    });

    if (err) { setError(err.message); setLoading(false); return; }
    router.push("/dashboard/player/packages");
    router.refresh();
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-cream">Nieuw package</h1>
        <p className="text-sm text-muted mt-1">Maak een staking package aan voor je volgende toernooi</p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {[
          { k: "name",           l: "Toernooinaam",          t: "text",   p: "PokerStars Open Main Event", r: true },
          { k: "venue",          l: "Locatie",                t: "text",   p: "Casino de Namur",            r: true },
          { k: "date_start",     l: "Startdatum",             t: "date",   p: "",                            r: true },
          { k: "date_end",       l: "Einddatum (optioneel)",  t: "date",   p: "",                            r: false },
          { k: "buy_in",         l: "Buy-in (€)",             t: "number", p: "1100",                        r: true },
          { k: "markup",         l: "Markup",                 t: "number", p: "1.2",                         r: true },
          { k: "total_percent",  l: "Max % te verkopen",      t: "number", p: "50",                          r: true },
          { k: "tournament_url", l: "Toernooi URL (optioneel)", t: "url",  p: "https://...",                 r: false },
        ].map(({ k, l, t, p, r }) => (
          <div key={k}>
            <label className="block text-xs text-muted mb-1.5 uppercase tracking-wider">{l}</label>
            <input type={t} value={form[k as keyof typeof form]} onChange={e => set(k, e.target.value)}
              required={r} placeholder={p} step={t === "number" ? "0.01" : undefined}
              min={t === "number" ? "0" : undefined} className="input" />
          </div>
        ))}

        <div>
          <label className="block text-xs text-muted mb-1.5 uppercase tracking-wider">Beschrijving (optioneel)</label>
          <textarea value={form.description} onChange={e => set("description", e.target.value)}
            rows={3} placeholder="Extra info..." className="input resize-none" />
        </div>

        {/* Cost preview */}
        {buyIn > 0 && (
          <div className="card p-4 rounded-xl">
            <p className="text-xs text-muted uppercase tracking-wider mb-2">Kostenpreview bij {markup}x markup</p>
            {[5, 10, 20, 25].map(pct => (
              <div key={pct} className="flex justify-between text-sm py-1.5 border-b border-border last:border-0">
                <span className="text-cream-muted">{pct}% pack</span>
                <span className="text-gold font-medium">€{(costPer1 * pct).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-red text-xs bg-red/10 border border-red/20 rounded-lg px-3 py-2">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => router.back()}
            className="btn-ghost flex-1 py-3 rounded-xl text-sm">Annuleren</button>
          <button type="submit" disabled={loading}
            className="btn-primary flex-1 py-3 rounded-xl text-sm disabled:opacity-60">
            {loading ? "Opslaan…" : "Package aanmaken"}
          </button>
        </div>
      </form>
    </div>
  );
}
