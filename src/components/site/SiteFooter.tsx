import { Link } from "@tanstack/react-router";

import { Enso } from "@/components/site/Enso";
import { Logo } from "@/components/site/Logo";
import { common } from "@/content/lt/common";
import { footerNav } from "@/data/nav";
import { contact } from "@/data/stays";

export function SiteFooter() {
  return (
    <footer id="kontaktai" className="bg-sage-deep text-warm-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Enso className="h-9 w-9 text-warm-white/60" />
            <Link to="/" aria-label="Dharma Stay — į pradžią" className="mt-5 inline-flex">
              <Logo className="h-24 w-24 text-warm-white" />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-warm-white/70">
              {common.footer.intro}
            </p>
          </div>

          <div>
            <h2 className="label-caps font-sans text-warm-white/60">{common.labels.contacts}</h2>
            <address className="mt-5 space-y-2 text-sm not-italic text-warm-white/85">
              <p>{contact.address}</p>
              {contact.phones.map((phone) => (
                <p key={phone}>
                  <a className="hover:text-warm-white" href={`tel:${phone.replace(/\s/g, "")}`}>
                    {phone}
                  </a>
                </p>
              ))}
              <p>
                <a className="hover:text-warm-white" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </p>
            </address>
          </div>

          <div>
            <h2 className="label-caps font-sans text-warm-white/60">{common.nav.site}</h2>
            <nav aria-label="Poraštės navigacija" className="mt-5 flex flex-col gap-2 text-sm">
              {footerNav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-warm-white/85 hover:text-warm-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <a
              href={contact.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex h-28 items-center justify-center rounded-2xl border border-warm-white/25 text-sm text-warm-white/75 hover:border-warm-white/50"
            >
              {common.cta.openMap}
            </a>
          </div>
        </div>

        <p className="mt-16 border-t border-warm-white/15 pt-6 text-xs text-warm-white/55">
          © {new Date().getFullYear()} Dharma Stay. Rezervacijos tiesiogiai, be tarpininkų.
        </p>
      </div>
    </footer>
  );
}