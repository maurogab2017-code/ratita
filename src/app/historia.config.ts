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
  /** Frases propias cuando erra en esta pregunta (si no, se usan las generales). */
  reaccionesError?: string[];
}

export const HISTORIA = {
  /** Cómo firmás vos. Aparece ya escrito en el contrato. */
  el: {
    nombre: 'Mauro',
    /** Cómo aparecés en la firma ("Firma de su ratita"). */
    apodo: 'su ratita',
  },

  /** Lo que se le sugiere a ella en el campo de nombre (puede escribir lo que quiera). */
  ella: {
    placeholderNombre: 'Tu nombre, ratita',
  },

  /** Pantalla de entrada: solo pasa si escribe su nombre. */
  acceso: {
    titulo: 'Esto es solo para una persona 🔒',
    texto: 'Antes de entrar, decime cómo te llamás:',
    placeholder: 'Tu nombre…',
    boton: 'Entrar',
    // Se comparan sin tildes ni mayúsculas; vale el nombre completo o la primera palabra.
    nombresValidos: ['Ro', 'Rocío', 'Roci', 'Rochi', 'Rocito'],
    errores: [
      'Mmm… vos no sos mi ratita 🐭',
      'Esto es solo para ella, perdón 🙈',
      'El gatito no te deja pasar 🐱',
    ],
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
      // La fecha correcta tiene que estar en "opciones" y también en "correctas".
      opciones: ['14 de febrero', '6 de agosto', '21 de septiembre', '1 de mayo'],
      correctas: ['6 de agosto'],
      mensajeAcierto: 'Ese día empezó una de las historias más lindas de mi vida ❤️',
      foto: 'assets/fotos/01-primer-encuentro.jpg',
      ilustracion: 'corazon',
    },
    {
      id: 'primer-beso',
      antetitulo: 'Capítulo 2 · El primer beso',
      pregunta: '¿Dónde nos dimos nuestro primer beso?',
      tipo: 'opciones',
      opciones: ['En el cine', 'En la calle', 'En Boticario', 'En la Sabattini'],
      correctas: ['En Boticario'],
      mensajeAcierto: 'En Boticario… y desde ese beso no te pude sacar más de mi cabeza 😘',
      ilustracion: 'beso',
    },
    {
      id: 'osito',
      antetitulo: 'Capítulo 3 · El tercero en la relación',
      pregunta: '¿Cómo se llama nuestro osito?',
      tipo: 'opciones-o-texto',
      opciones: ['Pochoclo', 'Lomito Caelia', 'Algodón'],
      // Alcanza con que escriba alguna de estas (sin importar tildes ni mayúsculas).
      correctas: ['Lomito Caelia', 'Lomo Caelia', 'Lomito', 'Lomo', 'Caelia'],
      placeholder: 'Escribí su nombre…',
      mensajeAcierto: '¡Lomito Caelia! El oso más lindo de todos después de Miki 🧸',
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
      opciones: ['Hermoso', 'Guapo', 'Corazoncito', 'Bello', 'Bebé'],
      mensajeAcierto: '¡Todas son correctas! Viniendo de vos, todo me gustaaa 🥰',
      ilustracion: 'ratita',
    },
    {
      id: 'persona-favorita',
      antetitulo: 'Capítulo 6 · Mi persona',
      pregunta: '¿Quién es mi profe, mi vecina y mi persona favorita?',
      tipo: 'opciones',
      opciones: ['No tengo 🤷', 'La rosa', 'Vos, obvio ❤️'],
      correctas: ['Vos, obvio ❤️'],
      reaccionesError: [
        '¿¿Cómo que no?? 😤 Pensalo bien…',
        '¿La rosa? Nooo, pensalo de nuevo 🙈',
      ],
      mensajeAcierto: 'Vos: mi profe, mi vecina y mi persona favorita en todo el mundo, bebé hermosaaa 💜',
      foto: 'assets/fotos/06-persona-favorita.jpg',
      ilustracion: 'abrazo',
    },
    {
      id: 'amor-de-mi-vida',
      antetitulo: 'Capítulo 7 · La más fácil',
      pregunta: '¿Quién es el amor de mi vida?',
      tipo: 'opciones',
      opciones: ['La comida', 'Belgrano', 'Vos, mi ratita ❤️'],
      correctas: ['Vos, mi ratita ❤️'],
      reaccionesError: [
        'La comida es importante… pero no tanto 🍕',
        'Belgrano me hace sufrir, vos no 💙',
      ],
      mensajeAcierto: 'Sos VOSSSS, BONITA ❤️',
      ilustracion: 'beso',
    },
    {
      id: 'cuanto-me-amas',
      antetitulo: 'Última pregunta',
      pregunta: '¿Cuánto me amás?',
      tipo: 'opciones',
      opciones: ['Poco', 'Poquito', 'Mucho', 'Muchísimo'],
      correctas: ['Mucho', 'Muchísimo'],
      reaccionesError: [
        '¿¿POCO?? 😤 Elegí de nuevo, ratita',
        '¿Poquito? El gatito está anotando todo 🐱📝',
        'Mmm… esa respuesta no la acepto 🙅',
      ],
      mensajeAcierto: 'Yo te amo muchísimo más, mi bella ❤️',
      ilustracion: 'corazon',
    },
  ] satisfies Pregunta[] as Pregunta[],

  /**
   * Fotitos chiquitas: aparece una en cada respuesta correcta (en orden)
   * y todas juntas en el mensaje final. Agregá o sacá las que quieras.
   */
  fotitos: [
    'assets/fotos/fotito-1.jpg',
    'assets/fotos/fotito-2.jpg',
    'assets/fotos/fotito-3.jpg',
    'assets/fotos/fotito-4.jpg',
    'assets/fotos/fotito-5.jpg',
    'assets/fotos/fotito-6.jpg',
    'assets/fotos/fotito-7.jpg',
  ],

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
      'Ya compartimos muchísimos momentos hermosos, pero todavía tengo una pregunta para vos, mi bebé, mi ratita bella, guapa y hermosa…',
    boton: 'Descubrir la última sorpresa',
  },

  contrato: {
    titulo: 'CONTRATO OFICIAL DE NOVIAZGO',
    partes: 'Entre mi ratita bella, guapa y hermosa, y su bebé.',
    clausula: 'Cláusula única: seguir compartiendo besos, abrazos, mimos y muchos momentos juntos.',
    vigencia: 'Vigencia: para siempre, con renovación diaria mediante besitos.',
    pregunta: '¿QUERÉS SER MI NOVIA? ❤️',
    botonSi: 'SÍ, QUIERO SER TU RATITA OFICIAL ❤️',
    botonBeso: 'SÍ, PERO QUIERO DARLE UN BESO A MI BEBÉ PRIMERO 😘',
  },

  firma: {
    titulo: '¡CONTRATO ACEPTADO OFICIALMENTE!',
    texto: 'Ahora solo falta que ambas partes firmen este hermoso acuerdo.',
    boton: 'Firmar nuestro contrato',
  },

  recuerdo: {
    mensaje: 'Desde hoy, oficialmente, mi ratita es mi novia. ❤️',
    firmado: 'Firmado: su bebé y su ratita bella, guapa y hermosa.',
    aclaracion: 'Recuerdo simbólico hecho con amor. No es un contrato legal (pero vale igual 😉).',
    botonDescargar: 'Descargar recuerdo',
  },
};
