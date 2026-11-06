import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, input, output, signal, viewChild } from '@angular/core';
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
        @if (pregunta().opciones && pregunta().tipo !== 'texto') {
          <div class="opciones" [class.muchas]="(pregunta().opciones?.length ?? 0) > 4">
            @for (op of pregunta().opciones; track op) {
              <button type="button" class="opcion" [class.mal]="malas().includes(op)" (click)="elegir(op)">{{ op }}</button>
            }
          </div>
        }
        @if (pregunta().tipo === 'texto' || pregunta().tipo === 'opciones-o-texto') {
          <form class="escribir" (ngSubmit)="responderTexto()">
            @if (pregunta().tipo === 'opciones-o-texto') { <span class="o">o escribilo</span> }
            <input name="respuesta" [(ngModel)]="texto" [placeholder]="pregunta().placeholder ?? 'Tu respuesta…'"
              autocomplete="off" autocapitalize="sentences" enterkeyhint="send" />
            <button type="submit" class="btn" [disabled]="!texto.trim()">Responder</button>
          </form>
        }
        @if (reaccion()) {
          <p class="reaccion" aria-live="polite">{{ reaccion() }}</p>
        }
      } @else {
        <div class="acierto">
          <app-escena [ilustracion]="pregunta().ilustracion" [foto]="pregunta().foto" />
          <p class="mensaje">{{ pregunta().mensajeAcierto }}</p>
          @if (fotito()) {
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
  texto = '';

  private readonly tarjeta = viewChild.required<ElementRef<HTMLElement>>('tarjeta');
  private readonly gatito = inject(GatitoService);
  private ultimaReaccion = -1;

  elegir(opcion: string) {
    const p = this.pregunta();
    if (p.tipo === 'todas-correctas') return this.correcto();
    const ok = (p.correctas ?? []).some((c) => normalizar(c) === normalizar(opcion));
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
    this.gatito.decir('¡Bieeen! 💜', 'feliz', 1800);
  }

  private incorrecto(opcion?: string) {
    const frases = this.pregunta().reaccionesError ?? HISTORIA.reaccionesError;
    let i = Math.floor(Math.random() * frases.length);
    if (i === this.ultimaReaccion) i = (i + 1) % frases.length;
    this.ultimaReaccion = i;
    this.reaccion.set(frases[i]);
    if (opcion) this.malas.update((m) => [...m, opcion]);
    this.gatito.decir('Nop 🙈', 'no');
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(this.tarjeta().nativeElement, { x: 0 }, { x: 8, duration: 0.07, repeat: 5, yoyo: true, ease: 'sine.inOut', clearProps: 'x' });
    }
  }
}
