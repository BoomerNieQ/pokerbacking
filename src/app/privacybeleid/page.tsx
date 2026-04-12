import Navbar from "@/components/Navbar";
import Link from "next/link";

export const metadata = {
  title: "Privacybeleid — Pokerbacking",
  description: "Hoe Pokerbacking omgaat met jouw persoonsgegevens.",
};

export default function PrivacybeleidPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-5 sm:px-8 pt-24 pb-20">
        <div className="max-w-2xl mx-auto">
          <p className="eyebrow mb-3">Juridisch</p>
          <h1 className="text-3xl font-bold text-cream mb-2">Privacybeleid</h1>
          <p className="text-xs text-muted mb-10">Laatste update: april 2026</p>

          <div className="space-y-8 text-sm text-cream-muted leading-relaxed">

            <section>
              <h2 className="text-lg font-semibold text-cream mb-3">1. Verwerkingsverantwoordelijke</h2>
              <p>
                Pokerbacking is verantwoordelijk voor de verwerking van jouw persoonsgegevens zoals
                beschreven in dit privacybeleid. Contact:{" "}
                <a href="mailto:info@pokerbacking.nl" className="text-gold hover:text-gold-light transition-colors">
                  info@pokerbacking.nl
                </a>
              </p>
            </section>

            <div className="gold-divider" />

            <section>
              <h2 className="text-lg font-semibold text-cream mb-3">2. Welke gegevens verzamelen we?</h2>
              <ul className="list-disc list-inside space-y-2">
                <li><span className="text-cream font-medium">Accountgegevens:</span> naam, e-mailadres, wachtwoord (versleuteld), land.</li>
                <li><span className="text-cream font-medium">Profielgegevens:</span> bio, profielfoto-URL, Hendon Mob-link, Twitter-link (optioneel).</li>
                <li><span className="text-cream font-medium">Transactiegegevens:</span> packages, stakes, bedragen, betalingsstatus.</li>
                <li><span className="text-cream font-medium">Technische gegevens:</span> IP-adres, browser, tijdstip van inloggen (via Supabase Auth).</li>
              </ul>
            </section>

            <div className="gold-divider" />

            <section>
              <h2 className="text-lg font-semibold text-cream mb-3">3. Waarvoor gebruiken we je gegevens?</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Om je account aan te maken en te beheren.</li>
                <li>Om transacties tussen spelers en backers te faciliteren.</li>
                <li>Om je te contacteren over je account of transacties.</li>
                <li>Om fraude en misbruik te voorkomen.</li>
                <li>Om het platform te verbeteren.</li>
              </ul>
            </section>

            <div className="gold-divider" />

            <section>
              <h2 className="text-lg font-semibold text-cream mb-3">4. Rechtsgrond</h2>
              <p>
                We verwerken je gegevens op basis van de uitvoering van de overeenkomst (gebruik van het
                platform), je toestemming (bij optionele profielgegevens), en ons gerechtvaardigd belang
                (platformveiligheid en fraudepreventie).
              </p>
            </section>

            <div className="gold-divider" />

            <section>
              <h2 className="text-lg font-semibold text-cream mb-3">5. Gegevens delen met derden</h2>
              <p>We delen je gegevens alleen met:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>
                  <span className="text-cream font-medium">Supabase</span> — onze databaseprovider
                  (servers in de EU). Privacybeleid:{" "}
                  <span className="text-muted">supabase.com/privacy</span>
                </li>
                <li>
                  <span className="text-cream font-medium">Mollie</span> — betalingsverwerker voor
                  Bancontact/iDEAL. Privacybeleid:{" "}
                  <span className="text-muted">mollie.com/nl/privacy</span>
                </li>
              </ul>
              <p className="mt-3">
                We verkopen je gegevens nooit aan derden en delen ze niet voor marketingdoeleinden.
              </p>
            </section>

            <div className="gold-divider" />

            <section>
              <h2 className="text-lg font-semibold text-cream mb-3">6. Bewaring</h2>
              <p>
                We bewaren je gegevens zolang je account actief is. Na het verwijderen van je account
                worden persoonsgegevens binnen 30 dagen gewist, tenzij wettelijke verplichtingen
                langere bewaring vereisen (bv. boekhoudkundige documenten: 7 jaar).
              </p>
            </section>

            <div className="gold-divider" />

            <section>
              <h2 className="text-lg font-semibold text-cream mb-3">7. Jouw rechten</h2>
              <p>Onder de AVG (GDPR) heb je het recht om:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Je gegevens in te zien.</li>
                <li>Onjuiste gegevens te laten corrigeren.</li>
                <li>Je gegevens te laten wissen ("recht op vergetelheid").</li>
                <li>De verwerking te beperken of hier bezwaar tegen te maken.</li>
                <li>Je gegevens over te dragen (dataportabiliteit).</li>
              </ul>
              <p className="mt-3">
                Stuur een e-mail naar{" "}
                <a href="mailto:info@pokerbacking.nl" className="text-gold hover:text-gold-light transition-colors">
                  info@pokerbacking.nl
                </a>{" "}
                om een van deze rechten uit te oefenen. We reageren binnen 30 dagen.
              </p>
            </section>

            <div className="gold-divider" />

            <section>
              <h2 className="text-lg font-semibold text-cream mb-3">8. Cookies</h2>
              <p>
                Pokerbacking gebruikt alleen functionele cookies die noodzakelijk zijn voor het werken
                van het platform (authenticatiesessie). Er worden geen tracking- of advertentiecookies
                geplaatst.
              </p>
            </section>

            <div className="gold-divider" />

            <section>
              <h2 className="text-lg font-semibold text-cream mb-3">9. Klachten</h2>
              <p>
                Als je een klacht hebt over de verwerking van je gegevens, kan je contact opnemen via
                info@pokerbacking.nl. Je hebt ook het recht een klacht in te dienen bij de
                Gegevensbeschermingsautoriteit (GBA) via{" "}
                <span className="text-muted">gegevensbeschermingsautoriteit.be</span>.
              </p>
            </section>

            <div className="gold-divider" />

            <section>
              <h2 className="text-lg font-semibold text-cream mb-3">10. Wijzigingen</h2>
              <p>
                Dit privacybeleid kan worden aangepast. Bij wezenlijke wijzigingen word je per e-mail
                op de hoogte gesteld.
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
