import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';
import { gsap } from 'gsap';
import { Ilustracion } from '../historia.config';
import { Gatito } from './gatito';
import { Ratita } from './ratita';

/**
 * Muestra la foto si existe; si no (o mientras no la cargues), una ilustración animada.
 */
@Component({
  selector: 'app-escena',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Ratita, Gatito],
  template: `
    @if (foto() && !fotoFallo()) {
      <figure class="foto">
        <img [src]="foto()" alt="Nosotros" (error)="alFallarFoto()" />
      </figure>
    } @else {
      <div class="ilustracion" [class]="ilustracion()">
        @switch (ilustracion()) {
          @case ('beso') {
            <app-ratita class="r izq" variante="ella" [ojosCerrados]="true" />
            <app-ratita class="r der" variante="el" [espejo]="true" [ojosCerrados]="true" />
            <span class="beso-corazon">❤️</span>
          }
          @case ('abrazo') {
            <app-ratita class="r izq" variante="ella" [ojosCerrados]="true" />
            <app-ratita class="r der" variante="el" [espejo]="true" [ojosCerrados]="true" />
            <span class="beso-corazon">💞</span>
          }
          @case ('osito') {
            <svg class="osito" viewBox="0 0 200 210" aria-label="Lomito, el osito">
              <circle cx="48" cy="44" r="28" fill="#b07a55" /><circle cx="48" cy="44" r="15" fill="#e8b996" />
              <circle cx="152" cy="44" r="28" fill="#b07a55" /><circle cx="152" cy="44" r="15" fill="#e8b996" />
              <ellipse cx="100" cy="160" rx="62" ry="50" fill="#b07a55" />
              <ellipse cx="100" cy="166" rx="38" ry="32" fill="#e8b996" />
              <path d="M100 186 C 82 172, 76 164, 76 156 C 76 149, 82 145, 88 145 C 94 145, 98 149, 100 153 C 102 149, 106 145, 112 145 C 118 145, 124 149, 124 156 C 124 164, 118 172, 100 186 Z" fill="#ff2e93" />
              <ellipse cx="38" cy="150" rx="16" ry="24" fill="#b07a55" transform="rotate(20 38 150)" />
              <ellipse cx="162" cy="150" rx="16" ry="24" fill="#b07a55" transform="rotate(-20 162 150)" />
              <circle cx="100" cy="88" r="56" fill="#b07a55" />
              <ellipse cx="100" cy="106" rx="26" ry="20" fill="#e8b996" />
              <ellipse cx="100" cy="98" rx="10" ry="7" fill="#3b2216" />
              <path d="M92 112 Q100 120 108 112" fill="none" stroke="#3b2216" stroke-width="3" stroke-linecap="round" />
              <circle cx="78" cy="80" r="6" fill="#3b2216" /><circle cx="122" cy="80" r="6" fill="#3b2216" />
              <circle cx="80" cy="78" r="2" fill="#fff" /><circle cx="124" cy="78" r="2" fill="#fff" />
              <ellipse cx="66" cy="102" rx="9" ry="5" fill="#ff5fa8" opacity=".45" />
              <ellipse cx="134" cy="102" rx="9" ry="5" fill="#ff5fa8" opacity=".45" />
            </svg>
          }
          @case ('corazon') {
            <svg class="gran-corazon" viewBox="0 0 32 29" aria-hidden="true">
              <defs>
                <linearGradient id="gc" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stop-color="#ff2e93" /><stop offset="1" stop-color="#9d4edd" />
                </linearGradient>
              </defs>
              <path fill="url(#gc)" d="M16 29 C 6 21, 0 15, 0 8.5 C 0 3.5, 4 0, 8.5 0 C 11.8 0, 14.6 1.9, 16 4.6 C 17.4 1.9, 20.2 0, 23.5 0 C 28 0, 32 3.5, 32 8.5 C 32 15, 26 21, 16 29 Z" />
            </svg>
            <app-ratita class="r sola" variante="ella" [ojosCerrados]="true" />
          }
          @case ('gatito') {
            <app-gatito reaccion="feliz" />
          }
          @default {
            <app-ratita class="r sola grande" variante="ella" [ojosCerrados]="true" />
          }
        }
      </div>
    }
  `,
  styles: `
    :host { display: flex; justify-content: center; align-items: center; min-height: 170px; }
    .foto { margin: 0; padding: 8px 8px 26px; background: #fff; border-radius: 6px; transform: rotate(-3deg);
      box-shadow: 0 12px 30px rgba(0,0,0,.4); max-width: min(78vw, 300px); }
    .foto img { display: block; width: 100%; max-height: 42vh; object-fit: cover; border-radius: 3px; }
    .ilustracion { position: relative; display: flex; align-items: flex-end; justify-content: center; height: 170px; }
    .r { width: 118px; }
    .r.izq, .r.der { position: relative; }
    .beso .izq, .abrazo .izq { margin-right: -26px; z-index: 1; }
    .beso-corazon { position: absolute; top: -6px; left: 50%; font-size: 2.2rem; transform: translateX(-50%) scale(0); }
    .abrazo .izq { margin-right: -30px; }
    .abrazo .r { width: 124px; }
    .osito { width: 150px; animation: balanceo 2.6s ease-in-out infinite alternate; transform-origin: 50% 100%; }
    .gran-corazon { position: absolute; width: 170px; top: -10px; animation: latido 1.1s ease-in-out infinite; filter: drop-shadow(0 0 24px rgba(255,46,147,.55)); }
    .sola { position: relative; z-index: 1; width: 110px; }
    .sola.grande { width: 140px; }
    @keyframes balanceo { from { transform: rotate(-5deg); } to { transform: rotate(5deg); } }
    @keyframes latido { 0%,100% { transform: scale(1); } 15% { transform: scale(1.12); } 30% { transform: scale(1); } 45% { transform: scale(1.08); } }
  `,
})
export class Escena {
  readonly ilustracion = input<Ilustracion>('ratita');
  readonly foto = input<string | undefined>(undefined);
  readonly fotoFallo = signal(false);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  alFallarFoto() {
    this.fotoFallo.set(true);
    afterNextRender(() => this.animar(), { injector: this.injector });
  }

  constructor() {
    afterNextRender(() => this.animar());
  }

  private animar() {
    const el = this.host.nativeElement;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el.querySelectorAll('.beso-corazon'), { scale: 1 });
      return;
    }
    const foto = el.querySelector('.foto');
    if (foto) {
      gsap.from(foto, { scale: 0.6, rotate: -14, opacity: 0, duration: 0.8, ease: 'back.out(1.8)' });
      return;
    }
    const izq = el.querySelector('.izq');
    const der = el.querySelector('.der');
    const corazon = el.querySelector('.beso-corazon');
    if (izq && der && corazon) {
      if (el.querySelector('.abrazo')) {
        gsap.set(izq, { rotate: 12, transformOrigin: '50% 100%' });
        gsap.set(der, { rotate: -12, transformOrigin: '50% 100%' });
      }
      const tl = gsap.timeline();
      tl.from(izq, { x: -70, opacity: 0, duration: 0.7, ease: 'power2.out' })
        .from(der, { x: 70, opacity: 0, duration: 0.7, ease: 'power2.out' }, '<')
        .to([izq, der], { y: -6, duration: 0.18, yoyo: true, repeat: 1 })
        .to(corazon, { scale: 1, y: -18, duration: 0.6, ease: 'back.out(3)' }, '-=0.1')
        .to(corazon, { scale: 1.15, duration: 0.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      return;
    }
    gsap.from(el.querySelector('.ilustracion'), { scale: 0.5, opacity: 0, duration: 0.7, ease: 'back.out(2)' });
  }
}
