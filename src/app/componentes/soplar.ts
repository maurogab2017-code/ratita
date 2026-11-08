import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { festejoGrande, lluviaDeAmor } from '../festejo';

/**
 * Un corazón que se infla soplando al micrófono hasta que explota en ratitas.
 * Plan B (sin micrófono, permiso denegado o iPhone que no deja): se infla tocándolo.
 * Nunca bloquea nada: es un juego opcional del final.
 */
@Component({
  selector: 'app-soplar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="caja">
      <button type="button" class="corazon" [class.exploto]="exploto()" [style.scale]="0.6 + inflado() * 0.9"
        (click)="tocar()" aria-label="Corazón para inflar">
        <svg viewBox="0 0 32 29" aria-hidden="true">
          <defs>
            <linearGradient id="gs" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#ff2e93" /><stop offset="1" stop-color="#9d4edd" />
            </linearGradient>
          </defs>
          <path fill="url(#gs)" d="M16 29 C 6 21, 0 15, 0 8.5 C 0 3.5, 4 0, 8.5 0 C 11.8 0, 14.6 1.9, 16 4.6 C 17.4 1.9, 20.2 0, 23.5 0 C 28 0, 32 3.5, 32 8.5 C 32 15, 26 21, 16 29 Z" />
        </svg>
      </button>
      <p class="texto">{{ texto() }}</p>
      @if (estado() === 'inicio') {
        <button type="button" class="btn grande secundario" (click)="empezar()">Soplá el corazón 🎈</button>
      }
      @if (estado() === 'listo') {
        <button type="button" class="link" (click)="reiniciar()">Inflar otro 💜</button>
      }
    </div>
  `,
  styles: `
    :host { display: block; width: 100%; }
    .caja { display: grid; justify-items: center; gap: 8px; }
    .corazon { width: 110px; height: 100px; padding: 0; background: none; border: 0; cursor: pointer; transition: scale .12s linear;
      filter: drop-shadow(0 0 18px rgba(255,46,147,.5)); -webkit-tap-highlight-color: transparent; }
    .corazon svg { width: 100%; height: 100%; display: block; }
    .corazon.exploto { animation: boom .4s ease-out forwards; }
    .texto { margin: 0; text-align: center; font-weight: 700; color: var(--rosa); min-height: 1.4em; }
    .link { font: inherit; background: none; border: 0; color: var(--lila); text-decoration: underline; cursor: pointer; }
    @keyframes boom { 60% { transform: scale(1.6); opacity: .8; } 100% { transform: scale(2.2); opacity: 0; } }
  `,
})
export class Soplar {
  readonly inflado = signal(0);
  readonly exploto = signal(false);
  readonly estado = signal<'inicio' | 'soplando' | 'tocando' | 'listo'>('inicio');
  readonly texto = signal('');

  private stream?: MediaStream;
  private ctx?: AudioContext;
  private raf = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.parar());
  }

  async empezar() {
    this.texto.set('Pidiendo el micrófono… 🎤');
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('sin micrófono');
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false } });
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctx();
      await this.ctx.resume();
      const analizador = this.ctx.createAnalyser();
      analizador.fftSize = 512;
      this.ctx.createMediaStreamSource(this.stream).connect(analizador);
      const buffer = new Uint8Array(analizador.fftSize);
      this.estado.set('soplando');
      this.texto.set('¡Soplá fuerte al micrófono! 🌬️');
      const medir = () => {
        analizador.getByteTimeDomainData(buffer);
        let suma = 0;
        for (const v of buffer) suma += ((v - 128) / 128) ** 2;
        const volumen = Math.sqrt(suma / buffer.length);
        // soplar da un ruido fuerte y parejo: infla; si para, se desinfla despacito
        this.inflado.update((x) => Math.max(0, Math.min(1, x + (volumen > 0.08 ? volumen * 0.06 : -0.004))));
        if (this.inflado() >= 1) return this.explotar();
        this.raf = requestAnimationFrame(medir);
      };
      medir();
    } catch {
      // Plan B: sin micrófono se infla tocándolo
      this.parar();
      this.estado.set('tocando');
      this.texto.set('Tocá el corazón muchas veces para inflarlo 👆');
    }
  }

  tocar() {
    if (this.estado() === 'inicio') {
      this.estado.set('tocando');
      this.texto.set('Tocá el corazón muchas veces para inflarlo 👆');
    }
    if (this.estado() !== 'tocando' && this.estado() !== 'soplando') return;
    this.inflado.update((x) => Math.min(1, x + 0.1));
    if (this.inflado() >= 1) this.explotar();
  }

  private explotar() {
    this.parar();
    this.exploto.set(true);
    this.estado.set('listo');
    this.texto.set('¡BOOM! 💥 Lluvia de ratitas 🐭');
    festejoGrande();
    lluviaDeAmor(5000);
  }

  reiniciar() {
    this.exploto.set(false);
    this.inflado.set(0);
    this.estado.set('inicio');
    this.texto.set('');
  }

  private parar() {
    cancelAnimationFrame(this.raf);
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = undefined;
    this.ctx?.close().catch(() => undefined);
    this.ctx = undefined;
  }
}
