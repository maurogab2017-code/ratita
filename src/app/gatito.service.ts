import { Injectable, signal } from '@angular/core';

/** Controla lo que dice y hace el gatito que acompaña en la esquina. */
@Injectable({ providedIn: 'root' })
export class GatitoService {
  readonly mensaje = signal<string | null>(null);
  readonly reaccion = signal<'no' | 'feliz' | null>(null);
  private timer?: ReturnType<typeof setTimeout>;

  decir(mensaje: string, reaccion: 'no' | 'feliz', ms = 2600) {
    clearTimeout(this.timer);
    this.reaccion.set(null);
    // un tick para reiniciar la animación CSS
    requestAnimationFrame(() => {
      this.mensaje.set(mensaje);
      this.reaccion.set(reaccion);
    });
    this.timer = setTimeout(() => {
      this.mensaje.set(null);
      this.reaccion.set(null);
    }, ms);
  }
}
