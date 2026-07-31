import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { Enso } from "@/components/site/Enso";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { stays } from "@/data/stays";

type BookingContextValue = {
  open: (stayId?: string) => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}

/**
 * Booking UI shell. Structure only — availability, pricing and payment come from
 * the booking engine (core) API in a later phase. No external redirects.
 */
export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [stayId, setStayId] = useState<string>(stays[0].id);

  const open = useCallback((id?: string) => {
    if (id) setStayId(id);
    setIsOpen(true);
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <BookingContext.Provider value={value}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-2xl border-border bg-warm-white p-0 sm:max-w-lg">
          <div className="p-6 sm:p-8">
            <DialogHeader className="space-y-3 text-left">
              <Enso className="h-8 w-8" />
              <DialogTitle className="font-display text-2xl font-normal text-ink">
                Tikrinti laisvas datas
              </DialogTitle>
              <DialogDescription className="text-stone">
                Rezervacija vyksta čia, Dharma Stay svetainėje. Rezervacijų sistema
                netrukus bus įjungta – kol kas tai peržiūros forma.
              </DialogDescription>
            </DialogHeader>

            <form className="mt-7 space-y-5" onSubmit={(event) => event.preventDefault()}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="label-caps text-stone">Atvykimas</span>
                  <input
                    type="date"
                    name="checkin"
                    className="w-full rounded-xl border border-border bg-linen px-4 py-3 text-sm text-ink"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="label-caps text-stone">Išvykimas</span>
                  <input
                    type="date"
                    name="checkout"
                    className="w-full rounded-xl border border-border bg-linen px-4 py-3 text-sm text-ink"
                  />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="label-caps text-stone">Apgyvendinimas</span>
                <select
                  name="stay"
                  value={stayId}
                  onChange={(event) => setStayId(event.target.value)}
                  className="w-full rounded-xl border border-border bg-linen px-4 py-3 text-sm text-ink"
                >
                  {stays.map((stay) => (
                    <option key={stay.id} value={stay.id}>
                      {stay.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="label-caps text-stone">Svečiai</span>
                <input
                  type="number"
                  name="guests"
                  min={1}
                  max={6}
                  defaultValue={2}
                  className="w-full rounded-xl border border-border bg-linen px-4 py-3 text-sm text-ink"
                />
              </label>

              <button
                type="submit"
                disabled
                className="w-full rounded-full bg-sage px-6 py-3.5 text-sm font-medium text-warm-white opacity-60"
              >
                Tęsti rezervaciją
              </button>
              <p className="text-center text-xs text-stone">
                Be tarpininkų ir be Booking.com komisinių.
              </p>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </BookingContext.Provider>
  );
}