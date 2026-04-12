import Image from "next/image";

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
      <Image
        src="/images/logosmall.png"
        alt="Pokerbacking logo"
        width={120}
        height={120}
        style={{ marginBottom: "2rem", objectFit: "contain" }}
      />

      <div style={{ width: "100%", maxWidth: "560px", marginBottom: "2.5rem", borderRadius: "12px", overflow: "hidden" }}>
        <Image
          src="/images/banner pb.png"
          alt="Pokerbacking banner"
          width={560}
          height={200}
          style={{ width: "100%", height: "auto", objectFit: "cover" }}
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
