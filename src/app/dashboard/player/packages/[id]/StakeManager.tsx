"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Stake, Package } from "@/lib/types";

type StakeWithProfile = Stake & { profiles: { name: string } | null };

const STATUS_LABEL: Record<string, string> = {
  pending: "In aanvraag", confirmed: "Bevestigd", paid_out: "Uitbetaald", cancelled: "Geannuleerd",
};
const STATUS_COLOR: Record<string, string> = {
  pending:   "text-amber-400 border-amber-400/30",
  confirmed: "text-green border-green/30",
  paid_out:  "text-gold border-gold/30",
  cancelled: "text-red border-red/30",
};

export default function StakeManager({ stakes, pkg }: { stakes: StakeWithProfile[]; pkg: Package }) {
  const router = useRouter();
  const supabase = createClient();
  const [prizeInput, setPrizeInput] = useState(pkg.prize_won?.toString() ?? "");
  const [savingPrize, setSavingPrize] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  async function updateStake(stakeId: string, status: Stake["status"], payoutAmount?: number) {
    setUpdating(stakeId);
    const update: Partial<Stake> = { status };
    if (payoutAmount !== undefined) update.payout_amount = payoutAmount;
    await supabase.from("stakes").update(update).eq("id", stakeId);

    if (status === "confirmed") {
      const stake = stakes.find(s => s.id === stakeId);
      if (stake) {
        const newSold = Math.min(Number(pkg.sold_percent) + Number(stake.percent), pkg.total_percent);
        await supabase.from("packages").update({ sold_percent: newSold }).eq("id", pkg.id);
      }
    }
    if (status === "cancelled") {
      const stake = stakes.find(s => s.id === stakeId);
      if (stake && stake.status === "confirmed") {
        const newSold = Math.max(0, Number(pkg.sold_percent) - Number(stake.percent));
        await supabase.from("packages").update({ sold_percent: newSold }).eq("id", pkg.id);
      }
    }

    setUpdating(null);
    router.refresh();
  }

  async function savePrize() {
    setSavingPrize(true);
    const prizeWon = parseFloat(prizeInput) || null;
    await supabase.from("packages").update({
      prize_won: prizeWon,
      status: prizeWon !== null ? "completed" : pkg.status,
    }).eq("id", pkg.id);

    if (prizeWon) {
      for (const s of stakes.filter(s => s.status === "confirmed")) {
        const payout = (Number(s.percent) / 100) * prizeWon;
        await supabase.from("stakes").update({ payout_amount: payout }).eq("id", s.id);
      }
      await supabase.rpc("refresh_player_stats", { p_id: pkg.player_id });
    }
    setSavingPrize(false);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Prize input */}
      <div className="card p-5 rounded-xl">
        <h2 className="font-semibold text-cream mb-3 text-sm">Resultaat invoeren</h2>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">€</span>
            <input type="number" value={prizeInput} onChange={e => setPrizeInput(e.target.value)}
              placeholder="0.00" step="0.01" min="0"
              className="input pl-7" />
          </div>
          <button onClick={savePrize} disabled={savingPrize}
            className="btn-primary px-5 py-2.5 rounded-xl text-sm disabled:opacity-60">
            {savingPrize ? "…" : "Opslaan"}
          </button>
        </div>
        <p className="text-xs text-muted mt-2">Bruto payout-bedrag. Backer-uitbetalingen worden automatisch berekend.</p>
      </div>

      {/* Stakes */}
      <div>
        <h2 className="font-semibold text-cream mb-3">Stakes ({stakes.length})</h2>
        {stakes.length === 0 ? (
          <p className="text-muted text-sm py-6 text-center">Nog geen stake-aanvragen.</p>
        ) : (
          <div className="space-y-3">
            {stakes.map((stake) => (
              <div key={stake.id} className="card p-4 rounded-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-cream">
                      {stake.profiles?.name ?? "Onbekend"} — {stake.percent}%
                    </p>
                    <p className="text-xs text-muted">
                      Betaald: €{Number(stake.amount_paid).toFixed(2)}
                      {stake.payout_amount !== null && ` · Uitbetaling: €${Number(stake.payout_amount).toFixed(2)}`}
                    </p>
                    {stake.notes && <p className="text-xs text-cream-muted italic mt-1">&ldquo;{stake.notes}&rdquo;</p>}
                  </div>
                  <span className={`text-xs border px-2 py-0.5 rounded-full shrink-0 ${STATUS_COLOR[stake.status]}`}>
                    {STATUS_LABEL[stake.status]}
                  </span>
                </div>

                {stake.status === "pending" && (
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => updateStake(stake.id, "confirmed")} disabled={updating === stake.id}
                      className="flex-1 py-1.5 rounded-lg bg-green/10 border border-green/30 text-green text-xs font-medium hover:bg-green/20 transition-colors disabled:opacity-60">
                      Bevestigen
                    </button>
                    <button onClick={() => updateStake(stake.id, "cancelled")} disabled={updating === stake.id}
                      className="flex-1 py-1.5 rounded-lg bg-red/10 border border-red/30 text-red text-xs font-medium hover:bg-red/20 transition-colors disabled:opacity-60">
                      Weigeren
                    </button>
                  </div>
                )}
                {stake.status === "confirmed" && stake.payout_amount !== null && (
                  <button onClick={() => updateStake(stake.id, "paid_out", Number(stake.payout_amount))}
                    disabled={updating === stake.id}
                    className="w-full mt-3 py-1.5 rounded-lg bg-gold/10 border border-gold/30 text-gold text-xs font-medium hover:bg-gold/20 transition-colors disabled:opacity-60">
                    Markeer als uitbetaald (€{Number(stake.payout_amount).toFixed(2)})
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
