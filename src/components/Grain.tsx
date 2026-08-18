/**
 * Grano sobre todo el sitio — E3 / hallazgo H13.
 *
 * La auditoría marcó que el `ink` es **plano en el 100 % de la superficie bajo
 * el Hero**: `BackgroundDots` vive solo en el Hero y no había grano, viñeta ni
 * fuente de luz en ninguna otra parte. Un negro liso a lo largo de ~7.800 px
 * de scroll se lee como vacío aunque tenga contenido encima.
 *
 * Esto agrega textura sin agregar **un solo color** a la paleta (§2.1 del
 * contrato: `ink`/`cream`/`brand-red` son intocables): es ruido monocromo a
 * opacidad muy baja.
 *
 * Decisiones de implementación:
 *
 * - **`feTurbulence` inline como data-URI**, no un PNG: pesa ~200 bytes contra
 *   los ~40 KB de una textura de ruido en imagen, y no suma un request.
 * - **`position: fixed` y una sola instancia**: el grano no scrollea con el
 *   contenido (así se lee como grano de película y no como un patrón pegado a
 *   la página) y no cuesta un elemento por sección.
 * - **`pointer-events-none`** y fuera del árbol de accesibilidad.
 * - Sin `mix-blend-mode`: sobre `ink` el modo normal a opacidad baja alcanza, y
 *   evita crear un stacking context que compita con el `sticky` del Hero.
 */
const GRAIN_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140">
     <filter id="n">
       <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>
       <feColorMatrix type="saturate" values="0"/>
     </filter>
     <rect width="140" height="140" filter="url(#n)" opacity="0.55"/>
   </svg>`
);

export default function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] opacity-[0.045]"
      style={{
        backgroundImage: `url("data:image/svg+xml,${GRAIN_SVG}")`,
        backgroundRepeat: 'repeat',
      }}
    />
  );
}
