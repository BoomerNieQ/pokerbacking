import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function PaymentCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ package_id?: string }>;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-5 pt-14">
        <div className="max-w-md w-full text-center">
          <div className="text-5xl mb-6 text-muted">✕</div>
          <h1 className="text-2xl font-bold text-cream mb-3">Betaling geannuleerd</h1>
          <p className="text-cream-muted mb-8">
            Je betaling werd niet afgerond. Je stake is niet aangemaakt.
            Probeer het opnieuw of kies voor manuele betaling.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/marketplace" className="btn-primary py-3 rounded-xl text-sm font-semibold">
              Terug naar marketplace
            </Link>
            <Link href="/" className="btn-ghost py-3 rounded-xl text-sm">
              Homepage
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
