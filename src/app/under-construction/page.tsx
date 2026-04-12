export const metadata = {
  title: "Pokerbacking — Binnenkort beschikbaar",
  description: "Pokerbacking is binnenkort live.",
};

export default function UnderConstructionPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#080d0a",
        color: "#f0ebe0",
        fontFamily: "sans-serif",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "560px", marginBottom: "2.5rem", borderRadius: "12px", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/banner%20pb.png"
          alt="Pokerbacking banner"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>

      <p style={{ color: "#a09070", fontSize: "1rem", maxWidth: "360px", lineHeight: 1.6 }}>
        We zijn nog bezig met de laatste afwerkingen.
        <br />
        Kom binnenkort terug.
      </p>
    </main>
  );
}
