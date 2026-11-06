/**
 * ============================================================
 *  TODO LO EDITABLE DE LA HISTORIA ESTÁ EN ESTE ARCHIVO ❤️
 * ============================================================
 *
 *  - Textos de cada pantalla
 *  - Preguntas, opciones y respuestas correctas
 *  - Fotos (los archivos van en src/assets/fotos/, ver el README de esa carpeta)
 *  - Tu nombre y tu firma
 *
 *  Si una foto no existe, se muestra una ilustración en su lugar,
 *  así que la web funciona aunque todavía no hayas cargado ninguna.
 */

/** Ilustraciones propias disponibles (SVG dibujados en el proyecto). */
export type Ilustracion = 'beso' | 'abrazo' | 'osito' | 'corazon' | 'gatito' | 'ratita';

export interface Pregunta {
  id: string;
  /** Texto chiquito arriba de la pregunta. */
  antetitulo?: string;
  pregunta: string;
  /**
   * - 'opciones': elige entre botones; vale solo la correcta.
   * - 'texto': escribe la respuesta (sin importar tildes ni mayúsculas).
   * - 'opciones-o-texto': puede escribir o tocar una opción.
   * - 'todas-correctas': elija lo que elija, está bien.
   */
  tipo: 'opciones' | 'texto' | 'opciones-o-texto' | 'todas-correctas';
  opciones?: string[];
  /**
   * Respuestas que valen como correctas. Se comparan sin tildes, sin mayúsculas
   * y sin signos. En las de texto alcanza con que la respuesta "contenga" alguna.
   */
  correctas?: string[];
  placeholder?: string;
  /** Mensaje al acertar. */
  mensajeAcierto: string;
  /** Foto opcional (ruta dentro de src/assets). Si no existe, se usa la ilustración. */
  foto?: string;
  /** Ilustración que se muestra al acertar (o si no hay foto). */
  ilustracion: Ilustracion;
}

export const HISTORIA = {
  /** Cómo firmás vos. Aparece ya escrito en el contrato. */
  el: {
    nombre: 'Mauro',
    apodo: 'su príncipe',
  },

  /** Lo que se le sugiere a ella en el campo de nombre (puede escribir lo que quiera). */
  ella: {
    placeholderNombre: 'Tu nombre, ratita',
  },

  bienvenida: {
    saludo: 'Hola, mi ratita bella, guapa y hermosa ❤️',
    subtitulo: 'Tu ratita te preparó algo muy especial.',
    pregunta: '¿A ver cuánto te acordás de lo nuestro?',
    boton: 'Empezar nuestra historia',
  },

  preguntas: [
    {
      id: 'primer-dia',
      antetitulo: 'Capítulo 1 · El comienzo',
      pregunta: '¿Qué día nos vimos por primera vez?',
      tipo: 'opciones',
      // ⚠️ COMPLETAR: poné la fecha real en "opciones" y la misma en "correctas".
      opciones: ['14 de febrero', '3 de marzo', '21 de septiembre', '1 de mayo'],
      correctas: ['3 de marzo'],
      mensajeAcierto: 'Ese día empezó una de las historias más lindas de mi vida ❤️',
      foto: 'assets/fotos/01-primer-encuentro.jpg',
      ilustracion: 'corazon',
    },
    {
      id: 'primer-beso',
      antetitulo: 'Capítulo 2 · El primer beso',
      pregunta: '¿Dónde nos dimos nuestro primer beso?',
      tipo: 'opciones',
      opciones: ['En el cine', 'En Boticario', 'En una plaza', 'En la puerta de casa'],
      correctas: ['En Boticario'],
      mensajeAcierto: 'En Boticario… y desde ese beso no te pude sacar más de mi cabeza 😘',
      ilustracion: 'beso',
    },
    {
      id: 'osito',
      antetitulo: 'Capítulo 3 · El tercero en la relación',
      pregunta: '¿Cómo se llama nuestro osito?',
      tipo: 'opciones-o-texto',
      opciones: ['Pochoclo', 'Lomito', 'Algodón'],
      correctas: ['Lomito'],
      placeholder: 'Escribí su nombre…',
      mensajeAcierto: '¡Lomito! El osito más mimado del mundo, casi tanto como vos 🧸',
      foto: 'assets/fotos/03-osito.jpg',
      ilustracion: 'osito',
    },
    {
      id: 'lugar',
      antetitulo: 'Capítulo 4 · Nuestro lugar',
      pregunta: '¿Cuál es el lugar donde más veces fuimos?',
      tipo: 'texto',
      correctas: ['Güemes'],
      placeholder: 'Escribilo acá…',
      mensajeAcierto: 'Güemes, nuestro lugar. Cada vuelta ahí con vos es especial ✨',
      foto: 'assets/fotos/04-guemes.jpg',
      ilustracion: 'abrazo',
    },
    {
      id: 'apodo',
      antetitulo: 'Capítulo 5 · Cosas nuestras',
      pregunta: '¿Cómo me gusta que me digas?',
      tipo: 'todas-correctas',
      opciones: ['Hermoso', 'Guapa', 'Corazoncito', 'Bello', 'Bebé'],
      mensajeAcierto: '¡Todas son correctas! Viniendo de vos, cualquiera me derrite 🥰',
      ilustracion: 'ratita',
    },
    {
      id: 'persona-favorita',
      antetitulo: 'Capítulo 6 · Mi persona',
      pregunta: '¿Quién es mi profe, mi vecina y mi persona favorita?',
      tipo: 'opciones',
      opciones: ['El gatito blanco', 'Vos, obvio ❤️', 'Lomito'],
      correctas: ['Vos, obvio ❤️'],
      mensajeAcierto: 'Vos: mi profe, mi vecina y mi persona favorita en todo el mundo 💜',
      foto: 'assets/fotos/06-persona-favorita.jpg',
      ilustracion: 'abrazo',
    },
    {
      id: 'amor-de-mi-vida',
      antetitulo: 'Capítulo 7 · La más fácil',
      pregunta: '¿Quién es el amor de mi vida?',
      tipo: 'opciones',
      opciones: ['La pizza', 'Vos, mi ratita ❤️', 'Dormir la siesta'],
      correctas: ['Vos, mi ratita ❤️'],
      mensajeAcierto: 'Sos vos, mi ratita. Siempre vos ❤️',
      ilustracion: 'beso',
    },
    {
      id: 'cuanto-me-amas',
      antetitulo: 'Última pregunta',
      pregunta: '¿Cuánto me amás?',
      tipo: 'todas-correctas',
      opciones: [
        'Muchísimo',
        'Más que a nadie',
        'Hasta el infinito',
        'Más de lo que las palabras pueden explicar',
      ],
      mensajeAcierto: 'Yo te amo muchísimo más, ratita ❤️',
      ilustracion: 'corazon',
    },
  ] satisfies Pregunta[] as Pregunta[],

  /** Frases simpáticas cuando no acierta (se elige una al azar). */
  reaccionesError: [
    '¡Casi, ratita! Pensalo de nuevo 🙈',
    'Mmm… el gatito dice que no 🐱',
    'Esa no, pero te perdono con un besito 😘',
    '¡Uy! Probá otra vez, que vos sabés 💜',
    'Te doy otra chance porque sos vos 😌',
  ],

  mensajeFinal: {
    titulo: 'Bueno, mi ratita…',
    texto:
      'Si llegaste hasta acá, quiero que sepas que cada momento que compartimos significa muchísimo para mí. ' +
      'Me encanta tenerte en mi vida, hacerte reír, abrazarte, cuidarte y seguir descubriendo todo lo lindo que nos espera. ' +
      'Ya compartimos muchísimos momentos hermosos, pero tu príncipe todavía tiene una pregunta para su ratita…',
    boton: 'Descubrir la última sorpresa',
  },

  contrato: {
    titulo: 'CONTRATO OFICIAL DE NOVIAZGO',
    partes: 'Entre mi ratita bella, guapa y hermosa, y su príncipe.',
    clausula: 'Cláusula única: seguir compartiendo besos, abrazos, mimos y muchos momentos juntos.',
    vigencia: 'Vigencia: para siempre, con renovación diaria mediante besitos.',
    pregunta: '¿QUERÉS SER MI NOVIA? ❤️',
    botonSi: 'SÍ, QUIERO SER TU RATITA OFICIAL ❤️',
    botonBeso: 'SÍ, PERO QUIERO DARLE UN BESO A MI PRÍNCIPE PRIMERO 😘',
  },

  firma: {
    titulo: '¡CONTRATO ACEPTADO OFICIALMENTE!',
    texto: 'Ahora solo falta que ambas partes firmen este hermoso acuerdo.',
    boton: 'Firmar nuestro contrato',
  },

  recuerdo: {
    mensaje: 'Desde hoy, oficialmente, mi ratita es mi novia. ❤️',
    firmado: 'Firmado: su príncipe y su ratita bella, guapa y hermosa.',
    aclaracion: 'Recuerdo simbólico hecho con amor. No es un contrato legal (pero vale igual 😉).',
    botonDescargar: 'Descargar recuerdo',
  },
};
