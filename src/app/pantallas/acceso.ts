import { ChangeDetectionStrategy, Component, ElementRef, inject, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { gsap } from 'gsap';
import { Ratita } from '../componentes/ratita';
import { GatitoService } from '../gatito.service';
import { HISTORIA } from '../historia.config';
import { normalizar } from './pregunta';

/** Pantalla de entrada: solo deja pasar si escribe su nombre. */
@Component({
  selector: 'app-acceso',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Ratita],
  template: `
    <form class="tarjeta" #tarjeta (ngSubmit)="entrar()">
      <app-ratita class="ratita" variante="ella" />
      <h1>{{ a.titulo }}</h1>
      <label for="nombre-acceso">{{ a.texto }}</label>
      <input id="nombre-acceso" name="nombre" [(ngModel)]="nombre" [placeholder]="a.placeholder"
        autocomplete="given-name" autocapitalize="words" enterkeyhint="go" />
      <button type="submit" class="btn grande" [disabled]="!nombre.trim()">{{ a.boton }} 💜</button>
      @if (error()) {
        <p class="error" aria-live="polite">{{ error() }}</p>
      }
    </form>
  `,
  styles: `
    :host { display: block; width: 100%; }
    form { display: grid; gap: 14px; justify-items: center; text-align: center; }
    .ratita { width: 110px; }
    h1 { margin: 0; font-family: var(--f-titulo); font-size: clamp(1.4rem, 6.4vw, 1.9rem); line-height: 1.2; color: var(--rosa); }
    label { font-weight: 700; }
    input {
      width: 100%; font: inherit; font-size: 1.1rem; text-align: center; color: var(--texto); padding: 14px 16px; border-radius: 16px;
      background: rgba(255,255,255,.07); border: 1.5px solid rgba(199,125,255,.4); outline: none;
    }
    input:focus { border-color: var(--fucsia); box-shadow: 0 0 0 4px rgba(255,46,147,.2); }
    .error { margin: 0; font-weight: 700; color: var(--rosa); animation: pop .35s ease-out; }
    @keyframes pop { from { transform: scale(.85); opacity: 0; } }
  `,
})
export class PantallaAcceso {
  readonly entro = output<string>();
  readonly a = HISTORIA.acceso;
  readonly error = signal<string | null>(null);
  nombre = '';

  private readonly tarjeta = viewChild.required<ElementRef<HTMLElement>>('tarjeta');
  private readonly gatito = inject(GatitoService);
  private intentos = 0;

  entrar() {
    const n = normalizar(this.nombre);
    if (!n) return;
    const validos = this.a.nombresValidos.map(normalizar);
    const primera = n.split(' ')[0];
    if (validos.includes(n) || validos.includes(primera)) {
      this.entro.emit(this.nombre.trim());
      return;
    }
    this.error.set(this.a.errores[this.intentos++ % this.a.errores.length]);
    this.gatito.decir('¡Alto ahí! 🐾', 'no');
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(this.tarjeta().nativeElement, { x: 0 }, { x: 8, duration: 0.07, repeat: 5, yoyo: true, ease: 'sine.inOut', clearProps: 'x' });
    }
  }
}
