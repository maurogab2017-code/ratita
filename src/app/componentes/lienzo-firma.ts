import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

type Punto = { x: number; y: number };

/** Lienzo para firmar con el dedo o el mouse (pointer events, anda bien en celular). */
@Component({
  selector: 'app-lienzo-firma',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="marco">
      <canvas #canvas aria-label="Lienzo para tu firma"
        (pointerdown)="empezar($event)" (pointermove)="mover($event)"
        (pointerup)="terminar($event)" (pointercancel)="terminar($event)"></canvas>
      @if (vacio()) { <span class="ayuda">{{ ayuda() }}</span> }
      <span class="linea" aria-hidden="true"></span>
    </div>
    <button type="button" class="borrar" (click)="borrar()" [disabled]="vacio()">Borrar firma</button>
  `,
  styles: `
    :host { display: grid; gap: 6px; }
    .marco { position: relative; height: 170px; border-radius: 16px; background: #fff8fc; border: 2px dashed #d6249f; overflow: hidden; }
    canvas { position: absolute; inset: 0; width: 100%; height: 100%; touch-action: none; cursor: crosshair; }
    .ayuda { position: absolute; inset: 0; display: grid; place-items: center; color: #b07ac9; font-weight: 700; pointer-events: none; }
    .linea { position: absolute; left: 18px; right: 18px; bottom: 34px; border-bottom: 1.5px solid #e7b6d6; pointer-events: none; }
    .borrar { justify-self: end; font: inherit; font-size: .85rem; background: none; border: 0; color: #9d4edd; text-decoration: underline; cursor: pointer; padding: 4px; }
    .borrar:disabled { opacity: .4; cursor: default; }
  `,
})
export class LienzoFirma {
  readonly ayuda = input('Firmá acá con el dedo ✍️');
  readonly cambio = output<string | null>();
  readonly vacio = signal(true);

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private trazos: Punto[][] = [];
  private actual: Punto[] | null = null;
  private ctx!: CanvasRenderingContext2D;

  constructor() {
    const destroy = inject(DestroyRef);
    afterNextRender(() => {
      const c = this.canvas().nativeElement;
      this.ctx = c.getContext('2d')!;
      const ro = new ResizeObserver(() => this.ajustar());
      ro.observe(c);
      destroy.onDestroy(() => ro.disconnect());
      this.ajustar();
    });
  }

  private ajustar() {
    const c = this.canvas().nativeElement;
    const r = c.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    c.width = Math.round(r.width * dpr);
    c.height = Math.round(r.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.redibujar();
  }

  private punto(e: PointerEvent): Punto {
    const r = this.canvas().nativeElement.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  empezar(e: PointerEvent) {
    e.preventDefault();
    this.canvas().nativeElement.setPointerCapture(e.pointerId);
    this.actual = [this.punto(e)];
    this.trazos.push(this.actual);
    this.redibujar();
  }

  mover(e: PointerEvent) {
    if (!this.actual) return;
    e.preventDefault();
    const coalescidos = e.getCoalescedEvents?.() ?? [];
    const eventos = coalescidos.length ? coalescidos : [e];
    for (const ev of eventos) this.actual.push(this.punto(ev));
    this.redibujar();
  }

  terminar(_e: PointerEvent) {
    if (!this.actual) return;
    this.actual = null;
    this.vacio.set(false);
    this.cambio.emit(this.exportar());
  }

  borrar() {
    this.trazos = [];
    this.vacio.set(true);
    this.redibujar();
    this.cambio.emit(null);
  }

  private redibujar() {
    const c = this.canvas().nativeElement;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeStyle = '#3a1450';
    ctx.fillStyle = '#3a1450';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const t of this.trazos) {
      if (t.length === 1) {
        ctx.beginPath();
        ctx.arc(t[0].x, t[0].y, 1.8, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }
      ctx.beginPath();
      ctx.moveTo(t[0].x, t[0].y);
      for (let i = 1; i < t.length - 1; i++) {
        const mx = (t[i].x + t[i + 1].x) / 2;
        const my = (t[i].y + t[i + 1].y) / 2;
        ctx.quadraticCurveTo(t[i].x, t[i].y, mx, my);
      }
      const u = t[t.length - 1];
      ctx.lineTo(u.x, u.y);
      ctx.stroke();
    }
  }

  /** PNG transparente de la firma. */
  private exportar(): string {
    return this.canvas().nativeElement.toDataURL('image/png');
  }
}
