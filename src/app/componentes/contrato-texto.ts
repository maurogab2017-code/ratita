import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HISTORIA } from '../historia.config';
import { Ratita } from './ratita';

/** El texto del contrato, con las dos ratitas enamoradas arriba. Se usa en el contrato y en el recuerdo. */
@Component({
  selector: 'app-contrato-texto',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Ratita],
  template: `
    <div class="pareja" aria-hidden="true">
      <app-ratita variante="ella" [ojosCerrados]="true" />
      <span class="corazon">❤</span>
      <app-ratita variante="el" [espejo]="true" [ojosCerrados]="true" />
    </div>
    <h2>{{ titulo() ?? c.titulo }}</h2>
    <div class="adorno" aria-hidden="true">♥ ♥ ♥</div>
    <p class="partes">{{ c.partes }}</p>
    <p><strong>{{ etiqueta(c.clausula) }}</strong>{{ resto(c.clausula) }}</p>
    <p><strong>{{ etiqueta(c.vigencia) }}</strong>{{ resto(c.vigencia) }}</p>
  `,
  styles: `
    :host { display: block; text-align: center; color: #3a1450; }
    .pareja { display: flex; justify-content: center; align-items: flex-end; gap: 0; margin-bottom: 4px; }
    .pareja app-ratita { width: 74px; }
    .pareja app-ratita:first-child { margin-right: -8px; transform: rotate(6deg); }
    .pareja app-ratita:last-child { margin-left: -8px; transform: rotate(-6deg); }
    .corazon { color: #ff2e93; font-size: 1.6rem; align-self: flex-start; animation: latir 1.2s ease-in-out infinite; }
    h2 { margin: 6px 0 2px; font-family: var(--f-titulo); font-size: clamp(1.15rem, 5.2vw, 1.55rem); letter-spacing: .04em; color: #7b2cbf; line-height: 1.2; }
    .adorno { color: #d6249f; letter-spacing: .5em; font-size: .8rem; margin-bottom: 12px; }
    p { margin: 0 0 10px; line-height: 1.5; font-size: 1rem; }
    .partes { font-style: italic; }
    strong { color: #b5177f; }
    @keyframes latir { 0%,100% { transform: scale(1); } 50% { transform: scale(1.25); } }
  `,
})
export class ContratoTexto {
  readonly c = HISTORIA.contrato;
  /** Si viene, reemplaza el título del contrato. */
  readonly titulo = input<string | undefined>(undefined);
  etiqueta(t: string) {
    const i = t.indexOf(':');
    return i > 0 ? t.slice(0, i + 1) : '';
  }
  resto(t: string) {
    const i = t.indexOf(':');
    return i > 0 ? t.slice(i + 1) : t;
  }
}
