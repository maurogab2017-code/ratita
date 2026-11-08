import { ChangeDetectionStrategy, Component, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { ContratoTexto } from '../componentes/contrato-texto';
import { lluviaDeAmor } from '../festejo';
import { HISTORIA } from '../historia.config';
import { Firmado } from './firma';

@Component({
  selector: 'app-recuerdo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ContratoTexto],
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
      <p class="aclaracion">{{ r.aclaracion }}</p>
    </article>

    <div class="acciones">
      <button type="button" class="btn grande" (click)="descargar()" [disabled]="descargando()">
        {{ descargando() ? 'Preparando…' : r.botonDescargar + ' 📸' }}
      </button>
      @if (error()) { <p class="error">{{ error() }}</p> }
      <button type="button" class="btn grande secundario" (click)="masAmor()">Tirar más amor 🐭🐱🧸💖</button>
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
    .aclaracion { margin: 16px 0 0; text-align: center; font-size: .68rem; color: #8a6b97; }
    .acciones { display: grid; gap: 10px; justify-items: center; }
    .error { margin: 0; color: var(--rosa); font-size: .9rem; text-align: center; }
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
  private readonly doc = viewChild.required<ElementRef<HTMLElement>>('doc');

  masAmor() {
    lluviaDeAmor();
  }

  async descargar() {
    this.descargando.set(true);
    this.error.set(null);
    try {
      const { toPng } = await import('html-to-image');
      const nodo = this.doc().nativeElement;
      // la primera pasada a veces sale sin fuentes en Safari; la segunda ya las tiene
      await toPng(nodo, { pixelRatio: 1, cacheBust: true });
      const url = await toPng(nodo, { pixelRatio: 2.5, cacheBust: true, backgroundColor: '#fdeaf4' });
      const a = document.createElement('a');
      a.href = url;
      a.download = 'contrato-de-noviazgo.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      this.error.set('No se pudo descargar 😿 Probá con una captura de pantalla.');
    } finally {
      this.descargando.set(false);
    }
  }
}
