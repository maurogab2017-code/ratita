import { ChangeDetectionStrategy, Component, OnInit, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Escena } from '../componentes/escena';
import { LienzoFirma } from '../componentes/lienzo-firma';
import { HISTORIA } from '../historia.config';

export interface Firmado {
  nombre: string;
  firma: string;
  /** Firma dibujada de él. */
  firmaEl: string;
  /** Selfie opcional de ella (JPG chiquito, solo en su teléfono). */
  selfie?: string;
  fecha: string;
}

@Component({
  selector: 'app-firma',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Escena, LienzoFirma],
  template: `
    <app-escena ilustracion="abrazo" />
    <div class="encabezado">
      <h2>{{ f.titulo }}</h2>
      @if (conBeso()) { <p class="beso">(Beso cobrado por adelantado 😘)</p> }
      <p>{{ f.texto }}</p>
    </div>

    <form class="cartulina" (ngSubmit)="firmar()">
      <section class="parte">
        <h3>Firma de {{ el.apodo }}</h3>
        <p class="nombre-el">{{ el.nombre }}</p>
        <app-lienzo-firma ayuda="Firmá acá, {{ el.nombre }} ✍️" (cambio)="firmaEl.set($event)" />
      </section>

      <section class="parte">
        <h3>Firma de su ratita bella</h3>
        <label for="nombre-ella">Tu nombre</label>
        <input id="nombre-ella" name="nombre" [(ngModel)]="nombre" [placeholder]="placeholderNombre" autocomplete="given-name" />
        <app-lienzo-firma (cambio)="firma.set($event)" />
      </section>

      <section class="parte selfie">
        <h3>Selfie para el contrato oficial 📸</h3>
        <input #camara class="oculto" type="file" accept="image/*" capture="user" (change)="cargarSelfie($event)" />
        @if (selfie()) {
          <div class="fila">
            <figure class="polaroid"><img [src]="selfie()" alt="Tu selfie" /></figure>
            <button type="button" class="link" (click)="camara.click()">Sacar otra</button>
          </div>
        } @else {
          <button type="button" class="btn secundario-claro" (click)="camara.click()">Sacate una selfie 📸</button>
          <small class="opcional">Es opcional y la foto queda solo en tu celu 💜</small>
        }
      </section>

      <p class="fecha">Fecha de aceptación: <strong>{{ fecha }}</strong></p>
      @if (intento() && falta()) {
        <p class="falta">{{ falta() }}</p>
      }
      <button type="submit" class="btn grande">{{ f.boton }}</button>
    </form>
  `,
  styles: `
    :host { display: grid; gap: 18px; width: 100%; }
    .encabezado { text-align: center; }
    h2 { margin: 0 0 8px; font-family: var(--f-titulo); font-size: clamp(1.35rem, 6vw, 1.9rem); color: var(--rosa); }
    .encabezado p { margin: 0; line-height: 1.5; }
    .beso { color: var(--lila); font-size: .9rem; margin-bottom: 4px !important; }
    form { display: grid; gap: 16px; color: #3a1450; }
    .parte { display: grid; gap: 6px; }
    h3 { margin: 0; font-size: .8rem; letter-spacing: .1em; text-transform: uppercase; color: #9d4edd; }
    .nombre-el { margin: 0; font-weight: 700; }
    .firma-el { margin: 0; font-family: var(--f-firma); font-size: 2.4rem; line-height: 1.1; color: #3a1450; border-bottom: 1.5px solid #e7b6d6; padding-bottom: 4px; }
    label { font-weight: 700; font-size: .9rem; }
    input { font: inherit; font-size: 1.05rem; padding: 12px 14px; border-radius: 14px; border: 1.5px solid #e0a6cf; background: #fff; color: #3a1450; outline: none; }
    input:focus { border-color: #d6249f; box-shadow: 0 0 0 4px rgba(214,36,159,.15); }
    .fecha { margin: 0; text-align: center; }
    .oculto { display: none; }
    .selfie { justify-items: start; }
    .fila { display: flex; align-items: center; gap: 16px; }
    .polaroid { margin: 0; padding: 4px 4px 14px; background: #fff; border-radius: 3px; width: 84px; transform: rotate(-5deg); box-shadow: 0 6px 16px rgba(58,20,80,.25); }
    .polaroid img { display: block; width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 2px; }
    .secundario-claro { background: #fff; color: #b5177f; border: 2px solid #f2a7d0; box-shadow: none; }
    .opcional { color: #8a6b97; }
    .link { font: inherit; background: none; border: 0; color: #9d4edd; text-decoration: underline; cursor: pointer; padding: 4px; }
    .falta { margin: 0; text-align: center; color: #d6249f; font-weight: 700; }
  `,
})
export class PantallaFirma implements OnInit {
  readonly conBeso = input(false);
  readonly nombreInicial = input('');
  readonly firmado = output<Firmado>();

  readonly f = HISTORIA.firma;
  readonly el = HISTORIA.el;
  readonly placeholderNombre = HISTORIA.ella.placeholderNombre;
  readonly fecha = new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
  readonly firma = signal<string | null>(null);
  readonly firmaEl = signal<string | null>(null);
  readonly intento = signal(false);
  readonly selfie = signal<string | null>(null);
  nombre = '';

  ngOnInit() {
    this.nombre = this.nombreInicial();
  }

  /** Qué falta para poder firmar (o null si está todo). */
  falta(): string | null {
    if (!this.firmaEl()) return 'Falta la firma de ' + this.el.nombre + ' ✍️';
    if (!this.nombre.trim()) return 'Poné tu nombre, ratita 💜';
    if (!this.firma()) return 'Falta tu firmita ✍️';
    return null;
  }

  /** Recorta la foto en cuadrado y la achica (para que la imagen final no pese una tonelada). */
  cargarSelfie(e: Event) {
    const archivo = (e.target as HTMLInputElement).files?.[0];
    if (!archivo) return;
    const img = new Image();
    const url = URL.createObjectURL(archivo);
    img.onload = () => {
      const lado = Math.min(img.naturalWidth, img.naturalHeight);
      const c = document.createElement('canvas');
      c.width = c.height = 360;
      c.getContext('2d')!.drawImage(img, (img.naturalWidth - lado) / 2, (img.naturalHeight - lado) / 2, lado, lado, 0, 0, 360, 360);
      this.selfie.set(c.toDataURL('image/jpeg', 0.85));
      URL.revokeObjectURL(url);
    };
    img.src = url;
    (e.target as HTMLInputElement).value = '';
  }

  firmar() {
    this.intento.set(true);
    const firma = this.firma();
    const firmaEl = this.firmaEl();
    if (this.falta() || !firma || !firmaEl) return;
    this.firmado.emit({ nombre: this.nombre.trim(), firma, firmaEl, selfie: this.selfie() ?? undefined, fecha: this.fecha });
  }
}
