import { useBooking } from "@/components/site/BookingDialog";
import { Enso } from "@/components/site/Enso";

export function BookingBand() {
  const { open } = useBooking();

  return (
    <section className="bg-sage px-6 py-24 text-warm-white lg:px-12">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <Enso className="h-9 w-9 text-warm-white/60" />
        <h2 className="mt-8 font-display text-[clamp(1.875rem,4.2vw,2.5rem)] leading-tight font-normal">
          Pasitikrinkite datas
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-warm-white/85">
          Rezervuokite tiesiogiai pas mus – ta pati kaina, jokių tarpininkų.
        </p>
        <button
          type="button"
          onClick={() => open()}
          className="mt-9 rounded-full bg-warm-white px-8 py-3.5 text-sm font-medium text-sage-deep transition-colors hover:bg-linen"
        >
          Tikrinti laisvas datas
        </button>
      </div>
    </section>
  );
}
