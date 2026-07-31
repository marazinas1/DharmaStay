import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useBooking } from "@/components/site/BookingDialog";
import { Logo } from "@/components/site/Logo";
import { common } from "@/content/lt/common";
import { mainNav, type NavEntry, type NavLink } from "@/data/nav";
import { cn } from "@/lib/utils";

function isGroup(entry: NavEntry): entry is { label: string; items: NavLink[] } {
  return "items" in entry;
}

export function SiteHeader() {
  const { open } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close every menu after a route change.
  useEffect(() => {
    setMenuOpen(false);
    setOpenGroup(null);
    setMobileGroup(null);
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenGroup(null);
    };
    const onClick = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setOpenGroup(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const solid = scrolled || menuOpen || pathname !== "/";
  const linkTone = solid ? "text-stone hover:text-sage" : "text-warm-white/85 hover:text-warm-white";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        solid ? "border-b border-border/70 bg-linen/95 backdrop-blur-sm" : "bg-transparent",
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 py-3 lg:px-12 lg:py-4">
        <Link
          to="/"
          aria-label="Dharma Stay — į pradžią"
          className={cn(
            "inline-flex items-center transition-colors",
            solid ? "text-ink" : "text-warm-white",
          )}
        >
          <Logo className="h-14 w-14 lg:h-[3.25rem] lg:w-[3.25rem] xl:h-14 xl:w-14" />
        </Link>

        <div ref={navRef} className="flex items-center gap-6">
          <nav aria-label="Pagrindinė navigacija" className="hidden items-center gap-6 lg:flex">
            {mainNav.map((entry) =>
              isGroup(entry) ? (
                <div
                  key={entry.label}
                  className="relative"
                  onMouseEnter={() => setOpenGroup(entry.label)}
                  onMouseLeave={() => setOpenGroup((value) => (value === entry.label ? null : value))}
                >
                  <button
                    type="button"
                    aria-expanded={openGroup === entry.label}
                    aria-haspopup="true"
                    onClick={() =>
                      setOpenGroup((value) => (value === entry.label ? null : entry.label))
                    }
                    className={cn(
                      "inline-flex items-center gap-1 text-sm font-medium transition-colors",
                      linkTone,
                    )}
                  >
                    {entry.label}
                    <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                  </button>
                  {openGroup === entry.label ? (
                    <div className="absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-3">
                      <ul className="overflow-hidden rounded-2xl border border-border bg-warm-white py-2 shadow-lift">
                        {entry.items.map((item) => (
                          <li key={item.to}>
                            <Link
                              to={item.to}
                              activeProps={{ className: "text-sage" }}
                              className="block px-5 py-2.5 text-sm text-stone transition-colors hover:bg-linen hover:text-sage"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link
                  key={entry.to}
                  to={entry.to}
                  activeProps={{ className: solid ? "text-sage" : "text-warm-white" }}
                  className={cn("text-sm font-medium transition-colors", linkTone)}
                >
                  {entry.label}
                </Link>
              ),
            )}
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
            {common.cta.checkDates}
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
        <div className="max-h-[80vh] overflow-y-auto border-t border-border/70 bg-linen px-6 pb-8 pt-2 lg:hidden">
          <nav aria-label="Mobili navigacija" className="flex flex-col">
            {mainNav.map((entry) =>
              isGroup(entry) ? (
                <div key={entry.label} className="border-b border-border/60">
                  <button
                    type="button"
                    aria-expanded={mobileGroup === entry.label}
                    onClick={() =>
                      setMobileGroup((value) => (value === entry.label ? null : entry.label))
                    }
                    className="flex w-full items-center justify-between py-4 text-base font-medium text-ink"
                  >
                    {entry.label}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        mobileGroup === entry.label && "rotate-180",
                      )}
                      aria-hidden
                    />
                  </button>
                  {mobileGroup === entry.label ? (
                    <ul className="pb-3 pl-4">
                      {entry.items.map((item) => (
                        <li key={item.to}>
                          <Link
                            to={item.to}
                            onClick={() => setMenuOpen(false)}
                            className="block py-2.5 text-sm text-stone"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : (
                <Link
                  key={entry.to}
                  to={entry.to}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-border/60 py-4 text-base font-medium text-ink"
                >
                  {entry.label}
                </Link>
              ),
            )}
          </nav>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              open();
            }}
            className="mt-6 w-full rounded-full bg-sage px-5 py-3.5 text-sm font-medium text-warm-white"
          >
            {common.cta.checkDates}
          </button>
        </div>
      ) : null}
    </header>
  );
}
