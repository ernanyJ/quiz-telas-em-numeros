/** Ícones SVG inline no estilo da identidade (traço arredondado, branco/azul). */

const svg = (body: string, viewBox = '0 0 64 64') =>
  `<svg viewBox="${viewBox}" aria-hidden="true" focusable="false">${body}</svg>`;

export const icons = {
  bulb: svg(`
    <g class="rays" stroke="#ffc83d" stroke-width="4" stroke-linecap="round">
      <path d="M32 4v6M10 12l4 4M54 12l-4 4M4 32h6M54 32h6"/>
    </g>
    <path d="M32 16c-9 0-16 7-16 15.5 0 6 3 9.5 6 12.5 2 2 3 4 3 6.5V52h14v-1.5c0-2.5 1-4.5 3-6.5 3-3 6-6.5 6-12.5C48 23 41 16 32 16z"
      fill="#ffc83d" stroke="#0b2a6f" stroke-width="3" stroke-linejoin="round"/>
    <path d="M28 46v-6a4 4 0 0 1 8 0v6" fill="none" stroke="#0b2a6f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="25" y="52" width="14" height="4" rx="2" fill="#0b2a6f"/>
    <rect x="27" y="57" width="10" height="4" rx="2" fill="#0b2a6f"/>`),
  wifi: svg(`
    <g fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round">
      <path d="M8 26a34 34 0 0 1 48 0"/><path d="M16 35a22 22 0 0 1 32 0"/><path d="M24 44a10 10 0 0 1 16 0"/>
    </g><circle cx="32" cy="52" r="4" fill="currentColor"/>`),
  laptop: svg(`
    <rect x="12" y="14" width="40" height="28" rx="4" fill="#1e5bd8" stroke="currentColor" stroke-width="4"/>
    <path d="M4 48h56l-4 6H8z" fill="currentColor" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>`),
  phone: svg(`
    <rect x="18" y="4" width="28" height="56" rx="6" fill="#1e5bd8" stroke="currentColor" stroke-width="4"/>
    <circle cx="32" cy="52" r="2.5" fill="currentColor"/>`),
  atom: svg(`
    <g fill="none" stroke="currentColor" stroke-width="3">
      <ellipse cx="32" cy="32" rx="26" ry="10"/>
      <ellipse cx="32" cy="32" rx="26" ry="10" transform="rotate(60 32 32)"/>
      <ellipse cx="32" cy="32" rx="26" ry="10" transform="rotate(-60 32 32)"/>
    </g><circle cx="32" cy="32" r="5" fill="#bfd7ff" stroke="currentColor" stroke-width="2"/>`),
  star: svg(
    `<path d="M32 5l8.2 16.6 18.3 2.7-13.2 12.9 3.1 18.2L32 46.8l-16.4 8.6 3.1-18.2L5.5 24.3l18.3-2.7z"
      stroke-linejoin="round"/>`,
  ),
  check: svg(
    `<path d="M14 33l12 12 24-26" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`,
  ),
  cross: svg(
    `<path d="M18 18l28 28M46 18L18 46" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>`,
  ),
  soundOn: svg(`
    <path d="M10 24h10l14-12v40L20 40H10z" fill="currentColor" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
    <g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round">
      <path d="M42 24a11 11 0 0 1 0 16"/><path d="M48 17a21 21 0 0 1 0 30"/>
    </g>`),
  soundOff: svg(`
    <path d="M10 24h10l14-12v40L20 40H10z" fill="currentColor" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
    <path d="M44 24l14 16M58 24L44 40" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`),
} as const;
