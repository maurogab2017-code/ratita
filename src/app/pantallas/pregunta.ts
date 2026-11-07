import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, computed, inject, input, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { gsap } from 'gsap';
import { Escena } from '../componentes/escena';
import { Fotitos } from '../componentes/fotitos';
import { festejoChico } from '../festejo';
import { GatitoService } from '../gatito.service';
import { HISTORIA, Pregunta } from '../historia.config';

/** Saca tildes, mayúsculas, signos y espacios de más. */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9ñ ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

@Component({
  selector: 'app-pregunta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Escena, Fotitos],
  template: `
    <div class="tarjeta" #tarjeta>
      @if (pregunta().antetitulo) {
        <p class="antetitulo">{{ pregunta().antetitulo }}</p>
      }
      <h2>{{ pregunta().pregunta }}</h2>

      @if (!acerto()) {
        @if (pregunta().tipo === 'fotos') {
          <div class="fotos">
            @for (op of pregunta().opciones; track op; let i = $index) {
              <button type="button" class="foto-op" [style.--giro.deg]="[-4, 3, 4, -3][i % 4]" (click)="elegir(op)" aria-label="Elegir esta foto">
                <img [src]="op" alt="" />
              </button>
            }
          </div>
        } @else if (pregunta().opciones && pregunta().tipo !== 'texto') {
          <div class="opciones" [class.muchas]="(pregunta().opciones?.length ?? 0) > 4">
            @for (op of pregunta().opciones; track op) {
              <button type="button" class="opcion" [class.mal]="malas().includes(op)" [class.huyendo]="!!huidas()[op]"
                [style.translate]="huidas()[op] ? huidas()[op].x + 'px ' + huidas()[op].y + 'px' : null"
                (pointerenter)="tentar(op, $event)" (click)="elegir(op)">{{ op }}</button>
            }
          </div>
        }
        @if (pregunta().tipo === 'texto' || pregunta().tipo === 'opciones-o-texto') {
          <form class="escribir" (ngSubmit)="responderTexto()">
            @if (pregunta().tipo === 'opciones-o-texto') { <span class="o">o escribilo</span> }
            <input name="respuesta" [(ngModel)]="texto" [placeholder]="pregunta().placeholder ?? 'Tu respuesta…'"
              autocomplete="off" autocapitalize="sentences" enterkeyhint="send" />
            <button type="submit" class="btn" [disabled]="!texto.trim()">Responder</button>
            @if (pregunta().pistas?.length) {
              <button type="button" class="pista" (click)="darPista()">Pedile una pista al gatito 🐱</button>
            }
          </form>
        }
        @if (reaccion()) {
          <p class="reaccion" aria-live="polite">{{ reaccion() }}</p>
        }
      } @else {
        <div class="acierto">
          <app-escena [ilustracion]="pregunta().ilustracion" [foto]="elegida() ?? pregunta().foto" />
          <p class="mensaje">{{ pregunta().mensajeAcierto }}</p>
          @if (fotito() && pregunta().tipo !== 'fotos') {
            <app-fotitos [fotos]="[fotito()!]" />
          }
          <button type="button" class="btn grande" (click)="siguiente.emit()">{{ ultima() ? 'Seguir ❤️' : 'Siguiente pregunta' }}</button>
        </div>
      }
    </div>
  `,
  styles: `
    :host { display: block; width: 100%; }
    .antetitulo { margin: 0 0 6px; color: var(--lila); font-size: .8rem; letter-spacing: .12em; text-transform: uppercase; font-weight: 700; }
    h2 { margin: 0 0 22px; font-family: var(--f-titulo); font-size: clamp(1.45rem, 6vw, 2rem); line-height: 1.2; }
    .opciones { display: grid; gap: 10px; }
    .fotos { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; padding: 4px; }
    .foto-op { padding: 6px 6px 20px; background: #fff; border: 0; border-radius: 3px; cursor: pointer;
      transform: rotate(var(--giro)); box-shadow: 0 8px 20px rgba(0,0,0,.4); transition: transform .2s; }
    .foto-op:hover, .foto-op:focus-visible { transform: rotate(0) scale(1.04); }
    .foto-op:active { transform: scale(.96); }
    .foto-op img { display: block; width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 2px; }
    .opciones.muchas { grid-template-columns: 1fr 1fr; }
    .opciones.muchas .opcion:last-child:nth-child(odd) { grid-column: 1 / -1; }
    .opcion {
      font: inherit; font-weight: 700; font-size: 1rem; color: var(--texto);
      padding: 14px 16px; border-radius: 16px; cursor: pointer; text-align: center;
      background: rgba(255,255,255,.06); border: 1.5px solid rgba(199,125,255,.35);
      transition: transform .15s, background .2s, border-color .2s;
    }
    .opcion:hover { background: rgba(255,46,147,.14); border-color: var(--fucsia); }
    .opcion:active { transform: scale(.97); }
    .opcion.mal { opacity: .45; border-style: dashed; }
    .opcion { transition: translate .25s cubic-bezier(.3,1.6,.5,1), transform .15s, background .2s, border-color .2s; position: relative; z-index: 1; }
    .opcion.huyendo { justify-self: start; padding: 10px 16px; }
    .pista { justify-self: center; font: inherit; font-size: .9rem; font-weight: 700; color: var(--lila); background: none; border: 0; text-decoration: underline; cursor: pointer; padding: 6px; }
    .escribir { display: grid; gap: 10px; margin-top: 16px; }
    .o { font-size: .85rem; color: var(--lila); text-align: center; }
    input {
      font: inherit; font-size: 1.05rem; color: var(--texto); padding: 14px 16px; border-radius: 16px;
      background: rgba(255,255,255,.07); border: 1.5px solid rgba(199,125,255,.4); outline: none;
    }
    input:focus { border-color: var(--fucsia); box-shadow: 0 0 0 4px rgba(255,46,147,.2); }
    .reaccion { margin: 16px 0 0; text-align: center; font-weight: 700; color: var(--rosa); animation: pop .35s ease-out; }
    .acierto { display: grid; gap: 18px; justify-items: center; text-align: center; }
    .mensaje { margin: 0; font-size: 1.15rem; font-weight: 700; line-height: 1.45; }
    @keyframes pop { from { transform: scale(.85); opacity: 0; } }
  `,
})
export class PantallaPregunta {
  readonly pregunta = input.required<Pregunta>();
  readonly ultima = input(false);
  /** Número de pregunta, para elegir qué fotito mostrar. */
  readonly numero = input(0);
  readonly fotito = computed(() => {
    const f = HISTORIA.fotitos;
    return f.length ? f[this.numero() % f.length] : null;
  });
  readonly siguiente = output();

  readonly acerto = signal(false);
  readonly reaccion = signal<string | null>(null);
  readonly malas = signal<string[]>([]);
  /** En la pregunta de fotos, la que tocó. */
  readonly elegida = signal<string | null>(null);
  texto = '';

  private readonly tarjeta = viewChild.required<ElementRef<HTMLElement>>('tarjeta');
  private readonly gatito = inject(GatitoService);
  private ultimaReaccion = -1;
  private pistaActual = 0;
  private huyo = false;
  /** Cuánto se corrió cada opción que se escapa. */
  readonly huidas = signal<Record<string, { x: number; y: number }>>({});

  constructor() {
    // Miki entra a algunas pantallas a decir algo.
    const t = setTimeout(() => {
      const msg = this.pregunta().mikiEntra;
      if (msg) this.gatito.entrar(msg, 'feliz', 3200);
    }, 900);
    inject(DestroyRef).onDestroy(() => clearTimeout(t));
  }

  private esIncorrecta(opcion: string) {
    return !(this.pregunta().correctas ?? []).some((c) => normalizar(c) === normalizar(opcion));
  }

  /** En la compu, la opción incorrecta se escapa apenas le pasa el mouse por encima. */
  tentar(opcion: string, e: PointerEvent) {
    if (e.pointerType === 'mouse' && this.pregunta().escapan && this.esIncorrecta(opcion)) this.huir(opcion);
  }

  /** Corre la opción a otro lado y Miki la reta. */
  private huir(opcion: string) {
    // Se corre a un lugar al azar dentro del ancho de las opciones, sin salirse de la tarjeta.
    const caja = this.tarjeta().nativeElement.querySelector('.opciones')?.getBoundingClientRect();
    const libre = Math.max(0, (caja?.width ?? 280) - 110);
    let x = Math.round(Math.random() * libre);
    const anterior = this.huidas()[opcion]?.x;
    if (anterior !== undefined && Math.abs(anterior - x) < libre / 3) x = anterior > libre / 2 ? Math.round(libre * 0.1) : Math.round(libre * 0.9);
    const y = 0;
    this.huidas.update((h) => ({ ...h, [opcion]: { x, y } }));
    const retos = ['¡Eso no se elige! Elegí MUCHO 😼', '¡Ni lo intentes! 🙀', 'Solo vale mucho o muchísimo 😾'];
    this.gatito.entrar(this.huyo ? retos[1 + Math.floor(Math.random() * 2)] : retos[0], 'no', 2600);
    this.huyo = true;
  }

  /** Miki entra y da la siguiente pista. */
  darPista() {
    const pistas = this.pregunta().pistas ?? [];
    if (!pistas.length) return;
    const pista = pistas[Math.min(this.pistaActual, pistas.length - 1)];
    this.pistaActual++;
    this.gatito.entrar('Pista: ' + pista, 'feliz', 4500);
  }

  elegir(opcion: string) {
    const p = this.pregunta();
    if (p.tipo === 'fotos') this.elegida.set(opcion);
    if (p.tipo === 'todas-correctas' || p.tipo === 'fotos') return this.correcto();
    if (p.escapan && this.esIncorrecta(opcion)) return this.huir(opcion);
    const ok = !this.esIncorrecta(opcion);
    if (ok) this.correcto();
    else this.incorrecto(opcion);
  }

  responderTexto() {
    const r = normalizar(this.texto);
    if (!r) return;
    const ok = (this.pregunta().correctas ?? []).some((c) => {
      const n = normalizar(c);
      return r === n || ` ${r} `.includes(` ${n} `);
    });
    if (ok) this.correcto();
    else this.incorrecto();
  }

  private correcto() {
    this.reaccion.set(null);
    this.acerto.set(true);
    festejoChico();
    const frases = HISTORIA.reaccionesAcierto;
    this.gatito.decir(frases[Math.floor(Math.random() * frases.length)], 'feliz', 2000);
  }

  private incorrecto(opcion?: string) {
    const frases = this.pregunta().reaccionesError ?? HISTORIA.reaccionesError;
    let i = Math.floor(Math.random() * frases.length);
    if (i === this.ultimaReaccion) i = (i + 1) % frases.length;
    this.ultimaReaccion = i;
    this.reaccion.set(frases[i]);
    if (opcion) this.malas.update((m) => [...m, opcion]);
    if (!opcion && this.pregunta().pistas?.length) this.darPista();
    else this.gatito.decir('Nop 🙈', 'no');
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(this.tarjeta().nativeElement, { x: 0 }, { x: 8, duration: 0.07, repeat: 5, yoyo: true, ease: 'sine.inOut', clearProps: 'x' });
    }
  }
}
