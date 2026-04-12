import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  let captured = false;
  let captureError: string | null = null;

  if (token) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3001";
      const res = await fetch(`${baseUrl}/api/paypal/capture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: token }),
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        captured = true;
      } else {
        captureError = data.error ?? "Betaling bevestigen mislukt";
      }
    } catch {
      captureError = "Verbindingsfout bij bevestigen";
    }
  }

  if (captureError) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center px-5 pt-14">
          <div className="max-w-md w-full text-center">
            <div className="text-5xl mb-6 text-muted">✕</div>
            <h1 className="text-2xl font-bold text-cream mb-3">Iets ging mis</h1>
            <p className="text-cream-muted mb-2">{captureError}</p>
            <p className="text-xs text-muted mb-8">
              Contacteer ons via info@pokerbacking.nl als je betaling wel is afgeschreven.
            </p>
            <Link href="/marketplace" className="btn-primary py-3 rounded-xl text-sm font-semibold block">
              Terug naar marketplace
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-5 pt-14">
        <div className="max-w-md w-full text-center">
          <div className="text-5xl mb-6">♠</div>
          <h1 className="text-2xl font-bold text-cream mb-3">Betaling geslaagd!</h1>
          <p className="text-cream-muted mb-2">
            Je stake is bevestigd. Je kan de status opvolgen in je dashboard.
          </p>
          {!token && (
            <p className="text-xs text-muted mb-8">
              Je ontvangt een bevestiging zodra de player je stake verwerkt heeft.
            </p>
          )}
          <div className="flex flex-col gap-3 mt-8">
            <Link href="/dashboard" className="btn-primary py-3 rounded-xl text-sm font-semibold">
              Naar dashboard
            </Link>
            <Link href="/marketplace" className="btn-ghost py-3 rounded-xl text-sm">
              Meer packages bekijken
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
