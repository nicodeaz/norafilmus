# norafilmus.blogspot.com — relevamiento completo del blog viejo

**Fecha de extracción original**: 2026-07-24 (solo páginas de archivo por año, resúmenes, sin fotos).
**Fecha de esta pasada completa**: 2026-07-25. **Método**: Playwright (`browser_navigate` + `browser_evaluate`) sobre cada post individual — WebFetch no sirve acá porque convierte el HTML a markdown y pierde los `src` reales de las imágenes. Se abrieron las 6 vistas de archivo por año (2009 a 2014) para levantar la lista completa de URLs de post, y después se abrió cada uno de los 34 posts individualmente para sacar el texto completo (tal cual está escrito, sin resumir) y descargar todas las fotos embebidas.

El blog está confirmado como de Nora Filmus por dos vías: lo describe ella misma en el "About" (actriz, directora, docente teatral) y su URL (`http://norafilmus.blogspot.com.ar/`) figura como "Web" en su perfil del panel de alternativateatral.com (ver `content/alternativa-teatral-panel/notes.md`).

**Total**: 34 posts entre 2009 y 2014 (2009: 2 · 2010: 1 · 2011: 4 · 2012: 11 · 2013: 11 · 2014: 5). No se encontraron años/posts fuera de ese rango en la navegación (alcance pedido explícitamente 2009-2014). **76 fotos nuevas descargadas** en `media/<año>/<slug-del-post>/foto-N.jpg`; todas verificadas con `file` como imágenes JPEG/PNG reales, ninguna es una página de error. Las fotos se descargaron intentando primero la versión de mayor resolución disponible en Blogger (reemplazando el segmento `/sNNN/` de la URL por `/s0/`, que en Blogger devuelve el original sin recortar) y, si esa variante fallaba, se usó la URL tal cual apareció en la página.

Cuando un post no tenía fotos, se dice explícitamente "sin fotos". Los dos posts de 2009 no tienen fotos; ningún año se quedó sin ningún post con fotos.

Nota sobre embebidos que NO se descargaron (fuera de alcance de esta tarea, según instrucción explícita de no re-scrapear YouTube, y los videos no son "fotos"): tres posts tienen video embebido en vez de o adicional a fotos — "Ya están los Clips de Chicha, Carmen y Angelita!!!" (2012, 2 videos de YouTube), "Video del Taller en Multiesapacio1914" (2012, 1 video de YouTube) y "Clip Chicha, Carmen y Angelita" (2013, 1 video nativo de Blogger, no YouTube). Se anota el link del embed en cada caso por completitud, pero no se descargó el archivo de video.

---

## 2009

### "Kantor - Grotowski" — miércoles 11 de marzo de 2009

**URL**: https://norafilmus.blogspot.com/2009/03/kantor.html
**Fotos**: sin fotos.

**Texto completo:**

> 1. Credo
>
> Una obra de teatro no se mira como se mira un cuadro por las emociones estéticas que procura: se la vive en concreto.
> No tengo ningún canon estético, no me siento sujeto a los tiempos pasados, no los conozco y no me interesan. Solo me siento comprometido con esta época en que vivo y con la gente que vive a mi lado. Creo que un todo puede contener al mismo tiempo barbarie y sutileza, tragedia y risotada, que un todo nace de contrastes y cuando mas importantes son esos contrastes, mas ese todo es palpable, concreto, vivo.
> Extracción del libro ¨Teatro de la muerte¨ de Tadeusz Kantor. Ediciones de la Flor
>
> Educar a un actor en nuestro teatro no significa enseñarle algo, tratamos de eliminar la resistencia que su organismo opone a los procesos psíquicos. El resultado es una liberación que se produce en el paso del impulso interior a la reacción externa, de tal modo que el impulso se convierte en reacción externa. El impulso y la acción son concurrentes: el cuerpo se desvanece, se quema, y el espectador solo contempla una serie de impulsos visibles. La nuestra es una vía negativa, no una COLECCION DE TÉCNICAS, si no la DESTRUCCIÓN DE OBSTÁCULOS.
> Hay algo incomparablemente íntimo y productivo en el trabajo que realizo con el actor que se me ha confiado. Debe ser cuidadoso, confiado y libre, porque nuestra labor significa explorar sus posibilidades hasta el máximo, su crecimiento se logra por observación, sorpresa y deseo de ayudar, el conocimiento se proyecta hacia él, o mas bien, se encuentra en él y nuestro crecimiento común se vuelve la revelación. El actor vuelve a nacer, no solo como actor si no como hombre y con él yo vuelvo a nacer. Es una manera muy torpe de expresarlo pero lo que se logra es la total ACEPTACION DE UN SER HUMANO POR OTRO.
> Fragmentos de ¨Hacia un Teatro Pobre¨ de Jerzy Grotowzki

Contenido de referencias/formación teórica (citas de Kantor y Grotowski), no biográfico directo.

---

### "Experiencia y Formación" — miércoles 11 de marzo de 2009 — **ALTO VALOR PARA EL SITIO**

**URL**: https://norafilmus.blogspot.com/2009/03/educar-al-actor-en-el-teatro-de-jerzy.html (el slug de la URL no coincide con el título real del post, que es "Experiencia y Formación")
**Fotos**: sin fotos.

Es un CV completo escrito y curado por ella misma. Reproducido tal cual, palabra por palabra (incluye erratas/tildes tal como están en el original):

> **Experiencia docente**
>
> 2012: Federación de Instituciones Comunitarias de Bs. As.
> F.I.C.B.A Asociación Civil - "Programa Adolescencia" - Taller de teatro para adolescentes.
> Programa sustentado por el gobierno de la Ciudad a través de Asociaciones Civiles – ONG.
>
> 2010 a la fecha: Multiespacio 1914 – Villa Crespo/Caballito – Capital Federal
> Taller de teatro para niños – Jornadas teatrales de vacaciones
>
> 2008 – 2009 Espacio Los Ranz – San Telmo – Capital Federal
> Taller de teatro para niños de nivel inicial y primario
>
> 2002 – 2004 Centro Cultural el Sueñero – San Telmo - Capital Federal
> Teatro para niños, adolescentes y adultos.
>
> 2001 – 2003 Museo de Apóstoles (Misiones).
> Talleres de recreación Teatral de verano para niños y adolescentes.
>
> 2001 – 2002 Centro Cultural de la Cooperación – Sede Maipú
> Talleres interdisciplinarios para adolescentes y adultos
> Coordinados por el artista plástico Aníbal Cedrón.
>
> **Otras experiencias como docente**
>
> 2012: Federación de Instituciones Comunitarias de Bs. As.
> - Operadora Social en talleres del "Programa Adolescencia"
> - Tutora de alumnos secundarios.
>
> **Experiencia Actoral**
>
> 2013 "Chicha, Carmen y Angelita" — Teatro Liberarte Bodega Cultural — Creación colectiva — Actualmente en cartel.
>
> 2011 - 2012 Varietés del circuito off. Actuación en distintas varietés con el personaje "Las Chicas de Flores". Sobre el texto Exvoto de Oliverio Girondo.
>
> 2010 – 2011 La Comuna Orgón de Marcelo Subiotto. Funciones realizadas en el Teatro Puerta Roja, una producción del Colectivo Teatral Puerta Roja. Dirección: Marcelo Subiotto. Grupo los Poseídos.
>
> 2009 – 2010 Pizarn-i-kett Mas? Un Híbrido a la fuerza. Dirección Gladis Huertos. Teatro Puerta Roja (Cap. Fed.) – Teatro El Refugio (Banfield). Dirección: Gladys Huertos.
>
> 2008 - Los Poseídos entre Lilas de Alejandra Pizarnik. Dirección Gladis Huertos. Universidad de Belgrano (Intercambio Universitario).
>
> 2009 – Interpretación de textos de Oliverio Girondo y E. S. Discépolo en Variteté Maravilla en espacio Alicia Maravilla. Creación Colectiva.
>
> 1998 – 2007 Grupo Los Ranz. Espectáculos: Inténtalo otra vez - Animal Tango - Tanga Catanga - Azúcar Pimienta y Sal - Luna en los Charcos - Chagall para niños. Espacios donde fueron representados: Teatro Colón de Bs. As. – AMIA - Centro Cultural Recoleta - S.A.D.R.A. - M.A.C.A.B.I - Espacio Gieso Reich - Pale de Glace - Teatro Leopoldo Marechal de Ramos Mejía - Biblioteca J. B. Alberdi - Teatro Payró de Banfield - Auditorio Asociación Bancaria entre otros. Dirección: Ricardo Ale y Nicolás Zoric.
>
> Septiembre 2002 - "Voyage, danza y Poesía" — Interpretación de textos de Alfonsina Storni. Dirección: Paula Monteagudo - en la Biblioteca J.B. Alberdi.
>
> Julio 2001 - Grupo Tete a Tete — Intervención interdisciplinaria en la muestra plástica "Foco de Resistencia" — Centro Cultural de la Cooperación Sede Maipú 73 — Dirección artística de la muestra: Aníbal Cedrón. Performance: "Argentina Oid Mortales" — Actuación y dirección: Mariel Rueda – Nora Filmus.
>
> 1996 Primer Campeonato Amateur de MATCH de Improvisación en espacio Liberarte — Dirección: Fabio Mosquito Sancineto – L.I.R.A.
>
> **Experiencia en Dirección Teatral**
>
> 2010 – 2011 Dirección del Show de humor "Chicha, Carmen y el Músico" — Funciones en: Libario Bar – Bulnes & Lavalle Pub - Eventos privados – Bs. As. Parador San Francisco en Piriápolis – Uruguay. La terraza de los Búhos en Punta del Diablo - Uruguay.
>
> 2009 – 2011 Asistencia de Dirección en "Amentia" de Marcelo Subiotto. Colectivo Teatral Puerta Roja - Teatro Puerta Roja.
>
> 2009 – 2010 Dirección de "Peluquería" — Creación Colectiva — El Metejón Teatro en la Ciudad de Bs. As.
>
> 2006 Asistencia de Dirección en la obra "Melodía de Mar equivocado" de Gerardo David Cristante – Teatro de la Fábula. Dirección de Gladis Huertos.
>
> 2004 Dirección "El último" de Haroldo Conti (adaptación libre del cuento) en Espacio Ranz.
>
> 2003 y 2004 Dirección de "El cuarto oscuro" y "No puedo imaginar el mañana" de Tennesse Williams — IUNA.
>
> **Actuación en Cine**
>
> Participación en cortos de estudiantes de la carrera de Diseño de imagen y sonido de la UBA, y de la Escuela de Cine de Olivos.
>
> 2009 – Productora: CRISTALDI PICTURES — Producción Italiana para la RAI: "Un pugno e un bacio" — Bolos por Extra.
>
> 2008 - Productora Disney Latinoamérica: "High School Musical" (versión México) – Bolos por Extra.
>
> **Publicidad**
>
> 2011 – Productora: Nah Contenidos — Disney Chanel – Muppets donde Reina el Caos.
>
> **Diseño de Vestuario**
>
> 2012 – Productora: Cabala Estudio — Fotonovela "El Feo" (en producción) www.cabalaestudio.com — Rol: Diseñadora de vestuario.
>
> **Formación artística y pedagógica**
>
> 2011 - Taller experimental de diseño de vestuario - Dramaturgia de la Indumentaria — Profesora: Gabriela Aurora Fernández - ARGENTORES.
>
> 2007 – 2010 Entrenamiento actoral y Montaje — Profesor: Marcelo Subiotto - Puerta Roja.
>
> 2001 – 2004 Licenciatura en Dirección Escénica - I.U.N.A. (Ex Conservatorio de arte dramático). Docentes: Rubén Szuchmacher - Andrés Bazalo - José Cáceres – G. Bonamino.
>
> 1999 – 2000 Entrenamiento Actoral Tadashi Suzuki — Profesora: Marisa Salas - Teatro Templum.
>
> 1995 – 1998 "Formación del Actor" en la Escuela Integral de Teatro I.F.T. Actuación a cargo de Eduardo Pávelic. Expresión y entrenamiento corporal a cargo de Hector Beacón. Técnica vocal a cargo de Carlos De Martino y Victoria Rodríguez Claros.
>
> 1992 – 1994 Match de improvisación — Profesor: Fabio Mosquito Sancineto - Centro Cultural Ricardo Rojas.
>
> 1992 – 1993 Actuación I y II — Profesor: Eduardo Pávelic. Sala Alberdi del Centro Cultural G. San Martín.
>
> 1990 Taller de teatro para adolescentes y adultos — Profesora: Alicia Aller.
>
> **Seminarios – Work Shops**
>
> 2012 - Danza Contemporánea. Profesor: Daniel Vulliez — I.U.N.A - Artes del Movimiento.
>
> 2011 – Dramaturgia de Emergencia — Profesor: Mauricio Kartún - Centro de Experimentación del Teatro Colón.
>
> 2010 - Gestión en Artes performáticas, taller dictado por Profesor: Rubén Szuchmacher - Teatro Kafka. Con el apoyo de la Oficina Cultural de la Embajada de España.
>
> 2009 – El método de trabajo Vivarium Studio's Biographi — Profesor: Philippe Quesne - Paris / France — CELCIT - Dentro del marco del Festival Internacional de Teatro 2009.
>
> Octubre 2006 Dramaturgia del actor. El cuerpo en escena/ La voz como acción. — Profesor: Diego Starosta - El Muererio Teatro.
>
> Noviembre 2006 La voz – Docente: Guillermo Angelleli. - El Muererio Teatro.
>
> 2003 – Danza Contemporánea - Entrenamiento: Profesora: Iris Scaccheri.
>
> 2000 - Danza Butho. Profesor: Gustavo Collini Sartor.
>
> 2000 - "El teatro: Territorio en guerra" seminario dictado en la Facultad de Derecho U.B.A. Pedagogía por Daniel Casablanca y Ricardo Bartís. Producción Teatral por Gustavo Schraier. El Teatro Periférico por Daniel Veronese.

**Nota de relevancia**: este post es prácticamente un CV curado por ella misma en 2009 (con una actualización posterior hasta 2013 visible en las entradas más recientes de cada sección, p.ej. menciona "Chicha, Carmen y Angelita" de 2013), y amplía/cruza lo que ya se sacó del panel de alternativateatral.com. Es la fuente más completa de toda esta investigación sobre formación y trayectoria temprana (1990-2013).

---

## 2010

### "AMENTIA de Marcelo Subiotto" — sábado 24 de julio de 2010

**URL**: https://norafilmus.blogspot.com/2010/07/amentia-de-marcelo-subiotto.html
**Fotos**: 1 — `media/2010/amentia-de-marcelo-subiotto/foto-1.jpg`

**Texto completo:**

> "Nosotras venimos de otro lado, de otro viento, de otro costado. Tenemos otro cielo, otros bosques, ojos raros. Cargamos los sentidos hasta el borde, sangramos los zapatos, aullamos. Nuestros cuerpos son la encarnación de un silencio oscuro. Un silencio dentro del silencio. Si todas reímos la luna canta. Si el cielo cierra los ojos todas desaparecemos. Menos el silencio. Es una condena que está bien clara"
>
> "Amentia" de Marcelo Subiotto
> Julieta Graziani- Verónica Gonzalez - Lucía Rodriguez - Sylvia Tavcar - Maru Waldhuter
> Diseño de luces: Adrián Canale
> Diseño Gráfico: Adrián Celano
> Asistencia de Dirección: Nora Filmus
>
> Dirección: Marcelo Subiotto
> Una Producción del Colectivo Teatral Puerta Roja - Teatro Puerta Roja
>
> Tres temporadas en Puerta Roja
> Funciones en
> "El Club de Teatro" - Mar del Plata
> "Sala Luis Franco" - San Miguel de Tucumán
> "Teatro Enrique Santos Discépolo" - Morón
> "Festival Ecunhi" - Bs. As.
>
> http://amentiamentia.blogspot.com.ar/

---

## 2011

### "PIZARN-I-KETT MAS?" — lunes 21 de febrero de 2011

**URL**: https://norafilmus.blogspot.com/2011/02/pizarn-i-kett-mas.html
**Fotos**: 1 — `media/2011/pizarn-i-kett-mas/foto-1.jpg`

**Texto completo:**

> Los Poseídos entre lilas
> (¿o Final de Partida?)
> ALEJANDRA PIZARNIK
> (¿o SAMUEL BECKETT?)
> ¿y qué más?
> ¡¿??!
>
> Ironía, humor y absurdo.
> En esta obra Pizarnik, parafraseando a Beckett y a sí misma, nos lleva "fuera de escena", donde la transgresión en el lenguaje reside más en el significante que en el significado.
> Los temas de la infancia, la farsa, la muerte, lo indecible a través de las palabras son recurrentes y su obsesión transgresora la conduce a tocar lo grotesco y lo obsceno en su sentido más amplio.
> Sus personajes actúan como marionetas que se burlan del código social y sexual.
> El texto es una crítica irónica a la incomunicación y la soledad del individuo.
> Es una realidad traducida a pesadilla. Una disquisición sobre la muerte.
> Esta obra cuenta con el apoyo del INSTITUTO NACIONAL DEL TEATRO
>
> Ficha técnico artística
> Actúan: Nora Filmus, Miguel Angel Gorini, Alejandro Massari, Alejandro Zacchinga
> Vestuario: Carolina Ortiz
> Escenografía: Carolina Ortiz
> Caracterización: Nora Filmus
> Maquillaje: Nora Filmus
> Diseño de luces: Luciana Giacobbe
> Diseño sonoro: Miguel Angel Gorini
> Diseño gráfico: Miguel Angel Gorini
> Dirección: Gladys Huertos

---

### "Chicha, Carmen y el Músico" de Exportación — lunes 21 de febrero de 2011

**URL**: https://norafilmus.blogspot.com/2011/02/chicha-carmen-y-el-musico-en-uruguay.html
**Fotos**: 1 — `media/2011/chicha-carmen-y-el-musico-en-uruguay/foto-1.jpg`

**Texto completo:**

> Verano 2011 - Uruguay
>
> Parador San Francisco - Piriápolis
>
> La terraza de los Búhos - Punta del Diablo

---

### "Chicha Carmen y el Músico" en Libario BAR — lunes 21 de febrero de 2011

**URL**: https://norafilmus.blogspot.com/2011/02/chicha-carmen-y-el-musico-en-libario.html
**Fotos**: 1 — `media/2011/chicha-carmen-y-el-musico-en-libario-bar/foto-1.jpg`

**Texto completo:**

> "Chicha, Carmen y el Músico"
>
> Show de humor
> Creación colectiva
>
> Lara Hernaiz - Martín Elter - María Rastelli
>
> Dirección: Nora Filmus
>
> Producción: Las tres
>
> Funciones en: Libario Bar - Bulnes y Lavalle Pub
> Eventos particulares
>
> Buenos Aires Argentina

---

### "La Comuna Orgón" — lunes 21 de febrero de 2011 **(pedida específicamente por el usuario en la pasada anterior)**

**URL**: https://norafilmus.blogspot.com/2011/02/la-comuna-orgon.html
**Fotos**: 1 — `media/2011/la-comuna-orgon/foto-1.jpg`

**Texto completo:**

> "La Comuna Orgón" de Marcelo Subiotto
>
> Nora Filmus - Julieta Graziani - Lara Hernaiz
> María Rastelli - Lucía Rodriguez - Sylvia Tavcar
>
> Dirección: Marcelo Subiotto
>
> Una Producción del Colectivo Teatral Puerta Roja

Coincide con la entrada del panel de alternativateatral.com ("La comuna Orgon", obra18815, rol: Actriz) y con la bio del panel (2010-2011, Dirección: Marcelo Subiotto).

---

## 2012

### "Estreno de Chicha, Carmen y Angelita en el 2013!" — lunes 31 de diciembre de 2012

**URL**: https://norafilmus.blogspot.com/2012/12/estreno-de-chicha-carmen-y-angelita-en.html
**Fotos**: 1 — `media/2012/estreno-de-chicha-carmen-y-angelita-en-el-2013/foto-1.jpg` (afiche)

**Texto completo:**

> Chicha, Carmen y Angelita es un espectáculo de humor donde la teatralidad es la protagonista.
> Los tres personajes te llevarán por situaciones y lugares insólitos, te revelarán sus sueños y confesarán sus deseos con humor y alegría garantizada.
>
> María Rastelli - Lara Hernaiz - Nora Filmus
> Coreografías: Silvina Riopa
> Fotografía: Fernando Gens
> Diseño Gráfico: Adrian Celano www.sobrelafaz.com
> Dramaturgia y Puesta en escena: Rastelli, Hernaiz, Filmus
>
> Estrenamos el Jueves 3 de enero (estaremos todos los jueves de enero)
> Horario: 23 hs.
> LIBERARTE BODEGA CULTURAL - http://www.liberarteteatro.com.ar/
> Av. Corrientes 1555 C.A.B.A.
> Reservas: 4375-2341
> Localidades: $60.-
>
> Los espero!!!

---

### "Agradecimientos" — lunes 31 de diciembre de 2012

**URL**: https://norafilmus.blogspot.com/2012/12/agradecimientos.html
**Fotos**: 1 — `media/2012/agradecimientos/foto-1.jpg`

**Texto completo:**

> Agradezco en este 2012 que se va a todos mis alumnas y alumnos del taller de teatro en F.I.C.B.A y en Multiespacio 1914, gracias por brindarme tanto y ayudarme a crecer día a día como docente y espero que el 2013 nos encuentre otra vez para seguir creciendo juntos.

---

### "Chicha, Carmen y Angelita en PARANOLIMARTES" — domingo 7 de octubre de 2012

**URL**: https://norafilmus.blogspot.com/2012/10/chicha-carmen-y-angelita-en.html
**Fotos**: 6 — `media/2012/chicha-carmen-y-angelita-en-paranolimartes/foto-1.jpg` a `foto-6.jpg` (la fotogalería de la gira al norte)

**Texto completo:**

> Esta vez estuvimos por los lares del Norte!

---

### "Ya están los Clips de Chicha, Carmen y Angelita!!!" — sábado 25 de agosto de 2012

**URL**: https://norafilmus.blogspot.com/2012/08/httpwww.html
**Fotos**: sin fotos. Contiene 2 videos embebidos de YouTube (no descargados, fuera de alcance): `https://www.youtube.com/embed/KfO1X3uv80A` y `https://www.youtube.com/embed/cFAT5jBuojE`.

**Texto completo:**

> Trío Humorístico
> Chicha: María Rastelli - Carmen: Lara Hernaiz - Angelita: Nora Filmus
> Productora: Puerta 3

---

### "Debut de 'Chicha, Carmen y Angelita' en Pasaje casa del arte - Capital" — viernes 24 de agosto de 2012

**URL**: https://norafilmus.blogspot.com/2012/08/debut-de-chicha-carmen-y-angelita-en.html
**Fotos**: 8 — `media/2012/debut-de-chicha-carmen-y-angelita-en-pasaje-casa-del-arte/foto-1.jpg` a `foto-8.jpg`

**Texto completo:** el post no tiene cuerpo de texto, es solo el título y la fotogalería del debut en Capital Federal.

---

### "Vacaciones de Invierno !!" — miércoles 4 de julio de 2012

**URL**: https://norafilmus.blogspot.com/2012/07/ya-llegan-las-vacaciones-de-invierno-y.html
**Fotos**: sin fotos.

**Texto completo:**

> Ya llegan las vacaciones de invierno y en Multiespacio 1914, donde doy las clases de teatro para chicos estamos inscribiendo para las actividades que ofrecemos
> Música
> Arte
> Cocina para chicos
> Baile
> y muchos cosas mas entre ellas no faltará el Teatro!!!!
> aquí el link del blog con el cronograma.
> Los espero!!
> http://www.multiespacio1914.blogspot.com.ar/

---

### "'El Feo' - Fotonovela - Cabala Estudio" — domingo 3 de junio de 2012

**URL**: https://norafilmus.blogspot.com/2012/06/el-feo-fotonovela-cabala-estudio.html
**Fotos**: 1 — `media/2012/el-feo-fotonovela-cabala-estudio/foto-1.jpg` (plantilla/portada del proyecto)

**Texto completo:**

> "El Feo" - Fotonovela (en proceso)
>
> Fotonovela a estrenarse.
> Creadores:
> Luciano Saracino
> Omar Hechtenkopf
>
> Diseño de vestuario: Nora Filmus
>
> Productora: http://cabalaestudio.com/

---

### "Video del Taller en Multiesapacio1914" — jueves 10 de mayo de 2012

**URL**: https://norafilmus.blogspot.com/2012/05/la-productora-aracni2-realizo-este.html (nota: el título real del post, "Video del Taller en Multiesapacio1914", no coincide con el slug de la URL)
**Fotos**: sin fotos. Contiene 1 video embebido de YouTube (no descargado): `https://www.youtube.com/embed/WYRzk5_2uPU`.

**Texto completo:**

> Video realizado por la productora Puerta 3

---

### "Taller de teatro para adolescentes en F.I.C.B.A." — miércoles 2 de mayo de 2012

**URL**: https://norafilmus.blogspot.com/2012/05/taller-de-teatro-para-adolescentes-en.html
**Fotos**: 1 — `media/2012/taller-de-teatro-para-adolescentes-en-ficba/foto-1.jpg`

**Texto completo:**

> Ya comencé dando clases de teatro para adolescentes los sábados en F.I.C.B.A. Federación de Instituciones Comunitarias de Buenos Aires.
> El taller se dicta dentro del marco del "Programa adolescente" que se realiza en distintas ONG y Asociaciones Civiles de la Ciudad de Buenos Aires.
> Estoy disfrutando y proyectando un muy buen año de aprendizaje con los pibes.

---

### "Feliz Comienzo!!!" — lunes 5 de marzo de 2012

**URL**: https://norafilmus.blogspot.com/2012/03/feliz-comienzo.html
**Fotos**: 1 — `media/2012/feliz-comienzo/foto-1.jpg` (nombre de archivo original en Blogger: "Taller de teatro rita.jpg" — posible referencia temprana al personaje "Rita", aunque el post no lo menciona en el texto)

**Texto completo:**

> Ya empezamos, felices y contentos de volver a compartir un espacio de juego, creatividad, expresión y compañerismo. Gracias Chicos por como y todo lo que brindan. A disfrutar del año del taller.!!!

---

### "Taller de teatro para Chicos !!!" — jueves 23 de febrero de 2012

**URL**: https://norafilmus.blogspot.com/2012/02/taller-de-teatro-para-chicos.html
**Fotos**: 1 — `media/2012/taller-de-teatro-para-chicos/foto-1.jpg`

**Texto completo:**

> Ya estoy retomando el dictado de los talleres de teatro para chicos en Multiespacio 1914.
>
> Para chicos de 6 a 8 años: Lunes de 17 a 18 hs.
> Para chicos de 9 a 12 años: Lunes de 18:30 a 19:30 hs.
>
> Consultar por otras edades, adolescentes y adultos.
>
> consultas:
> Mediante este medio ó llamando a Mutiespacio 1914: Teléfonos 4857-0784
> enviando un mail a talleres@multiespacio1914.com.ar
> ó a norafilmus@gmail.com
>
> www.multiespacio1914.com

---

## 2013

### "Chicha, Carmen y Angelita en el Teatro Español de Magdalena" — lunes 1 de julio de 2013

**URL**: https://norafilmus.blogspot.com/2013/07/chicha-carmen-y-angelita-en-el-teatro.html
**Fotos**: 3 — `media/2013/chicha-carmen-y-angelita-en-el-teatro-espanol-de-magdalena/foto-1.jpg` a `foto-3.jpg`

**Texto completo:** el post no tiene cuerpo de texto, es solo el título y las fotos de la función en esa sala.

---

### "Ultimas 2 Funciones en el Paseo La Plaza DOMINGO 21 hs. Av. Corrientes 1660" — viernes 17 de mayo de 2013

**URL**: https://norafilmus.blogspot.com/2013/05/ultimas-2-funciones-en-el-paseo-la.html
**Fotos**: 5 — `media/2013/ultimas-2-funciones-en-el-paseo-la-plaza/foto-1.jpg` a `foto-5.jpg`

**Texto completo:**

> Fotografía: Fernando Gens

---

### "Ya largamos en el PASEO LA PLAZA - ESPACIO COLETTE" — miércoles 8 de mayo de 2013

**URL**: https://norafilmus.blogspot.com/2013/05/ya-largamos-en-el-paseo-la-plaza.html
**Fotos**: 1 — `media/2013/ya-largamos-en-el-paseo-la-plaza-espacio-colette/foto-1.jpg`

**Texto completo:**

> Todos los domingos de Mayo a las 20:30 (para empezar a las 21hs.) Los espero!

---

### "Entrevista en el Programa de radio 'Subí que te llevo' de RADIO GRAFICA. Chicha, Carmen y Angelita" — domingo 28 de abril de 2013

**URL**: https://norafilmus.blogspot.com/2013/04/entrevista-en-el-programa-de-radio-subi.html
**Fotos**: 2 — `media/2013/entrevista-radio-grafica-subi-que-te-llevo/foto-1.jpg` y `foto-2.jpg`

**Texto completo:**

> En el mes de abril conocimos las instalaciones de Radio Gráfica FM 89.3 Una radio Comunitaria del barrio de Barracas.
> Fuimos invitadas al programa Subí que te llevo, acá el link de la entrevista.
>
> http://www.goear.com/listen/04fdb10/entrevista-a-chicha-carmen-y-angelita-radio-grafica
>
> Radio gráfica en Facebook: https://www.facebook.com/pages/Radio-Grafica-FM-893/86983114627
> Subí que te llevo en Facebook: https://www.facebook.com/subi.quetellevo.37?fref=ts
> La página de Radio Gráfica: http://www.radiografica.org.ar/
>
> Muchísimas gracias a las conductoras por la calidez y la buena onda!

---

### "Mayo en el Paseo La Plaza ! Chicha, Carmen y Angelita" — domingo 28 de abril de 2013

**URL**: https://norafilmus.blogspot.com/2013/04/mayo-en-el-paseo-la-plaza-chicha-carmen.html
**Fotos**: 2 — `media/2013/mayo-en-el-paseo-la-plaza/foto-1.jpg` (frente del flyer) y `foto-2.jpg` (dorso)

**Texto completo:**

> Arrancamos el mes de mayo con todo! Los espero en el Espacio Colette del Paseo La Plaza, todos los domingos a las 20:30 hs. - Av. Corrientes 1660

---

### "Chicha, Carmen y Angelita en EL ARBOL Centro de investigación Teatral" — domingo 28 de abril de 2013 — **nuevo hallazgo, no estaba en la pasada anterior**

**URL**: https://norafilmus.blogspot.com/2013/04/chicha-carmen-y-angelita-en-el-arbol.html
**Fotos**: 1 — `media/2013/chicha-carmen-y-angelita-en-el-arbol/foto-1.jpg` (imagen PNG del evento)

**Texto completo:**

> Funciones del mes de Abril, muchas gracias!

Otra sala más para el recorrido de "Chicha, Carmen y Angelita" en 2013, no mencionada en el resumen anterior de esta fuente.

---

### "Clip Chicha, Carmen y Angelita" — jueves 21 de febrero de 2013

**URL**: https://norafilmus.blogspot.com/2013/02/clip-chicha-carmen-y-angelita.html
**Fotos**: sin fotos. Contiene 1 video nativo de Blogger (no YouTube, no descargado — no forma parte del alcance de esta tarea): `https://www.blogger.com/video.g?token=...&origin=norafilmus.blogspot.com`.

**Texto completo:** el post no tiene cuerpo de texto, solo el video embebido.

---

### "Ultimas 2 Funciónes de Chicha, Carmen y Angelita" — jueves 21 de febrero de 2013

**URL**: https://norafilmus.blogspot.com/2013/02/ultimas-2-funciones-de-chicha-carmen-y.html
**Fotos**: 3 — `media/2013/ultimas-2-funciones-de-chicha-carmen-y-angelita/foto-1.jpg` a `foto-3.jpg`

**Texto completo:**

> Espectáculo de humor sobre el universo femenino y sobre la construcción de identidad en la sociedad actual.
> Chicha, Carmen y Angelita, tres mujeres, una misma generación y 2 millones de dudas sobre como pararse en la vida: ser hija, ser hermana, ser amiga, ser amante. Con más golpes que victorias, con más fracasos que noches buenas, Chicha, Carmen y Angelita llegan a la calle Corrientes unidas por el delirio, los mandatos, la libertad y el deseo de ser Mujeres.
>
> Una puesta en escena que va del Stand-up al Teatro físico pasando por el Clown y el Cafe-Concert sin dejar de ser una comedia delirante.

Esta descripción del espectáculo es la más completa/citable de todo el blog sobre "Chicha, Carmen y Angelita" — buena candidata a sinopsis para el sitio.

---

### "Veranito en la ciudad!! Tardes de juego para chicos." — lunes 21 de enero de 2013

**URL**: https://norafilmus.blogspot.com/2013/01/veranito-en-la-ciudad-tardes-de-juego.html
**Fotos**: 2 — `media/2013/veranito-en-la-ciudad/foto-1.jpg` y `foto-2.jpg` (dos flyers)

**Texto completo:**

> Para los que ya estén aburridos o cansados de la colonia, para los que quieran jugar, aprender y divertirse.
>
> Talleres de juegos para chicos, desde 6 años.
> Clases sueltas para divertirse una tarde.
> Teatro, arte y cuentos.....
> Informes e inscripción norafilmus@gmail.com

---

### "Postales de 'Chicha, Carmen y Angelita'" — domingo 20 de enero de 2013

**URL**: https://norafilmus.blogspot.com/2013/01/postales-de-chicha-carmen-y-angelita.html
**Fotos**: 2 — `media/2013/postales-de-chicha-carmen-y-angelita/foto-1.jpg` (frente de la tarjeta) y `foto-2.jpg` (dorso)

**Texto completo:**

> Agradecemos a nuestros Sponsors
> Diseño de Indumentaria:
> "Los Perros/Alicia Maravilla" - "No Robarás Hermanas Molina" - "Zapatos Esther Narcótica".
> Telas: "La Retacería Once"
> Catering: "Ambra Catering"

---

### "Fotos del Estreno - Fotógrafo Colo Gens" — viernes 4 de enero de 2013

**URL**: https://norafilmus.blogspot.com/2013/01/fotos-del-estreno-fotografo-colo-gens.html
**Fotos**: 9 — `media/2013/fotos-del-estreno-colo-gens/foto-1.jpg` a `foto-9.jpg`

**Texto completo:** el post no tiene cuerpo de texto, es solo el título (crédito al fotógrafo Colo Gens) y la fotogalería del estreno.

---

## 2014 (posts más recientes del blog)

### "Varieté de Clown en La Casa Semilla - Domingo 9 de noviembre" — martes 11 de noviembre de 2014

**URL**: https://norafilmus.blogspot.com/2014/11/variete-de-clown-en-la-casa-semilla.html
**Fotos**: 8 — `media/2014/variete-de-clown-en-la-casa-semilla/foto-1.jpg` a `foto-8.jpg`

**Texto completo:**

> Del Teatro del Perro a La Casa Semilla!
> Sofía, Melina, Manuel, Pablo y yo claro!

Confirma la transición de venue de "Teatro del Perro" a "La Casa Semilla" para las varietés de clown, con Nora y cuatro colaboradores más (Sofía, Melina, Manuel, Pablo).

---

### "Taller de teatro en Casa Valle" — sábado 22 de febrero de 2014

**URL**: https://norafilmus.blogspot.com/2014/02/taller-de-teatro-en-casa-valle.html
**Fotos**: 1 — `media/2014/taller-de-teatro-en-casa-valle/foto-1.jpg`

**Texto completo:**

> Ya comenzó la inscripción!

---

### "Apertura Casa Valle - 2014" — martes 28 de enero de 2014

**URL**: https://norafilmus.blogspot.com/2014/01/apertura-casa-valle-2014.html
**Fotos**: 4 — `media/2014/apertura-casa-valle-2014/foto-1.jpg` a `foto-4.jpg`

**Texto completo:** el post no tiene cuerpo de texto, es solo el título y las fotos de la apertura del espacio.

---

### "Clown - Teatro del Perro - Coordinación Diego Mouriño" — martes 28 de enero de 2014

**URL**: https://norafilmus.blogspot.com/2014/01/clown-teatro-del-perro-coordinacion.html
**Fotos**: 6 — `media/2014/clown-teatro-del-perro/foto-1.jpg` a `foto-6.jpg`

**Texto completo:** el post no tiene cuerpo de texto, es solo el título (con el crédito a Diego Mouriño, coordinador del espacio de clown) y las fotos de las funciones. Es la referencia más temprana en todas las fuentes de esta investigación sobre la faceta de payasa/clown de Nora, con nombre de coordinador confirmado.

---

### "F.I.C.B.A. Programa Adolescencia - Cierre 2013" — martes 28 de enero de 2014 — **nuevo hallazgo, no estaba en la pasada anterior**

**URL**: https://norafilmus.blogspot.com/2014/01/ficba-programa-adolescencia-cierre-2013.html
**Fotos**: 2 — `media/2014/ficba-programa-adolescencia-cierre-2013/foto-1.jpg` y `foto-2.jpg`

**Texto completo:**

> Cierre del Programa Adolescencia 2013
> Talleres Culturales para adolescentes.
>
> Federación de Instituciones Comunitarias de Buenos Aires

Nota: 2014 es el último año de actividad del blog — no se encontraron archivos posteriores en la navegación (alcance pedido explícitamente 2009-2014, no se buscó más allá).

---

## Resumen temático (para redacción del sitio)

- **Compañía/proyecto recurrente 1996-2007**: "Los Ranz" (ver también bio del panel de alternativateatral.com y el CV completo en "Experiencia y Formación" arriba, que lista los espectáculos y salas específicas).
- **Ciclo "Chicha, Carmen y Angelita" / "Chicha, Carmen y el Músico"** (2011-2013): el proyecto más documentado del blog, con 15 posts dedicados total. Arranca como "Chicha, Carmen y el Músico" en Uruguay/Libario Bar (2011, dirigido por Nora, con Lara Hernaiz y Martín Elter) y muta a "Chicha, Carmen y Angelita" (trío con María Rastelli y Lara Hernaiz), con temporadas en Liberarte, Pasaje Casa del Arte, Paseo La Plaza - Espacio Colette, Teatro Español de Magdalena, El Árbol Centro de Investigación Teatral, y giras (Paranolimartes). Sinopsis citable del espectáculo en el post "Últimas 2 Funciones..." de febrero 2013 (ver arriba). Fotógrafos acreditados: Fernando Gens y "Colo Gens".
- **Docencia infantil/adolescente**: talleres recurrentes en Multiespacio 1914 y F.I.C.B.A. (2012-2013, incluyendo un cierre de programa documentado en enero 2014), y en Casa Valle (2014).
- **Clown**: aparece recién en 2014 (Teatro del Perro, La Casa Semilla), coordinado por Diego Mouriño — es la referencia más temprana encontrada en todas las fuentes de esta investigación sobre su faceta de payasa. La transición de "Teatro del Perro" a "La Casa Semilla" queda documentada en el post de noviembre 2014.
- **Obras/dirección de Marcelo Subiotto (Puerta Roja)**: "Amentia" (2010, asistencia de dirección) y "La Comuna Orgón" (2010-2011, actriz) — ambas confirmadas también en el panel de alternativateatral.com y en el CV "Experiencia y Formación".
- **Diseño de vestuario**: la fotonovela "El Feo" (Cabala Estudio, 2012, con Luciano Saracino y Omar Hechtenkopf) es el único crédito de esta faceta encontrado en el blog, y también aparece en el CV de 2009 revisado.
- **CV completo**: el post "Experiencia y Formación" (2009, con datos actualizados hasta 2013) es la fuente más rica de toda la investigación — formación (IUNA, Suzuki, I.F.T., seminarios con Szuchmacher/Kartún/Bartís/Veronese), dirección, actuación en cine/publicidad y docencia, todo con fechas y espacios específicos.

## Limitaciones

- Se cubrieron los 34 posts individuales del rango 2009-2014 (alcance pedido explícitamente); no se buscaron años anteriores o posteriores.
- 3 posts contienen videos embebidos (2 de YouTube, 1 nativo de Blogger) que no se descargaron — están fuera del alcance de "fotos" pedido para esta tarea, y el enlace de YouTube está explícitamente fuera de alcance según la instrucción del usuario. Los links de los embeds quedan anotados en la entrada de cada post por si se necesitan más adelante.
- Dos títulos de post no coinciden con el slug de su URL ("Experiencia y Formación" vive en la URL `educar-al-actor-en-el-teatro-de-jerzy.html`, y "Video del Taller en Multiesapacio1914" vive en `la-productora-aracni2-realizo-este.html`) — probablemente Nora cambió el título después de publicar el post y Blogger no actualiza el slug retroactivamente. Se documenta la URL real de cada uno arriba para evitar confusión.
- Las fotos se descargaron en la mejor resolución que Blogger expone públicamente (`/s0/`, el tamaño "original" sin recortar que Blogger sirve); no hay forma de conseguir el archivo fuente sin resize a través del blog público.
