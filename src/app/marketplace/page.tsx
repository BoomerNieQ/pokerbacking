import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import PackageCard from "@/components/PackageCard";
import type { PackageWithPlayer } from "@/lib/types";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("packages")
    .select("*, profiles(*)")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  } else {
    query = query.in("status", ["open", "active", "completed"]);
  }

  const { data: packages } = await query;

  const filtered = (packages ?? []).filter((p) => {
    if (!q) return true;
    const search = q.toLowerCase();
    return (
      p.name.toLowerCase().includes(search) ||
      p.venue.toLowerCase().includes(search) ||
      (p.profiles as { name: string } | null)?.name.toLowerCase().includes(search)
    );
  }) as PackageWithPlayer[];

  const statuses = ["all", "open", "active", "completed"];

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16 min-h-screen max-w-6xl mx-auto px-5 sm:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cream">Marketplace</h1>
          <p className="text-cream-muted mt-1">Alle beschikbare staking packages</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex gap-2 flex-wrap">
            {statuses.map((s) => (
              <a
                key={s}
                href={s === "all" ? "/marketplace" : `/marketplace?status=${s}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-colors ${
                  (status ?? "all") === s
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-border text-muted hover:text-cream-muted"
                }`}
              >
                {s === "all" ? "Alle" : s}
              </a>
            ))}
          </div>

          <form method="GET" action="/marketplace" className="sm:ml-auto">
            <input
              name="q"
              defaultValue={q}
              placeholder="Zoek op naam, venue of speler…"
              className="input w-full sm:w-64 text-xs"
            />
          </form>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-3xl mb-4">♠</p>
            <p className="text-cream-muted">Geen packages gevonden.</p>
          </div>
        )}
      </main>
    </>
  );
}
