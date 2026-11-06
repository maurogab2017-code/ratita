# Nuestra historia: de dos ratitas a una pareja ❤️

Una web romántica que recorre nuestra historia con preguntas, termina con la propuesta
de noviazgo y un contrato simbólico que se firma con el dedo y se descarga como imagen.

Hecha con **Angular 21** (HTML, SCSS y TypeScript), **GSAP** para las animaciones,
**canvas-confetti** para la lluvia de corazones y **html-to-image** para descargar el recuerdo.
Las ratitas, el gatito y el osito son ilustraciones SVG propias.

## Recorrido

1. Bienvenida
2. Preguntas (una por pantalla; si erra, el gatito reacciona y puede reintentar)
3. Mensaje romántico
4. Contrato oficial de noviazgo y la gran pregunta
5. Firma digital (los dos nombres, firma con el dedo y fecha automática)
6. Recuerdo final para descargar como imagen

## Cómo correrlo en tu compu

Necesitás [Node.js](https://nodejs.org) 22 o más nuevo.

```bash
npm install
npm start
```

Abrí http://localhost:4200. Para verlo desde el celular en la misma red Wi-Fi:
`npx ng serve --host 0.0.0.0` y entrá a `http://IP-DE-TU-COMPU:4200`.

Para generar la versión final: `npm run build` (queda en `dist/ratita/browser`).

## Cómo personalizarlo

**Todo lo editable está en un solo archivo: [`src/app/historia.config.ts`](src/app/historia.config.ts).**
Ahí cambiás textos, preguntas, opciones, respuestas correctas, fotos y tu nombre.

Lo que conviene completar sí o sí:

- **Fecha del primer encuentro** (pregunta `primer-dia`): poné la fecha real en `opciones`
  y la misma en `correctas`.
- **Tu nombre** (`el.nombre`): es el que aparece firmado en el contrato.

Las respuestas escritas se comparan sin tildes, sin mayúsculas y sin signos
(`guemes`, `GÜEMES` y `en Güemes!` valen igual).

## Fotos

Van en [`src/assets/fotos/`](src/assets/fotos/README.md); ahí hay un README con el nombre de
archivo que lleva cada pregunta. Si falta una foto se muestra una ilustración, así que no se rompe nada.

## Publicarlo gratis

### Opción A: Vercel (la más fácil)

1. Entrá a https://vercel.com con tu cuenta de GitHub.
2. **Add New → Project** y elegí el repo `ratita`.
3. Vercel detecta Angular solo. Dejá todo como está y tocá **Deploy**.
4. Te da un link tipo `https://ratita.vercel.app` para mandarle. Cada push lo actualiza.

### Opción B: GitHub Pages

El repo ya trae el workflow `.github/workflows/github-pages.yml`.

1. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Hacé push a `main` (o corré el workflow a mano en la pestaña **Actions**).
3. Queda en `https://maurogab2017-code.github.io/ratita/`.

## Pasar a Angular 22

El proyecto usa Angular 21 porque Angular 22 pide Node 22.22 o más nuevo. Si actualizás Node
(por ejemplo a Node 24 LTS), podés subirlo con:

```bash
npx ng update @angular/core@22 @angular/cli@22
```

---

*El contrato es un recuerdo simbólico, no un documento legal. Pero vale igual 😉*
