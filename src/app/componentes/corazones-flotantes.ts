import { ChangeDetectionStrategy, Component } from '@angular/core';

const COLORES = ['#ff2e93', '#d6249f', '#c77dff', '#9d4edd', '#ff5fa8'];

/** Fondo de corazones que suben despacito. Solo CSS, cero JS por frame. */
@Component({
  selector: 'app-corazones-flotantes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (c of corazones; track $index) {
      <svg class="corazon" viewBox="0 0 32 29" aria-hidden="true"
        [style.left.%]="c.x" [style.width.px]="c.t" [style.animation-duration.s]="c.d"
        [style.animation-delay.s]="c.r" [style.opacity]="c.o">
        <path [attr.fill]="c.color" d="M16 29 C 6 21, 0 15, 0 8.5 C 0 3.5, 4 0, 8.5 0 C 11.8 0, 14.6 1.9, 16 4.6 C 17.4 1.9, 20.2 0, 23.5 0 C 28 0, 32 3.5, 32 8.5 C 32 15, 26 21, 16 29 Z" />
      </svg>
    }
  `,
  styles: `
    :host { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
    .corazon { position: absolute; bottom: -40px; animation: subir linear infinite; will-change: transform; }
    @keyframes subir {
      0% { transform: translate(0, 0) rotate(-8deg); }
      50% { transform: translate(18px, -55vh) rotate(8deg); }
      100% { transform: translate(-10px, -115vh) rotate(-8deg); }
    }
    @media (prefers-reduced-motion: reduce) { .corazon { animation: none; display: none; } }
  `,
})
export class CorazonesFlotantes {
  readonly corazones = Array.from({ length: 16 }, () => ({
    x: Math.random() * 100,
    t: 10 + Math.random() * 22,
    d: 12 + Math.random() * 14,
    r: -Math.random() * 26,
    o: 0.25 + Math.random() * 0.45,
    color: COLORES[Math.floor(Math.random() * COLORES.length)],
  }));
}
