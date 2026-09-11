/**
 * Fuente de verdad de TODO el texto y el material que muestra el sitio, en
 * español e inglés.
 *
 * El sitio es una **carta de presentación profesional**: le habla a
 * productoras, festivales e instituciones (sobre todo irlandesas) que podrían
 * contratar a Nora como actriz, productora o pedagoga teatral. Por eso la voz
 * es en primera persona pero sobria, y las credenciales van al frente.
 *
 * Reglas que NO se rompen al editar este archivo:
 *
 * 1. **Todo dato es verificable** contra `content/` o `CV/`. Nada de cifras
 *    redondeadas para arriba ni obras donde Nora no participó.
 * 2. **El rol de Nora se declara siempre.** Varias de las obras del archivo son
 *    producciones donde ella NO actúa (`Los golpes de Clara` es un unipersonal
 *    de Carolina Guevara que Nora produjo). Mostrar esas fotos sin aclarar el
 *    rol le atribuye a Nora la actuación de otra persona — ya pasó una vez.
 * 3. **Las fotos ajenas van con crédito.** Las de archivo son de fotógrafas
 *    profesionales (Russarabian, Finoli) y varias traen marca de agua.
 * 4. **Nada de menores identificables.** El material de docencia viene del
 *    Programa Adolescencia (adolescentes en situación de vulnerabilidad); no
 *    se publica una cara sin consentimiento escrito. Ver `pillars.ensenar`.
 */

export type Language = 'es' | 'en';

/**
 * Un pilar del menú del Hero: las 3 facetas de Nora, no el nav del sitio.
 * `'trayectoria' | 'contacto'` se agregaron 2026-09-09 solo para que
 * `Hero.tsx` pueda construir localmente 2 ítems más con esta misma forma —
 * `pillars[]` (ES/EN) sigue teniendo nada más que las 3 facetas reales.
 */
export interface Pillar {
  key: 'crear' | 'ensenar' | 'producir' | 'trayectoria' | 'contacto';
  label: string;
  /** Qué es ese pilar, en una línea. Se lee en el mosaico. */
  caption: string;
  /**
   * `null` = todavía no hay una foto publicable para este pilar (ver regla 4).
   * El mosaico muestra un placeholder en vez de inventar una imagen.
   */
  image: string | null;
  alt: string;
  /** Crédito de la fotógrafa, obligatorio cuando hay `image`. */
  credit?: string;
  /**
   * Ruta de la página correspondiente (`/crear`, `/ensenar`, `/producir` —
   * antes eran anchors `#crear` etc., ver Fase 1 de arquitectura de rutas en
   * CLAUDE.md). `null` mientras la sección no exista: el ítem se renderiza
   * sin link en vez de apuntar a una ruta inexistente.
   */
  href: string | null;
}

export interface GalleryItem {
  src: string;
  alt: string;
  /** Obra + año. */
  work: string;
  /** El rol REAL de Nora en esa producción. Nunca se omite (regla 2). */
  role: string;
  credit?: string;
  /**
   * A dónde navega el ítem al clickearlo (2026-09-06, "el slider... quiero
   * que pueda clickear cualquiera de esos items y me lleve a la sección que
   * corresponde, con la información de esa obra"). Ruta de Acto + hash del
   * crédito exacto (`/crear#${encodeURIComponent('Rapiña::2017–2019')}`) —
   * el mismo formato `work::years` que arma `creditId()` en `CreditList.tsx`,
   * que al aterrizar abre ese crédito puntual y le hace scroll. Verificado a
   * mano contra el `work`/`years` real de cada crédito (no derivado en
   * runtime): en inglés un título cambia (Pizarn-i-kett Más?), así que
   * `GALLERY_EN` pisa el `href` de esa entrada con el texto en inglés.
   */
  href: string;
}

/**
 * Una foto del slider vertical infinito de un Acto (`VerticalPhotoSlider`,
 * 2026-09-12) — reemplaza a la foto ancla única (`image`) de Crear/Producir.
 * Selección hecha por el usuario en el artifact "Casting del Archivo" (ver
 * memoria `casting-del-archivo-artifact`): son fotos de archivo reales, sin
 * curaduría de "una sola pieza ancla" como tenía `image` — por eso no llevan
 * `caption` propio, solo `alt`/`credit`.
 */
export interface ActGalleryPhoto {
  src: string;
  alt: string;
  credit: string;
}

/** Una línea de una lista de créditos tipo CV de sala (F2 en adelante). */
export interface Credit {
  work: string;
  detail: string;
  years: string;
  /**
   * Fotos propias de ESTE crédito — no una imagen fija de toda la sección.
   * Casi siempre una sola; créditos con material de archivo real (Rapiña,
   * ¡Mujeres a la obra!, Los golpes de Clara) traen varias — 2026-09-04: el
   * usuario pidió explícitamente que las fotos de una obra vivan pegadas a
   * su crédito, no en una galería aparte, así se entiende sin ambigüedad de
   * qué obra es cada una. Solo un puñado de créditos tiene material real; el
   * resto se despliega sin foto. Evita que la misma imagen aparezca dos
   * veces (el mosaico del Hero ya la muestra como preview; acá es la única
   * otra vez que se ve, y solo si el usuario abre el acordeón).
   */
  images?: { src: string; alt: string; credit: string }[];
  /**
   * Video propio de ESTE crédito (no un componente de video del sitio,
   * solo un link — YouTube por ahora). Mismo criterio que `image`: solo
   * un puñado de créditos tiene material real.
   */
  video?: { url: string };
}

export type TimelineCategory = 'actuacion' | 'docencia' | 'produccion' | 'formacion';
export type Decade = '1990s' | '2000s' | '2010s' | '2020s';

/**
 * Un hito de la línea de tiempo de #trayectoria (F5). `decade` es dato de
 * autor, no se calcula parseando `year` en runtime — varios años vienen como
 * "en curso" o "temporada 1", que no tienen un año numérico limpio para
 * derivar la década.
 */
export interface TimelineEntry {
  year: string;
  title: string;
  detail: string;
  category: TimelineCategory;
  decade: Decade;
  /**
   * Fotos reales de ESTE hito, ya acreditadas en otro lado del sitio (Crear/
   * Producir/`GALLERY_ES`) — nunca un archivo nuevo sin verificar acá. Array
   * (no una sola) para los hitos con varias tomas de la misma obra (Rapiña,
   * ¡Mujeres a la obra!, Los golpes de Clara): la espina pide "muchas
   * imágenes", no solo una por hito. La mayoría de los 39 hitos sigue sin
   * imagen — sería inventar material que no existe (regla 1).
   */
  images?: { src: string; alt: string; credit: string }[];
}

/** Forma completa del contenido de un idioma — si ES y EN se desalinean, rompe el build. */
export interface SiteContent {
  htmlLang: string;
  /** Texto del skip link — invisible salvo con teclado (Tab), primer foco de la página. */
  skipLink: string;
  langToggle: { label: string; short: string };
  /**
   * Copy del `ErrorBoundary` (2026-09-09) — se muestra cuando falla la carga
   * de un chunk de ruta (típico con poca conectividad: la conexión se corta
   * a mitad de la descarga del JS de `/crear`, `/ensenar`, etc.) en vez de
   * dejar la pantalla en blanco. Ver `src/components/ErrorBoundary.tsx`.
   */
  connectionError: { title: string; body: string; retry: string };
  /**
   * `PageCurtain.tsx` (2026-09-11) — el loader entre páginas pasó de un
   * fundido opaco a un blur translúcido con el ícono de la sección destino y
   * este texto ("Yendo a {label}…", el label sale de `nav`/`pillars`, no de
   * acá) — pedido explícito: "un blur suave en toda la página, el logo de la
   * sección en cuestión y un texto de yendo".
   */
  pageTransition: { goingTo: string };
  /**
   * Aviso de "sitio en construcción" (2026-09-09, pedido explícito) — ver
   * `SiteBanner.tsx`. Se muestra hasta que el usuario confirme el sitio
   * final; no tiene fecha de corte automática en el código.
   */
  siteBanner: { message: string; dismiss: string };
  hero: {
    firstName: string;
    lastName: string;
    role: string;
    bio: string;
    cta: string;
    /**
     * Segundo CTA del Hero, junto al de arriba (2026-09-12, pedido explícito:
     * "el botón de sobre mí no hace nada... quiero poner uno que diga
     * hablemos o algo así") — a diferencia de `cta` (scrollea/navega a
     * Trayectoria/Sobre mí, según `TRAYECTORIA_ENABLED`), este siempre apunta
     * a `/contacto`: una vía de conversión directa, no otra forma de leer
     * sobre Nora.
     */
    contactCta: string;
    location: string;
    portraitAlt: string;
    /** Crédito del retrato de estudio — regla 3 de este archivo. Confirmado por el usuario 2026-08-19: Paula. */
    portraitCredit: string;
    /**
     * Tira de credenciales del Hero: nombres reconocibles, sin adjetivos.
     * Es lo que hace que una productora entienda el nivel en 15 segundos.
     * **Todos verificables** (regla 1): Netflix = El amor después del amor ·
     * Star+ = Planners (directora de arte) · HBO = figura en el CV entre las
     * productoras para las que trabajó · Teatro Colón = sala donde tocó Los
     * Ranz · St. Patrick's Festival = 2023, Dublín.
     *
     * El Hero muestra estos nombres como una ficha editorial estática. Este
     * array sigue siendo la fuente del orden y del texto bilingüe.
     */
    credentials: string[];
    credentialsLabel: string;
    /**
     * Captions cortos para los dos ítems que el menú del Hero (`PillarMenu`,
     * `orientation="inline"`) suma a los 3 pilares (2026-09-09, pedido
     * explícito: "agregar trayectoria y contacto"). No son pilares reales
     * (`pillars[]` sigue siendo solo las 3 facetas) — se arman localmente en
     * `Hero.tsx` con el label de `nav.trayectoria`/`nav.contacto` y este
     * caption, para no duplicarlos en el nav de `Header`/`Footer` (que ya los
     * traen hardcodeados aparte).
     */
    menuCaptions: { trayectoria: string; contacto: string };
  };
  /** Nav del header de sitio (F1) — no confundir con `pillars`, que es el menú de 3 facetas del Hero. */
  nav: {
    home: string;
    about: string;
    trayectoria: string;
    contacto: string;
    /** `aria-label` del `<nav>` de `SectionNav.tsx` (2026-09-11) — distingue ese landmark del `<nav>` sin label del `Footer`. */
    sectionNav: string;
  };
  pillars: Pillar[];
  /**
   * Índice de programa en Home (Fase 2 del rediseño de fondo, 2026-08-28) —
   * la lista de las páginas del sitio (los 3 pilares + Trayectoria) como su
   * propio momento de navegación, no solo enlaces chicos en el Header/Footer.
   * Los ítems salen de `pillars` + `nav.trayectoria`, esto solo agrega el
   * eyebrow del bloque.
   */
  programIndex: { eyebrow: string };
  /** Sección #crear (F2) — el pilar actriz. Fuente: CV/cv cuasi completo_.docx + content/alternativa-teatral*. */
  crear: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    body1: string;
    body2: string;
    /**
     * Slider vertical infinito con TODA la selección de archivo para este
     * Acto (2026-09-12, reemplaza a la foto ancla única `image`) — ver
     * `VerticalPhotoSlider.tsx` y memoria `casting-del-archivo-artifact`.
     */
    gallery: ActGalleryPhoto[];
    stageTitle: string;
    stageCredits: Credit[];
    screenTitle: string;
    screenCredits: Credit[];
  };
  /**
   * Sección #ensenar (F3) — el pilar pedagoga. Hasta 2026-09-12 iba sin
   * `image`: el material de docencia disponible muestra menores
   * identificables del Programa Adolescencia (regla 4), así que el "material"
   * de esta sección era `statNumber`/`statLabel` en tipografía, no una foto.
   * Fuente: `CV/NoraFilmus2023PedCoord.docx` + `CV/FilmusProgramaAdolescencia.docx`.
   */
  ensenar: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    body1: string;
    body2: string;
    statNumber: string;
    statLabel: string;
    /**
     * Slider vertical infinito (2026-09-12) — 20 fotos de archivo elegidas
     * por el usuario en "Casting del Archivo" (ver memoria
     * `casting-del-archivo-artifact`), 6 de ellas con las caras de los
     * alumnes blurreadas a mano (sigma 28, mismo método que
     * `external-assets/marcos-paz-blur/blur.mjs`) porque mostraban caras
     * cercanas/reconocibles de menores — decisión explícita del usuario tras
     * revisar la política de la regla 4 (blur donde hace falta, nunca
     * descarte por defecto). `statNumber`/`statLabel` se quedan sin usar en
     * `Ensenar.tsx` (el slider reemplaza ese lugar) pero no se borran del
     * tipo — mismo criterio que ya sigue este archivo con `approach*`.
     */
    gallery: ActGalleryPhoto[];
    /**
     * Las tres modalidades de trabajo — texto madre que escribió Nora con
     * ayuda de ChatGPT (2026-08-31, ES/EN), pensado para explicar el "cómo"
     * de su práctica (Formación y Workshops, Entrenamiento Individual,
     * Grupos/Equipos/Organizaciones). Va a ancho completo, antes de los
     * créditos tipo CV — que siguen siendo la fuente del "dónde" (regla 1).
     */
    modalities: { title: string; body: string }[];
    /** Cierre "Mi mirada" del mismo texto madre — después de los créditos. */
    approachTitle: string;
    approachBody: string;
    approachClosing: string;
    coordTitle: string;
    coordCredits: Credit[];
    teachTitle: string;
    teachCredits: Credit[];
    recognitionTitle: string;
    recognitionCredits: Credit[];
  };
  /** Sección #producir (F4) — el pilar productora. Fuente: `CV/Historial Para CV de distintas areas.docx` (la más detallada, con referencias/contactos por proyecto). */
  producir: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    body1: string;
    body2: string;
    /**
     * Slider vertical infinito con TODA la selección de archivo para este
     * Acto (2026-09-12, reemplaza a la foto ancla única `image`) — ver
     * `VerticalPhotoSlider.tsx` y memoria `casting-del-archivo-artifact`.
     */
    gallery: ActGalleryPhoto[];
    stageTitle: string;
    stageCredits: Credit[];
    screenTitle: string;
    screenCredits: Credit[];
    irelandTitle: string;
    irelandCredits: Credit[];
  };
  /**
   * Sección #trayectoria (F5) — línea de tiempo 1990→2026, consolida los 4
   * CVs en una sola pieza (a diferencia de Crear/Enseñar/Producir, que son
   * selecciones curadas por pilar). Filtrable por categoría en el cliente.
   */
  trayectoria: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    body: string;
    filterAll: string;
    filterActing: string;
    filterTeaching: string;
    filterProducing: string;
    filterTraining: string;
    items: TimelineEntry[];
  };
  /**
   * Contacto (F7, en preparación) — cierre del sitio. `LINKS`/`social` ya
   * existen y se reusan tal cual (mismo mail/redes que Footer); esto solo
   * agrega el copy propio de la página.
   */
  contacto: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    body: string;
    emailLabel: string;
    /** Alt de la foto banner (2026-09-09, DSC01947.jpg, sesión "Norah_" — mismo crédito que el resto, "Paula"). */
    photoAlt: string;
    /** Formulario con captcha propio (honeypot + desafío firmado, sin cuenta externa) — envía por `/api/contact` (Resend). */
    form: {
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      captchaLabel: string;
      submit: string;
      sending: string;
      success: string;
      error: string;
    };
    /**
     * "Dejar una huella" — pared de firmas pública (nombre + mensaje corto,
     * sin foto ni dibujo) que cualquier visitante puede sumar vía `/api/sign`
     * (mismo captcha propio; se guarda como commit a `public/data/signatures.json`).
     */
    wall: {
      eyebrow: string;
      title: string;
      body: string;
      nameLabel: string;
      namePlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      submit: string;
      sending: string;
      success: string;
      error: string;
      empty: string;
    };
  };
  about: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    body1: string;
    body2: string;
    cta: string;
    cvLabel: string;
    gallery: GalleryItem[];
  };
  /** Label reutilizado por `CreditList` cuando un crédito puntual tiene `video`. */
  creditVideo: { watch: string };
  /**
   * Labels del lightbox global (`Lightbox.tsx`, 2026-09-06) — cerrar/anterior/
   * siguiente, compartidos por cualquier foto ampliable del sitio (Act,
   * CreditList, Trayectoria). Antes vivían como `presente.close/previous/next`,
   * específicos de la página `Presente` (borrada 2026-09-04); ahora son
   * genéricos porque el lightbox ya no pertenece a una sola sección.
   */
  lightbox: { close: string; previous: string; next: string };
  notFound: { text: string; home: string };
  social: { instagram: string; linkedin: string; email: string };
  /** Pie de sitio (F1) — LINKS (redes/mail) se reutiliza del Hero, esto es solo el texto que le falta. */
  /**
   * `colophon` (Fase 5, 2026-08-28): la última "costura" del Programa — reusa
   * `Seam.tsx`, huérfano desde la Fase 1 (ya no anuncia el próximo Acto entre
   * secciones porque cada una es su propia página), ahora como cierre real en
   * vez de "lo que viene". `photoCredits` agrega los fotógrafos reales que
   * ya se acreditan a lo largo del sitio (Crear/Enseñar/Producir/Presente) en
   * una sola línea de colofón — ninguno inventado, la lista sale de grepear
   * los `credit:` de personas (no de instituciones como CELCIT) en este mismo
   * archivo.
   */
  footer: { rights: string; backToTop: string; colophon: string; photoCredits: string };
}

const GALLERY_ES: GalleryItem[] = [
  {
    src: '/img/about/rapina-afiche.jpg',
    alt: 'Afiche de Rapiña',
    work: 'Rapiña · 2017–2019',
    role: 'Actriz',
    credit: 'Marcela Russarabian',
    href: `/crear#${encodeURIComponent('Rapiña::2017–2019')}`,
  },
  {
    src: '/img/about/chicha-carmen-y-angelita-foto-1.jpg',
    alt: 'Escena de Chicha, Carmen y Angelita, Teatro Español de Magdalena',
    work: 'Chicha, Carmen y Angelita · 2010–2013',
    role: 'Dramaturgia y actuación',
    credit: 'Colo Gens',
    href: `/crear#${encodeURIComponent('Chicha, Carmen y Angelita::2010–2013')}`,
  },
  {
    src: '/img/crear/pizarnikett-flyer.jpg',
    alt: 'Flyer de la obra Pizarn-i-kett Más?, Teatro El Refugio',
    work: 'Pizarn-i-kett Más? · 2009–2010',
    role: 'Actuación, caracterización y maquillaje',
    credit: 'Teatro El Refugio',
    href: `/crear#${encodeURIComponent('Pizarn-i-kett Más? (Un híbrido a la fuerza)::2009–2010')}`,
  },
  {
    src: '/img/about/maldichas-foto-1.png',
    alt: 'Integrante de Maldichas en escena',
    work: 'Maldichas · 2018–2019',
    role: 'Gestora cultural y productora ejecutiva',
    credit: 'Ariel Ugolino',
    href: `/producir#${encodeURIComponent('Maldichas::2018–2019')}`,
  },
  {
    src: '/img/about/los-golpes-de-clara-afiche.jpg',
    alt: 'Afiche de Los golpes de Clara',
    work: 'Los golpes de Clara · 2020',
    role: 'Produjo la única función',
    credit: 'Nicolás Finoli',
    href: `/producir#${encodeURIComponent('Los golpes de Clara::2020')}`,
  },
  {
    src: '/img/about/mujeres-a-la-obra-afiche.jpg',
    alt: 'Afiche del ciclo ¡Mujeres a la obra!',
    work: '¡Mujeres a la obra! · CELCIT, 2018',
    role: 'Producción',
    href: `/producir#${encodeURIComponent('¡Mujeres a la obra!::2018')}`,
  },
  {
    src: '/img/menu/improvisacion-mosquito-afiche.jpg',
    alt: 'Afiche de Improvisación Mosquito',
    work: 'Improvisación Mosquito · 2019',
    role: 'Producción',
    credit: 'Productora Demos',
    href: `/producir#${encodeURIComponent('Improvisación Mosquito::2019')}`,
  },
];

/** Mismas imágenes, mismos créditos — solo cambian obra/rol traducidos. */
const GALLERY_EN: GalleryItem[] = GALLERY_ES.map((item, i) => ({
  ...item,
  alt: [
    'Poster for Rapiña',
    'Scene from Chicha, Carmen y Angelita, Teatro Español de Magdalena',
    'Flyer for Pizarn-i-kett Más?, Teatro El Refugio',
    'Member of Maldichas on stage',
    'Poster for Los golpes de Clara',
    'Poster for the ¡Mujeres a la obra! season',
    'Poster for Improvisación Mosquito',
  ][i],
  role: [
    'Actress',
    'Playwright and performer',
    'Acting, characterisation and make-up',
    'Cultural manager and executive producer',
    'Produced the single performance',
    'Producer',
    'Producer',
  ][i],
  // Solo Pizarn-i-kett Más? traduce el subtítulo del título (ver
  // crear.stageCredits en inglés) — el resto del `href` de GALLERY_ES ya
  // vale tal cual porque el `work` del crédito no cambia de idioma.
  ...(i === 2
    ? { href: `/crear#${encodeURIComponent('Pizarn-i-kett Más? (A Forced Hybrid)::2009–2010')}` }
    : {}),
}));

export const content: Record<Language, SiteContent> = {
  es: {
    /** `lang` del <html>, para lectores de pantalla y buscadores. */
    htmlLang: 'es',
    skipLink: 'Saltar al contenido',
    langToggle: { label: 'Ver el sitio en inglés', short: 'EN' },
    connectionError: {
      title: 'No se pudo cargar esta página',
      body: 'Puede ser una conexión débil o inestable. Revisá tu conexión y probá de nuevo.',
      retry: 'Reintentar',
    },
    pageTransition: { goingTo: 'Yendo a' },
    siteBanner: {
      message: 'Este sitio está en obra — lo actualizamos todo el tiempo. Pronto vas a ver la versión final.',
      dismiss: 'Cerrar aviso',
    },

    hero: {
      /** El titular se arma en dos piezas tipográficas: firma + wordmark. */
      firstName: 'Nora',
      lastName: 'Filmus',
      role: 'Actriz · Productora · Pedagoga teatral',
      bio: 'Treinta y seis años en artes escénicas, entre Buenos Aires y Dublín. Actúo, produzco teatro y audiovisual, y coordino programas de formación artística.',
      cta: 'Ver trayectoria',
      contactCta: 'Hablemos',
      location: 'Dublín, Irlanda',
      portraitAlt: 'Nora Filmus riendo a carcajadas en un retrato de estudio, con los brazos cruzados',
      portraitCredit: 'Paula',
      credentials: ['Netflix', 'Star+', 'HBO', 'Teatro Colón', "St. Patrick's Festival"],
      credentialsLabel: 'Créditos seleccionados',
      menuCaptions: {
        trayectoria: 'Treinta y seis años de carrera, año por año.',
        contacto: 'Para proyectos, colaboraciones o consultas.',
      },
    },

    nav: {
      home: 'Inicio',
      about: 'Sobre mí',
      trayectoria: 'Trayectoria',
      contacto: 'Contacto',
      sectionNav: 'Navegación del sitio',
    },

    crear: {
      eyebrow: 'Actuación',
      titleLead: 'Arriba del escenario',
      titleAccent: 'desde 1990.',
      body1:
        'Empecé a estudiar teatro a los catorce años con Alicia Aller, y seguí formándome con Fabio Mosquito Sancineto, Héctor Beacón, Marisa Salas y Marcelo Subiotto, entre otros — cursé hasta tercer año la Licenciatura en Dirección Escénica en la UNA. Actué diez años con el grupo Los Ranz en salas como el Teatro Colón y el Centro Cultural Recoleta, y participé en La Comuna Orgón, dirigida por Marcelo Subiotto en Puerta Roja.',
      body2:
        'Escribí y actué en Chicha, Carmen y Angelita, integré el elenco de Rapiña y desde 2015 formo parte de la compañía Boquitas Pintadas, con la que hago Que no quede huella. En cine y televisión trabajé como extra en producciones para Netflix, Polka y Telefé.',
      gallery: [
      { src: '/img/crear/galeria/chicha-magdalena-foto-1.jpg', alt: 'Chicha, Carmen y Angelita — Teatro Español de Magdalena — foto de archivo', credit: 'Colo Gens' },
      { src: '/img/crear/galeria/chicha-magdalena-foto-6.jpg', alt: 'Chicha, Carmen y Angelita — Teatro Español de Magdalena — foto de archivo', credit: 'Colo Gens' },
      { src: '/img/crear/galeria/chicha-magdalena-foto-10.jpg', alt: 'Chicha, Carmen y Angelita — Teatro Español de Magdalena — foto de archivo', credit: 'Colo Gens' },
      { src: '/img/crear/galeria/chicha-magdalena-foto-25.jpg', alt: 'Chicha, Carmen y Angelita — Teatro Español de Magdalena — foto de archivo', credit: 'Colo Gens' },
      { src: '/img/crear/galeria/chicha-magdalena-foto-28.jpg', alt: 'Chicha, Carmen y Angelita — Teatro Español de Magdalena — foto de archivo', credit: 'Colo Gens' },
      { src: '/img/crear/galeria/chicha-magdalena-foto-39.jpg', alt: 'Chicha, Carmen y Angelita — Teatro Español de Magdalena — foto de archivo', credit: 'Colo Gens' },
      { src: '/img/crear/galeria/chicha-magdalena-foto-45.jpg', alt: 'Chicha, Carmen y Angelita — Teatro Español de Magdalena — foto de archivo', credit: 'Colo Gens' },
      { src: '/img/crear/galeria/variete-casa-semilla-foto-14.jpg', alt: 'Varieté de clown, Casa Semilla — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/variete-casa-semilla-foto-15.jpg', alt: 'Varieté de clown, Casa Semilla — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/pizarniket-ensayo-foto-2.jpg', alt: 'Pizarn-i-kett Más? — ensayo — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/book-actoral-foto-14.jpg', alt: 'Book actoral — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/pizarniket-ensayo-foto-7.jpg', alt: 'Pizarn-i-kett Más? — ensayo — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/pizarniket-ensayo-foto-9.jpg', alt: 'Pizarn-i-kett Más? — ensayo — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/pizarniket-ensayo-foto-20.jpg', alt: 'Pizarn-i-kett Más? — ensayo — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/pizarniket-ensayo-foto-27.jpg', alt: 'Pizarn-i-kett Más? — ensayo — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/rita-universos-DSC01597.jpg', alt: 'Rita Universos — foto de archivo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01593.jpg', alt: 'Rita Universos — foto de archivo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01616.jpg', alt: 'Rita Universos — foto de archivo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01630.jpg', alt: 'Rita Universos — foto de archivo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01641.jpg', alt: 'Rita Universos — foto de archivo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01677.jpg', alt: 'Rita Universos — foto de archivo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01660.jpg', alt: 'Rita Universos — foto de archivo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01694.jpg', alt: 'Rita Universos — foto de archivo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01685.jpg', alt: 'Rita Universos — foto de archivo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01696.jpg', alt: 'Rita Universos — foto de archivo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01708.jpg', alt: 'Rita Universos — foto de archivo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01710.jpg', alt: 'Rita Universos — foto de archivo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01722.jpg', alt: 'Rita Universos — foto de archivo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01719.jpg', alt: 'Rita Universos — foto de archivo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01728.jpg', alt: 'Rita Universos — foto de archivo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01731.jpg', alt: 'Rita Universos — foto de archivo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01753.jpg', alt: 'Rita Universos — foto de archivo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01743.jpg', alt: 'Rita Universos — foto de archivo', credit: 'Paula' },
      { src: '/img/crear/galeria/polas-DSC01465.jpg', alt: 'Book de estudio — foto de archivo', credit: 'Paula' },
      { src: '/img/crear/galeria/polas-DSC01517.jpg', alt: 'Book de estudio — foto de archivo', credit: 'Paula' },
      { src: '/img/crear/galeria/polas-DSC01514.jpg', alt: 'Book de estudio — foto de archivo', credit: 'Paula' },
      { src: '/img/crear/galeria/polas-DSC01520.jpg', alt: 'Book de estudio — foto de archivo', credit: 'Paula' },
      { src: '/img/crear/galeria/polas-DSC01522-2.jpg', alt: 'Book de estudio — foto de archivo', credit: 'Paula' },
      { src: '/img/crear/galeria/polas-DSC01525.jpg', alt: 'Book de estudio — foto de archivo', credit: 'Paula' },
      { src: '/img/crear/galeria/polas-DSC01552.jpg', alt: 'Book de estudio — foto de archivo', credit: 'Paula' },
      { src: '/img/crear/galeria/polas-DSC01556.jpg', alt: 'Book de estudio — foto de archivo', credit: 'Paula' },
      { src: '/img/crear/galeria/ph-wild-tapa-ph-wild.jpg', alt: 'Tapa editorial "Ph Wild" — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/bs-amentia-foto-1.jpg', alt: 'Amentia, de Marcelo Subiotto — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/bs-musico-libario-foto-1.jpg', alt: 'Chicha, Carmen y el músico — Libario Bar — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/bs-musico-uruguay-foto-1.jpg', alt: 'Chicha, Carmen y el músico — gira Uruguay — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/bs-comuna-orgon-foto-1.jpg', alt: 'La Comuna Orgón — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/bs-paranolimartes-foto-2.jpg', alt: 'Chicha, Carmen y Angelita en Paranolimartes — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/bs-paranolimartes-foto-5.jpg', alt: 'Chicha, Carmen y Angelita en Paranolimartes — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/bs-debut-casa-arte-foto-3.jpg', alt: 'Debut en Pasaje Casa del Arte — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/bs-debut-casa-arte-foto-5.jpg', alt: 'Debut en Pasaje Casa del Arte — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/bs-debut-casa-arte-foto-7.jpg', alt: 'Debut en Pasaje Casa del Arte — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/bs-debut-casa-arte-foto-8.jpg', alt: 'Debut en Pasaje Casa del Arte — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/bs-arbol-foto-1.jpg', alt: 'Chicha, Carmen y Angelita en "El Árbol" — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/bs-estreno-colo-gens-foto-2.jpg', alt: 'Estreno — foto de archivo', credit: 'Colo Gens' },
      { src: '/img/crear/galeria/bs-estreno-colo-gens-foto-4.jpg', alt: 'Estreno — foto de archivo', credit: 'Colo Gens' },
      { src: '/img/crear/galeria/bs-mayo-plaza-foto-1.jpg', alt: 'Mayo en el Paseo La Plaza — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/bs-postales-foto-1.jpg', alt: 'Postales de Chicha, Carmen y Angelita — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/bs-ultimas-2-funciones-foto-3.jpg', alt: 'Últimas 2 funciones — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/bs-ultimas-2-plaza-foto-5.jpg', alt: 'Últimas 2 funciones, Paseo La Plaza — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/bs-ultimas-2-plaza-foto-3.jpg', alt: 'Últimas 2 funciones, Paseo La Plaza — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/bs-clown-perro-foto-2.jpg', alt: 'Clown, Teatro del Perro — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/bs-clown-perro-foto-5.jpg', alt: 'Clown, Teatro del Perro — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/bs-variete-2014-foto-1.jpg', alt: 'Varieté de clown, Casa Semilla — foto de archivo', credit: 'Archivo personal' },
      { src: '/img/crear/galeria/bs-variete-2014-foto-5.jpg', alt: 'Varieté de clown, Casa Semilla — foto de archivo', credit: 'Archivo personal' },
      ],
      stageTitle: 'Teatro',
      stageCredits: [
        {
          work: 'Rapiña',
          detail: 'Elenco · Belisario Club de Cultura',
          years: '2017–2019',
          // Siete fotos de piezas distintas de la misma obra (2026-09-04 —
          // el usuario pidió más imágenes en Crear, y que se entienda de qué
          // obra son: pegadas acá, adentro del crédito, en vez de una
          // galería aparte al pie del Acto). Ninguna repite la foto ancla
          // del Acto (`crear.image`, "Bañera" en `/img/about/rapina-foto-5.jpg`
          // — un fotograma distinto de la misma pieza que el de acá abajo).
          images: [
            {
              src: '/img/crear/rapina-tarantulas.jpg',
              alt: 'Escena de la pieza "Como las tarántulas", de Rapiña',
              credit: 'Marcela Russarabian',
            },
            {
              src: '/img/archivo/rapina-sur.jpg',
              alt: 'Escena de la pieza "Sur", de Rapiña',
              credit: 'Marcela Russarabian',
            },
            {
              src: '/img/archivo/rapina-tarantulas-2.jpg',
              alt: 'Escena de la pieza "Como las tarántulas", de Rapiña, otro ángulo',
              credit: 'Marcela Russarabian',
            },
            {
              src: '/img/archivo/rapina-funcion.jpg',
              alt: 'Escena de función de Rapiña',
              credit: 'Marcela Russarabian',
            },
            {
              src: '/img/archivo/rapina-banera.jpg',
              alt: 'Escena de la pieza "Bañera", de Rapiña',
              credit: 'Marcela Russarabian',
            },
            {
              src: '/img/archivo/rapina-fotos-pieza.jpg',
              alt: 'Escena de la pieza "Fotos", de Rapiña',
              credit: 'Marcela Russarabian',
            },
            {
              src: '/img/archivo/rapina-tarantulas-3.jpg',
              alt: 'Escena de la pieza "Como las tarántulas", de Rapiña, tercer ángulo',
              credit: 'Marcela Russarabian',
            },
          ],
        },
        { work: 'Que no quede huella', detail: 'Compañía Boquitas Pintadas', years: 'desde 2015' },
        // Sin año confirmado por Nora (su bio profesional, 2026-08-31, solo dice "temporadas");
        // no se agregó a Trayectoria porque esa lista necesita `decade` y no hay dato para inferirlo. CHEQUEAR con Nora.
        { work: 'Las Preciadas', detail: 'Festival Internacional de Buenos Aires (FIBA)', years: 'año a confirmar' },
        { work: 'Las Manos de Alicia', detail: 'Nelson Valente, dir. Marianella Pensado — Microteatro BA y Microteatro Chauvin, Mar del Plata', years: '2022–2023' },
        { work: 'Betina Quiere', detail: 'Ignacio Torres, dir. Marianela Pensado — Microteatro BA', years: '2023' },
        { work: 'Solo llamé para decirte que te amo', detail: 'Nelson Valente — asistencia de dirección, CC25 de Mayo', years: '2023' },
        { work: 'Exagrama', detail: 'Florencia Aroldi, dir. Marianella Pensado — asistencia de dirección, Microteatro', years: '2023' },
        {
          work: 'Chicha, Carmen y Angelita',
          detail: 'Dramaturgia y actuación',
          years: '2010–2013',
          images: [
            {
              src: '/img/about/chicha-carmen-y-angelita-foto-1.jpg',
              alt: 'Escena de Chicha, Carmen y Angelita, Teatro Español de Magdalena',
              credit: 'Colo Gens',
            },
          ],
          video: { url: 'https://youtu.be/G13JP5uqVn0' },
        },
        { work: 'La Comuna Orgón', detail: 'Dirección: Marcelo Subiotto', years: '2010–2011' },
        {
          work: 'Pizarn-i-kett Más? (Un híbrido a la fuerza)',
          detail: 'Actuación, caracterización y maquillaje — texto: Alejandra Pizarnik, dir. Gladys Huertos',
          years: '2009–2010',
          images: [
            {
              src: '/img/crear/pizarnikett-flyer.jpg',
              alt: 'Flyer de la obra Pizarn-i-kett Más?, Teatro El Refugio',
              credit: 'Teatro El Refugio',
            },
          ],
        },
        {
          work: 'Los Ranz',
          detail: 'Inténtalo otra vez, Animal Tango, Tanga Catanga y otros — Teatro Colón, Centro Cultural Recoleta',
          years: '1998–2007',
        },
      ],
      screenTitle: 'Cine y televisión',
      screenCredits: [
        { work: 'El amor después del amor', detail: 'Netflix / More Televisión — extra', years: '2022' },
        { work: 'ATAV2', detail: 'Polka — bolo', years: '2022' },
        { work: 'Chocolate para 3', detail: 'Sánchez Cine — largometraje INCAA, extra', years: '2021' },
        { work: 'TONY', detail: 'UN3TV — bolo', years: '2020' },
        { work: 'Viudas e hijos del Rock and Roll', detail: 'Telefé', years: '2014' },
      ],
    },

    ensenar: {
      eyebrow: 'Docencia',
      titleLead: 'Doce años',
      titleAccent: 'formando en las artes escénicas.',
      body1:
        'Mi práctica se construye en el cruce entre las artes escénicas y la pedagogía. A lo largo de mi recorrido como actriz, docente y coordinadora de proyectos artísticos y socioeducativos, fui profundizando una manera de trabajar en la que el teatro no es solamente un lenguaje artístico o una herramienta para la formación actoral: es también un espacio de exploración, encuentro y descubrimiento.',
      body2:
        'Me interesa lo que sucede cuando la improvisación, el juego, el trabajo corporal, el clown y las herramientas de la actuación salen del entrenamiento estrictamente actoral y se ponen al servicio de otras necesidades: desarrollar presencia y expresividad, ampliar recursos de comunicación, estimular la creatividad, ganar confianza frente a otros, entrenar la escucha y relacionarse con lo inesperado.',
      statNumber: '12',
      statLabel: 'años coordinando el Programa Adolescencia — sin fotos publicables: el material muestra adolescentes en situación de vulnerabilidad.',
      gallery: [
      { src: '/img/ensenar/galeria/vicente-lopez-foto-10-blur.jpg', alt: 'Comedor Comunitario Las Flores, Vicente López — caras desenfocadas', credit: 'Archivo personal de Nora' },
      { src: '/img/ensenar/galeria/vicente-lopez-foto-15.jpg', alt: 'Comedor Comunitario Las Flores, Vicente López — foto de archivo', credit: 'Archivo personal de Nora' },
      { src: '/img/ensenar/galeria/vicente-lopez-foto-33-blur.jpg', alt: 'Comedor Comunitario Las Flores, Vicente López — caras desenfocadas', credit: 'Archivo personal de Nora' },
      { src: '/img/ensenar/galeria/vicente-lopez-foto-36.jpg', alt: 'Comedor Comunitario Las Flores, Vicente López — foto de archivo', credit: 'Archivo personal de Nora' },
      { src: '/img/ensenar/galeria/vicente-lopez-foto-37.jpg', alt: 'Comedor Comunitario Las Flores, Vicente López — foto de archivo', credit: 'Archivo personal de Nora' },
      { src: '/img/ensenar/galeria/vicente-lopez-foto-40.jpg', alt: 'Comedor Comunitario Las Flores, Vicente López — foto de archivo', credit: 'Archivo personal de Nora' },
      { src: '/img/ensenar/galeria/adolescentes-foto-6-blur.jpg', alt: 'Clases de teatro para adolescentes — caras desenfocadas', credit: 'Archivo personal de Nora' },
      { src: '/img/ensenar/galeria/adolescentes-foto-20-blur.jpg', alt: 'Clases de teatro para adolescentes — caras desenfocadas', credit: 'Archivo personal de Nora' },
      { src: '/img/ensenar/galeria/marcos-paz-foto-10-blur.jpg', alt: 'Muestra de alumnos, Marcos Paz — "Los Galponeros" — caras desenfocadas', credit: 'Archivo personal de Nora' },
      { src: '/img/ensenar/galeria/enamorar-baigorria-foto-1.jpg', alt: 'Programa Enamorar, Granadero Baigorria — foto de archivo', credit: 'Archivo personal de Nora' },
      { src: '/img/ensenar/galeria/enamorar-baigorria-foto-6.jpg', alt: 'Programa Enamorar, Granadero Baigorria — foto de archivo', credit: 'Archivo personal de Nora' },
      { src: '/img/ensenar/galeria/enamorar-baigorria-foto-7.jpg', alt: 'Programa Enamorar, Granadero Baigorria — foto de archivo', credit: 'Archivo personal de Nora' },
      { src: '/img/ensenar/galeria/enamorar-baigorria-foto-12.jpg', alt: 'Programa Enamorar, Granadero Baigorria — foto de archivo', credit: 'Archivo personal de Nora' },
      { src: '/img/ensenar/galeria/enamorar-baigorria-foto-34.jpg', alt: 'Programa Enamorar, Granadero Baigorria — foto de archivo', credit: 'Archivo personal de Nora' },
      { src: '/img/ensenar/galeria/bs-taller-chicos-foto-1.jpg', alt: 'Multiespacio 1914 — foto de archivo', credit: 'Archivo personal de Nora' },
      { src: '/img/ensenar/galeria/ficba-cierre-2013-foto-1-blur.jpg', alt: 'FICBA, cierre Programa Adolescencia 2013 — caras desenfocadas', credit: 'Archivo personal de Nora' },
      { src: '/img/ensenar/galeria/bs-taller-casa-valle-foto-1.jpg', alt: 'Casa Valle — foto de archivo', credit: 'Archivo personal de Nora' },
      { src: '/img/ensenar/galeria/bs-apertura-casa-valle-foto-4.jpg', alt: 'Casa Valle — foto de archivo', credit: 'Archivo personal de Nora' },
      { src: '/img/ensenar/galeria/bs-apertura-casa-valle-foto-3.jpg', alt: 'Casa Valle — foto de archivo', credit: 'Archivo personal de Nora' },
      { src: '/img/ensenar/galeria/bs-apertura-casa-valle-foto-1.jpg', alt: 'Casa Valle — foto de archivo', credit: 'Archivo personal de Nora' },
      ],
      modalities: [
        {
          title: 'Formación y workshops',
          body: 'Diseño y coordino experiencias teatrales para personas con o sin experiencia escénica. A través de la improvisación, el juego, el cuerpo, la presencia y la exploración del personaje, propongo espacios donde entrenar herramientas teatrales y, al mismo tiempo, habilitar la creatividad, la expresión personal, la escucha y el encuentro con otros. Dar el Salto, mi ciclo de talleres de teatro en español creado en Dublín, nace de esta mirada: entrar por el juego, animarse a hacer y descubrir en la experiencia nuevas posibilidades.',
        },
        {
          title: 'Entrenamiento individual',
          body: 'También desarrollo procesos personalizados para artistas, performers, músicos, presentadores y personas que necesitan desenvolverse frente a un público o fortalecer sus recursos expresivos. El trabajo parte de las necesidades concretas de cada persona y puede abordar presencia escénica, expresión corporal, espontaneidad, comunicación, confianza, escucha y capacidad de respuesta ante lo inesperado. No se trata de imponer una manera de estar en escena, sino de acompañar a cada persona a encontrar y ampliar sus propios recursos.',
        },
        {
          title: 'Grupos, equipos y organizaciones',
          body: 'Las herramientas de la improvisación y el teatro también se trasladan a contextos no escénicos: el juego teatral permite crear experiencias grupales en torno a la comunicación, la escucha, la creatividad, la colaboración, la confianza y la capacidad de adaptación. Esta línea recoge mi experiencia de más de una década en proyectos artísticos y socioeducativos, trabajando con distintas poblaciones y coordinando equipos interdisciplinarios.',
        },
      ],
      approachTitle: 'Mi mirada',
      approachBody:
        'Creo en el teatro como un espacio donde podemos ensayar otras posibilidades. A veces alguien llega porque quiere actuar. A veces porque necesita desenvolverse mejor frente a otros. A veces porque quiere crear, jugar o recuperar cierta espontaneidad. Y muchas veces algo se modifica simplemente porque se animó a hacer algo que antes no se animaba.',
      approachClosing: 'Entrar por el juego. Descubrirse haciendo.',
      coordTitle: 'Coordinación',
      coordCredits: [
        { work: 'Programa Adolescencia', detail: 'Asociación F.A.C.E. — Gobierno de la Ciudad de Buenos Aires', years: 'desde 2019' },
        { work: 'Programa Adolescencia', detail: 'Espacio Cultural Oliverio Girondo — GCBA', years: '2015–2018' },
        { work: 'Programa Adolescencia', detail: 'Federación de Instituciones Comunitarias — GCBA', years: '2012–2014' },
      ],
      teachTitle: 'Docencia',
      teachCredits: [
        { work: 'Teatro para la tercera edad', detail: 'Fundación Encanto por la Vida — convenio PAMI', years: 'desde 2017' },
        { work: 'Asistente de cátedra, Pedagogía Social', detail: 'IFTS N.º 28', years: '2020–2022' },
        { work: 'Teatro para niños y pre-adolescentes', detail: 'Escuela de Danzas Reina Reech', years: '2017–2019' },
        { work: 'Teatro, adolescentes en situación de encierro', detail: 'Instituto de Menores San Martín — Programa Jóvenes Creadores', years: '2015–2016' },
        {
          work: 'Teatro para adolescentes',
          detail: 'Escuelas medias 1 y 2 de Marcos Paz — grupo "Los Galponeros"',
          years: '2015–2016',
          images: [
            {
              // Foto de la muestra final del grupo, con las caras de los
              // alumnos desenfocadas a propósito (regla 4: son adolescentes
              // identificables, sin consentimiento escrito) — la franja de
              // luces queda nítida, es arquitectura sin gente. Ver
              // external-assets/marcos-paz-blur/blur.mjs para el proceso.
              src: '/img/archivo/marcos-paz-blur.jpg',
              alt: 'Público en la muestra de fin de taller en Marcos Paz, caras desenfocadas',
              credit: 'Archivo personal de Nora',
            },
          ],
        },
        { work: 'Teatro y expresión corporal', detail: 'Comedor Comunitario Las Flores, Vicente López', years: '2014–2015' },
      ],
      recognitionTitle: 'Reconocimientos',
      recognitionCredits: [
        { work: '"Opresión y Libertad"', detail: 'Fondo Metropolitano de la Cultura, las Artes y las Ciencias — proyecto para el Programa Adolescencia', years: '2018' },
        { work: 'Mecenazgo Cultural — "Adolescencias libres"', detail: 'Impulso Cultural (GCBA) y Fundación Santander — proyecto para el Programa Adolescencia', years: '2022' },
        { work: 'Mecenazgo Cultural — "Adolescencias en Galpón F.A.C.E."', detail: 'Impulso Cultural (GCBA) y Fundación Santander — a nombre de la Asociación Civil F.A.C.E.', years: '2023' },
      ],
    },

    producir: {
      eyebrow: 'Producción',
      titleLead: 'Detrás de escena,',
      titleAccent: 'en teatro y en pantalla.',
      body1:
        'Produje teatro independiente —¡Mujeres a la obra! en el CELCIT, Improvisación Mosquito, Maldichas en el Teatro Solís de Montevideo y en el Teatro Roma de Avellaneda, Pizarn-i-kett Más? con el subsidio del Instituto Nacional del Teatro— y gestioné el subsidio de Proteatro para Que no quede huella. También produje la primera función de Los golpes de Clara, justo antes de que arrancara la pandemia; Carolina Guevara siguió la obra sola después. En cine y televisión trabajé en equipos de producción para Star+, Netflix y HBO: fui productora de arte en El amor después del amor (Netflix), administradora de producción en Chocolate para 3, directora de arte en Planners (Star+) y soy asistente de producción en By Pass, la película que dirige Fernán Mirás para Non Stop y Cinema7.',
      body2:
        'Desde que vivo en Dublín sumé producción de eventos: coordino Argentina Day para La Clave Group desde 2023, fui runner de producción en el St. Patrick\'s Festival y en el Rathe Gather Festivalito, y trabajé en el equipo audiovisual del programa de TV The Floor para la productora Bigger Stage.',
      gallery: [
        {
          src: '/img/archivo/mujeres-a-la-obra-foto-4.jpg',
          alt: 'Escena del ciclo ¡Mujeres a la obra! — foto de archivo',
          credit: 'CELCIT',
        },
        {
          src: '/img/about/mujeres-a-la-obra-afiche.jpg',
          alt: 'Afiche del ciclo ¡Mujeres a la obra!',
          credit: 'CELCIT',
        },
        {
          src: '/img/producir/galeria/amor-despues-del-amor-poster.jpg',
          alt: 'Póster de El amor después del amor',
          credit: 'Netflix',
        },
        {
          src: '/img/producir/galeria/planners-poster.jpg',
          alt: 'Póster de Planners',
          credit: 'Star+',
        },
        {
          src: '/img/producir/galeria/chocolate-para-3-poster.jpg',
          alt: 'Afiche de Chocolate para 3',
          credit: 'Sánchez Cine',
        },
        {
          src: '/img/producir/galeria/todavia-poster.jpg',
          alt: 'Afiche de Todavía',
          credit: 'Sánchez Cine',
        },
        {
          src: '/img/producir/galeria/the-floor-poster.jpg',
          alt: 'Póster de The Floor',
          credit: 'Fox / Bigger Stage',
        },
        {
          src: '/img/producir/galeria/st-patricks-festival-2023.jpg',
          alt: "Multitud en el desfile del St. Patrick's Festival, Dublín 2023",
          credit: 'Thoslee, Wikimedia Commons (CC BY-SA)',
        },
        {
          src: '/img/producir/galeria/argentina-day-banner.jpg',
          alt: 'Flyer oficial de Argentina Day, Dublín',
          credit: 'La Clave Group',
        },
      ],
      stageTitle: 'Teatro',
      stageCredits: [
        {
          work: '¡Mujeres a la obra!',
          detail: 'Producción — 1º ciclo de teatro y feminismos, CELCIT',
          years: '2018',
          // Cuatro fotos (2026-09-04, mismo pedido que en Crear: más
          // imágenes, pegadas al crédito de la obra que les corresponde).
          images: [
            {
              src: '/img/about/mujeres-a-la-obra-afiche.jpg',
              alt: 'Afiche del ciclo ¡Mujeres a la obra!',
              credit: 'CELCIT',
            },
            {
              src: '/img/archivo/mujeres-a-la-obra-foto-2.jpg',
              alt: 'Escena del ciclo ¡Mujeres a la obra!',
              credit: 'CELCIT',
            },
            {
              src: '/img/archivo/mujeres-a-la-obra-foto-3.jpg',
              alt: 'Escena del ciclo ¡Mujeres a la obra!, otro momento',
              credit: 'CELCIT',
            },
            {
              src: '/img/archivo/mujeres-a-la-obra-foto-4.jpg',
              alt: 'Escena del ciclo ¡Mujeres a la obra!, otro momento',
              credit: 'CELCIT',
            },
          ],
        },
        {
          work: 'Maldichas',
          detail: 'Gestora cultural y productora ejecutiva — Teatro Solís (Montevideo), Teatro Roma de Avellaneda, Teatro Celcit',
          years: '2018–2019',
          images: [
            {
              src: '/img/about/maldichas-foto-1.png',
              alt: 'Integrante de Maldichas en escena',
              credit: 'Ariel Ugolino',
            },
          ],
        },
        {
          work: 'Improvisación Mosquito',
          detail: 'Producción — Productora Demos, Teatro Porteño',
          years: '2019',
          images: [
            {
              src: '/img/menu/improvisacion-mosquito-afiche.jpg',
              alt: 'Afiche de Improvisación Mosquito',
              credit: 'Productora Demos',
            },
          ],
        },
        { work: 'Pizarn-i-kett Más?', detail: 'Gestión del subsidio del Instituto Nacional del Teatro', years: '2009–2010' },
        { work: 'Que no quede huella', detail: 'Gestión del subsidio Proteatro', years: '2015–2017' },
        {
          // Año inferido, no confirmado por Nora: la ficha de alternativateatral
          // lista temporadas de la obra en CELCIT en 2018 y 2020 — 2018 coincide
          // con su aparición dentro del ciclo ¡Mujeres a la obra! (crédito
          // aparte, arriba), así que la función que Nora produjo por su cuenta
          // "antes de la pandemia" es más probable que haya sido la de 2020
          // (el ASPO en Argentina arrancó el 20/3/2020). CHEQUEAR con Nora.
          work: 'Los golpes de Clara',
          detail: 'Produjo la única función, antes de la pandemia — texto: Carolina Guevara, que siguió la obra sola después',
          years: '2020',
          images: [
            {
              src: '/img/about/los-golpes-de-clara-afiche.jpg',
              alt: 'Afiche de Los golpes de Clara',
              credit: 'Nicolás Finoli',
            },
            {
              src: '/img/about/los-golpes-de-clara-foto-3.jpg',
              alt: 'Carolina Guevara en Los golpes de Clara',
              credit: 'Nicolás Finoli',
            },
            {
              src: '/img/archivo/los-golpes-de-clara-foto-4.jpg',
              alt: 'Carolina Guevara en Los golpes de Clara, otro momento',
              credit: 'Nicolás Finoli',
            },
          ],
        },
      ],
      screenTitle: 'Cine, TV y streaming',
      screenCredits: [
        { work: 'By Pass', detail: 'Non Stop / Cinema7 — asistente de producción, dir. Fernán Mirás', years: 'en curso' },
        { work: 'Planners', detail: 'Star+ / PEGSA Group — directora de arte, dir. Daniel Barone', years: 'temporada 1' },
        { work: 'El amor después del amor', detail: 'Netflix / More Televisión — productora de arte', years: '2022' },
        { work: 'Chocolate para 3', detail: 'Sánchez Cine — administradora de producción (largometraje INCAA)', years: '2021' },
        { work: 'Todavía', detail: 'Sánchez Cine — jefa de administración (INCAA)', years: '2017–2018' },
      ],
      irelandTitle: 'Irlanda',
      irelandCredits: [
        { work: 'Argentina Day', detail: 'Productora: La Clave Group', years: '2023–2026' },
        { work: 'The Floor', detail: 'Programa de TV — Bigger Stage, runner de producción audiovisual (temporadas 4 y 5, grabado en Bray)', years: '2025' },
        { work: 'The Sugar Club', detail: 'Asistente de producción — presentación del disco solista de Gustavo Ecclesia', years: '2025' },
        { work: 'International Literature Festival Dublin', detail: 'Voluntaria, runner de producción', years: '2025' },
        { work: 'Christmas Market Latinoamericano', detail: 'Coordinación de producción — La Clave Group, Dtwo', years: '2025' },
        // La bio profesional de Nora (2026-08-31) lo escribe "Rather Gather Festivalito" —
        // se mantiene la grafía "Rathe" ya usada en todo el sitio hasta confirmar cuál es la correcta. CHEQUEAR con Nora.
        { work: 'Rathe Gather Festivalito', detail: 'Asistencia y runner de producción', years: '2024' },
        { work: 'La Peña Argentina en Dublín', detail: 'Producción — La Clave Group', years: '2024–2025' },
        { work: "St. Patrick's Festival", detail: 'Runner de producción (voluntariado)', years: '2023' },
      ],
    },

    trayectoria: {
      eyebrow: 'Trayectoria',
      titleLead: 'Treinta y seis años,',
      titleAccent: 'un solo hilo.',
      body: 'Actuación, docencia y producción no son tres carreras separadas — son la misma, vista desde tres lugares distintos. Esta es la cronología completa, filtrable por disciplina.',
      filterAll: 'Todo',
      filterActing: 'Actuación',
      filterTeaching: 'Docencia',
      filterProducing: 'Producción',
      filterTraining: 'Formación',
      items: [
        { year: '1990', title: 'Primeras clases de teatro', detail: 'Con Alicia Aller', category: 'formacion', decade: '1990s' },
        { year: '1992–1993', title: 'Actuación I y II', detail: 'Eduardo Pávelic — Centro Cultural General San Martín', category: 'formacion', decade: '1990s' },
        { year: '1995–1998', title: 'Formación del Actor', detail: 'Escuela Integral de Teatro IFT', category: 'formacion', decade: '1990s' },
        { year: '1996', title: 'Primer Campeonato Amateur de Match de Improvisación', detail: 'Dir. Fabio Mosquito Sancineto', category: 'actuacion', decade: '1990s' },
        { year: '1998–2007', title: 'Los Ranz', detail: 'Inténtalo otra vez, Animal Tango y otros — Teatro Colón, Centro Cultural Recoleta', category: 'actuacion', decade: '1990s' },
        { year: '1999–2000', title: 'Entrenamiento actoral Tadashi Suzuki', detail: 'Marisa Salas — Teatro Templum', category: 'formacion', decade: '1990s' },
        { year: '2001–2004', title: 'Licenciatura en Dirección Escénica', detail: 'UNA — hasta 3er año', category: 'formacion', decade: '2000s' },
        {
          year: '2009–2010',
          title: 'Pizarn-i-kett Más? (Un híbrido a la fuerza)',
          detail: 'Actuación, caracterización y maquillaje, y gestión del subsidio del INT — dir. Gladys Huertos',
          category: 'actuacion',
          decade: '2000s',
          images: [
            { src: '/img/crear/pizarnikett-flyer.jpg', alt: 'Flyer de la obra Pizarn-i-kett Más?, Teatro El Refugio', credit: 'Teatro El Refugio' },
          ],
        },
        { year: '2010–2011', title: 'La Comuna Orgón', detail: 'Dir. Marcelo Subiotto — Teatro Puerta Roja', category: 'actuacion', decade: '2010s' },
        {
          year: '2010–2015',
          title: 'Chicha, Carmen y Angelita',
          detail: 'Dramaturgia y actuación — Compañía Boquitas Pintadas',
          category: 'actuacion',
          decade: '2010s',
          images: [
            { src: '/img/about/chicha-carmen-y-angelita-foto-1.jpg', alt: 'Escena de Chicha, Carmen y Angelita, Teatro Español de Magdalena', credit: 'Colo Gens' },
          ],
        },
        { year: '2012–2013', title: 'Profesora de teatro para adolescentes', detail: 'Programa Adolescencia — Federación de Instituciones Comunitarias', category: 'docencia', decade: '2010s' },
        { year: '2012–2024', title: 'Coordinación del Programa Adolescencia', detail: 'Gobierno de la Ciudad de Buenos Aires', category: 'produccion', decade: '2010s' },
        { year: '2014–2015', title: 'Teatro y expresión corporal', detail: 'Comedor Comunitario Las Flores, Vicente López', category: 'docencia', decade: '2010s' },
        { year: '2015–2016', title: 'Teatro para adolescentes en situación de encierro', detail: 'Instituto de Menores San Martín — Programa Jóvenes Creadores', category: 'docencia', decade: '2010s' },
        { year: '2015', title: 'Premio "Jóvenes Creadores"', detail: 'SENAF / Asociación Argentina de Actores', category: 'docencia', decade: '2010s' },
        { year: '2015–2017', title: 'Que no quede huella', detail: 'Compañía Boquitas Pintadas — actuación y gestión del subsidio Proteatro', category: 'actuacion', decade: '2010s' },
        { year: '2017–2019', title: 'Teatro para niños y pre-adolescentes', detail: 'Escuela de Danzas Reina Reech', category: 'docencia', decade: '2010s' },
        { year: 'desde 2017', title: 'Teatro para la tercera edad', detail: 'Fundación Encanto por la Vida — convenio PAMI', category: 'docencia', decade: '2010s' },
        { year: '2017–2018', title: 'Todavía', detail: 'Sánchez Cine — jefa de administración (INCAA)', category: 'produccion', decade: '2010s' },
        {
          year: '2018–2019',
          title: 'Rapiña',
          detail: 'Elenco — Belisario Club de Cultura',
          category: 'actuacion',
          decade: '2010s',
          images: [
            { src: '/img/about/rapina-foto-5.jpg', alt: 'Escena de la pieza "Bañera", de Rapiña', credit: 'Marcela Russarabian' },
            { src: '/img/crear/rapina-tarantulas.jpg', alt: 'Escena de la pieza "Como las tarántulas", de Rapiña', credit: 'Marcela Russarabian' },
            { src: '/img/archivo/rapina-sur.jpg', alt: 'Escena de la pieza "Sur", de Rapiña', credit: 'Marcela Russarabian' },
          ],
        },
        {
          year: '2018',
          title: '¡Mujeres a la obra!',
          detail: 'Producción — CELCIT',
          category: 'produccion',
          decade: '2010s',
          images: [
            { src: '/img/about/mujeres-a-la-obra-afiche.jpg', alt: 'Afiche del ciclo ¡Mujeres a la obra!', credit: 'CELCIT' },
            { src: '/img/archivo/mujeres-a-la-obra-foto-2.jpg', alt: 'Escena del ciclo ¡Mujeres a la obra!', credit: 'CELCIT' },
          ],
        },
        { year: '2018', title: 'Premio "Opresión y Libertad"', detail: 'Fondo Metropolitano de la Cultura, las Artes y las Ciencias', category: 'produccion', decade: '2010s' },
        {
          year: '2018–2019',
          title: 'Maldichas',
          detail: 'Gestora cultural y productora ejecutiva — Teatro Solís, Montevideo',
          category: 'produccion',
          decade: '2010s',
          images: [
            { src: '/img/about/maldichas-foto-1.png', alt: 'Integrante de Maldichas en escena', credit: 'Ariel Ugolino' },
          ],
        },
        // Año inferido — ver nota en producir.stageCredits más abajo. CHEQUEAR con Nora.
        {
          year: '2020',
          title: 'Los golpes de Clara',
          detail: 'Produjo la única función — texto: Carolina Guevara, que siguió la obra sola después',
          category: 'produccion',
          decade: '2020s',
          images: [
            { src: '/img/about/los-golpes-de-clara-afiche.jpg', alt: 'Afiche de Los golpes de Clara', credit: 'Nicolás Finoli' },
            { src: '/img/about/los-golpes-de-clara-foto-3.jpg', alt: 'Carolina Guevara en Los golpes de Clara', credit: 'Nicolás Finoli' },
          ],
        },
        {
          year: '2019',
          title: 'Improvisación Mosquito',
          detail: 'Producción — Productora Demos',
          category: 'produccion',
          decade: '2010s',
          images: [
            { src: '/img/menu/improvisacion-mosquito-afiche.jpg', alt: 'Afiche de Improvisación Mosquito', credit: 'Productora Demos' },
          ],
        },
        { year: '2020', title: 'Tecnicatura Superior en Pedagogía Social', detail: 'Orientación en Derechos Humanos — IFTS N.º 28', category: 'formacion', decade: '2020s' },
        { year: '2020–2022', title: 'Asistente de cátedra, Pedagogía Social', detail: 'IFTS N.º 28', category: 'docencia', decade: '2020s' },
        { year: '2021', title: 'Chocolate para 3', detail: 'Sánchez Cine — extra en pantalla, administradora de producción (largometraje INCAA)', category: 'produccion', decade: '2020s' },
        { year: '2022', title: 'El amor después del amor', detail: 'Netflix / More Televisión — extra en pantalla, productora de arte', category: 'produccion', decade: '2020s' },
        { year: '2022', title: 'Mecenazgo Cultural — "Adolescencias libres"', detail: 'Impulso Cultural (GCBA) y Fundación Santander — Programa Adolescencia', category: 'produccion', decade: '2020s' },
        { year: '2023', title: 'Mecenazgo Cultural — "Adolescencias en Galpón F.A.C.E."', detail: 'Impulso Cultural (GCBA) y Fundación Santander', category: 'produccion', decade: '2020s' },
        { year: '2023', title: 'Mudanza a Dublín', detail: 'Irlanda', category: 'formacion', decade: '2020s' },
        { year: '2023', title: "St. Patrick's Festival", detail: 'Runner de producción (voluntariado)', category: 'produccion', decade: '2020s' },
        { year: '2023–2026', title: 'Argentina Day', detail: 'Productora: La Clave Group', category: 'produccion', decade: '2020s' },
        { year: 'en curso', title: 'By Pass', detail: 'Non Stop / Cinema7 — asistente de producción, dir. Fernán Mirás', category: 'produccion', decade: '2020s' },
        { year: 'temporada 1', title: 'Planners', detail: 'Star+ / PEGSA Group — directora de arte', category: 'produccion', decade: '2020s' },
        { year: '2024', title: 'Festival Internacional de Teatro Shakespeare', detail: '"Maten a Hamlet" (Los Macoco) — asistente de producción voluntaria, Craiova, Rumania', category: 'produccion', decade: '2020s' },
        { year: '2024', title: 'Rathe Gather Festivalito', detail: 'Clown en escena, como Rita Universos, y asistencia de producción', category: 'actuacion', decade: '2020s' },
        { year: '2025', title: 'The Floor', detail: 'Bigger Stage — runner de producción audiovisual (temporadas 4 y 5, Bray)', category: 'produccion', decade: '2020s' },
        { year: '2026', title: 'Improv Theatre Workshop', detail: 'Marise Renate — Irlanda', category: 'formacion', decade: '2020s' },
        { year: '2026', title: 'Intensive Clown Training Workshop', detail: 'Gregorio "Goyo" Richter — Irlanda', category: 'formacion', decade: '2020s' },
      ],
    },

    pillars: [
      {
        key: 'crear',
        label: 'Crear',
        caption: 'Actriz en teatro, cine y televisión desde 1990.',
        image: '/img/menu/rapina.jpg',
        alt: 'Escena de Rapiña, obra en la que Nora integró el elenco',
        credit: 'Marcela Russarabian',
        href: '/crear',
      },
      {
        key: 'ensenar',
        label: 'Enseñar',
        caption: 'Doce años coordinando talleres de teatro para adolescentes.',
        // Sin foto a propósito: el material disponible muestra adolescentes
        // identificables del Programa Adolescencia. Ver regla 4 arriba.
        image: null,
        alt: 'Todavía sin imagen publicable para este pilar',
        href: '/ensenar',
      },
      {
        key: 'producir',
        label: 'Producir',
        caption: 'Producción ejecutiva en teatro independiente, festivales y rodajes.',
        image: '/img/about/maldichas-foto-1.png',
        alt: 'Integrante de Maldichas en escena, trío que Nora produjo',
        credit: 'Ariel Ugolino',
        href: '/producir',
      },
    ],

    programIndex: { eyebrow: 'El Programa' },

    contacto: {
      eyebrow: 'Contacto',
      titleLead: '¿Un proyecto',
      titleAccent: 'en mente?',
      body: 'Actúo, produzco y coordino formación artística entre Buenos Aires y Dublín. Si hay un proyecto en el que pueda sumar, escribime — respondo por correo o por Instagram.',
      emailLabel: 'Escribime',
      photoAlt: 'Nora Filmus riendo, sentada y mirando hacia un costado, en una sesión de fotos editorial',
      form: {
        nameLabel: 'Nombre',
        namePlaceholder: 'Tu nombre',
        emailLabel: 'Correo',
        emailPlaceholder: 'tu@correo.com',
        messageLabel: 'Mensaje',
        messagePlaceholder: 'Contame sobre el proyecto...',
        captchaLabel: 'Verificación —',
        submit: 'Enviar mensaje',
        sending: 'Enviando...',
        success: 'Gracias — el mensaje llegó. Te respondo pronto.',
        error: 'Algo falló al enviar. Probá de nuevo o escribime directo por correo.',
      },
      wall: {
        eyebrow: 'Dejá tu huella',
        title: 'Firmá el programa',
        body: 'Si llegaste hasta acá, dejá tu nombre y una línea — queda publicado en esta misma página, como una firma en el programa de sala.',
        nameLabel: 'Nombre',
        namePlaceholder: 'Tu nombre',
        messageLabel: 'Mensaje',
        messagePlaceholder: 'Una línea, nada más',
        submit: 'Firmar',
        sending: 'Firmando...',
        success: 'Firmado — gracias por pasar.',
        error: 'No se pudo guardar la firma. Probá de nuevo en un momento.',
        empty: 'Todavía no hay firmas — sé la primera persona en dejar la tuya.',
      },
    },

    about: {
      eyebrow: '36 años en artes escénicas',
      titleLead: 'Treinta y seis años',
      titleAccent: 'en escena.',
      body1:
        'Soy actriz, docente y productora audiovisual y cultural argentino-rumana, radicada en Dublín. Me formé en la Escuela Integral de Teatro IFT y cursé la Licenciatura en Dirección Escénica en la UNA. Trabajé diez años con el grupo Los Ranz, cinco en el Colectivo Teatral Puerta Roja de Marcelo Subiotto, y desde 2015 integro la compañía Boquitas Pintadas.',
      body2:
        'En paralelo coordiné durante doce años el Programa Adolescencia del Gobierno de la Ciudad de Buenos Aires —talleres artísticos para adolescentes en contextos de vulnerabilidad— y trabajé en producción de cine y televisión para Netflix, HBO, Star+ e INCAA. Desde 2023 vivo en Dublín, donde participé del St. Patrick’s Festival, Argentina Day y el Rathe Gather Festival.',
      cta: 'Escribime',
      cvLabel: 'Descargar CV',
      gallery: GALLERY_ES,
    },

    creditVideo: { watch: 'Ver video' },

    lightbox: { close: 'Cerrar', previous: 'Anterior', next: 'Siguiente' },

    notFound: {
      text: 'La página que buscás no existe o fue movida.',
      home: 'Volver al inicio',
    },

    social: {
      instagram: 'Instagram',
      linkedin: 'LinkedIn',
      email: 'Escribime por correo',
    },

    footer: {
      rights: 'Todos los derechos reservados.',
      backToTop: 'Volver arriba',
      colophon: 'Fin del programa',
      photoCredits:
        'Fotografías: Marcela Russarabian, Nicolás Finoli, Ariel Ugolino, Colo Gens, Paula.',
    },
  },

  en: {
    htmlLang: 'en',
    skipLink: 'Skip to content',
    langToggle: { label: 'Ver el sitio en español', short: 'ES' },
    connectionError: {
      title: "This page couldn't load",
      body: 'It may be a weak or unstable connection. Check your connection and try again.',
      retry: 'Retry',
    },
    pageTransition: { goingTo: 'Going to' },
    siteBanner: {
      message: "This site is a work in progress — we're updating it constantly. The final version is coming soon.",
      dismiss: 'Dismiss notice',
    },

    hero: {
      firstName: 'Nora',
      lastName: 'Filmus',
      role: 'Actress · Producer · Theatre educator',
      bio: 'Thirty-six years in the performing arts, between Buenos Aires and Dublin. I act, I produce for stage and screen, and I run arts education programmes.',
      cta: 'See my work',
      contactCta: "Let's talk",
      location: 'Dublin, Ireland',
      portraitAlt: 'Nora Filmus laughing out loud in a studio portrait, arms crossed',
      portraitCredit: 'Paula',
      credentials: ['Netflix', 'Star+', 'HBO', 'Teatro Colón', "St. Patrick's Festival"],
      credentialsLabel: 'Selected credits',
      menuCaptions: {
        trayectoria: 'Thirty-six years of work, year by year.',
        contacto: 'For projects, collaborations or enquiries.',
      },
    },

    nav: {
      home: 'Home',
      about: 'About',
      trayectoria: 'Timeline',
      contacto: 'Contact',
      sectionNav: 'Site navigation',
    },

    crear: {
      eyebrow: 'Acting',
      titleLead: 'On stage',
      titleAccent: 'since 1990.',
      body1:
        'I started studying theatre at fourteen with Alicia Aller, and went on training with Fabio Mosquito Sancineto, Héctor Beacón, Marisa Salas and Marcelo Subiotto, among others — I completed three years of a degree in Stage Direction at Argentina’s National University of the Arts (UNA). I spent ten years acting with the company Los Ranz, performing in venues including the Teatro Colón and the Centro Cultural Recoleta in Buenos Aires, and took part in La Comuna Orgón, directed by Marcelo Subiotto at Teatro Puerta Roja.',
      body2:
        'I co-wrote and performed in Chicha, Carmen y Angelita, joined the cast of Rapiña, and have been part of the company Boquitas Pintadas since 2015, performing in Que no quede huella. In film and television I’ve worked as an extra on productions for Netflix, Polka and Telefé.',
      gallery: [
      { src: '/img/crear/galeria/chicha-magdalena-foto-1.jpg', alt: 'Chicha, Carmen y Angelita — Teatro Español de Magdalena — archive photo', credit: 'Colo Gens' },
      { src: '/img/crear/galeria/chicha-magdalena-foto-6.jpg', alt: 'Chicha, Carmen y Angelita — Teatro Español de Magdalena — archive photo', credit: 'Colo Gens' },
      { src: '/img/crear/galeria/chicha-magdalena-foto-10.jpg', alt: 'Chicha, Carmen y Angelita — Teatro Español de Magdalena — archive photo', credit: 'Colo Gens' },
      { src: '/img/crear/galeria/chicha-magdalena-foto-25.jpg', alt: 'Chicha, Carmen y Angelita — Teatro Español de Magdalena — archive photo', credit: 'Colo Gens' },
      { src: '/img/crear/galeria/chicha-magdalena-foto-28.jpg', alt: 'Chicha, Carmen y Angelita — Teatro Español de Magdalena — archive photo', credit: 'Colo Gens' },
      { src: '/img/crear/galeria/chicha-magdalena-foto-39.jpg', alt: 'Chicha, Carmen y Angelita — Teatro Español de Magdalena — archive photo', credit: 'Colo Gens' },
      { src: '/img/crear/galeria/chicha-magdalena-foto-45.jpg', alt: 'Chicha, Carmen y Angelita — Teatro Español de Magdalena — archive photo', credit: 'Colo Gens' },
      { src: '/img/crear/galeria/variete-casa-semilla-foto-14.jpg', alt: 'Varieté de clown, Casa Semilla — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/variete-casa-semilla-foto-15.jpg', alt: 'Varieté de clown, Casa Semilla — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/pizarniket-ensayo-foto-2.jpg', alt: 'Pizarn-i-kett Más? — ensayo — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/book-actoral-foto-14.jpg', alt: 'Book actoral — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/pizarniket-ensayo-foto-7.jpg', alt: 'Pizarn-i-kett Más? — ensayo — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/pizarniket-ensayo-foto-9.jpg', alt: 'Pizarn-i-kett Más? — ensayo — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/pizarniket-ensayo-foto-20.jpg', alt: 'Pizarn-i-kett Más? — ensayo — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/pizarniket-ensayo-foto-27.jpg', alt: 'Pizarn-i-kett Más? — ensayo — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/rita-universos-DSC01597.jpg', alt: 'Rita Universos — archive photo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01593.jpg', alt: 'Rita Universos — archive photo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01616.jpg', alt: 'Rita Universos — archive photo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01630.jpg', alt: 'Rita Universos — archive photo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01641.jpg', alt: 'Rita Universos — archive photo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01677.jpg', alt: 'Rita Universos — archive photo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01660.jpg', alt: 'Rita Universos — archive photo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01694.jpg', alt: 'Rita Universos — archive photo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01685.jpg', alt: 'Rita Universos — archive photo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01696.jpg', alt: 'Rita Universos — archive photo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01708.jpg', alt: 'Rita Universos — archive photo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01710.jpg', alt: 'Rita Universos — archive photo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01722.jpg', alt: 'Rita Universos — archive photo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01719.jpg', alt: 'Rita Universos — archive photo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01728.jpg', alt: 'Rita Universos — archive photo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01731.jpg', alt: 'Rita Universos — archive photo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01753.jpg', alt: 'Rita Universos — archive photo', credit: 'Paula' },
      { src: '/img/crear/galeria/rita-universos-DSC01743.jpg', alt: 'Rita Universos — archive photo', credit: 'Paula' },
      { src: '/img/crear/galeria/polas-DSC01465.jpg', alt: 'Book de estudio — archive photo', credit: 'Paula' },
      { src: '/img/crear/galeria/polas-DSC01517.jpg', alt: 'Book de estudio — archive photo', credit: 'Paula' },
      { src: '/img/crear/galeria/polas-DSC01514.jpg', alt: 'Book de estudio — archive photo', credit: 'Paula' },
      { src: '/img/crear/galeria/polas-DSC01520.jpg', alt: 'Book de estudio — archive photo', credit: 'Paula' },
      { src: '/img/crear/galeria/polas-DSC01522-2.jpg', alt: 'Book de estudio — archive photo', credit: 'Paula' },
      { src: '/img/crear/galeria/polas-DSC01525.jpg', alt: 'Book de estudio — archive photo', credit: 'Paula' },
      { src: '/img/crear/galeria/polas-DSC01552.jpg', alt: 'Book de estudio — archive photo', credit: 'Paula' },
      { src: '/img/crear/galeria/polas-DSC01556.jpg', alt: 'Book de estudio — archive photo', credit: 'Paula' },
      { src: '/img/crear/galeria/ph-wild-tapa-ph-wild.jpg', alt: 'Tapa editorial "Ph Wild" — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/bs-amentia-foto-1.jpg', alt: 'Amentia, de Marcelo Subiotto — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/bs-musico-libario-foto-1.jpg', alt: 'Chicha, Carmen y el músico — Libario Bar — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/bs-musico-uruguay-foto-1.jpg', alt: 'Chicha, Carmen y el músico — gira Uruguay — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/bs-comuna-orgon-foto-1.jpg', alt: 'La Comuna Orgón — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/bs-paranolimartes-foto-2.jpg', alt: 'Chicha, Carmen y Angelita en Paranolimartes — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/bs-paranolimartes-foto-5.jpg', alt: 'Chicha, Carmen y Angelita en Paranolimartes — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/bs-debut-casa-arte-foto-3.jpg', alt: 'Debut en Pasaje Casa del Arte — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/bs-debut-casa-arte-foto-5.jpg', alt: 'Debut en Pasaje Casa del Arte — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/bs-debut-casa-arte-foto-7.jpg', alt: 'Debut en Pasaje Casa del Arte — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/bs-debut-casa-arte-foto-8.jpg', alt: 'Debut en Pasaje Casa del Arte — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/bs-arbol-foto-1.jpg', alt: 'Chicha, Carmen y Angelita en "El Árbol" — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/bs-estreno-colo-gens-foto-2.jpg', alt: 'Estreno — archive photo', credit: 'Colo Gens' },
      { src: '/img/crear/galeria/bs-estreno-colo-gens-foto-4.jpg', alt: 'Estreno — archive photo', credit: 'Colo Gens' },
      { src: '/img/crear/galeria/bs-mayo-plaza-foto-1.jpg', alt: 'Mayo en el Paseo La Plaza — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/bs-postales-foto-1.jpg', alt: 'Postales de Chicha, Carmen y Angelita — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/bs-ultimas-2-funciones-foto-3.jpg', alt: 'Últimas 2 funciones — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/bs-ultimas-2-plaza-foto-5.jpg', alt: 'Últimas 2 funciones, Paseo La Plaza — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/bs-ultimas-2-plaza-foto-3.jpg', alt: 'Últimas 2 funciones, Paseo La Plaza — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/bs-clown-perro-foto-2.jpg', alt: 'Clown, Teatro del Perro — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/bs-clown-perro-foto-5.jpg', alt: 'Clown, Teatro del Perro — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/bs-variete-2014-foto-1.jpg', alt: 'Varieté de clown, Casa Semilla — archive photo', credit: 'Personal archive' },
      { src: '/img/crear/galeria/bs-variete-2014-foto-5.jpg', alt: 'Varieté de clown, Casa Semilla — archive photo', credit: 'Personal archive' },
      ],
      stageTitle: 'Theatre',
      stageCredits: [
        {
          work: 'Rapiña',
          detail: 'Ensemble cast · Belisario Club de Cultura, Buenos Aires',
          years: '2017–2019',
          images: [
            {
              src: '/img/crear/rapina-tarantulas.jpg',
              alt: 'Scene from "Como las tarántulas", part of Rapiña',
              credit: 'Marcela Russarabian',
            },
            {
              src: '/img/archivo/rapina-sur.jpg',
              alt: 'Scene from "Sur", part of Rapiña',
              credit: 'Marcela Russarabian',
            },
            {
              src: '/img/archivo/rapina-tarantulas-2.jpg',
              alt: 'Scene from "Como las tarántulas", part of Rapiña, another angle',
              credit: 'Marcela Russarabian',
            },
            {
              src: '/img/archivo/rapina-funcion.jpg',
              alt: 'Scene from a Rapiña performance',
              credit: 'Marcela Russarabian',
            },
            {
              src: '/img/archivo/rapina-banera.jpg',
              alt: 'Scene from "Bañera", part of Rapiña',
              credit: 'Marcela Russarabian',
            },
            {
              src: '/img/archivo/rapina-fotos-pieza.jpg',
              alt: 'Scene from "Fotos", part of Rapiña',
              credit: 'Marcela Russarabian',
            },
            {
              src: '/img/archivo/rapina-tarantulas-3.jpg',
              alt: 'Scene from "Como las tarántulas", part of Rapiña, a third angle',
              credit: 'Marcela Russarabian',
            },
          ],
        },
        { work: 'Que no quede huella', detail: 'Boquitas Pintadas company', years: 'since 2015' },
        // No confirmed year from Nora's professional bio (2026-08-31, only says "seasons");
        // not added to the Timeline, which needs `decade` and there's no data to infer it from. CHECK with Nora.
        { work: 'Las Preciadas', detail: 'Buenos Aires International Festival (FIBA)', years: 'year to confirm' },
        { work: 'Las Manos de Alicia', detail: 'Nelson Valente, dir. Marianella Pensado — Microteatro BA and Microteatro Chauvin, Mar del Plata', years: '2022–2023' },
        { work: 'Betina Quiere', detail: 'Ignacio Torres, dir. Marianela Pensado — Microteatro BA', years: '2023' },
        { work: 'Solo llamé para decirte que te amo', detail: 'Nelson Valente — assistant director, CC25 de Mayo', years: '2023' },
        { work: 'Exagrama', detail: 'Florencia Aroldi, dir. Marianella Pensado — assistant director, Microteatro', years: '2023' },
        {
          work: 'Chicha, Carmen y Angelita',
          detail: 'Writer and performer',
          years: '2010–2013',
          images: [
            {
              src: '/img/about/chicha-carmen-y-angelita-foto-1.jpg',
              alt: 'Scene from Chicha, Carmen y Angelita, Teatro Español de Magdalena',
              credit: 'Colo Gens',
            },
          ],
          video: { url: 'https://youtu.be/G13JP5uqVn0' },
        },
        { work: 'La Comuna Orgón', detail: 'Dir. Marcelo Subiotto', years: '2010–2011' },
        {
          work: 'Pizarn-i-kett Más? (A Forced Hybrid)',
          detail: 'Performer, hair & makeup — text: Alejandra Pizarnik, dir. Gladys Huertos',
          years: '2009–2010',
          images: [
            {
              src: '/img/crear/pizarnikett-flyer.jpg',
              alt: 'Flyer for Pizarn-i-kett Más?, Teatro El Refugio',
              credit: 'Teatro El Refugio',
            },
          ],
        },
        {
          work: 'Los Ranz',
          detail: 'Inténtalo otra vez, Animal Tango, Tanga Catanga and others — Teatro Colón, Centro Cultural Recoleta',
          years: '1998–2007',
        },
      ],
      screenTitle: 'Film & television',
      screenCredits: [
        { work: 'El amor después del amor', detail: 'Netflix / More Televisión — extra', years: '2022' },
        { work: 'ATAV2', detail: 'Polka (Argentine TV) — walk-on', years: '2022' },
        { work: 'Chocolate para 3', detail: 'Sánchez Cine — INCAA feature, extra', years: '2021' },
        { work: 'TONY', detail: 'UN3TV — walk-on', years: '2020' },
        { work: 'Viudas e hijos del Rock and Roll', detail: 'Telefé (Argentine TV)', years: '2014' },
      ],
    },

    ensenar: {
      eyebrow: 'Teaching',
      titleLead: 'Twelve years',
      titleAccent: 'training people in the performing arts.',
      body1:
        'My practice sits at the crossing point between the performing arts and education. Through my work as an actress, theatre educator and coordinator of artistic and socially engaged projects, I have developed an approach that sees theatre not only as an art form or a space for actor training, but also as a powerful way to explore, connect and discover.',
      body2:
        'I am particularly interested in what happens when improvisation, play, physical work, clowning and acting techniques move beyond traditional actor training: how they can help us develop presence and expressiveness, build confidence, strengthen communication and listening skills, stimulate creativity, become more comfortable with the unexpected, and discover new ways of responding and connecting with others.',
      statNumber: '12',
      statLabel: 'years coordinating Programa Adolescencia — no publishable photos: the material shows teenagers in vulnerable circumstances.',
      gallery: [
      { src: '/img/ensenar/galeria/vicente-lopez-foto-10-blur.jpg', alt: 'Comedor Comunitario Las Flores, Vicente López — faces blurred', credit: 'Nora\'s personal archive' },
      { src: '/img/ensenar/galeria/vicente-lopez-foto-15.jpg', alt: 'Comedor Comunitario Las Flores, Vicente López — archive photo', credit: 'Nora\'s personal archive' },
      { src: '/img/ensenar/galeria/vicente-lopez-foto-33-blur.jpg', alt: 'Comedor Comunitario Las Flores, Vicente López — faces blurred', credit: 'Nora\'s personal archive' },
      { src: '/img/ensenar/galeria/vicente-lopez-foto-36.jpg', alt: 'Comedor Comunitario Las Flores, Vicente López — archive photo', credit: 'Nora\'s personal archive' },
      { src: '/img/ensenar/galeria/vicente-lopez-foto-37.jpg', alt: 'Comedor Comunitario Las Flores, Vicente López — archive photo', credit: 'Nora\'s personal archive' },
      { src: '/img/ensenar/galeria/vicente-lopez-foto-40.jpg', alt: 'Comedor Comunitario Las Flores, Vicente López — archive photo', credit: 'Nora\'s personal archive' },
      { src: '/img/ensenar/galeria/adolescentes-foto-6-blur.jpg', alt: 'Clases de teatro para adolescentes — faces blurred', credit: 'Nora\'s personal archive' },
      { src: '/img/ensenar/galeria/adolescentes-foto-20-blur.jpg', alt: 'Clases de teatro para adolescentes — faces blurred', credit: 'Nora\'s personal archive' },
      { src: '/img/ensenar/galeria/marcos-paz-foto-10-blur.jpg', alt: 'Muestra de alumnos, Marcos Paz — "Los Galponeros" — faces blurred', credit: 'Nora\'s personal archive' },
      { src: '/img/ensenar/galeria/enamorar-baigorria-foto-1.jpg', alt: 'Programa Enamorar, Granadero Baigorria — archive photo', credit: 'Nora\'s personal archive' },
      { src: '/img/ensenar/galeria/enamorar-baigorria-foto-6.jpg', alt: 'Programa Enamorar, Granadero Baigorria — archive photo', credit: 'Nora\'s personal archive' },
      { src: '/img/ensenar/galeria/enamorar-baigorria-foto-7.jpg', alt: 'Programa Enamorar, Granadero Baigorria — archive photo', credit: 'Nora\'s personal archive' },
      { src: '/img/ensenar/galeria/enamorar-baigorria-foto-12.jpg', alt: 'Programa Enamorar, Granadero Baigorria — archive photo', credit: 'Nora\'s personal archive' },
      { src: '/img/ensenar/galeria/enamorar-baigorria-foto-34.jpg', alt: 'Programa Enamorar, Granadero Baigorria — archive photo', credit: 'Nora\'s personal archive' },
      { src: '/img/ensenar/galeria/bs-taller-chicos-foto-1.jpg', alt: 'Multiespacio 1914 — archive photo', credit: 'Nora\'s personal archive' },
      { src: '/img/ensenar/galeria/ficba-cierre-2013-foto-1-blur.jpg', alt: 'FICBA, cierre Programa Adolescencia 2013 — faces blurred', credit: 'Nora\'s personal archive' },
      { src: '/img/ensenar/galeria/bs-taller-casa-valle-foto-1.jpg', alt: 'Casa Valle — archive photo', credit: 'Nora\'s personal archive' },
      { src: '/img/ensenar/galeria/bs-apertura-casa-valle-foto-4.jpg', alt: 'Casa Valle — archive photo', credit: 'Nora\'s personal archive' },
      { src: '/img/ensenar/galeria/bs-apertura-casa-valle-foto-3.jpg', alt: 'Casa Valle — archive photo', credit: 'Nora\'s personal archive' },
      { src: '/img/ensenar/galeria/bs-apertura-casa-valle-foto-1.jpg', alt: 'Casa Valle — archive photo', credit: 'Nora\'s personal archive' },
      ],
      modalities: [
        {
          title: 'Training & workshops',
          body: 'I design and facilitate theatre workshops for adults with or without previous performance experience. Through improvisation, play, physical and expressive work, stage presence and character exploration, I create spaces where participants can develop performance skills while exploring their creativity, spontaneity, confidence, listening and connection with others. Dar el Salto, my Spanish-language theatre workshop series in Dublin, grew from this approach: a space to play, experiment, take creative risks and discover new possibilities through doing.',
        },
        {
          title: '1:1 creative & performance training',
          body: 'I offer tailored one-to-one sessions for performers, musicians, presenters, speakers and anyone who wants to feel more confident, present and expressive in front of others. Each process begins with the person and what they want to develop. Sessions may explore stage presence, physical expression, spontaneity, communication, confidence, audience connection, listening and responding to the unexpected. Rather than teaching one particular way of performing, I work with each person to identify, develop and expand their own expressive resources.',
        },
        {
          title: 'Groups, teams & organisations',
          body: 'Improvisation, play and theatre-based practices can also offer valuable tools beyond the stage: I design experiential sessions for groups and teams that use theatre and improvisation to explore communication, active listening, creativity, collaboration, adaptability and connection. This part of my practice is informed by more than a decade of experience in arts education and socially engaged projects, working with people of different ages and backgrounds and coordinating multidisciplinary teams.',
        },
      ],
      approachTitle: 'My approach',
      approachBody:
        "I believe theatre gives us a space to try things out, take risks and explore new possibilities. Some people come to theatre because they want to perform. Others want to feel more confident in front of people, communicate more freely, reconnect with their creativity or simply try something new. And often, through play and experience, we discover abilities and possibilities we didn't know were there.",
      approachClosing: 'Through play, we discover new possibilities.',
      coordTitle: 'Coordination',
      coordCredits: [
        { work: 'Programa Adolescencia', detail: 'Asociación F.A.C.E. — City of Buenos Aires', years: 'since 2019' },
        { work: 'Programa Adolescencia', detail: 'Espacio Cultural Oliverio Girondo — City of Buenos Aires', years: '2015–2018' },
        { work: 'Programa Adolescencia', detail: 'Federación de Instituciones Comunitarias — City of Buenos Aires', years: '2012–2014' },
      ],
      teachTitle: 'Teaching',
      teachCredits: [
        { work: 'Theatre for older adults', detail: 'Fundación Encanto por la Vida — PAMI programme', years: 'since 2017' },
        { work: 'Teaching assistant, Social Pedagogy', detail: 'IFTS Nº 28', years: '2020–2022' },
        { work: 'Theatre for children and pre-teens', detail: 'Escuela de Danzas Reina Reech', years: '2017–2019' },
        { work: 'Theatre for teenagers in detention', detail: 'Instituto de Menores San Martín — Jóvenes Creadores programme', years: '2015–2016' },
        {
          work: 'Theatre for teenagers',
          detail: 'Secondary schools 1 & 2, Marcos Paz — "Los Galponeros" group',
          years: '2015–2016',
          images: [
            {
              src: '/img/archivo/marcos-paz-blur.jpg',
              alt: 'Audience at the end-of-workshop show in Marcos Paz, faces blurred',
              credit: "Nora's personal archive",
            },
          ],
        },
        { work: 'Theatre and movement', detail: 'Las Flores community canteen, Vicente López', years: '2014–2015' },
      ],
      recognitionTitle: 'Recognition',
      recognitionCredits: [
        { work: '"Opresión y Libertad"', detail: 'Fondo Metropolitano de la Cultura, las Artes y las Ciencias — project for Programa Adolescencia', years: '2018' },
        { work: 'Mecenazgo Cultural — "Adolescencias libres"', detail: 'Impulso Cultural (City of Buenos Aires) and Fundación Santander — project for Programa Adolescencia', years: '2022' },
        { work: 'Mecenazgo Cultural — "Adolescencias en Galpón F.A.C.E."', detail: 'Impulso Cultural (City of Buenos Aires) and Fundación Santander — under Asociación Civil F.A.C.E.', years: '2023' },
      ],
    },

    producir: {
      eyebrow: 'Production',
      titleLead: 'Behind the scenes,',
      titleAccent: 'in theatre and on screen.',
      body1:
        'I produced independent theatre —¡Mujeres a la obra! at CELCIT, Improvisación Mosquito, Maldichas at the Teatro Solís in Montevideo and at the Teatro Roma de Avellaneda, Pizarn-i-kett Más? with a grant from Argentina\'s National Theatre Institute— and managed the Proteatro grant for Que no quede huella. I also produced the opening night of Los golpes de Clara, right before the pandemic hit; Carolina Guevara went on with the show alone afterwards. In film and television I worked on production teams for Star+, Netflix and HBO: I was art producer on El amor después del amor (Netflix), production administrator on Chocolate para 3, art director on Planners (Star+), and I am a production assistant on By Pass, the film Fernán Mirás is directing for Non Stop and Cinema7.',
      body2:
        'Since moving to Dublin I have added event production to that: I have coordinated Argentina Day for La Clave Group since 2023, worked as a production runner at the St. Patrick\'s Festival and the Rathe Gather Festivalito, and joined the production crew for the TV show The Floor for the production company Bigger Stage.',
      gallery: [
        {
          src: '/img/archivo/mujeres-a-la-obra-foto-4.jpg',
          alt: 'Scene from the ¡Mujeres a la obra! series — archive photo',
          credit: 'CELCIT',
        },
        {
          src: '/img/about/mujeres-a-la-obra-afiche.jpg',
          alt: 'Poster for the ¡Mujeres a la obra! series',
          credit: 'CELCIT',
        },
        {
          src: '/img/producir/galeria/amor-despues-del-amor-poster.jpg',
          alt: 'Poster for El amor después del amor',
          credit: 'Netflix',
        },
        {
          src: '/img/producir/galeria/planners-poster.jpg',
          alt: 'Poster for Planners',
          credit: 'Star+',
        },
        {
          src: '/img/producir/galeria/chocolate-para-3-poster.jpg',
          alt: 'Poster for Chocolate para 3',
          credit: 'Sánchez Cine',
        },
        {
          src: '/img/producir/galeria/todavia-poster.jpg',
          alt: 'Poster for Todavía',
          credit: 'Sánchez Cine',
        },
        {
          src: '/img/producir/galeria/the-floor-poster.jpg',
          alt: 'Poster for The Floor',
          credit: 'Fox / Bigger Stage',
        },
        {
          src: '/img/producir/galeria/st-patricks-festival-2023.jpg',
          alt: "Crowd at the St. Patrick's Festival parade, Dublin 2023",
          credit: 'Thoslee, Wikimedia Commons (CC BY-SA)',
        },
        {
          src: '/img/producir/galeria/argentina-day-banner.jpg',
          alt: 'Official Argentina Day flyer, Dublin',
          credit: 'La Clave Group',
        },
      ],
      stageTitle: 'Theatre',
      stageCredits: [
        {
          work: '¡Mujeres a la obra!',
          detail: 'Producer — theatre & feminism festival, CELCIT',
          years: '2018',
          images: [
            {
              src: '/img/about/mujeres-a-la-obra-afiche.jpg',
              alt: 'Poster for the ¡Mujeres a la obra! season',
              credit: 'CELCIT',
            },
            {
              src: '/img/archivo/mujeres-a-la-obra-foto-2.jpg',
              alt: 'Scene from the ¡Mujeres a la obra! season',
              credit: 'CELCIT',
            },
            {
              src: '/img/archivo/mujeres-a-la-obra-foto-3.jpg',
              alt: 'Scene from the ¡Mujeres a la obra! season, another moment',
              credit: 'CELCIT',
            },
            {
              src: '/img/archivo/mujeres-a-la-obra-foto-4.jpg',
              alt: 'Scene from the ¡Mujeres a la obra! season, another moment',
              credit: 'CELCIT',
            },
          ],
        },
        {
          work: 'Maldichas',
          detail: 'Cultural manager and executive producer — Teatro Solís (Montevideo), Teatro Roma de Avellaneda, Teatro Celcit',
          years: '2018–2019',
          images: [
            {
              src: '/img/about/maldichas-foto-1.png',
              alt: 'A Maldichas performer on stage',
              credit: 'Ariel Ugolino',
            },
          ],
        },
        {
          work: 'Improvisación Mosquito',
          detail: 'Producer — Productora Demos, Teatro Porteño',
          years: '2019',
          images: [
            {
              src: '/img/menu/improvisacion-mosquito-afiche.jpg',
              alt: 'Poster for Improvisación Mosquito',
              credit: 'Productora Demos',
            },
          ],
        },
        { work: 'Pizarn-i-kett Más?', detail: 'Managed the grant from Argentina\'s National Theatre Institute', years: '2009–2010' },
        { work: 'Que no quede huella', detail: 'Managed the Proteatro grant', years: '2015–2017' },
        {
          // Inferred year, not confirmed by Nora — see the ES entry for the
          // reasoning (CELCIT seasons in 2018/2020, ASPO lockdown 20/3/2020).
          // CHECK with Nora.
          work: 'Los golpes de Clara',
          detail: 'Produced the only night, right before the pandemic — text: Carolina Guevara, who went on with the show alone afterwards',
          years: '2020',
          images: [
            {
              src: '/img/about/los-golpes-de-clara-afiche.jpg',
              alt: 'Poster for Los golpes de Clara',
              credit: 'Nicolás Finoli',
            },
            {
              src: '/img/about/los-golpes-de-clara-foto-3.jpg',
              alt: 'Carolina Guevara in Los golpes de Clara',
              credit: 'Nicolás Finoli',
            },
            {
              src: '/img/archivo/los-golpes-de-clara-foto-4.jpg',
              alt: 'Carolina Guevara in Los golpes de Clara, another moment',
              credit: 'Nicolás Finoli',
            },
          ],
        },
      ],
      screenTitle: 'Film, TV & streaming',
      screenCredits: [
        { work: 'By Pass', detail: 'Non Stop / Cinema7 — production assistant, dir. Fernán Mirás', years: 'ongoing' },
        { work: 'Planners', detail: 'Star+ / PEGSA Group — art director, dir. Daniel Barone', years: 'season 1' },
        { work: 'El amor después del amor', detail: 'Netflix / More Televisión — art producer', years: '2022' },
        { work: 'Chocolate para 3', detail: 'Sánchez Cine — production administrator (INCAA feature)', years: '2021' },
        { work: 'Todavía', detail: 'Sánchez Cine — head of administration (INCAA)', years: '2017–2018' },
      ],
      irelandTitle: 'Ireland',
      irelandCredits: [
        { work: 'Argentina Day', detail: 'Producer: La Clave Group', years: '2023–2026' },
        { work: 'The Floor', detail: 'TV show — Bigger Stage, production runner (Series 4 & 5, filmed in Bray)', years: '2025' },
        { work: 'The Sugar Club', detail: 'Production assistant — Gustavo Ecclesia\'s solo album launch', years: '2025' },
        { work: 'International Literature Festival Dublin', detail: 'Volunteer production runner', years: '2025' },
        { work: 'Christmas Market Latinoamericano', detail: 'Production coordination — La Clave Group, Dtwo', years: '2025' },
        { work: 'Rathe Gather Festivalito', detail: 'Production assistance and runner', years: '2024' },
        { work: 'La Peña Argentina en Dublín', detail: 'Production — La Clave Group', years: '2024–2025' },
        { work: "St. Patrick's Festival", detail: 'Production runner (volunteer)', years: '2023' },
      ],
    },

    trayectoria: {
      eyebrow: 'Timeline',
      titleLead: 'Thirty-six years,',
      titleAccent: 'one throughline.',
      body: 'Acting, teaching and producing aren\'t three separate careers — they\'re the same one, seen from three angles. This is the full chronology, filterable by discipline.',
      filterAll: 'All',
      filterActing: 'Acting',
      filterTeaching: 'Teaching',
      filterProducing: 'Producing',
      filterTraining: 'Training',
      items: [
        { year: '1990', title: 'First theatre classes', detail: 'With Alicia Aller', category: 'formacion', decade: '1990s' },
        { year: '1992–1993', title: 'Acting I & II', detail: 'Eduardo Pávelic — Centro Cultural General San Martín', category: 'formacion', decade: '1990s' },
        { year: '1995–1998', title: 'Actor training', detail: 'Escuela Integral de Teatro IFT', category: 'formacion', decade: '1990s' },
        { year: '1996', title: 'First Amateur Improv Championship', detail: 'Dir. Fabio Mosquito Sancineto', category: 'actuacion', decade: '1990s' },
        { year: '1998–2007', title: 'Los Ranz', detail: 'Inténtalo otra vez, Animal Tango and others — Teatro Colón, Centro Cultural Recoleta', category: 'actuacion', decade: '1990s' },
        { year: '1999–2000', title: 'Tadashi Suzuki actor training', detail: 'Marisa Salas — Teatro Templum', category: 'formacion', decade: '1990s' },
        { year: '2001–2004', title: 'Degree in Stage Direction', detail: 'UNA — three years completed', category: 'formacion', decade: '2000s' },
        {
          year: '2009–2010',
          title: 'Pizarn-i-kett Más? (A Forced Hybrid)',
          detail: 'Performer, hair & makeup, and managed the INT grant — dir. Gladys Huertos',
          category: 'actuacion',
          decade: '2000s',
          images: [
            { src: '/img/crear/pizarnikett-flyer.jpg', alt: 'Flyer for Pizarn-i-kett Más?, Teatro El Refugio', credit: 'Teatro El Refugio' },
          ],
        },
        { year: '2010–2011', title: 'La Comuna Orgón', detail: 'Dir. Marcelo Subiotto — Teatro Puerta Roja', category: 'actuacion', decade: '2010s' },
        {
          year: '2010–2015',
          title: 'Chicha, Carmen y Angelita',
          detail: 'Writer and performer — Boquitas Pintadas company',
          category: 'actuacion',
          decade: '2010s',
          images: [
            { src: '/img/about/chicha-carmen-y-angelita-foto-1.jpg', alt: 'Scene from Chicha, Carmen y Angelita, Teatro Español de Magdalena', credit: 'Colo Gens' },
          ],
        },
        { year: '2012–2013', title: 'Theatre teacher for teenagers', detail: 'Programa Adolescencia — Federación de Instituciones Comunitarias', category: 'docencia', decade: '2010s' },
        { year: '2012–2024', title: 'Coordinator, Programa Adolescencia', detail: 'City of Buenos Aires', category: 'produccion', decade: '2010s' },
        { year: '2014–2015', title: 'Theatre and movement', detail: 'Las Flores community canteen, Vicente López', category: 'docencia', decade: '2010s' },
        { year: '2015–2016', title: 'Theatre for teenagers in detention', detail: 'Instituto de Menores San Martín — Jóvenes Creadores programme', category: 'docencia', decade: '2010s' },
        { year: '2015', title: '"Jóvenes Creadores" award', detail: 'SENAF / Asociación Argentina de Actores', category: 'docencia', decade: '2010s' },
        { year: '2015–2017', title: 'Que no quede huella', detail: 'Boquitas Pintadas company — performer and managed the Proteatro grant', category: 'actuacion', decade: '2010s' },
        { year: '2017–2019', title: 'Theatre for children and pre-teens', detail: 'Escuela de Danzas Reina Reech', category: 'docencia', decade: '2010s' },
        { year: 'since 2017', title: 'Theatre for older adults', detail: 'Fundación Encanto por la Vida — PAMI programme', category: 'docencia', decade: '2010s' },
        { year: '2017–2018', title: 'Todavía', detail: 'Sánchez Cine — head of administration (INCAA)', category: 'produccion', decade: '2010s' },
        {
          year: '2018–2019',
          title: 'Rapiña',
          detail: 'Ensemble cast — Belisario Club de Cultura',
          category: 'actuacion',
          decade: '2010s',
          images: [
            { src: '/img/about/rapina-foto-5.jpg', alt: 'Scene from "Bañera", part of Rapiña', credit: 'Marcela Russarabian' },
            { src: '/img/crear/rapina-tarantulas.jpg', alt: 'Scene from "Como las tarántulas", part of Rapiña', credit: 'Marcela Russarabian' },
            { src: '/img/archivo/rapina-sur.jpg', alt: 'Scene from "Sur", part of Rapiña', credit: 'Marcela Russarabian' },
          ],
        },
        {
          year: '2018',
          title: '¡Mujeres a la obra!',
          detail: 'Producer — CELCIT',
          category: 'produccion',
          decade: '2010s',
          images: [
            { src: '/img/about/mujeres-a-la-obra-afiche.jpg', alt: 'Poster for the ¡Mujeres a la obra! season', credit: 'CELCIT' },
            { src: '/img/archivo/mujeres-a-la-obra-foto-2.jpg', alt: 'Scene from the ¡Mujeres a la obra! season', credit: 'CELCIT' },
          ],
        },
        { year: '2018', title: '"Opresión y Libertad" award', detail: 'Fondo Metropolitano de la Cultura, las Artes y las Ciencias', category: 'produccion', decade: '2010s' },
        {
          year: '2018–2019',
          title: 'Maldichas',
          detail: 'Cultural manager and executive producer — Teatro Solís, Montevideo',
          category: 'produccion',
          decade: '2010s',
          images: [
            { src: '/img/about/maldichas-foto-1.png', alt: 'A Maldichas performer on stage', credit: 'Ariel Ugolino' },
          ],
        },
        // Inferred year — see the note in producir.stageCredits above. CHECK with Nora.
        {
          year: '2020',
          title: 'Los golpes de Clara',
          detail: 'Produced the only night — text: Carolina Guevara, who went on with the show alone afterwards',
          category: 'produccion',
          decade: '2020s',
          images: [
            { src: '/img/about/los-golpes-de-clara-afiche.jpg', alt: 'Poster for Los golpes de Clara', credit: 'Nicolás Finoli' },
            { src: '/img/about/los-golpes-de-clara-foto-3.jpg', alt: 'Carolina Guevara in Los golpes de Clara', credit: 'Nicolás Finoli' },
          ],
        },
        {
          year: '2019',
          title: 'Improvisación Mosquito',
          detail: 'Producer — Productora Demos',
          category: 'produccion',
          decade: '2010s',
          images: [
            { src: '/img/menu/improvisacion-mosquito-afiche.jpg', alt: 'Poster for Improvisación Mosquito', credit: 'Productora Demos' },
          ],
        },
        { year: '2020', title: 'Further-education degree in Social Pedagogy', detail: 'Human Rights focus — IFTS Nº 28', category: 'formacion', decade: '2020s' },
        { year: '2020–2022', title: 'Teaching assistant, Social Pedagogy', detail: 'IFTS Nº 28', category: 'docencia', decade: '2020s' },
        { year: '2021', title: 'Chocolate para 3', detail: 'Sánchez Cine — on-screen extra, production administrator (INCAA feature)', category: 'produccion', decade: '2020s' },
        { year: '2022', title: 'El amor después del amor', detail: 'Netflix / More Televisión — on-screen extra, art producer', category: 'produccion', decade: '2020s' },
        { year: '2022', title: 'Mecenazgo Cultural — "Adolescencias libres"', detail: 'Impulso Cultural (City of Buenos Aires) and Fundación Santander — Programa Adolescencia', category: 'produccion', decade: '2020s' },
        { year: '2023', title: 'Mecenazgo Cultural — "Adolescencias en Galpón F.A.C.E."', detail: 'Impulso Cultural (City of Buenos Aires) and Fundación Santander', category: 'produccion', decade: '2020s' },
        { year: '2023', title: 'Moved to Dublin', detail: 'Ireland', category: 'formacion', decade: '2020s' },
        { year: '2023', title: "St. Patrick's Festival", detail: 'Production runner (volunteer)', category: 'produccion', decade: '2020s' },
        { year: '2023–2026', title: 'Argentina Day', detail: 'Producer: La Clave Group', category: 'produccion', decade: '2020s' },
        { year: 'ongoing', title: 'By Pass', detail: 'Non Stop / Cinema7 — production assistant, dir. Fernán Mirás', category: 'produccion', decade: '2020s' },
        { year: 'season 1', title: 'Planners', detail: 'Star+ / PEGSA Group — art director', category: 'produccion', decade: '2020s' },
        { year: '2024', title: 'Shakespeare International Theatre Festival', detail: '"Maten a Hamlet" (Los Macoco) — volunteer production assistant, Craiova, Romania', category: 'produccion', decade: '2020s' },
        { year: '2024', title: 'Rathe Gather Festivalito', detail: 'Clown performance as Rita Universos, and production assistance', category: 'actuacion', decade: '2020s' },
        { year: '2025', title: 'The Floor', detail: 'Bigger Stage — production runner (Series 4 & 5, Bray)', category: 'produccion', decade: '2020s' },
        { year: '2026', title: 'Improv Theatre Workshop', detail: 'Marise Renate — Ireland', category: 'formacion', decade: '2020s' },
        { year: '2026', title: 'Intensive Clown Training Workshop', detail: 'Gregorio "Goyo" Richter — Ireland', category: 'formacion', decade: '2020s' },
      ],
    },

    pillars: [
      {
        key: 'crear',
        label: 'Create',
        caption: 'Acting for stage, film and television since 1990.',
        image: '/img/menu/rapina.jpg',
        alt: 'Scene from Rapiña, a production Nora performed in',
        credit: 'Marcela Russarabian',
        href: '/crear',
      },
      {
        key: 'ensenar',
        label: 'Teach',
        caption: 'Twelve years running theatre workshops for teenagers.',
        image: null,
        alt: 'No publishable image for this strand yet',
        href: '/ensenar',
      },
      {
        key: 'producir',
        label: 'Produce',
        caption: 'Executive production across independent theatre, festivals and film sets.',
        image: '/img/about/maldichas-foto-1.png',
        alt: 'A Maldichas performer on stage, the trio Nora produced',
        credit: 'Ariel Ugolino',
        href: '/producir',
      },
    ],

    programIndex: { eyebrow: 'The Programme' },

    contacto: {
      eyebrow: 'Contact',
      titleLead: 'Got a project',
      titleAccent: 'in mind?',
      body: "I act, produce and run arts education programmes between Buenos Aires and Dublin. If there's a project I could be part of, get in touch — I reply by email or Instagram.",
      emailLabel: 'Get in touch',
      photoAlt: 'Nora Filmus laughing, sitting and looking to the side, during an editorial photo session',
      form: {
        nameLabel: 'Name',
        namePlaceholder: 'Your name',
        emailLabel: 'Email',
        emailPlaceholder: 'you@email.com',
        messageLabel: 'Message',
        messagePlaceholder: 'Tell me about the project...',
        captchaLabel: 'Verification —',
        submit: 'Send message',
        sending: 'Sending...',
        success: "Thanks — your message is in. I'll get back to you soon.",
        error: 'Something went wrong sending it. Try again or email me directly.',
      },
      wall: {
        eyebrow: 'Leave your mark',
        title: 'Sign the programme',
        body: "If you made it this far, leave your name and a line — it gets published right here, like a signature in the programme sheet.",
        nameLabel: 'Name',
        namePlaceholder: 'Your name',
        messageLabel: 'Message',
        messagePlaceholder: 'One line, nothing more',
        submit: 'Sign',
        sending: 'Signing...',
        success: 'Signed — thanks for stopping by.',
        error: 'Could not save the signature. Try again in a moment.',
        empty: 'No signatures yet — be the first to leave yours.',
      },
    },

    about: {
      eyebrow: '36 years in the performing arts',
      titleLead: 'Thirty-six years',
      titleAccent: 'on stage.',
      body1:
        'I\'m an Argentine-Romanian actress, educator and audiovisual and cultural producer, based in Dublin. I trained at the IFT Integral Theatre School and studied Stage Direction at Argentina’s National University of the Arts (UNA). I spent ten years with the company Los Ranz, five with Marcelo Subiotto’s Colectivo Teatral Puerta Roja, and I have been part of the Boquitas Pintadas company since 2015.',
      body2:
        'Alongside that, I spent twelve years coordinating Programa Adolescencia for the City of Buenos Aires — arts workshops for teenagers in vulnerable contexts — and worked in film and television production for Netflix, HBO, Star+ and INCAA. Since 2023 I have been based in Dublin, working on the St. Patrick’s Festival, Argentina Day and the Rathe Gather Festival.',
      cta: 'Get in touch',
      cvLabel: 'Download CV',
      gallery: GALLERY_EN,
    },

    creditVideo: { watch: 'Watch video' },

    lightbox: { close: 'Close', previous: 'Previous', next: 'Next' },

    notFound: {
      text: 'The page you are looking for does not exist or has been moved.',
      home: 'Back to home',
    },

    social: {
      instagram: 'Instagram',
      linkedin: 'LinkedIn',
      email: 'Email me',
    },

    footer: {
      rights: 'All rights reserved.',
      backToTop: 'Back to top',
      colophon: 'End of programme',
      photoCredits:
        'Photography: Marcela Russarabian, Nicolás Finoli, Ariel Ugolino, Colo Gens, Paula.',
    },
  },
};

/** Links que no dependen del idioma. */
export const LINKS = {
  instagram: 'https://www.instagram.com/noraritafilmus/',
  linkedin: 'https://www.linkedin.com/in/nora-filmus-ab353013/',
  email: 'mailto:norafilmus@gmail.com',
  cv: '/cv/nora-filmus-cv.pdf',
} as const;
