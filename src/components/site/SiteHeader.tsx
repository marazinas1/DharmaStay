import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useBooking } from "@/components/site/BookingDialog";
import { Logo } from "@/components/site/Logo";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Apartamentai", href: "#apartamentai" },
  { label: "Namelis", href: "#namelis" },
  { label: "Vieta", href: "#vieta" },
  { label: "Kontaktai", href: "#kontaktai" },
];

export function SiteHeader() {
  const { open } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || menuOpen;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        solid ? "border-b border-border/70 bg-linen/95 backdrop-blur-sm" : "bg-transparent",
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 py-5 lg:px-12">
        <Link
          to="/"
          hash="top"
          aria-label="Dharma Stay — į pradžią"
          className={cn(
            "inline-flex items-center transition-colors",
            solid ? "text-ink" : "text-warm-white",
          )}
        >
          <Logo className="h-11 w-11" />
        </Link>

        <div className="flex items-center gap-8">
          <nav aria-label="Pagrindinė navigacija" className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  solid ? "text-stone hover:text-sage" : "text-warm-white/85 hover:text-warm-white",
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => open()}
            className={cn(
              "hidden rounded-full px-5 py-2.5 text-sm font-medium transition-colors lg:inline-flex",
              solid
                ? "bg-sage text-warm-white hover:bg-sage-deep"
                : "border border-warm-white/70 text-warm-white hover:bg-warm-white hover:text-ink",
            )}
          >
            Tikrinti laisvas datas
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Uždaryti meniu" : "Atidaryti meniu"}
            className={cn("lg:hidden", solid ? "text-ink" : "text-warm-white")}
          >
            {menuOpen ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-border/70 bg-linen px-6 pb-8 pt-2 lg:hidden">
          <nav aria-label="Mobili navigacija" className="flex flex-col">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-border/60 py-4 text-base font-medium text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              open();
            }}
            className="mt-6 w-full rounded-full bg-sage px-5 py-3.5 text-sm font-medium text-warm-white"
          >
            Tikrinti laisvas datas
          </button>
        </div>
      ) : null}
    </header>
  );
}
