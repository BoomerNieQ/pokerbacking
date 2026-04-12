import Navbar from "@/components/Navbar";
import Link from "next/link";

export const metadata = {
  title: "Algemene voorwaarden — Pokerbacking",
  description: "Lees de algemene voorwaarden van Pokerbacking.",
};

export default function AlgemeneVoorwaardenPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-5 sm:px-8 pt-24 pb-20">
        <div className="max-w-2xl mx-auto">
          <p className="eyebrow mb-3">Juridisch</p>
          <h1 className="text-3xl font-bold text-cream mb-2">Algemene voorwaarden</h1>
          <p className="text-xs text-muted mb-10">Laatste update: april 2026</p>

          <div className="space-y-8 text-sm text-cream-muted leading-relaxed">

            <section>
              <h2 className="text-lg font-semibold text-cream mb-3">1. Wie zijn wij?</h2>
              <p>
                Pokerbacking is een online platform dat pokerspelers en backers met elkaar verbindt.
                Via het platform kunnen spelers een percentage van hun toernooideelname te koop aanbieden
                aan backers, die in ruil een proportioneel deel van eventuele prijzengelden ontvangen.
              </p>
              <p className="mt-2">
                Pokerbacking wordt uitgebaat vanuit België. Contact:{" "}
                <a href="mailto:info@pokerbacking.nl" className="text-gold hover:text-gold-light transition-colors">
                  info@pokerbacking.nl
                </a>
              </p>
            </section>

            <div className="gold-divider" />

            <section>
              <h2 className="text-lg font-semibold text-cream mb-3">2. Toepassingsgebied</h2>
              <p>
                Deze voorwaarden zijn van toepassing op alle gebruikers van het platform — zowel spelers
                als backers — en op alle transacties die via Pokerbacking tot stand komen. Door een account
                aan te maken ga je akkoord met deze voorwaarden.
              </p>
            </section>

            <div className="gold-divider" />

            <section>
              <h2 className="text-lg font-semibold text-cream mb-3">3. Rollen op het platform</h2>
              <ul className="list-disc list-inside space-y-2">
                <li><span className="text-cream font-medium">Speler:</span> een geregistreerde gebruiker die packages aanmaakt en stakes verkoopt.</li>
                <li><span className="text-cream font-medium">Backer:</span> een geregistreerde gebruiker die stakes aankoopt in packages van spelers.</li>
              </ul>
            </section>

            <div className="gold-divider" />

            <section>
              <h2 className="text-lg font-semibold text-cream mb-3">4. Packages en stakes</h2>
              <p>
                Een package vertegenwoordigt de deelname van een speler aan een specifiek pokertoernooi.
                De speler bepaalt zelf welk percentage hij aanbiedt, de buy-in, de markup en de sluitingsdatum.
              </p>
              <p className="mt-2">
                Een backer koopt een percentage (stake) van een package. De backer betaalt de aangegeven kostprijs
                en ontvangt bij een cashende speler het overeenkomstige percentage van de nettoprijzengelden,
                na aftrek van de platformcommissie.
              </p>
            </section>

            <div className="gold-divider" />

            <section>
              <h2 className="text-lg font-semibold text-cream mb-3">5. Commissie</h2>
              <p>
                Pokerbacking rekent een commissie van <span className="text-gold font-semibold">3%</span> op
                het totale bedrag van een stake. Deze commissie is inbegrepen in de prijs die de backer betaalt
                en dient ter dekking van de operationele kosten van het platform.
              </p>
            </section>

            <div className="gold-divider" />

            <section>
              <h2 className="text-lg font-semibold text-cream mb-3">6. Betalingen</h2>
              <p>
                Betalingen kunnen verlopen via Mollie (Bancontact, iDEAL) of via manuele overschrijving.
                Bij manuele betaling is de speler verantwoordelijk voor de bevestiging van ontvangst.
              </p>
              <p className="mt-2">
                Pokerbacking treedt op als tussenpersoon voor de matching van spelers en backers, maar is
                geen partij in de financiële transactie zelf. Pokerbacking is niet aansprakelijk voor
                niet-nagekomen betalingsverplichtingen van individuele gebruikers.
              </p>
            </section>

            <div className="gold-divider" />

            <section>
              <h2 className="text-lg font-semibold text-cream mb-3">7. Uitbetalingen</h2>
              <p>
                Na afloop van een toernooi is de speler verantwoordelijk voor het correct rapporteren van
                eventuele prijzengelden en het uitbetalen van de backers conform hun aandeel.
                Pokerbacking faciliteert de registratie van uitbetalingen maar is niet verantwoordelijk
                voor de effectieve overdracht van fondsen.
              </p>
            </section>

            <div className="gold-divider" />

            <section>
              <h2 className="text-lg font-semibold text-cream mb-3">8. Aansprakelijkheid</h2>
              <p>
                Pokerbacking biedt het platform aan "as is". Het platform garandeert geen winst voor
                spelers of backers. Beleggen in pokertoernooien houdt financieel risico in — backers
                kunnen hun inleg geheel of gedeeltelijk verliezen.
              </p>
              <p className="mt-2">
                Pokerbacking is niet aansprakelijk voor indirecte schade, gederfde winst, of schade
                voortvloeiend uit het gedrag van andere gebruikers.
              </p>
            </section>

            <div className="gold-divider" />

            <section>
              <h2 className="text-lg font-semibold text-cream mb-3">9. Gedragsregels</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Gebruikers zijn verantwoordelijk voor de juistheid van de door hen ingevoerde informatie.</li>
                <li>Het aanmaken van valse accounts of het manipuleren van gegevens is verboden.</li>
                <li>Pokerbacking behoudt het recht accounts te blokkeren bij misbruik.</li>
              </ul>
            </section>

            <div className="gold-divider" />

            <section>
              <h2 className="text-lg font-semibold text-cream mb-3">10. Wijzigingen</h2>
              <p>
                Pokerbacking behoudt het recht deze voorwaarden te wijzigen. Bij wezenlijke wijzigingen
                worden gebruikers per e-mail geïnformeerd. Voortgezet gebruik van het platform na
                kennisgeving geldt als aanvaarding van de nieuwe voorwaarden.
              </p>
            </section>

            <div className="gold-divider" />

            <section>
              <h2 className="text-lg font-semibold text-cream mb-3">11. Toepasselijk recht</h2>
              <p>
                Op deze voorwaarden is Belgisch recht van toepassing. Geschillen worden voorgelegd aan
                de bevoegde rechtbanken in België.
              </p>
            </section>

          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <Link href="/" className="text-xs text-gold hover:text-gold-light transition-colors">← Terug naar homepage</Link>
          </div>
        </div>
      </main>
    </>
  );
}
