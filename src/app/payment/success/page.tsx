import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function PaymentSuccessPage() {
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
          <p className="text-xs text-muted mb-8">
            Je ontvangt een bevestiging zodra de player je stake verwerkt heeft.
          </p>
          <div className="flex flex-col gap-3">
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
