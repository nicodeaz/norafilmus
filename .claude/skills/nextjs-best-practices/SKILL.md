---
name: nextjs-best-practices
description: Arquitectura real de norafilmus. OJO — este proyecto NO es Next.js, es Vite + React Router. Cargar antes de asumir App Router, Server Components o cualquier convención de Next.
---

# Arquitectura — norafilmus NO es Next.js

**Corrección de base, léela primero:** si una instrucción o prompt describe "App Router", "Server Components", "Client Components" o cualquier convención de Next.js aplicada a este repo, es un desajuste — este proyecto es **Vite 6 + React 19 + React Router v7 (`BrowserRouter`)**, sin Next.js, sin RSC, sin `'use client'` real (el `Button.tsx` tiene un comentario `'use client'` heredado de un componente de referencia externo — es vestigial, no hace nada en Vite, no lo repliques en componentes nuevos).

La carpeta hermana `C:\xampp\htdocs\norafilmus_v2\` SÍ es Next.js — trabajo real de otra sesión en paralelo. No importar ni mezclar convenciones de ahí sin pedido explícito del usuario.

## Stack real

```
React 19 + Vite 6 + Tailwind CSS 4 (@tailwindcss/vite, sin tailwind.config)
+ motion (import 'motion/react', NO gsap — ver skill gsap-motion)
+ lucide-react
+ react-router-dom v7 (BrowserRouter en main.tsx, Routes en App.tsx)
```

Alias `@/*` apunta a la **raíz del proyecto**, no a `src/` — `lib/utils.ts` y `lib/ease.ts` viven en la raíz, `cn()` no está en `src/lib/`. Confirmá el path real (`@/lib/ease` vs `@/src/lib/ease`) antes de importar, son cosas distintas en este repo.

## Routing

`App.tsx`: `Routes` con un layout route (`<Route element={<SiteLayout/>}>`) que envuelve todas las páginas reales, más `NotFound` como catch-all (`*`) **fuera** del layout — sin Header/Footer/obertura, pantalla aislada a propósito.

`Home` (dentro de `App.tsx`, no un archivo `pages/HomePage.tsx` separado) es `Hero + AboutMe + ProgramIndex` — el hub de navegación, no un resumen del sitio entero. Cada Acto/pieza tiene su propia ruta en `src/pages/*Page.tsx`: wrappers delgados que solo importan el componente real de `src/components/` — la lógica de contenido vive en el componente, no en el wrapper de página.

Páginas más pesadas que Home van con `React.lazy` en `App.tsx` (ver skill `performance`). `PageCurtain.tsx` es la transición entre rutas (telón, reusa el lenguaje visual del `Preloader` pero es una implementación propia, no compartida) — usa `useOutlet()` en vez de `<Outlet/>` directo para poder seguir mostrando la página vieja mientras el telón cierra (con `<Outlet/>` directo el contenido nuevo aparece apenas cambia la URL, un flash por debajo del telón todavía cerrando).

## i18n — sin librería

Todo el texto vive en `src/i18n/content.ts`, tipado como `SiteContent` que obliga a que ES y EN tengan exactamente la misma forma — si agregás un campo, agregalo en los dos idiomas o TypeScript lo marca. `LanguageContext.tsx` (`src/i18n/`) maneja el estado + `localStorage` + el atributo `lang` del `<html>`. No agregues `react-i18next` ni similar — la razón de no tener librería es que el volumen de contenido es chico y controlado, no una limitación técnica.

## TypeScript

`npm run lint` es literalmente `tsc --noEmit` — no hay ESLint configurado. Esto significa que errores de estilo/convención NO los va a atrapar el linter; la disciplina de estos skills es la única red. Corré `npm run lint` después de cualquier cambio de tipos o de `content.ts`.

## Convención de páginas nuevas

1. Componente real en `src/components/NombreSeccion.tsx` (contenido + composición).
2. Wrapper en `src/pages/NombreSeccionPage.tsx` que solo renderiza el componente (más `<title>`/meta si aplica).
3. Ruta en `App.tsx`, lazy-loaded si no es Home.
4. Link agregado a `Header.tsx` y `Footer.tsx` (un lugar cada uno, no una tercera lista de nav) — si es un pilar (`Pillar` con imagen/crédito), también a `content.ts` `pillars[]` y por lo tanto aparece solo en `PillarMenu`; si no, es un link fijo como `Trayectoria`/`Presente`/`Archivo`/`Contacto`.

## Server vs. Client

No aplica — todo en este repo es client-side (SPA de Vite). No hay data fetching server-side, no hay `getServerSideProps`/`generateStaticParams` ni equivalentes. Cualquier necesidad futura de contenido dinámico real (no el caso hoy) sería una decisión de arquitectura nueva, no una convención ya resuelta.
