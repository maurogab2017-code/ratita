import { ChangeDetectionStrategy, Component, ElementRef, inject, output, signal, viewChild } from '@angular/core';
import { ContratoTexto } from '../componentes/contrato-texto';
import { Escena } from '../componentes/escena';
import { Raspadita } from '../componentes/raspadita';
import { festejoChico, festejoGrande, lluviaDeBesos } from '../festejo';
import { GatitoService } from '../gatito.service';
import { HISTORIA } from '../historia.config';

@Component({
  selector: 'app-contrato',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ContratoTexto, Escena, Raspadita],
  template: `
    @if (!besando()) {
      <app-raspadita (revelo)="destapar()">
        <h2 class="pregunta">{{ c.pregunta }}</h2>
      </app-raspadita>
      @if (destapada()) {
      <div class="botones" #botones>
        <button type="button" class="btn grande" (click)="si()">{{ c.botonSi }}</button>
        <button type="button" class="btn grande secundario" (click)="beso()">{{ c.botonBeso }}</button>
        @if (intentosNo() < c.retosNo.length) {
          <button type="button" class="no" [style.translate]="posNo().x + 'px ' + posNo().y + 'px'"
            [style.scale]="1 - intentosNo() * 0.12" (pointerenter)="tentarNo($event)" (click)="escaparNo()">
            {{ c.botonNo }}
          </button>
        }
      </div>
      }
    } @else {
      <div class="besando">
        <app-escena ilustracion="beso" />
        <p class="muak">¡Muuuak! 😘 Beso recibido y firmado.</p>
      </div>
    }

    @if (destapada()) {
    <article class="cartulina aparece">
      <span class="esquina e1">♥</span><span class="esquina e2">♥</span>
      <span class="esquina e3">♥</span><span class="esquina e4">♥</span>
      <app-contrato-texto [titulo]="c.tituloPropuesta" />
    </article>
    }
  `,
  styles: `
    :host { display: grid; gap: 22px; width: 100%; }
    .pregunta { margin: 0; text-align: center; font-family: var(--f-titulo); font-size: clamp(1.3rem, 6.2vw, 2.2rem); line-height: 1.2;
      background: linear-gradient(90deg, var(--fucsia), var(--lila)); -webkit-background-clip: text; background-clip: text; color: transparent;
      animation: latir 1.6s ease-in-out infinite; }
    .botones { display: grid; gap: 12px; animation: aparecer .6s cubic-bezier(.2,.9,.3,1.2) both; }
    .aparece { animation: aparecer .7s .15s cubic-bezier(.2,.9,.3,1.2) both; }
    @keyframes aparecer { from { opacity: 0; transform: translateY(14px) scale(.96); } }
    .no { justify-self: start; font: inherit; font-weight: 700; font-size: .95rem; color: var(--texto); cursor: pointer;
      padding: 10px 20px; border-radius: 999px; background: rgba(255,255,255,.06); border: 1.5px solid rgba(199,125,255,.35);
      transition: translate .3s cubic-bezier(.3,1.6,.5,1), scale .3s; }
    .besando { display: grid; justify-items: center; gap: 8px; }
    .muak { margin: 0; font-weight: 800; font-size: 1.2rem; color: var(--rosa); }
    @keyframes latir { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
  `,
})
export class PantallaContrato {
  readonly acepto = output<'si' | 'beso'>();
  readonly c = HISTORIA.contrato;
  readonly besando = signal(false);
  /** true cuando ya raspó la pregunta. */
  readonly destapada = signal(false);
  /** Cuántas veces intentó tocar "No" (se achica y al final desaparece). */
  readonly intentosNo = signal(0);
  readonly posNo = signal({ x: 0, y: 0 });

  private readonly botones = viewChild<ElementRef<HTMLElement>>('botones');
  private readonly gatito = inject(GatitoService);

  destapar() {
    this.destapada.set(true);
    festejoChico();
  }

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

  /** En la compu, el "No" se escapa apenas le acerca el mouse. */
  tentarNo(e: PointerEvent) {
    if (e.pointerType === 'mouse') this.escaparNo();
  }

  /** El "No" salta a otro lado (cada vez más chiquito) y el gatito la reta. */
  escaparNo() {
    const ancho = this.botones()?.nativeElement.getBoundingClientRect().width ?? 300;
    const libre = Math.max(0, ancho - 120);
    const antes = this.posNo().x;
    let x = Math.round(Math.random() * libre);
    if (Math.abs(x - antes) < libre / 3) x = antes > libre / 2 ? Math.round(libre * 0.05) : Math.round(libre * 0.95);
    this.posNo.set({ x, y: 0 });
    const n = this.intentosNo();
    this.gatito.entrar(this.c.retosNo[n], 'no', 2600);
    this.intentosNo.set(n + 1);
  }
}
