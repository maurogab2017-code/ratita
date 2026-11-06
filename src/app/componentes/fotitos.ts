import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Fotitos chiquitas tipo polaroid, minimalistas. Si una no carga, se oculta sola. */
@Component({
  selector: 'app-fotitos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (f of fotos(); track f; let i = $index) {
      <figure class="polaroid" [style.--giro.deg]="giro(i)" [style.animation-delay.s]="0.25 + i * 0.12">
        <img [src]="f" alt="Nosotros" loading="lazy" (error)="ocultar($event)" />
      </figure>
    }
  `,
  styles: `
    :host { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
    .polaroid {
      margin: 0; padding: 4px 4px 14px; background: #fff; border-radius: 3px;
      width: var(--ancho, 130px); padding: 6px 6px 20px; transform: rotate(var(--giro));
      box-shadow: 0 6px 16px rgba(0,0,0,.35);
      animation: caer .6s cubic-bezier(.2,.9,.3,1.3) both;
    }
    .polaroid:nth-child(even) { margin-top: 8px; }
    img { display: block; width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 2px; }
    @keyframes caer { from { opacity: 0; transform: translateY(-14px) rotate(calc(var(--giro) * -2)) scale(.8); } }
    @media (prefers-reduced-motion: reduce) { .polaroid { animation: none; } }
  `,
})
export class Fotitos {
  readonly fotos = input<string[]>([]);

  giro(i: number) {
    return [-6, 4, -3, 7, -5, 3, -7][i % 7];
  }

  ocultar(e: Event) {
    ((e.target as HTMLElement).parentElement as HTMLElement).style.display = 'none';
  }
}
