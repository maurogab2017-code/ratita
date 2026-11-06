import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { ContratoTexto } from '../componentes/contrato-texto';
import { Escena } from '../componentes/escena';
import { festejoGrande, lluviaDeBesos } from '../festejo';
import { HISTORIA } from '../historia.config';

@Component({
  selector: 'app-contrato',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ContratoTexto, Escena],
  template: `
    <article class="cartulina">
      <span class="esquina e1">♥</span><span class="esquina e2">♥</span>
      <span class="esquina e3">♥</span><span class="esquina e4">♥</span>
      <app-contrato-texto [titulo]="c.tituloPropuesta" />
    </article>

    @if (!besando()) {
      <h2 class="pregunta">{{ c.pregunta }}</h2>
      <div class="botones">
        <button type="button" class="btn grande" (click)="si()">{{ c.botonSi }}</button>
        <button type="button" class="btn grande secundario" (click)="beso()">{{ c.botonBeso }}</button>
      </div>
    } @else {
      <div class="besando">
        <app-escena ilustracion="beso" />
        <p class="muak">¡Muuuak! 😘 Beso recibido y firmado.</p>
      </div>
    }
  `,
  styles: `
    :host { display: grid; gap: 22px; width: 100%; }
    .pregunta { margin: 0; text-align: center; font-family: var(--f-titulo); font-size: clamp(1.3rem, 6.2vw, 2.2rem); line-height: 1.2;
      background: linear-gradient(90deg, var(--fucsia), var(--lila)); -webkit-background-clip: text; background-clip: text; color: transparent;
      animation: latir 1.6s ease-in-out infinite; }
    .botones { display: grid; gap: 12px; }
    .besando { display: grid; justify-items: center; gap: 8px; }
    .muak { margin: 0; font-weight: 800; font-size: 1.2rem; color: var(--rosa); }
    @keyframes latir { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
  `,
})
export class PantallaContrato {
  readonly acepto = output<'si' | 'beso'>();
  readonly c = HISTORIA.contrato;
  readonly besando = signal(false);

  si() {
    festejoGrande();
    this.acepto.emit('si');
  }

  beso() {
    this.besando.set(true);
    lluviaDeBesos();
    setTimeout(() => {
      festejoGrande();
      this.acepto.emit('beso');
    }, 2600);
  }
}
