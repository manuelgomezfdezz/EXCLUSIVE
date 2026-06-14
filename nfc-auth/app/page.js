import Link from "next/link";
import Seal from "@/components/Seal";

export default function Home() {
  return (
    <main className="min-h-screen bg-ink text-paper flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md fade-up">
        <div className="flex justify-center mb-8">
          <div className="bg-paper rounded-full p-4">
            <Seal verified size={96} />
          </div>
        </div>
        <p className="text-[10px] tracking-widest2 uppercase text-paper/45 font-medium mb-4">
          Authentication Registry
        </p>
        <h1 className="font-serif text-5xl leading-tight mb-5">
          Proof of Origin,
          <br /> in every thread.
        </h1>
        <p className="text-sm text-paper/55 leading-relaxed mb-10">
          Each limited edition piece carries an embedded NFC tag. Tap it with
          your phone to open its private certificate of authenticity and verify
          its registered owner.
        </p>

        <div className="flex flex-col gap-3 items-center">
          <Link
            href="/item/CAM-0001"
            className="text-[11px] tracking-widest2 uppercase border border-paper/25 rounded-full px-6 py-3 hover:bg-paper hover:text-ink transition"
          >
            View Sample Certificate
          </Link>
          <Link
            href="/admin"
            className="text-[10px] tracking-widest2 uppercase text-paper/40 hover:text-paper/70 transition mt-2"
          >
            Admin Access
          </Link>
        </div>
      </div>
    </main>
  );
}
