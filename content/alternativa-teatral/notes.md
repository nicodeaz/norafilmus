# alternativateatral.com — fichas de obras (páginas públicas)

Fecha de extracción: 2026-07-24. Método: WebFetch para el texto/ficha técnica de cada obra; Playwright (`browser_evaluate`, lectura de `meta[property="og:image"]`) para las URLs de afiche, que WebFetch no devuelve porque convierte el HTML a markdown y pierde las imágenes.

**Actualización 2026-07-25**: pasada de descarga de fotos de galería. Cada ficha de obra tiene, además del afiche (`og:image`), un carrusel oculto en el HTML (`ul.rotador li.fondo.item`, atributo `data-image`) con fotos de función a resolución "original" — no aparece como pestaña/link "Fotos" navegable, hay que leer el HTML directamente. Se extrajeron y descargaron todas las URLs de ese carrusel para las 4 obras. Varias URLs del carrusel de "¡Mujeres a la obra!" devolvieron 404 real del servidor de alternativateatral.com (no es un problema de nuestra descarga — confirmado con `curl -I`, Content-Length 4959/4956 bytes, es la página de error 404 de IIS, no una imagen), es decir esas fotos ya no existen del lado de la fuente.

---

## 1. Rapiña

**URL**: https://www.alternativateatral.com/obra52672-rapina
**Rol de Nora**: actuó (elenco).

### Sinopsis
"RAPIÑA es una obra sobre lo carroñero en los vínculos humanos. La rapiña aparece como una fuerza instintiva que ronda las relaciones humanas y nos devuelve a un estado más primitivo." La obra está compuesta por cuatro piezas cortas — "Sur", "Bañera", "Fotos" y "Como las tarántulas" — que muestran la violencia sobre el cuerpo y el alma del otro en nombre del amor. Con apoyo de PROTEATRO.

### Ficha técnica
- Autoría: Leandro Airaldo, Mariana Topet
- Idea: Mariana Topet
- Dirección: Mariana Topet
- Producción general: Mariana Topet
- **Elenco**: Irene Bazzano, Victoria Bilbao, **Nora Rita Filmus**, Sandra Franzen, Santiago Luna, María Luz Morteo, Rocío Ortíz Herrera, Doris Resen, Mariel Rueda, Cristina Sallesses, Marcelo Zegalo
- Locución: Natalia Sosa
- Diseño de luces: Alejandro Vázquez
- Escenografía: Valeria Pontoriero
- Musicalización: Alejandro Marani
- Fotografía: Marcela Russarabian
- Diseño gráfico: Marcela Russarabian
- Asistencia de dirección: Marcelo Accame
- Asistencia de producción: Andrea Russarabian Holowczak
- Duración: 70 minutos. Clasificación: Teatro, Adultos.

### Fechas y temporada
Tercera temporada a partir del 2 de marzo de 2019.

### Sala / histórico de funciones
- Belisario Club de Cultura, Av. Corrientes 1624 (2019, 2018)
- Paraje Artesón (2017)

### Imagen
- Afiche (og:image): https://img.alternativateatral.com/scripts/es/fotos/obras/resumen/89/000196089.jpg
- Descargado en: `media/rapina-afiche.jpg`

### Fotos de galería (carrusel `ul.rotador`, agregado 2026-07-25)
10 fotos de función encontradas, todas descargadas en `media/`. Fotógrafa: Marcela Russarabian (créditos embebidos en el HTML del carrusel, atributo `descripcion`).
- `media/rapina-foto-1.jpg` — misma toma que el afiche (id 000196089) pero versión "original" a mayor resolución (1772×1299 vs. el resumen ya bajado). Descripción: "Rapiña. Sur."
- `media/rapina-foto-2.jpg` — "SUR." (2717×2244)
- `media/rapina-foto-3.jpg` — "SUR." (2717×2244)
- `media/rapina-foto-4.jpg` — "BAÑERA." (2717×2244)
- `media/rapina-foto-5.jpg` — "BAÑERA." (2717×2244)
- `media/rapina-foto-6.jpg` — "FOTOS." (2717×2244, nombre de la pieza corta, no metadato de la foto)
- `media/rapina-foto-7.jpg` — "FOTOS." (2717×2244)
- `media/rapina-foto-8.jpg` — "COMO LAS TARÁNTULAS." (960×681)
- `media/rapina-foto-9.jpg` — "COMO LAS TARÁNTULAS." (960×681)
- `media/rapina-foto-10.jpg` — sin descripción específica, foto de función (1417×1063)

---

## 2. Los golpes de Clara

**URL**: https://www.alternativateatral.com/obra50130-los-golpes-de-clara
**Rol de Nora**: produjo (Producción Ejecutiva).

### Sinopsis
"La obra aborda, desde la comedia, la historia de Clara, una mujer que, atravesada por una situación de violencia decide entrenar boxeo en su casa. Separada, desocupada y jefa de hogar, Clara se reúne con otras mujeres que también dan pelea en el 'ring doméstico' para re-direccionar las violencias que reciben." "A partir de los entrenamientos de boxeo, la protagonista gesta y lidera una cuadrilla de mujeres para salir a boxear a 'tanto jodido suelto'. Clara se apropia de las palabras y pone en juego los estereotipos de género y de clase tan arraigados en el imaginario colectivo. Los golpes de Clara transforma el dolor en humor y nos invita a reflexionar y re-pensar estos estereotipos con los que convivimos cotidianamente."

### Ficha técnica
- Dramaturgia y dirección: Leandro Rosati
- Texto: Carolina Guevara
- Elenco: Carolina Guevara (actúa, unipersonal)
- Vestuario: Julieta Grinspan
- Escenografía: Alfredo Aguirre, Marcos Peruyero
- Música original: Mariano Travella
- Fotografía: Nicolás Finoli
- Asistencia técnica: Alfredo Aguirre, Marcos Peruyero
- **Producción ejecutiva: Nora Rita Filmus**
- Producción en gira: Alejandra García
- Duración: 50 minutos. Clasificaciones: Adultos, Comedia, Artes Escénicas, Unipersonales.

### Histórico de funciones (sala — años)
- Cuatro Elementos (2025)
- Espacio Cultural La Fragua (2024)
- UOCRA Cultura (2023)
- CELCIT (2020, 2018)
- El Sábato Espacio Cultural — Económicas UBA (2019)
- Centro Cultural de la Cooperación (2018, 2017)
- Centro Cultural Municipal - Sociedad Italiana (2018)
- Espacio Tole Tole Teatro (2018)

### Festivales y eventos
- IV Festival Humoris Causa
- Festival de Teatro Rafaela 2018
- Ciclo de Unipersonales Perspectivas 5
- ¡Mujeres a la obra! 1° ciclo de teatro y feminismos (ver obra siguiente)
- Escenarias 2019 (mujeres que hacen la escena contemporánea)

### Imagen
- Afiche (og:image): https://img.alternativateatral.com/scripts/es/fotos/obras/resumen/57/000222257.jpg
- Descargado en: `media/los-golpes-de-clara-afiche.jpg`

### Fotos de galería (carrusel `ul.rotador`, agregado 2026-07-25)
4 fotos encontradas en el carrusel, las 4 descargadas en `media/`.
- `media/los-golpes-de-clara-foto-1.jpg` — misma toma que el afiche (id 000222257) en versión "original" (960×640)
- `media/los-golpes-de-clara-foto-2.jpg` — foto de función distinta (960×640)
- `media/los-golpes-de-clara-foto-3.jpg` — foto de función, resolución menor (243×360, probablemente un thumbnail que quedó en el carrusel)
- `media/los-golpes-de-clara-foto-4.jpg` — foto de función, resolución menor (544×360)

---

## 3. ¡Mujeres a la obra! 1º ciclo de teatro y feminismos

**URL**: https://www.alternativateatral.com/obra61620-mujeres-a-la-obra-1-ciclo-de-teatro-y-feminismos
**Rol de Nora**: produjo.

### Descripción general
Ciclo de seis obras breves sobre vivencias y luchas femeninas, organizado en Alternativa. Comunidad en escena. Cita de la convocatoria: "actrices, directoras, dramaturgas, gestoras, asistentes, productoras nos juntamos para celebrar nuestras luchas", buscando poner en escena "memorias grabadas en nuestros cuerpos" durante el mes que conmemora el Día Internacional de la No Violencia hacia las Mujeres.

### Obras del ciclo
- **Viernes 16/11, 20:00 — "Están lloviendo hombres"** (25 min). Con Lucía Adúriz y Mariela Asensio. Dirección: Mariela Asensio.
- **Viernes 16/11 (horario posterior) — "Esa niña"** (35 min). Con Maia Lancioni. Dirección: María Lucila Quarleri.
- **Sábado 17/11, 20:00 — "Rosa del Desierto"** (55 min). Con Verónica Heguy y Lidia Volpe. Dramaturgia y dirección: Claudia Quiroga.
- **Sábado 17/11, 22:30 — "Rayito de Sol"** (55 min). Con Leticia Torres. Dirección: Cintia Miraglia. Texto: Natalia Villamil.
- **Domingo 18/11, 22:00 — "Maldichas"** (60 min). Actuación y dirección: Daniela Carballo, Lara Hernaiz, Lena Zapata.
- **Lunes 19/11, 18:00 — "Descansa"** (60 min). Con Verónica Cognioul Hanicq, Susy Figueroa, Romina Oslé. Dramaturgia y dirección: Pilar Ruiz.
- **Lunes 19/11, 20:00 — "Los golpes de Clara"** (60 min). Texto y actuación: Carolina Guevara. Dramaturgia y dirección: Leandro Rosati. (Ver ficha completa arriba — Nora produjo esta obra específica también fuera del ciclo).

### Ficha técnica del ciclo
- Dirección: Mariela Asensio, Daniela Carballo, Lara Hernaiz, Cintia Miraglia, María Lucila Quarleri, Claudia Quiroga, Pilar Ruiz, Lena Zapata
- Dramaturgia: Claudia Quiroga, Leandro Rosati, Pilar Ruiz, Natalia Villamil
- Textos: Mariela Asensio, Carolina Guevara, María Lucila Quarleri
- Elenco: Lucía Adúriz, Mariela Asensio, Daniela Carballo, Verónica Cognioul Hanicq, Susy Figueroa, Carolina Guevara, Verónica Heguy, Lara Hernaiz, Maia Lancioni, Romina Oslé, Leticia Torres, Lidia Volpe, Lena Zapata
- Vestuario: Maricel Aguirre, Julieta Grinspan, Eliana Itovich, Paula Molina
- Escenografía: Alfredo Aguirre, Maricel Aguirre, José Escobar, Eliana Itovich
- Iluminación: Sebastián Evangelista, Lucía Feijoó, Víctor Guidoli
- Diseño sonoro: Petra Donn, Pedro Donnerstag
- Música: Pilo García, Daniel Quintas, Mariano Travella
- Fotografía: Hersilia Alvarez, Federico Barreña, Nicolás Finoli Blanco, Gustavo Pascaner, Adrián Sosa Escalada
- Asistencia general: Alfredo Aguirre, Micaela Arditi, Paola Luttini, Florencia Peralta, Marcos Peruyero, Natalia Villamil
- **Producción**: Victoria Carrión, **Nora Rita Filmus**, Bárbara García Di Yorio, Marina Kryzczuk, Andrea Villamayor, LugarOtro Estudio Teatral, Poética Resiliencia
- Supervisión dramatúrgica: Maruja Bustamante, Camila Mansilla, Eugenia Pérez Tomás

### Fechas y sala
16 al 19 de noviembre (2018). Sala: CELCIT.

### Enlaces
- Sitio del ciclo: http://celcit.org.ar/espectaculos/172/mujeres-a-la-obra-1-ciclo-de-teatro-y-feminismos./

### Imagen
- Afiche (og:image): https://img.alternativateatral.com/scripts/es/fotos/obras/resumen/00/000191700.jpg
- Descargado en: `media/mujeres-a-la-obra-afiche.jpg`

### Fotos de galería (carrusel `ul.rotador`, agregado 2026-07-25)
El carrusel listaba 14 entradas, pero **10 de esas 14 URLs devuelven 404 real del servidor** de alternativateatral.com (verificado con `curl -I`: Content-Type `text/html`, Content-Length 4959/4956 bytes = página de error IIS, no una imagen — las fotos fueron borradas o movidas del lado de la fuente, no es un problema de nuestro método de descarga). Solo 4 de las 14 URLs listadas resolvieron a una imagen real; esas 4 están descargadas:
- `media/mujeres-a-la-obra-foto-1.jpg` — misma toma que el afiche (id 000191700) en versión "original" (1251×1459)
- `media/mujeres-a-la-obra-foto-2.jpg` — foto de función distinta (id 000191489, 1000×667, EXIF Canon EOS 6D, 2016-02-23 — nota: esta fecha es anterior a las funciones de noviembre 2018 del ciclo, podría ser una foto reciclada de otra puesta de alguna de las obras del ciclo)
- `media/mujeres-a-la-obra-foto-3.jpg` — foto de función (id 000191488)
- `media/mujeres-a-la-obra-foto-4.jpg` — foto de función (id 000191501)

Los 10 ids que dieron 404 (para referencia, por si en el futuro vuelven a estar disponibles del lado de la fuente): 000191492, 000191491, 000191497, 000191490, 000191496, 000191495, 000191498, 000191493, 000191499, 000191494.

---

## 4. Improvisación Mosquito

**URL**: https://www.alternativateatral.com/obra7489-improvisacion-mosquito
**Rol de Nora**: asistencia de producción (según indicación del usuario — **ver limitación abajo, no aparece en la ficha pública**).

### Sinopsis
"¡Bienvenido al único espectáculo donde vos sos el impulsor de ideas!" Show de improvisación teatral con dos equipos (azul y rojo) en competencia. Los espectadores escriben propuestas al ingresar que determinan estilos, frases y desafíos de las improvisaciones. "Un match teatral presentado y dirigido por 'Mosquito' Sancineto en un show donde no vas a poder parar de reír en base a las propuestas que vos mismo escribís." El público vota al finalizar cada propuesta. Incluye invitados especiales como padrinos de cada equipo. Más de 900.000 espectadores acumulados históricamente.

### Ficha técnica
- Dirección: Fabio "Mosquito" Sancineto
- Elenco: Vedette, Natalia Barbieri, Jorgelina Belardo, Lucas Cargnel, Florencia Chena, Gastón Cordera, Sofía Cuccarese, Agustín del Valle, José Luis Escobar, Luis María Ottonello, Lucho Rossetto, Fabio Mosquito Sancineto, Mariana Ucelli, Madame Vanguardia
- Vestuario: Gabriela Ohlobiak, Ginger Ropa Vintage
- Multimedia: Demetrio Arias, Nahuel González Mosca, Agustín Pablo
- Músico en escena: Pablo Viotti
- Asistencia general: Nati Pessagno
- Duración: 70 minutos. Clasificaciones: Improvisación, Artes Escénicas, Adultos.

### Funciones y temporada
- Teatro El Popular, Chile 2080, CABA — domingos 20:00 hs (hasta 26/07/2026), sábado 20:30 hs (01/08/2026). Reservas: 1169135757.
- Teatro El Tinglado (2026)
- Teatro Carlos Carella (2025)
- "5 únicas funciones para nuestros especiales" (mención en la página, sin más detalle)

### Contacto / redes
- Instagram: instagram.com/impromosquitook
- Instagram del teatro: instagram.com/teatroelpopular/

### Imagen
- Afiche (og:image): https://img.alternativateatral.com/scripts/es/fotos/obras/resumen/51/000315351.jpg
- Descargado en: `media/improvisacion-mosquito-afiche.jpg`

### Fotos de galería (carrusel `ul.rotador`, agregado 2026-07-25)
**Sin fotos adicionales, solo afiche.** El carrusel de esta obra tiene una sola entrada y es exactamente la misma imagen que el afiche (id 000315351) — se revisó explícitamente, no se salteó. No se descargó ningún archivo nuevo para esta obra.

### Limitación importante
Se verificó con `browser_evaluate` (búsqueda de "Filmus"/"Nora" en `document.body.innerText`) que **el nombre de Nora no aparece en ningún lugar del HTML de esta página** — ni en elenco ni en créditos técnicos. Es probable que sea una obra donde participó de forma no acreditada en la ficha pública del sitio, o que la ficha esté desactualizada. El rol "asistencia de producción" viene únicamente de lo que indicó el usuario, no de la fuente. Vale la pena confirmarlo con Nora directamente antes de usarlo como dato de trayectoria en el sitio.

---

## Notas generales / limitaciones de esta fuente

- Las fechas "histórico de funciones" reflejan temporadas/años en que se repuso cada obra en distintas salas, no necesariamente una única fecha de estreno.
- **Actualización 2026-07-25 (galerías de fotos)**: la nota anterior de esta sección decía que ninguna de las 4 páginas tenía fotos más allá del afiche — eso era incorrecto, la galería sí existe pero está en un carrusel oculto en el HTML (`ul.rotador li.fondo.item[data-image]`) que no se ve como link/pestaña navegable, solo corriendo `browser_evaluate` sobre el DOM. Se revisaron las 4 obras: Rapiña (10 fotos), Los golpes de Clara (4 fotos), ¡Mujeres a la obra! (4 fotos válidas de 14 listadas, 10 dan 404 real en el servidor de la fuente) e Improvisación Mosquito (0 fotos adicionales, confirmado que el carrusel solo repite el afiche). Total: 18 fotos nuevas descargadas en `media/`. Ver el detalle en la sección de cada obra arriba.
