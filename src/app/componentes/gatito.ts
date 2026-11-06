import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Gatito blanco (ilustración propia en SVG) que acompaña el recorrido. */
@Component({
  selector: 'app-gatito',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': '"reaccion-" + (reaccion() ?? "nada")' },
  template: `
    @if (mensaje()) {
      <div class="burbuja">{{ mensaje() }}</div>
    }
    <svg viewBox="0 0 160 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path class="cola" d="M118 132 C 150 130, 156 96, 140 84" fill="none" stroke="#ffffff" stroke-width="12" stroke-linecap="round" />
      <ellipse cx="80" cy="122" rx="46" ry="30" fill="#ffffff" />
      <g class="cabeza">
        <path d="M38 62 L44 18 L70 44 Z" fill="#ffffff" />
        <path d="M122 62 L116 18 L90 44 Z" fill="#ffffff" />
        <path d="M46 52 L49 30 L62 44 Z" fill="#ffb3d4" />
        <path d="M114 52 L111 30 L98 44 Z" fill="#ffb3d4" />
        <ellipse cx="80" cy="70" rx="46" ry="38" fill="#ffffff" />
        <g class="ojos">
          <ellipse cx="62" cy="68" rx="6" ry="8" fill="#2a1638" />
          <ellipse cx="98" cy="68" rx="6" ry="8" fill="#2a1638" />
          <circle cx="64" cy="65" r="2" fill="#fff" />
          <circle cx="100" cy="65" r="2" fill="#fff" />
        </g>
        <ellipse cx="48" cy="84" rx="8" ry="5" fill="#ffb3d4" opacity=".7" />
        <ellipse cx="112" cy="84" rx="8" ry="5" fill="#ffb3d4" opacity=".7" />
        <path d="M76 80 L84 80 L80 85 Z" fill="#ff7eb6" />
        <path d="M72 88 Q76 92 80 88 Q84 92 88 88" fill="none" stroke="#2a1638" stroke-width="2" stroke-linecap="round" />
        <g stroke="#d9cde6" stroke-width="1.6" stroke-linecap="round">
          <line x1="40" y1="80" x2="18" y2="76" /><line x1="40" y1="86" x2="18" y2="88" />
          <line x1="120" y1="80" x2="142" y2="76" /><line x1="120" y1="86" x2="142" y2="88" />
        </g>
      </g>
      <ellipse cx="60" cy="146" rx="12" ry="6" fill="#ffffff" />
      <ellipse cx="100" cy="146" rx="12" ry="6" fill="#ffffff" />
    </svg>
  `,
  styles: `
    :host { position: relative; display: inline-block; width: 92px; filter: drop-shadow(0 6px 14px rgba(0,0,0,.35)); }
    svg { width: 100%; display: block; overflow: visible; }
    .cola { transform-origin: 118px 132px; animation: cola 1.8s ease-in-out infinite alternate; }
    .cabeza { transform-origin: 80px 100px; }
    .ojos { transform-origin: 80px 68px; animation: parpadeo 5s infinite; }
    :host(.reaccion-no) .cabeza { animation: no 0.5s ease-in-out 2; }
    :host(.reaccion-feliz) .cabeza { animation: salto 0.6s ease-out 2; }
    .burbuja {
      position: absolute; bottom: 100%; right: 10%; margin-bottom: 6px;
      background: #fff; color: #2a1638; font-size: .78rem; font-weight: 700;
      padding: 6px 10px; border-radius: 14px; white-space: nowrap;
      animation: aparecer .3s ease-out;
    }
    .burbuja::after { content: ''; position: absolute; top: 100%; right: 22px; border: 6px solid transparent; border-top-color: #fff; }
    @keyframes cola { from { transform: rotate(-10deg); } to { transform: rotate(14deg); } }
    @keyframes parpadeo { 0%, 94%, 100% { transform: scaleY(1); } 97% { transform: scaleY(.1); } }
    @keyframes no { 0%,100% { transform: rotate(0); } 25% { transform: rotate(-12deg); } 75% { transform: rotate(12deg); } }
    @keyframes salto { 0%,100% { transform: translateY(0); } 40% { transform: translateY(-10px); } }
    @keyframes aparecer { from { opacity: 0; transform: translateY(6px) scale(.9); } }
    @media (prefers-reduced-motion: reduce) { .cola, .ojos, .cabeza { animation: none !important; } }
  `,
})
export class Gatito {
  readonly mensaje = input<string | null>(null);
  readonly reaccion = input<'no' | 'feliz' | null>(null);
}
