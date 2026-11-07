import { Injectable, signal } from '@angular/core';

/** Controla lo que dice y hace Miki, el gatito que acompaña en la esquina. */
@Injectable({ providedIn: 'root' })
export class GatitoService {
  readonly mensaje = signal<string | null>(null);
  readonly reaccion = signal<'no' | 'feliz' | null>(null);
  /** true mientras Miki está "de visita" en el medio de la pantalla. */
  readonly visita = signal(false);
  private timer?: ReturnType<typeof setTimeout>;

  /** Miki dice algo desde su esquina. */
  decir(mensaje: string, reaccion: 'no' | 'feliz', ms = 2600) {
    this.mostrar(mensaje, reaccion, ms, false);
  }

  /** Miki entra caminando al medio de la pantalla, dice algo y vuelve a su esquina. */
  entrar(mensaje: string, reaccion: 'no' | 'feliz' = 'feliz', ms = 4000) {
    this.mostrar(mensaje, reaccion, ms, true);
  }

  private mostrar(mensaje: string, reaccion: 'no' | 'feliz', ms: number, visita: boolean) {
    clearTimeout(this.timer);
    this.reaccion.set(null);
    this.visita.set(visita);
    // un tick para reiniciar la animación CSS
    requestAnimationFrame(() => {
      this.mensaje.set(mensaje);
      this.reaccion.set(reaccion);
    });
    this.timer = setTimeout(() => {
      this.mensaje.set(null);
      this.reaccion.set(null);
      this.visita.set(false);
    }, ms);
  }
}
