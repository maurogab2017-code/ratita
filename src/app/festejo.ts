import confetti from 'canvas-confetti';

const reducido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

let corazon: confetti.Shape | null = null;
function forma() {
  corazon ??= confetti.shapeFromPath({
    path: 'M16 29 C 6 21, 0 15, 0 8.5 C 0 3.5, 4 0, 8.5 0 C 11.8 0, 14.6 1.9, 16 4.6 C 17.4 1.9, 20.2 0, 23.5 0 C 28 0, 32 3.5, 32 8.5 C 32 15, 26 21, 16 29 Z',
  });
  return corazon;
}

const colores = ['#ff2e93', '#d6249f', '#c77dff', '#9d4edd', '#ffffff'];

/** Lluvia corta de corazones (para cada acierto). */
export function festejoChico() {
  if (reducido()) return;
  confetti({
    particleCount: 40,
    spread: 70,
    startVelocity: 32,
    origin: { y: 0.65 },
    shapes: [forma()],
    colors: colores,
    scalar: 1.3,
    ticks: 140,
    disableForReducedMotion: true,
  });
}

/** Festejo grande (cuando dice que sí y cuando firma). */
export function festejoGrande() {
  if (reducido()) return;
  // 10 segundos de corazones por toda la pantalla: cañones a los costados
  // y una lluvia que cae desde arriba a lo ancho.
  const fin = Date.now() + 10000;
  let cuadro = 0;
  const tirar = () => {
    cuadro++;
    if (cuadro % 3 === 0) {
      confetti({ particleCount: 3, angle: 60, spread: 65, startVelocity: 55, origin: { x: 0, y: 0.8 }, shapes: [forma()], colors: colores, scalar: 1.5 });
      confetti({ particleCount: 3, angle: 120, spread: 65, startVelocity: 55, origin: { x: 1, y: 0.8 }, shapes: [forma()], colors: colores, scalar: 1.5 });
    }
    confetti({
      particleCount: 1,
      startVelocity: 0,
      ticks: 320,
      gravity: 0.55,
      drift: Math.random() - 0.5,
      origin: { x: Math.random(), y: -0.05 },
      shapes: [forma()],
      colors: colores,
      scalar: 1.2 + Math.random() * 0.8,
    });
    if (Date.now() < fin) requestAnimationFrame(tirar);
  };
  tirar();
}

/** Besitos 😘 volando para el botón divertido. */
export function lluviaDeBesos() {
  if (reducido()) return;
  const beso = confetti.shapeFromText({ text: '💋', scalar: 2.4 });
  confetti({ particleCount: 28, spread: 110, startVelocity: 38, origin: { y: 0.75 }, shapes: [beso], scalar: 2.4, ticks: 160, flat: true });
}
