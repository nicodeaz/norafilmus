import type { ImgHTMLAttributes } from 'react';
import manifest from '@/src/generated/image-manifest.json';

type ManifestEntry = { width: number; height: number; widths: number[] };
const MANIFEST = manifest as Record<string, ManifestEntry>;

interface PictureProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> {
  /** Ruta pública tal como vive en `content.ts` (clave del manifest), ej. '/img/about/rapina-afiche.jpg'. */
  src: string;
  alt: string;
  /** Atributo `sizes` del `<source>` — default 100vw, pasar el real cuando la imagen no ocupa todo el ancho. */
  sizes?: string;
  /** Clase del `<picture>` en sí (por default es `inline`) — para layouts tipo Hero donde el wrapper necesita `block`/`h-full` para que el `height: 100%` del `<img>` tenga de qué heredar. */
  pictureClassName?: string;
}

function derivedPath(src: string, width: number, format: 'avif' | 'webp') {
  const dot = src.lastIndexOf('.');
  return `${src.slice(0, dot)}-${width}w.${format}`;
}

/**
 * Lookup crudo del manifest, para componentes que arman su propio markup
 * (ej. `PillarMenu`, cuyo mosaico recorta la foto en 9 pedazos con `calc()` y
 * no puede pasar por el `<picture>` de acá abajo). Devuelve `null` si `src`
 * todavía no pasó por `scripts/optimize-images.mjs`.
 */
export function getImageSources(src: string) {
  const entry = MANIFEST[src];
  if (!entry) return null;
  const { width, height, widths } = entry;
  return {
    width,
    height,
    avifSet: widths.map((w) => `${derivedPath(src, w, 'avif')} ${w}w`).join(', '),
    webpSet: widths.map((w) => `${derivedPath(src, w, 'webp')} ${w}w`).join(', '),
  };
}

/**
 * `<picture>` con AVIF/WebP responsive a partir de `src/generated/image-manifest.json`
 * (lo escribe `scripts/optimize-images.mjs` — ver SUPERPROMPT.md §05). El
 * `<img>` de adentro sirve el original tal cual como fallback y trae
 * `width`/`height` del manifest para no generar layout shift.
 *
 * Si `src` no está en el manifest (imagen nueva, script no corrido todavía)
 * cae a un `<img>` plano sin romper el render — con un warning en dev, no
 * en producción, para no ensuciar la consola de un sitio publicado.
 */
export default function Picture({
  src,
  alt,
  sizes = '100vw',
  className,
  pictureClassName,
  ...imgProps
}: PictureProps) {
  const entry = MANIFEST[src];

  if (!entry) {
    if (import.meta.env.DEV) {
      console.warn(
        `[Picture] "${src}" no está en image-manifest.json — corré "node scripts/optimize-images.mjs". Sirviendo el original sin optimizar.`
      );
    }
    return <img src={src} alt={alt} className={className} {...imgProps} />;
  }

  const { width, height, widths } = entry;
  const avifSet = widths.map((w) => `${derivedPath(src, w, 'avif')} ${w}w`).join(', ');
  const webpSet = widths.map((w) => `${derivedPath(src, w, 'webp')} ${w}w`).join(', ');

  return (
    <picture className={pictureClassName}>
      <source type="image/avif" srcSet={avifSet} sizes={sizes} />
      <source type="image/webp" srcSet={webpSet} sizes={sizes} />
      <img src={src} alt={alt} width={width} height={height} className={className} {...imgProps} />
    </picture>
  );
}
