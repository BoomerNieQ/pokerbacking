"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Package } from "@/lib/types";

export default function PackageSettings({ pkg }: { pkg: Package }) {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Package["status"]>(pkg.status);
  const [markup, setMarkup] = useState(pkg.markup.toString());
  const [totalPct, setTotalPct] = useState(pkg.total_percent.toString());
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await supabase.from("packages").update({
      status,
      markup: parseFloat(markup),
      total_percent: parseInt(totalPct),
    }).eq("id", pkg.id);
    setSaving(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="card p-5 rounded-xl">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-cream text-sm">Package instellingen</h2>
        <button onClick={() => setOpen(!open)} className="text-xs text-gold hover:text-gold-light transition-colors">
          {open ? "Sluiten" : "Bewerken"}
        </button>
      </div>

      {open && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-xs text-muted mb-1.5 uppercase tracking-wider">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as Package["status"])}
              className="input">
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5 uppercase tracking-wider">Markup</label>
            <input type="number" step="0.01" min="1" value={markup} onChange={e => setMarkup(e.target.value)} className="input" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5 uppercase tracking-wider">Max % te verkopen</label>
            <input type="number" min="1" max="100" value={totalPct} onChange={e => setTotalPct(e.target.value)} className="input" />
          </div>
          <button onClick={save} disabled={saving}
            className="btn-primary w-full py-2.5 rounded-xl text-sm disabled:opacity-60">
            {saving ? "Opslaan…" : "Wijzigingen opslaan"}
          </button>
        </div>
      )}
    </div>
  );
}
