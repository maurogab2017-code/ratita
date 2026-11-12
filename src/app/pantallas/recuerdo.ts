import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, input, output, signal, viewChild } from '@angular/core';
import { ContratoTexto } from '../componentes/contrato-texto';
import { Soplar } from '../componentes/soplar';
import { lluviaDeAmor } from '../festejo';
import { dibujarRecuerdo, svgParaCanvas } from '../imagen-recuerdo';
import { HISTORIA } from '../historia.config';
import { Firmado } from './firma';

@Component({
  selector: 'app-recuerdo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ContratoTexto, Soplar],
  template: `
    <article class="documento cartulina" #doc>
      <span class="esquina e1">♥</span><span class="esquina e2">♥</span>
      <span class="esquina e3">♥</span><span class="esquina e4">♥</span>
      <app-contrato-texto />
      <p class="mensaje">{{ r.mensaje }}</p>

      <div class="firmas">
        <div class="firma">
          <img class="trazo" [src]="datos().firmaEl" alt="Firma de {{ el.nombre }}" />
          <span class="linea"></span>
          <span class="quien">{{ el.nombre }}<br /><small>{{ el.apodo }}</small></span>
        </div>
        <div class="firma">
          <img class="trazo" [src]="datos().firma" alt="Firma de {{ datos().nombre }}" />
          <span class="linea"></span>
          <span class="quien">{{ datos().nombre }}<br /><small>su ratita oficial</small></span>
        </div>
      </div>

      <p class="fecha">Firmado el {{ datos().fecha }}</p>
      <div class="sello" aria-hidden="true">ACEPTADO<br />❤</div>
      @if (datos().selfie) {
        <figure class="selfie"><img [src]="datos().selfie" alt="Selfie de {{ datos().nombre }}" /></figure>
      }
      <p class="aclaracion">{{ r.aclaracion }}</p>
    </article>

    <div class="acciones">
      <button type="button" class="btn grande" (click)="mandar()" [disabled]="mandando()">
        {{ mandando() ? 'Preparando…' : r.botonMandar }}
      </button>
      @if (error()) { <p class="error">{{ error() }}</p> }
      <button type="button" class="btn grande secundario" (click)="masAmor()">Tirar más amor 🐭🐱🧸💖</button>
      @if (sacudir() === 'activo') {
        <p class="pista">📳 Sacudí el celu para que lluevan ratitas</p>
      } @else if (sacudir() === 'pedir') {
        <button type="button" class="link" (click)="activarSacudida()">📳 Activar: sacudí el celu y llueven ratitas</button>
      }
      <app-soplar />
      <button type="button" class="link" (click)="reiniciar.emit()">Volver a vivir la historia</button>
    </div>
  `,
  styles: `
    :host { display: grid; gap: 18px; width: 100%; }
    .documento { color: #3a1450; }
    .mensaje { margin: 14px 0 18px; text-align: center; font-family: var(--f-titulo); font-size: 1.2rem; color: #b5177f; }
    .firmas { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .firma { display: grid; justify-items: center; text-align: center; gap: 4px; }
    .trazo { height: 64px; width: 100%; object-fit: contain; display: flex; align-items: flex-end; justify-content: center; }
    .trazo.texto { font-family: var(--f-firma); font-size: 2.1rem; line-height: 1; }
    .linea { width: 100%; border-bottom: 1.5px solid #c9a0c0; }
    .quien { font-weight: 700; font-size: .92rem; line-height: 1.25; }
    .quien small { font-weight: 400; color: #9d4edd; }
    .fecha { margin: 16px 0 4px; text-align: center; font-weight: 700; }
    .sello { position: absolute; right: 12px; top: 12px; width: 64px; height: 64px; background: #fdeaf4; border-radius: 50%;
      border: 3px double #d6249f; color: #d6249f; display: grid; place-content: center; text-align: center;
      font-weight: 800; font-size: .62rem; letter-spacing: .08em; transform: rotate(-16deg); opacity: .75; line-height: 1.3; }
    .selfie { position: absolute; left: 14px; top: 14px; margin: 0; padding: 3px 3px 11px; background: #fff; border-radius: 2px; width: 62px;
      transform: rotate(-8deg); box-shadow: 0 4px 10px rgba(58,20,80,.25); }
    .selfie img { display: block; width: 100%; aspect-ratio: 1; object-fit: cover; }
    .aclaracion { margin: 16px 0 0; text-align: center; font-size: .68rem; color: #8a6b97; }
    .acciones { display: grid; gap: 10px; justify-items: center; }
    .error { margin: 0; color: var(--rosa); font-size: .9rem; text-align: center; }
    .pista { margin: 0; font-size: .9rem; color: var(--lila); text-align: center; }
    .link { font: inherit; background: none; border: 0; color: var(--lila); text-decoration: underline; cursor: pointer; }
  `,
})
export class PantallaRecuerdo {
  readonly datos = input.required<Firmado>();
  readonly reiniciar = output();
  readonly r = HISTORIA.recuerdo;
  readonly el = HISTORIA.el;
  readonly descargando = signal(false);
  readonly error = signal<string | null>(null);
  readonly mandando = signal(false);
  /** Sacudida: 'activo' (ya escucha), 'pedir' (iPhone: hay que tocar para dar permiso) o 'no' (compu / no soportado). */
  readonly sacudir = signal<'activo' | 'pedir' | 'no'>('no');
  private png?: Promise<string>;
  private ultimaSacudida = 0;
  private readonly alMover = (e: DeviceMotionEvent) => {
    const a = e.accelerationIncludingGravity;
    if (!a || a.x == null || a.y == null || a.z == null) return;
    const fuerza = Math.abs(Math.hypot(a.x, a.y, a.z) - 9.8);
    const ahora = Date.now();
    if (fuerza > 12 && ahora - this.ultimaSacudida > 2500) {
      this.ultimaSacudida = ahora;
      lluviaDeAmor(2500);
    }
  };

  constructor() {
    inject(DestroyRef).onDestroy(() => window.removeEventListener('devicemotion', this.alMover));
    const esCelu = matchMedia('(pointer: coarse)').matches;
    if (esCelu && 'DeviceMotionEvent' in window) {
      const pedir = (DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission;
      if (typeof pedir === 'function') this.sacudir.set('pedir');
      else this.escucharSacudida();
    }
    // Preparamos la imagen de antemano: así al tocar "Mandáselo" el celu comparte al toque
    // (en iPhone, si pasa mucho tiempo entre el toque y compartir, no deja).
    afterNextRender(() => setTimeout(() => (this.png = this.generar().catch(() => (this.png = undefined, ''))), 1500));
  }

  private escucharSacudida() {
    window.addEventListener('devicemotion', this.alMover);
    this.sacudir.set('activo');
  }

  async activarSacudida() {
    try {
      const pedir = (DeviceMotionEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission;
      const r = await pedir();
      if (r === 'granted') this.escucharSacudida();
      else this.sacudir.set('no');
    } catch {
      this.sacudir.set('no');
    }
  }

  /** Genera el PNG del contrato firmado (dibujado en canvas: sale completo también en iPhone). */
  private generar(): Promise<string> {
    const d = this.datos();
    const c = HISTORIA.contrato;
    const ratitas = this.doc().nativeElement.querySelectorAll('app-contrato-texto app-ratita');
    const ella = svgParaCanvas(ratitas[0] ?? null);
    const el = svgParaCanvas(ratitas[1] ?? null);
    return dibujarRecuerdo({
      titulo: c.titulo,
      partes: c.partes,
      clausula: c.clausula,
      vigencia: c.vigencia,
      mensaje: this.r.mensaje,
      aclaracion: this.r.aclaracion,
      nombreEl: this.el.nombre,
      apodoEl: this.el.apodo,
      firmaEl: d.firmaEl,
      nombreElla: d.nombre,
      firmaElla: d.firma,
      fecha: d.fecha,
      selfie: d.selfie,
      ratitas: ella && el ? { ella, el } : undefined,
    });
  }

  private async imagen(): Promise<string> {
    const lista = this.png ? await this.png : '';
    if (lista) return lista;
    this.png = this.generar();
    return this.png;
  }

  /** Comparte la imagen (WhatsApp aparece en la lista). Si el celu no deja, la descarga y abre WhatsApp con un mensaje. */
  async mandar() {
    this.mandando.set(true);
    this.error.set(null);
    try {
      const url = await this.imagen();
      const blob = await (await fetch(url)).blob();
      const archivo = new File([blob], 'contrato-de-noviazgo.png', { type: 'image/png' });
      if (navigator.canShare?.({ files: [archivo] })) {
        try {
          await navigator.share({ files: [archivo], text: this.r.textoMandar });
          return;
        } catch (e) {
          if ((e as DOMException).name === 'AbortError') return; // cerró el menú: no pasa nada
        }
      }
      // Plan B: se descarga y se abre WhatsApp con el mensaje para que adjunte la imagen
      this.bajar(url);
      const numero = this.el.whatsapp.replace(/\D/g, '');
      window.open('https://wa.me/' + numero + '?text=' + encodeURIComponent(this.r.textoMandar + ' (te mando la imagen que se me descargó)'), '_blank');
    } catch {
      this.error.set('No se pudo mandar 😿 Probá con Descargar recuerdo o una captura.');
    } finally {
      this.mandando.set(false);
    }
  }

  private bajar(url: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contrato-de-noviazgo.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  private readonly doc = viewChild.required<ElementRef<HTMLElement>>('doc');

  masAmor() {
    lluviaDeAmor();
  }

  async descargar() {
    this.descargando.set(true);
    this.error.set(null);
    try {
      this.bajar(await this.imagen());
    } catch {
      this.error.set('No se pudo descargar 😿 Probá con una captura de pantalla.');
    } finally {
      this.descargando.set(false);
    }
  }
}
