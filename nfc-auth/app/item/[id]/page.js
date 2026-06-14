import { getItemById, getHistoryForItem } from "@/lib/db";
import Seal from "@/components/Seal";
import { notFound } from "next/navigation";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function CertificatePage({ params }) {
  const item = await getItemById(params.id);

  if (!item) {
    notFound();
  }

  const history = await getHistoryForItem(params.id);
  const isTransferred = item.status === "Transferred";

  return (
    <main className="min-h-screen bg-ink flex items-center justify-center px-4 py-10 sm:py-16">
      {/* The certificate card */}
      <div className="relative w-full max-w-md">
        {/* Paper card */}
        <div className="grain relative overflow-hidden bg-paper text-ink rounded-[4px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
          {/* Inner border frame */}
          <div className="absolute inset-3 border border-ink/15 rounded-[2px] pointer-events-none" />

          <div className="relative px-7 pt-9 pb-8 sm:px-10 sm:pt-11">
            {/* Eyebrow */}
            <p className="fade-up text-center text-[10px] tracking-widest2 uppercase text-ink/50 font-medium">
              Maison · Limited Series
            </p>

            {/* Seal */}
            <div className="flex justify-center mt-6 mb-6">
              <Seal verified />
            </div>

            {/* Title */}
            <h1 className="fade-up delay-1 font-serif text-center text-[40px] leading-[1.05] sm:text-[44px] tracking-tight">
              Certificate of
              <br />
              Authenticity
            </h1>

            <div className="fade-up delay-1 hairline my-7" />

            {/* Product */}
            <div className="fade-up delay-2 text-center space-y-1">
              <p className="text-[10px] tracking-widest2 uppercase text-ink/45 font-medium">
                The Piece
              </p>
              <p className="font-serif text-2xl">{item.product_name}</p>
              <p className="text-xs tracking-[0.2em] uppercase text-ink/55">
                Edition {item.edition}
              </p>
            </div>

            {/* Detail grid */}
            <div className="fade-up delay-3 mt-8 grid grid-cols-2 gap-px bg-ink/10 border border-ink/10 rounded-[2px] overflow-hidden">
              <Field label="Reference" value={item.item_id} />
              <Field
                label="Status"
                value={
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isTransferred ? "bg-amber-600" : "bg-emerald-600"
                      }`}
                    />
                    {item.status}
                  </span>
                }
              />
              <Field label="Registered Owner" value={item.owner_name} wide />
              <Field
                label="Last Updated"
                value={formatDate(item.last_updated)}
                wide
              />
            </div>

            {/* Verified badge */}
            <div className="fade-up delay-4 mt-8 flex items-center justify-center gap-2.5 rounded-full border border-ink/20 bg-ink text-paper py-2.5 px-5 w-fit mx-auto">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 6 9 17l-5-5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[11px] tracking-widest2 uppercase font-medium">
                Verified Authentic
              </span>
            </div>

            {/* Ownership history */}
            {history.length > 0 && (
              <div className="fade-up delay-4 mt-9">
                <p className="text-[10px] tracking-widest2 uppercase text-ink/45 font-medium text-center mb-4">
                  Provenance
                </p>
                <ol className="space-y-3">
                  {history.map((h, idx) => (
                    <li key={idx} className="flex gap-3 text-xs">
                      <div className="flex flex-col items-center pt-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-ink/60" />
                        {idx !== history.length - 1 && (
                          <span className="w-px flex-1 bg-ink/15 mt-1" />
                        )}
                      </div>
                      <div className="pb-1">
                        <p className="text-ink/80">
                          Transferred from{" "}
                          <span className="font-medium">{h.previous_owner}</span> to{" "}
                          <span className="font-medium">{h.new_owner}</span>
                        </p>
                        <p className="text-ink/40 mt-0.5 tracking-wide">
                          {formatDate(h.changed_at)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Footer */}
            <div className="hairline my-7" />
            <p className="text-center text-[9px] tracking-[0.25em] uppercase text-ink/35">
              This certificate verifies a genuine article
            </p>
          </div>
        </div>

        {/* Caption under card */}
        <p className="text-center text-paper/30 text-[10px] tracking-widest2 uppercase mt-5">
          Scanned via NFC · Secure Registry
        </p>
      </div>
    </main>
  );
}

function Field({ label, value, wide }) {
  return (
    <div className={`bg-paper px-4 py-3.5 ${wide ? "col-span-2" : ""}`}>
      <p className="text-[9px] tracking-[0.2em] uppercase text-ink/40 font-medium mb-1">
        {label}
      </p>
      <p className="text-sm text-ink/90">{value}</p>
    </div>
  );
}
