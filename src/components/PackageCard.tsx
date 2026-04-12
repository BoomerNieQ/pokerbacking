import Link from "next/link";
import type { PackageWithPlayer } from "@/lib/types";

const BADGE: Record<string, string> = {
  open:      "badge-open",
  closed:    "badge-closed",
  active:    "badge-active",
  completed: "badge-completed",
  cancelled: "badge-cancelled",
};
const BADGE_LABEL: Record<string, string> = {
  open: "Open", closed: "Gesloten", active: "Bezig", completed: "Afgerond", cancelled: "Geannuleerd",
};

export default function PackageCard({ pkg }: { pkg: PackageWithPlayer }) {
  const available = Number(pkg.total_percent) - Number(pkg.sold_percent);
  const pct = pkg.total_percent > 0 ? (Number(pkg.sold_percent) / Number(pkg.total_percent)) * 100 : 0;
  const costPer1 = Number(pkg.buy_in) * Number(pkg.markup) / 100;

  return (
    <Link href={`/packages/${pkg.id}`} className="card card-lift block p-5 rounded-xl group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs border px-2 py-0.5 rounded-full font-medium ${BADGE[pkg.status]}`}>
              {BADGE_LABEL[pkg.status]}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-cream truncate group-hover:text-gold transition-colors">
            {pkg.name}
          </h3>
          <p className="text-xs text-muted mt-0.5 truncate">{pkg.venue}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xl font-bold text-cream">€{Number(pkg.buy_in).toFixed(0)}</p>
          <p className="text-xs text-muted">{pkg.markup}x markup</p>
        </div>
      </div>

      {/* Player */}
      {pkg.profiles && (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-xs font-semibold text-cream-muted">
            {pkg.profiles.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-cream-muted">{pkg.profiles.name}</span>
        </div>
      )}

      {/* Date */}
      <p className="text-xs text-muted mb-3">
        {new Date(pkg.date_start).toLocaleDateString("nl-BE", { day: "numeric", month: "short", year: "numeric" })}
        {pkg.date_end ? ` – ${new Date(pkg.date_end).toLocaleDateString("nl-BE", { day: "numeric", month: "short" })}` : ""}
      </p>

      {/* Pack prices */}
      <div className="grid grid-cols-4 gap-1.5 mb-3">
        {[5, 10, 15, 20].map((p) => (
          <div key={p} className="bg-bg-elevated rounded-md px-2 py-1.5 text-center">
            <div className="text-xs text-cream-muted">{p}%</div>
            <div className="text-xs font-semibold text-gold">€{(costPer1 * p).toFixed(0)}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="space-y-1">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
        <div className="flex justify-between text-xs text-muted">
          <span>{Number(pkg.sold_percent).toFixed(0)}% verkocht</span>
          <span>{available.toFixed(0)}% beschikbaar</span>
        </div>
      </div>
    </Link>
  );
}
