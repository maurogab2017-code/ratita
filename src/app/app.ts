import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CorazonesFlotantes } from './componentes/corazones-flotantes';
import { Fotitos } from './componentes/fotitos';
import { Gatito } from './componentes/gatito';
import { Ratita } from './componentes/ratita';
import { festejoGrande } from './festejo';
import { GatitoService } from './gatito.service';
import { HISTORIA } from './historia.config';
import { PantallaAcceso } from './pantallas/acceso';
import { PantallaContrato } from './pantallas/contrato';
import { Firmado, PantallaFirma } from './pantallas/firma';
import { PantallaPregunta } from './pantallas/pregunta';
import { PantallaRecuerdo } from './pantallas/recuerdo';
import { PantallaSuspenso } from './pantallas/suspenso';

type Paso = 'acceso' | 'bienvenida' | 'pregunta' | 'mensaje' | 'suspenso' | 'contrato' | 'firma' | 'recuerdo';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PantallaAcceso, Fotitos, CorazonesFlotantes, Gatito, Ratita, PantallaPregunta, PantallaContrato, PantallaFirma, PantallaRecuerdo, PantallaSuspenso],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly h = HISTORIA;
  readonly gatito = inject(GatitoService);

  readonly paso = signal<Paso>('acceso');
  readonly indice = signal(0);
  readonly conBeso = signal(false);
  readonly firmado = signal<Firmado | null>(null);
  /** El nombre que escribió al entrar; se usa para completar la firma. */
  readonly nombreElla = signal('');

  /** Una sola pantalla a la vez; la clave cambia para disparar la transición. */
  readonly pantallas = computed(() => {
    const paso = this.paso();
    const i = this.indice();
    return [{ clave: paso === 'pregunta' ? `p-${i}` : paso, paso, pregunta: this.h.preguntas[i], i }];
  });

  readonly progreso = computed(() => {
    const total = this.h.preguntas.length;
    const paso = this.paso();
    if (paso === 'acceso' || paso === 'bienvenida') return null;
    const hechas = paso === 'pregunta' ? this.indice() : total;
    return Array.from({ length: total }, (_, k) => k < hechas);
  });

  saludarMiki() {
    const nombre = this.nombreElla();
    this.gatito.decir(nombre ? '¡Hola, ' + nombre + '! 💜' : '¡Hola! 🐾', 'feliz', 3000);
  }

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

  entrar(nombre: string) {
    this.nombreElla.set(nombre);
    this.ir('bienvenida');
    this.saludarMiki();
  }

  aceptar(como: 'si' | 'beso') {
    this.conBeso.set(como === 'beso');
    this.ir('firma');
  }

  firmar(datos: Firmado) {
    this.firmado.set(datos);
    this.ir('recuerdo');
    festejoGrande();
  }

  reiniciar() {
    this.indice.set(0);
    this.firmado.set(null);
    this.conBeso.set(false);
    this.ir('bienvenida');
  }
}
