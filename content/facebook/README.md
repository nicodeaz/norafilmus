# content/facebook/ — álbumes privados

Intentamos loguear con Playwright pero la cuenta de Facebook usa login vía Google
("Continuar con Google") en vez de contraseña propia de Facebook, así que quedó frenado
del lado de las credenciales — ver conversación. Mientras tanto, la vía manual:

## Cómo descargar cada álbum

1. Entrá al link del álbum en tu Chrome (ya logueado).
2. Arriba a la derecha de la grilla de fotos hay un botón **"Descargar"** (ícono de
   flecha hacia abajo) que baja un `.zip` con todas las fotos del álbum en resolución
   original. Si no aparece esa opción, seleccioná las fotos manualmente (click derecho →
   "Guardar imagen como") o hacé click en cada una y descargala individualmente.
3. Descomprimí el `.zip` (o movés las imágenes sueltas) directamente dentro de la
   carpeta `media/` del álbum correspondiente, de la lista de abajo.
4. Si el álbum tiene una descripción, comentarios con fechas/nombres, o texto que
   pegan las fotos (quién es quién, qué obra, qué año), copialo y pegalo en un
   `notas.md` dentro de esa misma carpeta — así no se pierde el contexto que solo
   existe en Facebook.

No hace falta que hagas los 10 ahora — andá a tu ritmo, subís lo que tengas y seguimos
del resto en otra sesión.

## Álbumes

| # | Carpeta | Contexto (tal como lo describiste) | Link |
|---|---|---|---|
| 1 | `01-chicha-carmen-y-angelita-magdalena/` | Teatro Español de Magdalena, Pcia. Bs. As. — Chicha, Carmen y Angelita | https://www.facebook.com/media/set/?set=a.10201124434125924&type=3 |
| 2 | `02-variete-casa-semilla/` | Varieté, Casa Semilla | https://www.facebook.com/media/set/?set=a.10204590994747773&type=3 |
| 3 | `03-pizarniket-ensayo/` | Pizarniket, ensayo | https://www.facebook.com/media/set/?set=a.1050544296797&type=3 |
| 4 | `04-book-del-ano-del-orto/` | "Book del año del orto" | https://www.facebook.com/media/set/?set=a.1116751711941&type=3 |
| 5 | `05-programa-enamorar-baigorria-santa-fe/` | Programa Enamorar, Ministerio de la Nación, Gobernador Baigorria, Santa Fe | https://www.facebook.com/media/set/?set=a.10205652159596231&type=3 |
| 6 | `06-magdalena-detras-de-escena/` | Magdalena, detrás de escena | https://www.facebook.com/media/set/?set=a.10201124485727214&type=3 |
| 7 | `07-clases-teatro-ninos-multiespacio/` | Clases de teatro para niños en Multiespacio | https://www.facebook.com/media/set/?set=a.1508037613844&type=3 |
| 8 | `08-clases-arte-infancias-vicente-lopez/` | Clases de arte para las infancias y expresión corporal para adultos, comedor comunitario, Municipalidad de Vicente López | https://www.facebook.com/media/set/?set=a.10201646331053021&type=3 |
| 9 | `09-clases-teatro-adolescentes/` | Clases de teatro para adolescentes | https://www.facebook.com/media/set/?set=a.4445223201648&type=3 |
| 10 | `10-muestra-alumnos-marcos-paz/` | Muestra de alumnos, Marcos Paz, teatro para adolescentes | https://www.facebook.com/media/set/?set=a.10210268691726649&type=3 |

## Estado

**Actualización 2026-07-25 (segunda pasada, sesión autenticada)**: el usuario abrió el navegador (Playwright) y se logueó manualmente en Facebook con su propia cuenta — a partir de ahí, con la sesión ya autenticada, se completaron los 8 álbumes restantes de forma automatizada: por cada álbum se abrió la grilla, se extrajeron los links de foto (`facebook.com/photo/?fbid=...&set=...`), se navegó a la primera foto y se recorrieron las demás simulando la tecla flecha-derecha (lee `img[data-visualcompletion="media-vc-image"]` en cada paso para la URL en resolución completa), y se descargaron todas por `curl`. Ver los primeros 2 álbumes (identificados por contenido, ver más abajo) para la nota sobre por qué esos dos no siguieron este mismo flujo.

**Actualización 2026-07-28 (auditoría de completitud)**: el usuario pidió una pasada completa para asegurar que no quedara contenido "sin relación o sin referencia". Al revisar los 10 `notas.md` se encontró 1 foto real sin relación (álbum 3, ver abajo). Pero además, al comparar cada álbum contra el conteo oficial de elementos que muestra la página de Facebook, se descubrió que los álbumes 1 y 2 — los dos identificados por contenido, sin metadata, antes de que existiera el flujo automatizado — estaban **incompletos**: álbum 1 tenía 20 de 45 fotos reales, álbum 2 tenía 18 de 19. Se recuperaron las fotos faltantes con el mismo método de recorrido del visor usado en los álbumes 3–10, y el álbum 1 se reindexó completo en el orden real de Facebook (ver su `notas.md` para el detalle — incluye además una corrección: una foto que estaba en el álbum 1 no pertenece a él, es un duplicado que en realidad vive en el álbum 6). Los álbumes 3–10 (los automatizados desde el principio) coincidieron exactamente con el conteo oficial de Facebook, sin faltantes.

**Los 10 álbumes están completos y verificados contra el conteo oficial de Facebook.** Total: **272 fotos** en `media/` a través de los 10 álbumes, más 1 en `sin-relacion/` (`03-pizarniket-ensayo/foto-5.jpg`, foto social sin ninguna conexión con la obra/ensayo, sacada de `media/` el 2026-07-28 — ver `03-pizarniket-ensayo/notas.md`).

| # | Carpeta | Fotos | Álbum real en Facebook (título propio) |
|---|---|---|---|
| 1 | `01-chicha-carmen-y-angelita-magdalena/` | 45 (verificado contra Facebook 2026-07-28; backup de las 20 originales en `media-manual-20-backup-2026-07-28/`) | "Sábado 6 de julio - Teatro Español - Ciudad de Magdalena - Fotos: Colo Gens" |
| 2 | `02-variete-casa-semilla/` | 19 (verificado contra Facebook 2026-07-28) | (identificado por contenido — descarga manual del usuario sin metadata; fecha confirmada 11/11/2014) |
| 3 | `03-pizarniket-ensayo/` | 27 descargadas, 26 en `media/` (1 en `sin-relacion/`) | "Poseídos entre Lilas - Pizarniket mas" |
| 4 | `04-book-del-ano-del-orto/` | 15 | "Mi book algunas fotiños" |
| 5 | `05-programa-enamorar-baigorria-santa-fe/` | 40 | "De Gira por Granadero Baigorria Pcia. de Santa Fé y Rosario" |
| 6 | `06-magdalena-detras-de-escena/` | 36 | "Magdalena LADO B - Antes de la función" |
| 7 | `07-clases-teatro-ninos-multiespacio/` | 17 | "Mis alumnos en las Vacaciones de Invierno" |
| 8 | `08-clases-arte-infancias-vicente-lopez/` | 40 | "Comedor Comunitario LAS FLORES, Villa Martelli" |
| 9 | `09-clases-teatro-adolescentes/` | 22 | "Un título - una foto - un comienzo de improvisación" |
| 10 | `10-muestra-alumnos-marcos-paz/` | 11 | "Muestra Taller de Teatro en Marcos Paz" |

Cada carpeta tiene su propio `notas.md` con lo que se pudo rescatar de contexto (descripción del post, comentarios relevantes, fecha relativa que mostraba Facebook, fotógrafo si estaba acreditado — casi nunca lo estaba). El álbum 6 comparte 1 foto duplicada exacta con el álbum 1 (mismo evento, dos álbumes distintos del lado de Facebook) — se dejó en ambos lados, ver `06-magdalena-detras-de-escena/notas.md`.
