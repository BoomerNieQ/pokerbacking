"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const links = [
    { href: "/marketplace", label: "Marketplace" },
    { href: "/players",     label: "Players" },
    { href: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/60 bg-bg/80 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-lg tracking-tight">
          <span className="text-gradient">Pokerbacking</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-6">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className="text-sm text-cream-muted hover:text-cream transition-colors">
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm text-cream-muted hover:text-cream transition-colors">
                Dashboard
              </Link>
              <button onClick={signOut} className="btn-ghost text-xs px-3 py-1.5 rounded-lg">
                Uitloggen
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-cream-muted hover:text-cream transition-colors">
                Inloggen
              </Link>
              <Link href="/login?tab=register" className="btn-primary text-xs px-4 py-2 rounded-lg">
                Registreer
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-cream-muted hover:text-cream"
          aria-label={menuOpen ? "Menu sluiten" : "Menu openen"}
          onClick={() => setMenuOpen(v => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {menuOpen
              ? <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              : <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            }
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-bg-card px-5 py-4 space-y-1">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm text-cream-muted hover:text-cream transition-colors">
              {label}
            </Link>
          ))}
          <div className="pt-3 border-t border-border mt-3 flex flex-col gap-2">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-sm text-cream-muted hover:text-cream">Dashboard</Link>
                <button onClick={signOut} className="text-left text-sm text-muted hover:text-cream-muted">Uitloggen</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm text-cream-muted">Inloggen</Link>
                <Link href="/login?tab=register" onClick={() => setMenuOpen(false)} className="btn-primary text-center text-sm px-4 py-2 rounded-lg">Registreer</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
