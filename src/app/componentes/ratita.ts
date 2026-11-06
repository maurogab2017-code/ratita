import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Ratita dibujada a mano en SVG (ilustración propia).
 * - 'ella': lila, con moño fucsia.
 * - 'el': gris, con coronita de príncipe.
 */
@Component({
  selector: 'app-ratita',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ratita', '[class.espejo]': 'espejo()', '[class.ojos-cerrados]': 'ojosCerrados()' },
  template: `
    <svg viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg" role="img" [attr.aria-label]="variante() === 'ella' ? 'Ratita' : 'Ratito príncipe'">
      <!-- cola -->
      <path class="cola" d="M150 190 C 190 190, 196 150, 176 140 C 160 132, 150 150, 166 158"
        fill="none" [attr.stroke]="cola" stroke-width="7" stroke-linecap="round" />
      <!-- cuerpo -->
      <ellipse cx="100" cy="168" rx="54" ry="50" [attr.fill]="cuerpo" />
      <ellipse cx="100" cy="178" rx="33" ry="32" [attr.fill]="panza" />
      <!-- patitas -->
      <ellipse cx="74" cy="216" rx="17" ry="9" fill="#f7a8cf" />
      <ellipse cx="126" cy="216" rx="17" ry="9" fill="#f7a8cf" />
      <!-- bracitos -->
      <ellipse class="brazo-izq" cx="56" cy="166" rx="12" ry="20" [attr.fill]="cuerpo" transform="rotate(25 56 166)" />
      <ellipse class="brazo-der" cx="144" cy="166" rx="12" ry="20" [attr.fill]="cuerpo" transform="rotate(-25 144 166)" />
      <!-- orejas -->
      <circle cx="50" cy="52" r="32" [attr.fill]="cuerpo" />
      <circle cx="50" cy="52" r="20" fill="#f7a8cf" />
      <circle cx="150" cy="52" r="32" [attr.fill]="cuerpo" />
      <circle cx="150" cy="52" r="20" fill="#f7a8cf" />
      <!-- cabeza -->
      <ellipse cx="100" cy="98" rx="56" ry="52" [attr.fill]="cuerpo" />
      <!-- ojos -->
      <g class="ojos">
        <ellipse cx="78" cy="94" rx="8" ry="10" fill="#1a0b24" />
        <ellipse cx="122" cy="94" rx="8" ry="10" fill="#1a0b24" />
        <circle cx="81" cy="90" r="3" fill="#fff" />
        <circle cx="125" cy="90" r="3" fill="#fff" />
      </g>
      <g class="ojos-felices" fill="none" stroke="#1a0b24" stroke-width="4" stroke-linecap="round">
        <path d="M69 96 Q78 86 87 96" />
        <path d="M113 96 Q122 86 131 96" />
      </g>
      <!-- cachetes -->
      <ellipse cx="64" cy="114" rx="11" ry="7" fill="#ff5fa8" opacity=".45" />
      <ellipse cx="136" cy="114" rx="11" ry="7" fill="#ff5fa8" opacity=".45" />
      <!-- nariz y boca -->
      <ellipse cx="100" cy="110" rx="8" ry="6" fill="#e0218a" />
      <path d="M90 120 Q95 126 100 120 Q105 126 110 120" fill="none" stroke="#1a0b24" stroke-width="2.5" stroke-linecap="round" />
      <!-- bigotes -->
      <g stroke="#6d5a80" stroke-width="2" stroke-linecap="round" opacity=".7">
        <line x1="56" y1="110" x2="30" y2="104" />
        <line x1="56" y1="116" x2="30" y2="118" />
        <line x1="144" y1="110" x2="170" y2="104" />
        <line x1="144" y1="116" x2="170" y2="118" />
      </g>
      @if (variante() === 'ella') {
        <!-- moño -->
        <g transform="translate(150 30) rotate(18)">
          <path d="M0 0 L-22 -14 Q-28 0 -22 14 Z" fill="#ff2e93" />
          <path d="M0 0 L22 -14 Q28 0 22 14 Z" fill="#ff2e93" />
          <circle r="7" fill="#d6249f" />
        </g>
      } @else {
        <!-- coronita -->
        <g transform="translate(100 44)">
          <path d="M-26 6 L-26 -14 L-13 -2 L0 -20 L13 -2 L26 -14 L26 6 Z" fill="#ffd166" stroke="#e9a800" stroke-width="2" stroke-linejoin="round" />
          <circle cx="0" cy="-20" r="4" fill="#ff2e93" />
          <circle cx="-26" cy="-14" r="3" fill="#c77dff" />
          <circle cx="26" cy="-14" r="3" fill="#c77dff" />
        </g>
      }
    </svg>
  `,
  styles: `
    :host { display: inline-block; width: 140px; aspect-ratio: 200 / 230; }
    :host(.espejo) svg { transform: scaleX(-1); }
    svg { width: 100%; height: 100%; overflow: visible; display: block; }
    .ojos { transform-origin: 100px 94px; animation: parpadeo 4.5s infinite; }
    .ojos-felices { display: none; }
    :host(.ojos-cerrados) .ojos { display: none; }
    :host(.ojos-cerrados) .ojos-felices { display: inline; }
    .cola { transform-origin: 150px 190px; animation: cola 2.4s ease-in-out infinite alternate; }
    @keyframes parpadeo { 0%, 92%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
    @keyframes cola { from { transform: rotate(-6deg); } to { transform: rotate(8deg); } }
    @media (prefers-reduced-motion: reduce) { .ojos, .cola { animation: none; } }
  `,
})
export class Ratita {
  readonly variante = input<'ella' | 'el'>('ella');
  readonly espejo = input(false);
  readonly ojosCerrados = input(false);

  get cuerpo() {
    return this.variante() === 'ella' ? '#d9c6f2' : '#bdb6cc';
  }
  get panza() {
    return this.variante() === 'ella' ? '#f3eafc' : '#e4e0ec';
  }
  get cola() {
    return '#f7a8cf';
  }
}
