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
      <div style={{ fontSize: "3rem", marginBottom: "1.5rem", opacity: 0.6 }}>♠</div>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.75rem" }}>
        Pokerbacking
      </h1>
      <p style={{ color: "#a09070", fontSize: "1rem", maxWidth: "360px", lineHeight: 1.6 }}>
        We zijn nog bezig met de laatste afwerkingen.
        <br />
        Kom binnenkort terug.
      </p>
    </main>
  );
}
