import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Escena } from '../componentes/escena';
import { LienzoFirma } from '../componentes/lienzo-firma';
import { HISTORIA } from '../historia.config';

export interface Firmado {
  nombre: string;
  firma: string;
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
        <p class="firma-el" aria-hidden="true">{{ el.nombre }}</p>
      </section>

      <section class="parte">
        <h3>Firma de su ratita bella</h3>
        <label for="nombre-ella">Tu nombre</label>
        <input id="nombre-ella" name="nombre" [(ngModel)]="nombre" [placeholder]="placeholderNombre" autocomplete="given-name" />
        <app-lienzo-firma (cambio)="firma.set($event)" />
      </section>

      <p class="fecha">Fecha de aceptación: <strong>{{ fecha }}</strong></p>
      @if (intento() && (!nombre.trim() || !firma())) {
        <p class="falta">{{ !nombre.trim() ? 'Poné tu nombre, ratita 💜' : 'Falta tu firmita ✍️' }}</p>
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
    .falta { margin: 0; text-align: center; color: #d6249f; font-weight: 700; }
  `,
})
export class PantallaFirma {
  readonly conBeso = input(false);
  readonly firmado = output<Firmado>();

  readonly f = HISTORIA.firma;
  readonly el = HISTORIA.el;
  readonly placeholderNombre = HISTORIA.ella.placeholderNombre;
  readonly fecha = new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
  readonly firma = signal<string | null>(null);
  readonly intento = signal(false);
  nombre = '';

  firmar() {
    this.intento.set(true);
    const firma = this.firma();
    if (!this.nombre.trim() || !firma) return;
    this.firmado.emit({ nombre: this.nombre.trim(), firma, fecha: this.fecha });
  }
}
