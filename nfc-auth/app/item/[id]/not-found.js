import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-ink text-paper flex items-center justify-center px-4">
      <div className="text-center max-w-sm fade-up">
        <div className="mx-auto mb-8 h-16 w-16 rounded-full border border-paper/25 flex items-center justify-center">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-[10px] tracking-widest2 uppercase text-paper/45 font-medium mb-3">
          Registry Lookup
        </p>
        <h1 className="font-serif text-4xl mb-4">Not Verified</h1>
        <p className="text-sm text-paper/55 leading-relaxed">
          This reference could not be found in our authentication registry. The
          item may be counterfeit, or the tag may be damaged. Contact the maison
          to confirm.
        </p>
        <Link
          href="/"
          className="inline-block mt-8 text-[11px] tracking-widest2 uppercase border-b border-paper/30 pb-1 text-paper/70 hover:text-paper transition"
        >
          Return
        </Link>
      </div>
    </main>
  );
}
