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
   * - 'fotos': las opciones son fotos (rutas); toque la que toque, está bien
   *   y se muestra grande la que eligió.
   */
  tipo: 'opciones' | 'texto' | 'opciones-o-texto' | 'todas-correctas' | 'fotos';
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
  /** Pistas que da Miki (en orden) cuando erra en una pregunta para escribir, o si pide una. */
  pistas?: string[];
  /** Si viene, Miki entra al medio de la pantalla y dice esto al empezar la pregunta. */
  mikiEntra?: string;
  /** Si es true, las opciones incorrectas se escapan cuando las quiere tocar. */
  escapan?: boolean;
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
      mensajeAcierto: '¡Sisisisisisi! En Boticario… y desde ese beso no te pude sacar más de mi cabeza 😘',
      ilustracion: 'beso',
    },
    {
      id: 'osito',
      antetitulo: 'Capítulo 3 · El tercero en la relación',
      pregunta: '¿Cómo se llama nuestro osito?',
      tipo: 'texto',
      // Alcanza con que escriba alguna de estas (sin importar tildes ni mayúsculas).
      correctas: ['Lomito Caelia', 'Lomo Caelia', 'Lomito', 'Lomo', 'Caelia'],
      placeholder: 'Escribí su nombre…',
      pistas: ['Empieza con "Lomo"… 🧸', 'Tiene apellido… empieza con C 😉', 'Lomito C-a-e-l-i-a 🙈'],
      mensajeAcierto: '¡Lomito Caelia! 🧸💜',
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
      pistas: ['Es un barrio de Córdoba 🏘️', 'Empieza con G… 😏', 'G-ü-e-m-e-s 🙈'],
      mensajeAcierto: '¡Sisisisi! Güemes, nuestro lugar. Cada vuelta ahí con vos es especial ✨',
      foto: 'assets/fotos/04-guemes.jpg',
      ilustracion: 'abrazo',
    },
    {
      id: 'foto-favorita',
      antetitulo: 'Capítulo 5 · Nuestras fotos',
      pregunta: '¿Cuál es mi foto favorita?',
      mikiEntra: '¡Elegí bien, eh! 📸',
      tipo: 'fotos',
      opciones: [
        'assets/fotos/fotito-5.jpg',
        'assets/fotos/fotito-2.jpg',
        'assets/fotos/fotito-4.jpg',
        'assets/fotos/fotito-7.jpg',
      ],
      mensajeAcierto: '¡Esa! Aunque en todas salís hermosa 📸',
      ilustracion: 'corazon',
    },
    {
      id: 'apodo',
      antetitulo: 'Capítulo 6 · Cosas nuestras',
      pregunta: '¿Cómo me gusta que me digas?',
      tipo: 'todas-correctas',
      opciones: ['Hermoso', 'Guapo', 'Corazoncito', 'Bello', 'Bebé', 'Amor'],
      mensajeAcierto: '¡Todas son correctas si vienen de tuu! 🥰',
      ilustracion: 'ratita',
    },
    {
      id: 'te-amo-primero',
      antetitulo: 'Capítulo 7 · El primer te amo',
      pregunta: '¿Quién dijo "te amo" primero?',
      mikiEntra: 'Yo sé la respuesta… 🤫',
      tipo: 'opciones',
      opciones: ['Vos', 'Yo', 'Los dos juntos'],
      correctas: ['Vos'],
      reaccionesError: [
        'Nooo, fuiste vos… ¡se te escapó! 🙊',
        'Mmm, no no. Haceme memoria… 😏',
      ],
      mensajeAcierto: '¡Vos! Se te escapó a vos primero… pero después yo 🙊❤️',
      ilustracion: 'beso',
    },
    {
      id: 'lo-que-mas-me-gusta',
      antetitulo: 'Capítulo 8 · Lo que más me gusta',
      pregunta: '¿Qué es lo que más me gusta de vos?',
      tipo: 'todas-correctas',
      opciones: ['Tu sonrisa', 'Tus ojos', 'Tu forma de ser tan tierna', 'Tu nariz', 'Cómo me hacés sentir'],
      mensajeAcierto: 'Todas valen… pero la respuesta correcta es TODO 💜',
      ilustracion: 'abrazo',
    },
    {
      id: 'cuanto-me-amas',
      antetitulo: 'Última pregunta',
      pregunta: '¿Cuánto me amás?',
      mikiEntra: 'Te estoy mirando 👀',
      escapan: true,
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

  /** Lo que dice Miki cuando acierta (se elige una al azar). */
  reaccionesAcierto: ['¡Sisisisisisi! 💜', '¡Sisisisi! 🥰', '¡Sisisisisisisisi! 🐾', '¡Bieeen! 💜'],

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
      'Ya compartimos muchos momentos hermosos, pero todavía tengo una pregunta para vos, mi bebé, mi ratita bella, guapa y hermosa…',
    boton: 'Descubrir la última sorpresa',
  },

  /** Pausa con suspenso antes del contrato (frases que aparecen de a una + cuenta 3, 2, 1). */
  suspenso: {
    lineas: ['Ahora sí…', 'Respirá hondo 🫣', 'Lo que viene es muy importante…'],
  },

  contrato: {
    /** Título en el recuerdo final. */
    titulo: 'CONTRATO OFICIAL DE NOVIAZGO',
    /** Título la primera vez que aparece (antes de que diga que sí). */
    tituloPropuesta: 'CONTRATO OFICIAL',
    partes: 'Entre mi ratita bella, guapa y hermosa, y su bebé.',
    clausula: 'Cláusula única: seguir compartiendo besos, abrazos, mimos y muchos momentos juntos.',
    vigencia: 'Vigencia: para siempre, con renovación diaria mediante besitos.',
    pregunta: '¿QUERÉS SER MI NOVIA? ❤️',
    botonSi: 'SÍ, QUIERO SER TU RATITA OFICIAL ❤️',
    botonBeso: 'SÍ, PERO QUIERO DARLE UN BESO A MI BEBÉ PRIMERO 😘',
    /** Botón "No": se escapa cada vez que lo quiere tocar y al final desaparece. */
    botonNo: 'No 🙈',
    retosNo: [
      '¡Esa opción no existe! 😼',
      '¿¿Otra vez?? 🙀',
      'Ni lo intentes, ratita 😾',
      'Ya casi no queda botón 😹',
      'Listo, el NO se fue para siempre 💜',
    ],
  },

  firma: {
    titulo: '¡CONTRATO ACEPTADO OFICIALMENTE!',
    texto: 'Ahora solo falta que ambas partes firmen este hermoso acuerdo.',
    boton: 'Firmar nuestro contrato',
  },

  recuerdo: {
    mensaje: 'Desde hoy, oficialmente, mi ratita es mi novia. ❤️',
    firmado: 'Firmado: su bebé y su ratita bella, guapa y hermosa.',
    aclaracion: 'Este contrato no se puede romper nunca 💜',
    botonDescargar: 'Descargar recuerdo',
  },
};
