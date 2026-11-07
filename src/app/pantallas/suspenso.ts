import { ChangeDetectionStrategy, Component, DestroyRef, inject, output, signal } from '@angular/core';
import { HISTORIA } from '../historia.config';

/**
 * Pausa con suspenso entre la última pregunta y el contrato:
 * frases que aparecen de a una, un corazón que late y una cuenta regresiva.
 */
@Component({
  selector: 'app-suspenso',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="suspenso">
      @for (linea of s.lineas; track $index) {
        <p class="linea" [style.animation-delay.s]="$index * 1.6">{{ linea }}</p>
      }
      <div class="latido" [style.animation-delay.s]="s.lineas.length * 1.6" aria-hidden="true">
        @for (n of [cuenta()]; track n) {
          <span class="numero">{{ n > 0 ? n : '❤️' }}</span>
        }
      </div>
    </div>
  `,
  styles: `
    :host { display: block; width: 100%; }
    .suspenso { display: grid; gap: 18px; justify-items: center; text-align: center; min-height: 60vh; align-content: center; }
    .linea { margin: 0; font-family: var(--f-titulo); font-size: clamp(1.4rem, 6.5vw, 2rem); color: var(--rosa);
      opacity: 0; animation: aparecer 1.1s ease-out forwards; }
    .latido { width: 150px; height: 150px; display: grid; place-items: center; margin-top: 10px; opacity: 0;
      animation: aparecer .6s ease-out forwards, latir 1s ease-in-out infinite; }
    .latido { background: radial-gradient(circle, rgba(255,46,147,.55), rgba(123,44,191,.15) 60%, transparent 70%); border-radius: 50%; }
    .numero { font-family: var(--f-titulo); font-size: 4.2rem; color: #fff; text-shadow: 0 0 24px rgba(255,46,147,.9); animation: pop .5s ease-out; }
    @keyframes aparecer { from { opacity: 0; transform: translateY(12px); filter: blur(6px); } to { opacity: 1; transform: none; filter: none; } }
    @keyframes latir { 0%,100% { scale: 1; } 15% { scale: 1.14; } 30% { scale: 1; } 45% { scale: 1.08; } }
    @keyframes pop { from { transform: scale(1.8); opacity: 0; } }
    @media (prefers-reduced-motion: reduce) { .linea, .latido { animation: none; opacity: 1; } }
  `,
})
export class PantallaSuspenso {
  readonly listo = output();
  readonly s = HISTORIA.suspenso;
  readonly cuenta = signal(3);

  constructor() {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const inicio = this.s.lineas.length * 1600 + 600;
    for (let n = 3; n >= 0; n--) {
      timers.push(setTimeout(() => this.cuenta.set(n), inicio + (3 - n) * 1000));
    }
    timers.push(setTimeout(() => this.listo.emit(), inicio + 4200));
    inject(DestroyRef).onDestroy(() => timers.forEach(clearTimeout));
  }
}
