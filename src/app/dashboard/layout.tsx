import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashNav from "./DashNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) redirect("/login");

  return (
    <div className="min-h-screen bg-bg">
      <DashNav profile={profile} />
      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
        {children}
      </main>
    </div>
  );
}
