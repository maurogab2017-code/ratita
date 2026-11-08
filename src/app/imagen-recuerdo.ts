/**
 * Dibuja el contrato firmado "a mano" en un canvas y lo devuelve como PNG.
 *
 * Antes se sacaba una "captura" del HTML (html-to-image), pero en iPhone esa técnica
 * suele salir vacía (sin firmas ni texto). Dibujar en canvas sale igual en todos los celus.
 */

export interface DatosImagen {
  titulo: string;
  partes: string;
  clausula: string;
  vigencia: string;
  mensaje: string;
  aclaracion: string;
  nombreEl: string;
  apodoEl: string;
  firmaEl: string;
  nombreElla: string;
  firmaElla: string;
  fecha: string;
  selfie?: string;
  /** SVGs de las ratitas (ella, él) ya listos para dibujar. */
  ratitas?: { ella: string; el: string };
}

const ANCHO = 1080;
const MARGEN = 90;
const COLOR = { texto: '#3a1450', violeta: '#7b2cbf', fucsia: '#ff2e93', magenta: '#d6249f', rosa: '#b5177f', lila: '#9d4edd', gris: '#8a6b97' };
const FUENTE_TITULO = 'Fredoka, Nunito, sans-serif';
const FUENTE = 'Nunito, sans-serif';

function cargar(src: string): Promise<HTMLImageElement | null> {
  return new Promise((ok) => {
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = () => ok(null);
    img.src = src;
  });
}

type Trozo = { texto: string; fuente: string; color: string };

/** Escribe texto con partes en distintos estilos, cortando en renglones y centrado. Devuelve la nueva Y. */
function parrafo(ctx: CanvasRenderingContext2D, trozos: Trozo[], y: number, alto: number, dibujar: boolean): number {
  const max = ANCHO - MARGEN * 2;
  const palabras: Trozo[] = [];
  for (const t of trozos) for (const p of t.texto.split(/(\s+)/)) if (p) palabras.push({ ...t, texto: p });
  const renglones: Trozo[][] = [[]];
  let ancho = 0;
  for (const p of palabras) {
    ctx.font = p.fuente;
    const w = ctx.measureText(p.texto).width;
    const espacio = /^\s+$/.test(p.texto);
    if (!espacio && ancho + w > max && renglones[renglones.length - 1].length) {
      renglones.push([]);
      ancho = 0;
    }
    if (espacio && ancho === 0) continue;
    renglones[renglones.length - 1].push(p);
    ancho += w;
  }
  for (const r of renglones) {
    while (r.length && /^\s+$/.test(r[r.length - 1].texto)) r.pop();
    if (dibujar) {
      let total = 0;
      for (const p of r) {
        ctx.font = p.fuente;
        total += ctx.measureText(p.texto).width;
      }
      let x = (ANCHO - total) / 2;
      for (const p of r) {
        ctx.font = p.fuente;
        ctx.fillStyle = p.color;
        ctx.fillText(p.texto, x, y);
        x += ctx.measureText(p.texto).width;
      }
    }
    y += alto;
  }
  return y;
}

/** Separa "Etiqueta: resto" en dos trozos (etiqueta en negrita). */
function conEtiqueta(t: string, tam: number): Trozo[] {
  const i = t.indexOf(':');
  if (i < 0) return [{ texto: t, fuente: `400 ${tam}px ${FUENTE}`, color: COLOR.texto }];
  return [
    { texto: t.slice(0, i + 1), fuente: `800 ${tam}px ${FUENTE}`, color: COLOR.rosa },
    { texto: t.slice(i + 1), fuente: `400 ${tam}px ${FUENTE}`, color: COLOR.texto },
  ];
}

function rectRedondo(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Dibuja una imagen entera dentro de una caja, centrada (como object-fit: contain). */
function contener(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const k = Math.min(w / img.naturalWidth, h / img.naturalHeight);
  const iw = img.naturalWidth * k;
  const ih = img.naturalHeight * k;
  ctx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
}

export async function dibujarRecuerdo(d: DatosImagen): Promise<string> {
  try {
    await Promise.all([
      document.fonts.load(`600 40px Fredoka`),
      document.fonts.load(`400 40px Nunito`),
      document.fonts.load(`800 40px Nunito`),
    ]);
  } catch {
    /* si no cargan, se usa la fuente del sistema */
  }

  const [firmaEl, firmaElla, selfie, ratitaElla, ratitaEl] = await Promise.all([
    cargar(d.firmaEl),
    cargar(d.firmaElla),
    d.selfie ? cargar(d.selfie) : Promise.resolve(null),
    d.ratitas ? cargar(d.ratitas.ella) : Promise.resolve(null),
    d.ratitas ? cargar(d.ratitas.el) : Promise.resolve(null),
  ]);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  ctx.textBaseline = 'alphabetic';

  /** Todo el contenido. Se corre dos veces: una para medir el alto y otra para dibujar. */
  const contenido = (dibujar: boolean, conRatitas: boolean): number => {
    let y = 110;
    // ratitas enamoradas
    if (conRatitas && ratitaElla && ratitaEl) {
      if (dibujar) {
        const w = 170;
        const h = 196;
        ctx.save();
        ctx.translate(ANCHO / 2 - 150, y);
        ctx.rotate(0.1);
        ctx.drawImage(ratitaElla, -w / 2 + 40, 0, w, h);
        ctx.restore();
        ctx.save();
        ctx.translate(ANCHO / 2 + 150, y);
        ctx.rotate(-0.1);
        ctx.scale(-1, 1);
        ctx.drawImage(ratitaEl, -w / 2 + 40, 0, w, h);
        ctx.restore();
        ctx.font = `400 64px ${FUENTE}`;
        ctx.fillStyle = COLOR.fucsia;
        ctx.textAlign = 'center';
        ctx.fillText('❤', ANCHO / 2, y + 70);
        ctx.textAlign = 'left';
      }
      y += 230;
    } else {
      if (dibujar) {
        ctx.font = `400 90px ${FUENTE}`;
        ctx.textAlign = 'center';
        ctx.fillStyle = COLOR.fucsia;
        ctx.fillText('🐭❤🐭', ANCHO / 2, y + 90);
        ctx.textAlign = 'left';
      }
      y += 150;
    }
    y += 50;
    y = parrafo(ctx, [{ texto: d.titulo, fuente: `600 60px ${FUENTE_TITULO}`, color: COLOR.violeta }], y, 72, dibujar);
    y = parrafo(ctx, [{ texto: '♥  ♥  ♥', fuente: `400 30px ${FUENTE}`, color: COLOR.magenta }], y, 70, dibujar);
    y = parrafo(ctx, [{ texto: d.partes, fuente: `italic 400 38px ${FUENTE}`, color: COLOR.texto }], y, 54, dibujar);
    y += 16;
    y = parrafo(ctx, conEtiqueta(d.clausula, 38), y, 54, dibujar);
    y += 16;
    y = parrafo(ctx, conEtiqueta(d.vigencia, 38), y, 54, dibujar);
    y += 40;
    y = parrafo(ctx, [{ texto: d.mensaje, fuente: `600 46px ${FUENTE_TITULO}`, color: COLOR.rosa }], y, 60, dibujar);
    y += 40;

    // firmas, en dos columnas
    const col = (ANCHO - MARGEN * 2 - 60) / 2;
    const firmas: [HTMLImageElement | null, string, string][] = [
      [firmaEl, d.nombreEl, d.apodoEl],
      [firmaElla, d.nombreElla, 'su ratita oficial'],
    ];
    firmas.forEach(([img, nombre, sub], i) => {
      const x = MARGEN + i * (col + 60);
      if (!dibujar) return;
      if (img) contener(ctx, img, x, y, col, 170);
      ctx.strokeStyle = '#c9a0c0';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y + 180);
      ctx.lineTo(x + col, y + 180);
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.font = `800 36px ${FUENTE}`;
      ctx.fillStyle = COLOR.texto;
      ctx.fillText(nombre, x + col / 2, y + 230);
      ctx.font = `400 30px ${FUENTE}`;
      ctx.fillStyle = COLOR.lila;
      ctx.fillText(sub, x + col / 2, y + 270);
      ctx.textAlign = 'left';
    });
    y += 330;
    y = parrafo(ctx, [{ texto: 'Firmado el ' + d.fecha, fuente: `800 36px ${FUENTE}`, color: COLOR.texto }], y, 60, dibujar);
    y += 10;
    y = parrafo(ctx, [{ texto: d.aclaracion, fuente: `400 28px ${FUENTE}`, color: COLOR.gris }], y, 40, dibujar);
    return y + 70;
  };

  const pintar = (conRatitas: boolean): string => {
    const alto = Math.ceil(contenido(false, conRatitas));
    canvas.width = ANCHO;
    canvas.height = alto;
    // cartulina
    ctx.fillStyle = '#fdeaf4';
    ctx.fillRect(0, 0, ANCHO, alto);
    ctx.strokeStyle = '#f2a7d0';
    ctx.lineWidth = 6;
    rectRedondo(ctx, 26, 26, ANCHO - 52, alto - 52, 40);
    ctx.stroke();
    ctx.font = `400 44px ${FUENTE}`;
    ctx.fillStyle = COLOR.fucsia;
    for (const [x, y] of [[60, 100], [ANCHO - 96, 100], [60, alto - 56], [ANCHO - 96, alto - 56]]) ctx.fillText('♥', x, y);
    contenido(true, conRatitas);

    // sello "ACEPTADO"
    ctx.save();
    ctx.translate(ANCHO - 170, 170);
    ctx.rotate(-0.28);
    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = COLOR.magenta;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, 82, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 72, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = COLOR.magenta;
    ctx.textAlign = 'center';
    ctx.font = `800 28px ${FUENTE}`;
    ctx.fillText('ACEPTADO', 0, 2);
    ctx.font = `400 30px ${FUENTE}`;
    ctx.fillText('❤', 0, 38);
    ctx.restore();
    ctx.textAlign = 'left';

    // selfie chiquita tipo polaroid
    if (selfie) {
      ctx.save();
      ctx.translate(170, 190);
      ctx.rotate(-0.14);
      ctx.shadowColor = 'rgba(58,20,80,.3)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = '#fff';
      ctx.fillRect(-90, -90, 180, 206);
      ctx.shadowColor = 'transparent';
      const lado = Math.min(selfie.naturalWidth, selfie.naturalHeight);
      ctx.drawImage(selfie, (selfie.naturalWidth - lado) / 2, (selfie.naturalHeight - lado) / 2, lado, lado, -80, -80, 160, 160);
      ctx.restore();
    }
    return canvas.toDataURL('image/png');
  };

  try {
    return pintar(true);
  } catch {
    // algunos Safari viejos no dejan exportar si se dibujó un SVG: va sin ratitas
    return pintar(false);
  }
}

/** Prepara el SVG de una ratita del DOM para dibujarlo en el canvas (con los ojitos como se ven). */
export function svgParaCanvas(host: Element | null): string | undefined {
  const svg = host?.querySelector('svg');
  if (!svg) return undefined;
  const copia = svg.cloneNode(true) as SVGSVGElement;
  const cerrados = host!.classList.contains('ojos-cerrados');
  copia.querySelector(cerrados ? '.ojos' : '.ojos-felices')?.remove();
  copia.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  copia.setAttribute('width', '200');
  copia.setAttribute('height', '230');
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(copia));
}
