"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Profile } from "@/lib/types";

export default function DashNav({ profile }: { profile: Profile }) {
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const isPlayer = profile.role === "player";

  return (
    <header className="border-b border-border bg-bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <nav className="max-w-5xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-gradient">Pokerbacking</Link>
          <div className="hidden sm:flex gap-4">
            {isPlayer ? (
              <>
                <Link href="/dashboard/player" className="text-xs text-cream-muted hover:text-cream transition-colors">Overzicht</Link>
                <Link href="/dashboard/player/packages" className="text-xs text-cream-muted hover:text-cream transition-colors">Packages</Link>
              </>
            ) : (
              <>
                <Link href="/dashboard/backer" className="text-xs text-cream-muted hover:text-cream transition-colors">Mijn stakes</Link>
                <Link href="/marketplace" className="text-xs text-cream-muted hover:text-cream transition-colors">Marketplace</Link>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-xs text-muted">{profile.name}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
            isPlayer ? "border-gold/40 text-gold" : "border-border text-muted"
          }`}>
            {isPlayer ? "Player" : "Backer"}
          </span>
          <button onClick={signOut} className="text-xs text-muted hover:text-cream transition-colors">
            Uitloggen
          </button>
        </div>
      </nav>
    </header>
  );
}
