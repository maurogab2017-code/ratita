import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { festejoGrande, lluviaDeAmor } from '../festejo';

const CORAZON =
  'M16 29 C 6 21, 0 15, 0 8.5 C 0 3.5, 4 0, 8.5 0 C 11.8 0, 14.6 1.9, 16 4.6 C 17.4 1.9, 20.2 0, 23.5 0 C 28 0, 32 3.5, 32 8.5 C 32 15, 26 21, 16 29 Z';

/**
 * Un corazón-globo: se infla soplando al micrófono (o tocando, como plan B)
 * y crece hasta llenar toda la pantalla; cuando se llena, explota en ratitas.
 * Es un juego opcional del final: nunca bloquea nada (se puede cancelar).
 */
@Component({
  selector: 'app-soplar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="caja">
      <svg class="chiquito" viewBox="0 0 32 29" aria-hidden="true"><path fill="#ff2e93" [attr.d]="corazon" /></svg>
      @if (mensaje()) { <p class="texto">{{ mensaje() }}</p> }
      <button type="button" class="btn grande secundario" (click)="empezar()">
        {{ vueltas() ? 'Inflar otro 🎈' : 'Soplá el corazón 🎈' }}
      </button>
    </div>

    @if (inflando()) {
      <div class="globo" (click)="tocar()">
        <svg class="globo-svg" [class.boom]="exploto()" viewBox="0 0 32 29" aria-hidden="true"
          [style.transform]="'translate(-50%, -50%) scale(' + escala() + ')'">
          <defs>
            <linearGradient id="gs" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#ff2e93" /><stop offset="1" stop-color="#9d4edd" />
            </linearGradient>
            <radialGradient id="brillo" cx=".3" cy=".25" r=".35">
              <stop offset="0" stop-color="#fff" stop-opacity=".55" /><stop offset="1" stop-color="#fff" stop-opacity="0" />
            </radialGradient>
          </defs>
          <path fill="url(#gs)" [attr.d]="corazon" />
          <path fill="url(#brillo)" [attr.d]="corazon" />
        </svg>
        @if (!exploto()) {
          <p class="ayuda">{{ modo() === 'mic' ? '¡Soplá fuerte al micrófono! 🌬️ (o tocá la pantalla)' : 'Tocá la pantalla muchas veces para inflarlo 👆' }}</p>
          <button type="button" class="cancelar" (click)="cancelar($event)">✕ Cancelar</button>
        }
      </div>
    }
  `,
  styles: `
    :host { display: block; width: 100%; }
    .caja { display: grid; justify-items: center; gap: 10px; width: 100%; }
    .chiquito { width: 64px; filter: drop-shadow(0 0 14px rgba(255,46,147,.5)); animation: latir 1.4s ease-in-out infinite; }
    .texto { margin: 0; text-align: center; font-weight: 700; color: var(--rosa); }
    .globo { position: fixed; inset: 0; z-index: 60; background: rgba(11,4,16,.35); touch-action: manipulation; cursor: pointer; }
    .globo-svg { position: absolute; left: 50%; top: 50%; width: 120px; transform-origin: 50% 50%; transition: transform .12s linear;
      filter: drop-shadow(0 0 30px rgba(255,46,147,.6)); pointer-events: none; }
    .globo-svg.boom { animation: boom .45s ease-out forwards; }
    .ayuda { position: absolute; left: 16px; right: 16px; bottom: 90px; margin: 0; text-align: center; font-weight: 800; color: #fff;
      text-shadow: 0 2px 10px rgba(0,0,0,.6); pointer-events: none; }
    .cancelar { position: absolute; top: 16px; right: 16px; font: inherit; font-weight: 700; color: #fff; background: rgba(0,0,0,.35);
      border: 0; border-radius: 999px; padding: 8px 14px; cursor: pointer; }
    @keyframes boom { to { opacity: 0; filter: blur(8px); } }
    @keyframes latir { 0%,100% { transform: scale(1); } 50% { transform: scale(1.12); } }
  `,
})
export class Soplar {
  readonly corazon = CORAZON;
  readonly inflando = signal(false);
  readonly exploto = signal(false);
  readonly inflado = signal(0);
  readonly escala = signal(1);
  readonly modo = signal<'mic' | 'toque'>('toque');
  readonly mensaje = signal('');
  /** Cuántos corazones explotó (para cambiar el texto del botón). */
  readonly vueltas = signal(0);

  private stream?: MediaStream;
  private ctx?: AudioContext;
  private analizador?: AnalyserNode;
  private raf = 0;
  /** Cuánto tiene que crecer para tapar toda la pantalla. */
  private maxEscala = 10;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.apagarMicrofono());
  }

  async empezar() {
    this.maxEscala = (Math.hypot(innerWidth, innerHeight) * 1.25) / 120;
    this.exploto.set(false);
    this.inflado.set(0);
    this.escala.set(1);
    this.mensaje.set('');
    this.inflando.set(true);
    // El micrófono se pide una sola vez y queda prendido mientras está en esta pantalla:
    // así "Inflar otro" no vuelve a pedir permiso.
    if (!this.analizador) await this.prenderMicrofono();
    if (this.analizador) {
      this.modo.set('mic');
      this.medir();
    } else {
      this.modo.set('toque');
    }
  }

  private async prenderMicrofono() {
    try {
      if (!navigator.mediaDevices?.getUserMedia) return;
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false } });
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctx();
      await this.ctx.resume();
      this.analizador = this.ctx.createAnalyser();
      this.analizador.fftSize = 512;
      this.ctx.createMediaStreamSource(this.stream).connect(this.analizador);
    } catch {
      // sin permiso o sin micrófono: queda el plan B (tocar)
      this.apagarMicrofono();
    }
  }

  private medir() {
    cancelAnimationFrame(this.raf);
    const an = this.analizador;
    if (!an) return;
    const buffer = new Uint8Array(an.fftSize);
    const paso = () => {
      if (!this.inflando() || this.exploto()) return;
      an.getByteTimeDomainData(buffer);
      let suma = 0;
      for (const v of buffer) suma += ((v - 128) / 128) ** 2;
      const volumen = Math.sqrt(suma / buffer.length);
      // soplar da un ruido fuerte y parejo: infla; si para, se desinfla despacito
      this.sumar(volumen > 0.08 ? volumen * 0.05 : -0.003);
      if (!this.exploto()) this.raf = requestAnimationFrame(paso);
    };
    paso();
  }

  tocar() {
    if (!this.exploto()) this.sumar(0.07);
  }

  private sumar(d: number) {
    const x = Math.max(0, Math.min(1, this.inflado() + d));
    this.inflado.set(x);
    // crece como un globo: lento al principio, más rápido al final
    this.escala.set(1 + (this.maxEscala - 1) * x * x);
    if (x >= 1) this.explotar();
  }

  private explotar() {
    cancelAnimationFrame(this.raf);
    this.exploto.set(true);
    festejoGrande();
    lluviaDeAmor(5000);
    setTimeout(() => {
      this.inflando.set(false);
      this.exploto.set(false);
      this.vueltas.update((n) => n + 1);
      this.mensaje.set('¡BOOM! 💥 Lluvia de ratitas 🐭');
    }, 450);
  }

  cancelar(e: Event) {
    e.stopPropagation();
    cancelAnimationFrame(this.raf);
    this.inflando.set(false);
  }

  private apagarMicrofono() {
    cancelAnimationFrame(this.raf);
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = undefined;
    this.ctx?.close().catch(() => undefined);
    this.ctx = undefined;
    this.analizador = undefined;
  }
}
