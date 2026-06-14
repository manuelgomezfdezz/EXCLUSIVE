"use client";

// The embossed wax-style verification seal. This is the page's signature
// element: a circular crest with rotating micro-text around a central mark.
export default function Seal({ verified = true, size = 132 }) {
  return (
    <div
      className="relative seal-in"
      style={{ width: size, height: size }}
      aria-label={verified ? "Verified authentic seal" : "Unverified seal"}
    >
      {/* Rotating outer micro-text ring */}
      <svg
        className="spin-slow absolute inset-0"
        viewBox="0 0 200 200"
        width={size}
        height={size}
      >
        <defs>
          <path
            id="circlePath"
            d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
          />
        </defs>
        <text
          fill="#0A0A0A"
          style={{
            fontSize: "9px",
            letterSpacing: "3.5px",
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            opacity: 0.55,
          }}
        >
          <textPath href="#circlePath" startOffset="0%">
            CERTIFICATE OF AUTHENTICITY · VERIFIED ORIGINAL ·&nbsp;
          </textPath>
        </text>
      </svg>

      {/* Static crest in the middle */}
      <svg
        className="absolute inset-0"
        viewBox="0 0 200 200"
        width={size}
        height={size}
      >
        {/* Double ring */}
        <circle cx="100" cy="100" r="60" fill="none" stroke="#0A0A0A" strokeWidth="1" opacity="0.9" />
        <circle cx="100" cy="100" r="54" fill="none" stroke="#0A0A0A" strokeWidth="0.5" opacity="0.5" />

        {/* Center mark: an interlocked monogram + checkmark */}
        <g transform="translate(100,100)">
          <path
            d="M -16,2 L -5,14 L 18,-13"
            fill="none"
            stroke="#0A0A0A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x="0"
            y="-22"
            textAnchor="middle"
            style={{
              fontSize: "11px",
              letterSpacing: "2px",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
            }}
            fill="#0A0A0A"
          >
            AUTH
          </text>
          {/* small flanking stars */}
          <text x="-30" y="2" textAnchor="middle" fontSize="8" fill="#0A0A0A" opacity="0.6">✦</text>
          <text x="30" y="2" textAnchor="middle" fontSize="8" fill="#0A0A0A" opacity="0.6">✦</text>
        </g>
      </svg>
    </div>
  );
}
