/**
 * Número de versión del sitio, fijo en la esquina inferior derecha del
 * viewport (2026-09-11, pedido explícito: "dejalo fixed abajo a la derecha
 * en chiquito" — primero había vivido como una línea más dentro del
 * `Footer`, junto con sacar `SiteBanner`, pero el usuario lo quería como
 * marca fija de sitio, no como parte del contenido del pie).
 *
 * `__APP_VERSION__` sale de `vite.config.ts` (major.minor.patch de
 * `package.json` + conteo de commits, ver su comentario) — no es contenido
 * traducible (es un número técnico), por eso no vive en `content.ts`, mismo
 * criterio que el año del copyright del `Footer`.
 *
 * `right-2 bottom-2`: a 390px de ancho la rueda de `SectionNav` (`w-[320px]`,
 * centrada) deja ~35px libres a cada lado — este badge cae fuera de ese
 * rango incluso en el mobile más angosto que soporta el sitio. `z-30`: por
 * debajo del rail/rueda de `SectionNav` y del `Header` (`z-40`), nunca
 * compite por espacio con ellos porque tampoco se superponen en posición.
 */
export default function VersionBadge() {
  return (
    <span
      aria-hidden
      className="pointer-events-none fixed bottom-2 right-2 z-30 font-label text-[9px] uppercase tracking-[0.1em] text-cream/50"
    >
      v{__APP_VERSION__}
    </span>
  );
}
