/**
 * Illustration originale (SVG) représentant la mise en relation
 * entre un client et un artisan — pas de photo externe, donc pas de
 * dépendance réseau ni de question de droits d'usage.
 */
export default function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 560 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration d'un artisan et d'un client se serrant la main devant une maison"
      style={{ width: "100%", height: "100%" }}
    >
      <defs>
        <linearGradient id="blobDegrade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0a83a" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0e5c3e" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="maisonDegrade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fdfbf6" />
        </linearGradient>
        <filter id="ombre" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#0e5c3e" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Fond en forme organique */}
      <path
        d="M96 84C170 18 330 6 424 62C518 118 552 240 522 336C492 432 384 486 280 508C176 530 60 508 26 420C-8 332 22 150 96 84Z"
        fill="url(#blobDegrade)"
      />

      {/* Maison stylisée en arrière-plan */}
      <g opacity="0.95">
        <rect x="150" y="260" width="260" height="190" rx="14" fill="url(#maisonDegrade)" stroke="#e6ddc9" />
        <path d="M132 272L280 168L428 272" stroke="#0e5c3e" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="248" y="360" width="64" height="90" rx="6" fill="#0e5c3e" />
        <rect x="184" y="300" width="48" height="48" rx="6" fill="#dcefe3" stroke="#0e5c3e" strokeWidth="3" />
        <rect x="328" y="300" width="48" height="48" rx="6" fill="#fdeee6" stroke="#e8622c" strokeWidth="3" />
      </g>

      {/* Personnage — artisan (à gauche), avec caisse à outils */}
      <g>
        <circle cx="196" cy="352" r="26" fill="#0e5c3e" />
        <path
          d="M150 460C150 410 170 386 196 386C222 386 242 410 242 460"
          fill="#0e5c3e"
        />
        <rect x="152" y="440" width="40" height="30" rx="6" fill="#e8622c" />
        <rect x="146" y="432" width="52" height="12" rx="4" fill="#c94f20" />
      </g>

      {/* Personnage — client (à droite) */}
      <g>
        <circle cx="366" cy="352" r="26" fill="#e8622c" />
        <path
          d="M320 460C320 410 340 386 366 386C392 386 412 410 412 460"
          fill="#e8622c"
        />
      </g>

      {/* Poignée de main entre les deux personnages */}
      <path
        d="M244 424C264 408 298 408 318 424"
        stroke="#1c1b19"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <circle cx="281" cy="418" r="11" fill="#f0a83a" />

      {/* Carte flottante : artisan vérifié */}
      <g transform="translate(60, 120)">
        <rect width="152" height="64" rx="16" fill="#ffffff" filter="url(#ombre)" />
        <circle cx="30" cy="32" r="14" fill="#dcefe3" />
        <path d="M24 32l4 4 8-9" stroke="#0e5c3e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="54" y="27" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" fill="#1c1b19">Artisan vérifié</text>
        <text x="54" y="42" fontFamily="Inter, sans-serif" fontSize="10" fill="#5a564e">Identité contrôlée</text>
      </g>

      {/* Carte flottante : note */}
      <g transform="translate(360, 440)">
        <rect width="140" height="60" rx="16" fill="#ffffff" filter="url(#ombre)" />
        <text x="16" y="26" fontFamily="Space Mono, monospace" fontSize="14" fontWeight="700" fill="#f0a83a">★ 4.8</text>
        <text x="16" y="44" fontFamily="Inter, sans-serif" fontSize="10" fill="#5a564e">Note moyenne</text>
      </g>
    </svg>
  );
}
