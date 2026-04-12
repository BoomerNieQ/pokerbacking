"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

type Tab = "login" | "register";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const supabase = createClient();

  const [tab, setTab] = useState<Tab>((params.get("tab") as Tab) ?? "login");
  const [role, setRole] = useState<"player" | "backer">("backer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (tab === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { name, role } },
      });
      if (error) { setError(error.message); setLoading(false); return; }
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-5">
      <Link href="/" className="text-2xl font-bold text-gradient mb-10">Pokerbacking</Link>

      <div className="w-full max-w-sm bg-bg-card border border-border rounded-2xl p-7">
        {/* Tabs */}
        <div className="flex bg-bg-elevated rounded-xl p-1 mb-7">
          {(["login", "register"] as Tab[]).map((t) => (
            <button key={t} onClick={() => { setTab(t); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-bg-card text-cream" : "text-muted hover:text-cream-muted"}`}>
              {t === "login" ? "Inloggen" : "Registreren"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          {tab === "register" && (
            <>
              <div>
                <label className="block text-xs text-muted mb-1.5 uppercase tracking-wider">Naam</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required
                  placeholder="Jouw naam" className="input" />
              </div>

              {/* Role selector */}
              <div>
                <label className="block text-xs text-muted mb-1.5 uppercase tracking-wider">Ik ben een…</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["backer", "player"] as const).map((r) => (
                    <button key={r} type="button" onClick={() => setRole(r)}
                      className={`py-3 rounded-xl border text-sm font-medium transition-colors ${
                        role === r
                          ? "border-gold bg-gold/5 text-gold"
                          : "border-border text-muted hover:text-cream-muted hover:border-border-light"
                      }`}>
                      {r === "backer" ? "🎯 Backer" : "♠ Player"}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted mt-2">
                  {role === "backer" ? "Jij investeert in spelers." : "Jij maakt packages aan voor je toernooien."}
                </p>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs text-muted mb-1.5 uppercase tracking-wider">E-mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="jouw@email.com" className="input" />
          </div>

          <div>
            <label className="block text-xs text-muted mb-1.5 uppercase tracking-wider">Wachtwoord</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••" className="input" />
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>
          )}

          <button type="submit" disabled={loading}
            className="btn-primary w-full py-3 rounded-xl text-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? "Laden…" : tab === "login" ? "Inloggen" : "Account aanmaken"}
          </button>
        </form>
      </div>

      <Link href="/" className="mt-6 text-xs text-muted hover:text-cream-muted transition-colors">
        ← Terug naar Pokerbacking
      </Link>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
