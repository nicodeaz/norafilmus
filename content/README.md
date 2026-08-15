# content/ — material de investigación

Esta carpeta contiene **material crudo de investigación** recopilado de fuentes externas sobre la trayectoria de Nora Filmus (actriz, payasa, docente de teatro y productora cultural). No es código ni contenido final del sitio — es insumo para redactar textos reales (bios, ficha de trayectoria, sección de portfolio, etc.) en una sesión posterior.

**Importante**: esta carpeta es independiente de `src/content/`, que sí es código TypeScript consumido por la app React. Nada de lo que hay acá se importa en el sitio.

## Organización

- `youtube/notes.md` — metadata extraída de un video de YouTube sobre la obra "Que no quede huella" (compañía Boquitas Pintadas). Sin archivo descargable (no hay yt-dlp en el entorno).
- `alternativa-teatral/notes.md` + `alternativa-teatral/media/` — fichas técnicas de 4 obras extraídas de las páginas públicas de alternativateatral.com (Rapiña, Los golpes de Clara, Mujeres a la obra, Improvisación Mosquito), con los 4 afiches ya descargados en `media/`.
- `alternativa-teatral-panel/notes.md` — historial completo de obras y bio de Nora extraído del panel privado de alternativateatral.com (requiere login; la extracción se hizo una sola vez, la contraseña no se guardó en ningún archivo). Sin imágenes, es contenido de texto.
- `blogspot/notes.md` — relevamiento del blog viejo de Nora (norafilmus.blogspot.com), listado de posts con foco en contenido biográfico/teatral. **Pendiente**: varios posts de 2012-2014 mencionan fotos ("con fotos", fotogalerías) que no se descargaron todavía — solo se leyeron las vistas de archivo por año, no cada post individual con sus imágenes. Falta una segunda pasada para eso si se necesitan esas fotos.
- `facebook/` — 10 álbumes privados de Facebook, uno por carpeta con su `media/` vacía. El login automatizado quedó frenado (la cuenta usa "Continuar con Google", no contraseña propia de Facebook) — ver `facebook/README.md` para el proceso de descarga manual.

## Cómo usar este material

Cada `notes.md` incluye la URL original y la fecha de extracción de cada fuente. Priorizá los datos concretos (fechas, roles, nombres de obras, colaboradores, salas) por sobre la prosa — esos son los hechos que después alimentan la redacción real del sitio.

## Estado / limitaciones conocidas

Ver la sección final de cada `notes.md` para las limitaciones puntuales de esa fuente. En términos generales: no se pudo descargar ningún video (no hay `yt-dlp` instalado, solo se guardaron metadata y links); algunas páginas de alternativateatral.com no mencionan a Nora explícitamente en el HTML público aunque el usuario indicó su rol de memoria (está señalado caso por caso).
