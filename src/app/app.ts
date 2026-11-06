import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CorazonesFlotantes } from './componentes/corazones-flotantes';
import { Gatito } from './componentes/gatito';
import { Ratita } from './componentes/ratita';
import { GatitoService } from './gatito.service';
import { HISTORIA } from './historia.config';
import { PantallaContrato } from './pantallas/contrato';
import { Firmado, PantallaFirma } from './pantallas/firma';
import { PantallaPregunta } from './pantallas/pregunta';
import { PantallaRecuerdo } from './pantallas/recuerdo';

type Paso = 'bienvenida' | 'pregunta' | 'mensaje' | 'contrato' | 'firma' | 'recuerdo';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CorazonesFlotantes, Gatito, Ratita, PantallaPregunta, PantallaContrato, PantallaFirma, PantallaRecuerdo],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly h = HISTORIA;
  readonly gatito = inject(GatitoService);

  readonly paso = signal<Paso>('bienvenida');
  readonly indice = signal(0);
  readonly conBeso = signal(false);
  readonly firmado = signal<Firmado | null>(null);

  /** Una sola pantalla a la vez; la clave cambia para disparar la transición. */
  readonly pantallas = computed(() => {
    const paso = this.paso();
    const i = this.indice();
    return [{ clave: paso === 'pregunta' ? `p-${i}` : paso, paso, pregunta: this.h.preguntas[i], i }];
  });

  readonly progreso = computed(() => {
    const total = this.h.preguntas.length;
    const paso = this.paso();
    if (paso === 'bienvenida') return null;
    const hechas = paso === 'pregunta' ? this.indice() : total;
    return Array.from({ length: total }, (_, k) => k < hechas);
  });

  readonly mensajeLineas = this.h.mensajeFinal.texto.split(/(?<=\.)\s+/);

  ir(paso: Paso) {
    this.paso.set(paso);
    this.arriba();
  }

  /** Vuelve arriba, también después de que la pantalla vieja termina de salir. */
  private arriba() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 420);
  }

  siguientePregunta() {
    if (this.indice() < this.h.preguntas.length - 1) {
      this.indice.update((i) => i + 1);
      this.arriba();
    } else {
      this.ir('mensaje');
    }
  }

  aceptar(como: 'si' | 'beso') {
    this.conBeso.set(como === 'beso');
    this.ir('firma');
  }

  firmar(datos: Firmado) {
    this.firmado.set(datos);
    this.ir('recuerdo');
  }

  reiniciar() {
    this.indice.set(0);
    this.firmado.set(null);
    this.conBeso.set(false);
    this.ir('bienvenida');
  }
}
