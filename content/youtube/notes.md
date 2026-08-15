# YouTube — "Que no quede Huella" (Boquitas Pintadas)

**URL**: https://www.youtube.com/watch?v=BOa9TUKMo7E
**Fecha de extracción**: 2026-07-24
**Método**: WebFetch falló (YouTube es JS-heavy, solo devolvió el footer genérico de la página). Se usó Playwright (`browser_navigate` + `browser_evaluate` sobre `window.ytInitialPlayerResponse`) para sacar metadata real.

## Descripción del usuario

El usuario describió este video como correspondiente a la obra **"Que no quede Huella"**, de la compañía **Boquitas Pintadas**.

## Metadata real extraída

- **Título del video**: `1  VideoInicioobra` (así, tal cual figura en YouTube — con doble espacio entre "1" y "Video", sin separación entre "Inicio" y "obra". Es un título mal cargado por quien subió el video, no un error de extracción; se confirmó tanto en el `<h1>` como en `ytInitialPlayerResponse.videoDetails.title`).
- **Canal**: Nora Rita Filmus (`@NoraRitaFilmus`, `channelId: UC5feUE5wJYdZverUzUOQTHw`), 20 suscriptores.
- **Fecha de subida (exacta)**: 2015-03-04T13:49:37-08:00 → **4 de marzo de 2015**.
- **Duración**: 81 segundos (1:21).
- **Vistas**: 6.
- **Descripción**: vacía — "No description has been added to this video."
- **Categoría asignada por YouTube**: "Gaming" (claramente una categoría mal asignada/automática, no tiene relación con el contenido real; no tomar como dato fiable).
- **Elenco/ficha técnica en la descripción**: no hay, la descripción está vacía. No se encontraron comentarios fijados con datos adicionales.

## Conexión con el panel de alternativateatral.com

En el historial de obras del panel privado (ver `content/alternativa-teatral-panel/notes.md`) figura una obra llamada **"Que no quede huella"** (`obra35559-que-no-quede-huella`) donde Nora participó como **Actriz, Directora**. Es muy probable que este video de YouTube (subido por su propio canal) sea material de esa obra — pero el video en sí no incluye descripción que lo confirme explícitamente, es una inferencia por coincidencia de nombre y por venir del canal personal de Nora.

## Archivo descargado

`media/que-no-quede-huella.mp4` (360p, formato progresivo 18 de YouTube, con audio — se
bajó un `yt-dlp.exe` standalone porque no había Python/pip en el entorno; no hay ffmpeg
instalado así que se pidió directamente el formato combinado en vez de video+audio
separados para mergear).

## Limitaciones
- No hay descripción ni ficha técnica en el video mismo — cualquier dato de elenco/compañía ("Boquitas Pintadas") viene de lo que indicó el usuario, no de la página.
- No se encontró información sobre "Boquitas Pintadas" como compañía en esta fuente — habría que buscarla aparte si se necesita para el sitio.
