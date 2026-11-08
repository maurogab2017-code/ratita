import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';

/**
 * Tapa su contenido con una capa brillante que se raspa con el dedo (o el mouse).
 * Cuando raspa más o menos la mitad, se destapa todo y avisa con `revelada`.
 */
@Component({
  selector: 'app-raspadita',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="contenido"><ng-content /></div>
    @if (!revelada()) {
      <canvas #capa [class.yendo]="yendo()" aria-label="Raspá con el dedo para descubrir"
        (pointerdown)="empezar($event)" (pointermove)="mover($event)" (pointerup)="soltar()" (pointercancel)="soltar()"></canvas>
      @if (ayuda()) {
        <button type="button" class="ayuda" (click)="destapar()">¿No te sale? Tocá acá 👆</button>
      }
    }
  `,
  styles: `
    :host { position: relative; display: block; border-radius: 18px; }
    .contenido { padding: 18px 8px; }
    canvas { position: absolute; inset: 0; width: 100%; height: 100%; border-radius: 18px; touch-action: none; cursor: grab;
      box-shadow: 0 8px 24px rgba(255,46,147,.35); transition: opacity .6s; }
    canvas.yendo { opacity: 0; }
    .ayuda { position: absolute; left: 50%; top: 100%; translate: -50% 6px; font: inherit; font-size: .85rem; font-weight: 700; color: var(--lila);
      background: none; border: 0; text-decoration: underline; cursor: pointer; white-space: nowrap; animation: aparecer .4s ease-out; }
    @keyframes aparecer { from { opacity: 0; } }
  `,
})
export class Raspadita {
  readonly revelo = output();
  readonly revelada = signal(false);
  readonly yendo = signal(false);
  /** Plan B: si en unos segundos no logró raspar, aparece un botón que destapa todo. */
  readonly ayuda = signal(false);

  private readonly capa = viewChild<ElementRef<HTMLCanvasElement>>('capa');
  private ctx?: CanvasRenderingContext2D;
  private raspando = false;
  private ultimo: { x: number; y: number } | null = null;
  private movimientos = 0;

  constructor() {
    const destroy = inject(DestroyRef);
    const t = setTimeout(() => this.ayuda.set(true), 7000);
    destroy.onDestroy(() => clearTimeout(t));
    afterNextRender(() => {
      this.pintar();
      const ro = new ResizeObserver(() => this.pintar());
      const c = this.capa()?.nativeElement;
      if (c) ro.observe(c);
      destroy.onDestroy(() => ro.disconnect());
    });
  }

  /** Pinta la capa para raspar: degradé fucsia/violeta con brillitos y la indicación. */
  private pintar() {
    const c = this.capa()?.nativeElement;
    if (!c || this.movimientos > 0) return;
    const r = c.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    c.width = Math.round(r.width * dpr);
    c.height = Math.round(r.height * dpr);
    const ctx = c.getContext('2d')!;
    this.ctx = ctx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const g = ctx.createLinearGradient(0, 0, r.width, r.height);
    g.addColorStop(0, '#ff2e93');
    g.addColorStop(0.5, '#d6249f');
    g.addColorStop(1, '#7b2cbf');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, r.width, r.height);
    ctx.fillStyle = 'rgba(255,255,255,.35)';
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * r.width, Math.random() * r.height, Math.random() * 2 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '700 18px Fredoka, Nunito, sans-serif';
    ctx.fillText('Raspá acá con el dedo ✨', r.width / 2, r.height / 2 - 10);
    ctx.font = '400 13px Nunito, sans-serif';
    ctx.fillText('hay algo escondido 👆', r.width / 2, r.height / 2 + 14);
  }

  private punto(e: PointerEvent) {
    const r = this.capa()!.nativeElement.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  empezar(e: PointerEvent) {
    e.preventDefault();
    this.raspando = true;
    this.ultimo = this.punto(e);
    this.raspar(this.ultimo);
  }

  mover(e: PointerEvent) {
    if (!this.raspando) return;
    e.preventDefault();
    this.raspar(this.punto(e));
  }

  soltar() {
    this.raspando = false;
    this.ultimo = null;
    this.revisar();
  }

  private raspar(p: { x: number; y: number }) {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 38;
    ctx.lineCap = 'round';
    ctx.beginPath();
    const desde = this.ultimo ?? p;
    ctx.moveTo(desde.x, desde.y);
    ctx.lineTo(p.x + 0.1, p.y);
    ctx.stroke();
    this.ultimo = p;
    if (++this.movimientos % 12 === 0) this.revisar();
  }

  /** Mide cuánto raspó; con más o menos la mitad se destapa sola. */
  private revisar() {
    const c = this.capa()?.nativeElement;
    if (!c || !this.ctx || this.yendo()) return;
    let datos: Uint8ClampedArray;
    try {
      datos = this.ctx.getImageData(0, 0, c.width, c.height).data;
    } catch {
      return this.destapar();
    }
    let vacios = 0;
    let total = 0;
    for (let i = 3; i < datos.length; i += 4 * 16) {
      total++;
      if (datos[i] === 0) vacios++;
    }
    if (total && vacios / total > 0.45) this.destapar();
  }

  destapar() {
    if (this.yendo()) return;
    this.yendo.set(true);
    setTimeout(() => {
      this.revelada.set(true);
      this.revelo.emit();
    }, 600);
  }
}
