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

/** Un pilar del menú del Hero: las 3 facetas de Nora, no el nav del sitio. */
export interface Pillar {
  key: 'crear' | 'ensenar' | 'producir';
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
   * Ancla de la sección correspondiente. `null` mientras la sección no exista:
   * el ítem se renderiza sin link en vez de apuntar a un `#` inexistente.
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
}

/** Una línea de una lista de créditos tipo CV de sala (F2 en adelante). */
export interface Credit {
  work: string;
  detail: string;
  years: string;
  /**
   * Foto propia de ESTE crédito — no una imagen fija de toda la sección.
   * Solo un puñado de créditos tiene material real; el resto se despliega
   * sin foto. Evita que la misma imagen aparezca dos veces (el mosaico del
   * Hero ya la muestra como preview; acá es la única otra vez que se ve, y
   * solo si el usuario abre el acordeón).
   */
  image?: { src: string; alt: string; credit: string };
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
}

/** Forma completa del contenido de un idioma — si ES y EN se desalinean, rompe el build. */
export interface SiteContent {
  htmlLang: string;
  /** Texto del skip link — invisible salvo con teclado (Tab), primer foco de la página. */
  skipLink: string;
  langToggle: { label: string; short: string };
  hero: {
    firstName: string;
    lastName: string;
    role: string;
    bio: string;
    cta: string;
    location: string;
    portraitAlt: string;
  };
  /** Nav del header de sitio (F1) — no confundir con `pillars`, que es el menú de 3 facetas del Hero. */
  nav: { home: string; about: string; trayectoria: string };
  pillars: Pillar[];
  /** Sección #crear (F2) — el pilar actriz. Fuente: CV/cv cuasi completo_.docx + content/alternativa-teatral*. */
  crear: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    body1: string;
    body2: string;
    /** Foto ancla del Acto — distinta del archivo que usa el mosaico del Hero para este pilar. */
    image: { src: string; alt: string; credit: string; caption: string };
    stageTitle: string;
    stageCredits: Credit[];
    screenTitle: string;
    screenCredits: Credit[];
  };
  /**
   * Sección #ensenar (F3) — el pilar pedagoga. Sin `image` a propósito: el
   * material de docencia disponible muestra adolescentes identificables del
   * Programa Adolescencia (regla 4). El "material" de esta sección es
   * `statNumber`/`statLabel`, no una foto. Fuente: `CV/NoraFilmus2023PedCoord.docx`
   * + `CV/FilmusProgramaAdolescencia.docx`.
   */
  ensenar: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    body1: string;
    body2: string;
    statNumber: string;
    statLabel: string;
    coordTitle: string;
    coordCredits: Credit[];
    teachTitle: string;
    teachCredits: Credit[];
  };
  /** Sección #producir (F4) — el pilar productora. Fuente: `CV/Historial Para CV de distintas areas.docx` (la más detallada, con referencias/contactos por proyecto). */
  producir: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    body1: string;
    body2: string;
    /** Foto ancla del Acto — distinta del afiche que usa el mosaico del Hero para este pilar. */
    image: { src: string; alt: string; credit: string; caption: string };
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
  about: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    body1: string;
    body2: string;
    cta: string;
    galleryTitle: string;
    galleryNote: string;
    gallery: GalleryItem[];
  };
  notFound: { text: string; home: string };
  social: { instagram: string; linkedin: string; email: string };
  /** Pie de sitio (F1) — LINKS (redes/mail) se reutiliza del Hero, esto es solo el texto que le falta. */
  footer: { rights: string; backToTop: string };
}

const GALLERY_ES: GalleryItem[] = [
  {
    src: '/img/about/rapina-afiche.jpg',
    alt: 'Afiche de Rapiña',
    work: 'Rapiña · 2017–2019',
    role: 'Actriz',
    credit: 'Marcela Russarabian',
  },
  {
    src: '/img/about/rapina-foto-3.jpg',
    alt: 'Escena de la pieza "Sur", de Rapiña',
    work: 'Rapiña · 2017–2019',
    role: 'Actriz',
    credit: 'Marcela Russarabian',
  },
  {
    src: '/img/about/rapina-foto-6.jpg',
    alt: 'Escena de la pieza "Fotos", de Rapiña',
    work: 'Rapiña · 2017–2019',
    role: 'Actriz',
    credit: 'Marcela Russarabian',
  },
  {
    src: '/img/about/los-golpes-de-clara-afiche.jpg',
    alt: 'Afiche de Los golpes de Clara',
    work: 'Los golpes de Clara · 2017–2025',
    role: 'Producción ejecutiva',
    credit: 'Nicolás Finoli',
  },
  {
    src: '/img/about/los-golpes-de-clara-foto-1.jpg',
    alt: 'Carolina Guevara en Los golpes de Clara',
    work: 'Los golpes de Clara · 2017–2025',
    role: 'Producción ejecutiva',
    credit: 'Nicolás Finoli',
  },
  {
    src: '/img/about/los-golpes-de-clara-foto-2.jpg',
    alt: 'Carolina Guevara en Los golpes de Clara',
    work: 'Los golpes de Clara · 2017–2025',
    role: 'Producción ejecutiva',
    credit: 'Nicolás Finoli',
  },
  {
    src: '/img/about/mujeres-a-la-obra-afiche.jpg',
    alt: 'Afiche del ciclo ¡Mujeres a la obra!',
    work: '¡Mujeres a la obra! · CELCIT, 2018',
    role: 'Producción',
  },
];

/** Mismas imágenes, mismos créditos — solo cambian obra/rol traducidos. */
const GALLERY_EN: GalleryItem[] = GALLERY_ES.map((item, i) => ({
  ...item,
  alt: [
    'Poster for Rapiña',
    'Scene from "Sur", part of Rapiña',
    'Scene from "Fotos", part of Rapiña',
    'Poster for Los golpes de Clara',
    'Carolina Guevara in Los golpes de Clara',
    'Carolina Guevara in Los golpes de Clara',
    'Poster for the ¡Mujeres a la obra! season',
  ][i],
  role: ['Actor', 'Actor', 'Actor', 'Executive producer', 'Executive producer', 'Executive producer', 'Producer'][i],
}));

export const content: Record<Language, SiteContent> = {
  es: {
    /** `lang` del <html>, para lectores de pantalla y buscadores. */
    htmlLang: 'es',
    skipLink: 'Saltar al contenido',
    langToggle: { label: 'Ver el sitio en inglés', short: 'EN' },

    hero: {
      /** El titular se arma en dos piezas tipográficas: firma + wordmark. */
      firstName: 'Nora',
      lastName: 'Filmus',
      role: 'Actriz · Productora · Pedagoga teatral',
      bio: 'Treinta y seis años en artes escénicas, entre Buenos Aires y Dublín. Actúo, produzco teatro y audiovisual, y coordino programas de formación artística.',
      cta: 'Ver trayectoria',
      location: 'Dublín, Irlanda',
      portraitAlt: 'Retrato de perfil de Nora Filmus',
    },

    nav: { home: 'Inicio', about: 'Sobre mí', trayectoria: 'Trayectoria' },

    crear: {
      eyebrow: 'Actuación',
      titleLead: 'Arriba del escenario',
      titleAccent: 'desde 1990.',
      body1:
        'Empecé a estudiar teatro a los catorce años con Alicia Aller, y seguí formándome con Fabio Mosquito Sancineto, Héctor Beacón, Marisa Salas y Marcelo Subiotto, entre otros — cursé hasta tercer año la Licenciatura en Dirección Escénica en la UNA. Actué diez años con el grupo Los Ranz en salas como el Teatro Colón y el Centro Cultural Recoleta, y participé en La Comuna Orgón, dirigida por Marcelo Subiotto en Puerta Roja.',
      body2:
        'Escribí y actué en Chicha, Carmen y Angelita, integré el elenco de Rapiña y desde 2015 formo parte de la compañía Boquitas Pintadas, con la que hago Que no quede huella. En cine y televisión trabajé como extra en producciones de Disney, RAI y Telefé.',
      image: {
        src: '/img/about/rapina-foto-5.jpg',
        alt: 'Escena de la pieza "Bañera", de Rapiña',
        credit: 'Marcela Russarabian',
        caption: 'Rapiña · "Bañera" · 2017–2019',
      },
      stageTitle: 'Teatro',
      stageCredits: [
        {
          work: 'Rapiña',
          detail: 'Elenco · Belisario Club de Cultura',
          years: '2017–2019',
          image: {
            src: '/img/crear/rapina-tarantulas.jpg',
            alt: 'Escena de la pieza "Como las tarántulas", de Rapiña',
            credit: 'Marcela Russarabian',
          },
        },
        { work: 'Que no quede huella', detail: 'Compañía Boquitas Pintadas', years: 'desde 2015' },
        { work: 'Chicha, Carmen y Angelita', detail: 'Dramaturgia y actuación', years: '2010–2013' },
        { work: 'La Comuna Orgón', detail: 'Dirección: Marcelo Subiotto', years: '2010–2011' },
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
        'Desde 2012 coordino el Programa Adolescencia del Gobierno de la Ciudad de Buenos Aires —un programa de promoción de derechos para chicas y chicos en situación de vulnerabilidad social— con base en tres organizaciones civiles: la Federación de Instituciones Comunitarias, el Espacio Cultural Oliverio Girondo y, desde 2019, la Asociación FACE. Diseño y coordino los proyectos artísticos anuales, formo las duplas de docentes y operadores sociales, y soy el nexo con la Secretaría de Niñez y Adolescencia.',
      body2:
        'También coordiné talleres de teatro en el Instituto de Menores San Martín, en escuelas medias de Marcos Paz y en el Comedor Comunitario Las Flores de Vicente López, y desde 2017 doy clases de teatro para la tercera edad (convenio PAMI). Cursé la Tecnicatura Superior en Pedagogía Social con Orientación en Derechos Humanos y fui asistente de cátedra de Pedagogía Social en el IFTS N.º 28. En 2015 y 2018 gané los concursos "Jóvenes Creadores" (SENAF / Asociación Argentina de Actores) y "Opresión y Libertad" (Fondo Metropolitano de la Cultura, las Artes y las Ciencias).',
      statNumber: '12',
      statLabel: 'años coordinando el Programa Adolescencia — sin fotos publicables: el material muestra adolescentes en situación de vulnerabilidad.',
      coordTitle: 'Coordinación',
      coordCredits: [
        { work: 'Programa Adolescencia', detail: 'Asociación FACE — Gobierno de la Ciudad de Buenos Aires', years: 'desde 2019' },
        { work: 'Programa Adolescencia', detail: 'Espacio Cultural Oliverio Girondo — GCBA', years: '2015–2018' },
        { work: 'Programa Adolescencia', detail: 'Federación de Instituciones Comunitarias — GCBA', years: '2012–2014' },
      ],
      teachTitle: 'Docencia',
      teachCredits: [
        { work: 'Teatro para la tercera edad', detail: 'Fundación Encanto por la Vida — convenio PAMI', years: 'desde 2017' },
        { work: 'Asistente de cátedra, Pedagogía Social', detail: 'IFTS N.º 28', years: '2020–2022' },
        { work: 'Teatro para niños y adolescentes', detail: 'Escuela de Danzas Reina Reech', years: '2017–2019' },
        { work: 'Teatro, adolescentes en situación de encierro', detail: 'Instituto de Menores San Martín — Programa Jóvenes Creadores', years: '2015–2016' },
        { work: 'Teatro y expresión corporal', detail: 'Comedor Comunitario Las Flores, Vicente López', years: '2014–2015' },
      ],
    },

    producir: {
      eyebrow: 'Producción',
      titleLead: 'Detrás de escena,',
      titleAccent: 'en teatro y en pantalla.',
      body1:
        'Produje teatro independiente —Los golpes de Clara, ¡Mujeres a la obra! en el CELCIT, Improvisación Mosquito, Maldichas en el Teatro Solís de Montevideo— y gestioné el subsidio de Proteatro para Que no quede huella. En cine y televisión trabajé en equipos de producción para Star+, Netflix y HBO: fui directora de arte en Planners (Star+) y soy asistente de producción en By Pass, la película que dirige Fernán Mirás para Non Stop y Cinema7.',
      body2:
        'Desde que vivo en Dublín sumé producción de eventos: coordino Argentina Day para La Clave Group desde 2023, fui runner de producción en el St. Patrick\'s Festival y en el Rathe Gather Festivalito, y trabajé en el equipo audiovisual del programa de TV The Floor para la productora Bigger Stage.',
      image: {
        src: '/img/about/los-golpes-de-clara-foto-2.jpg',
        alt: 'Escena de Los golpes de Clara, obra que Nora produjo',
        credit: 'Nicolás Finoli',
        caption: 'Los golpes de Clara · Producción ejecutiva · 2017–2025',
      },
      stageTitle: 'Teatro',
      stageCredits: [
        {
          work: 'Los golpes de Clara',
          detail: 'Producción ejecutiva — texto: Carolina Guevara',
          years: '2017–2025',
          image: {
            src: '/img/about/los-golpes-de-clara-afiche.jpg',
            alt: 'Afiche de Los golpes de Clara, obra que Nora produjo',
            credit: 'Nicolás Finoli',
          },
        },
        {
          work: '¡Mujeres a la obra!',
          detail: 'Producción — 1º ciclo de teatro y feminismos, CELCIT',
          years: '2018',
          image: {
            src: '/img/about/mujeres-a-la-obra-afiche.jpg',
            alt: 'Afiche del ciclo ¡Mujeres a la obra!',
            credit: 'CELCIT',
          },
        },
        { work: 'Maldichas', detail: 'Producción independiente — Teatro Solís, Montevideo', years: '2018–2019' },
        { work: 'Improvisación Mosquito', detail: 'Producción — Productora Demos, Teatro Porteño', years: '2019' },
        { work: 'Que no quede huella', detail: 'Gestión del subsidio Proteatro', years: '2015–2017' },
      ],
      screenTitle: 'Cine, TV y streaming',
      screenCredits: [
        { work: 'By Pass', detail: 'Non Stop / Cinema7 — asistente de producción, dir. Fernán Mirás', years: 'en curso' },
        { work: 'Planners', detail: 'Star+ / PEGSA Group — directora de arte, dir. Daniel Barone', years: 'temporada 1' },
        { work: 'El amor después del amor', detail: 'Netflix / More Televisión — equipo de producción', years: '2022' },
        { work: 'Todavía', detail: 'Sánchez Cine — jefa de administración (INCAA)', years: '2017–2018' },
      ],
      irelandTitle: 'Irlanda',
      irelandCredits: [
        { work: 'Argentina Day', detail: 'Productora: La Clave Group', years: '2023–2026' },
        { work: 'The Floor', detail: 'Programa de TV — Bigger Stage, runner de producción audiovisual', years: '2025' },
        { work: 'Rathe Gather Festivalito', detail: 'Asistencia y runner de producción', years: '2024' },
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
        { year: '2010–2011', title: 'La Comuna Orgón', detail: 'Dir. Marcelo Subiotto — Teatro Puerta Roja', category: 'actuacion', decade: '2010s' },
        { year: '2010–2015', title: 'Chicha, Carmen y Angelita', detail: 'Dramaturgia y actuación — Compañía Boquitas Pintadas', category: 'actuacion', decade: '2010s' },
        { year: '2012–2013', title: 'Profesora de teatro para adolescentes', detail: 'Programa Adolescencia — Federación de Instituciones Comunitarias', category: 'docencia', decade: '2010s' },
        { year: '2012–2024', title: 'Coordinación del Programa Adolescencia', detail: 'Gobierno de la Ciudad de Buenos Aires', category: 'produccion', decade: '2010s' },
        { year: '2014–2015', title: 'Teatro y expresión corporal', detail: 'Comedor Comunitario Las Flores, Vicente López', category: 'docencia', decade: '2010s' },
        { year: '2015–2016', title: 'Teatro para adolescentes en situación de encierro', detail: 'Instituto de Menores San Martín — Programa Jóvenes Creadores', category: 'docencia', decade: '2010s' },
        { year: '2015', title: 'Premio "Jóvenes Creadores"', detail: 'SENAF / Asociación Argentina de Actores', category: 'docencia', decade: '2010s' },
        { year: '2015–2017', title: 'Que no quede huella', detail: 'Compañía Boquitas Pintadas — actuación y gestión del subsidio Proteatro', category: 'actuacion', decade: '2010s' },
        { year: '2017–2019', title: 'Teatro para niños y adolescentes', detail: 'Escuela de Danzas Reina Reech', category: 'docencia', decade: '2010s' },
        { year: 'desde 2017', title: 'Teatro para la tercera edad', detail: 'Fundación Encanto por la Vida — convenio PAMI', category: 'docencia', decade: '2010s' },
        { year: '2017–2018', title: 'Todavía', detail: 'Sánchez Cine — jefa de administración (INCAA)', category: 'produccion', decade: '2010s' },
        { year: '2018–2019', title: 'Rapiña', detail: 'Elenco — Belisario Club de Cultura', category: 'actuacion', decade: '2010s' },
        { year: '2018', title: '¡Mujeres a la obra!', detail: 'Producción — CELCIT', category: 'produccion', decade: '2010s' },
        { year: '2018', title: 'Premio "Opresión y Libertad"', detail: 'Fondo Metropolitano de la Cultura, las Artes y las Ciencias', category: 'produccion', decade: '2010s' },
        { year: '2018–2019', title: 'Maldichas', detail: 'Producción independiente — Teatro Solís, Montevideo', category: 'produccion', decade: '2010s' },
        { year: '2017–2025', title: 'Los golpes de Clara', detail: 'Producción ejecutiva — texto: Carolina Guevara', category: 'produccion', decade: '2010s' },
        { year: '2019', title: 'Improvisación Mosquito', detail: 'Producción — Productora Demos', category: 'produccion', decade: '2010s' },
        { year: '2020', title: 'Tecnicatura Superior en Pedagogía Social', detail: 'Orientación en Derechos Humanos — IFTS N.º 28', category: 'formacion', decade: '2020s' },
        { year: '2020–2022', title: 'Asistente de cátedra, Pedagogía Social', detail: 'IFTS N.º 28', category: 'docencia', decade: '2020s' },
        { year: '2022', title: 'El amor después del amor', detail: 'Netflix / More Televisión — extra en pantalla, equipo de producción', category: 'produccion', decade: '2020s' },
        { year: '2023', title: 'Mudanza a Dublín', detail: 'Irlanda', category: 'formacion', decade: '2020s' },
        { year: '2023', title: "St. Patrick's Festival", detail: 'Runner de producción (voluntariado)', category: 'produccion', decade: '2020s' },
        { year: '2023–2026', title: 'Argentina Day', detail: 'Productora: La Clave Group', category: 'produccion', decade: '2020s' },
        { year: 'en curso', title: 'By Pass', detail: 'Non Stop / Cinema7 — asistente de producción, dir. Fernán Mirás', category: 'produccion', decade: '2020s' },
        { year: 'temporada 1', title: 'Planners', detail: 'Star+ / PEGSA Group — directora de arte', category: 'produccion', decade: '2020s' },
        { year: '2024', title: 'Rathe Gather Festivalito', detail: 'Clown en escena y asistencia de producción', category: 'actuacion', decade: '2020s' },
        { year: '2025', title: 'The Floor', detail: 'Bigger Stage — runner de producción audiovisual', category: 'produccion', decade: '2020s' },
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
        href: '#crear',
      },
      {
        key: 'ensenar',
        label: 'Enseñar',
        caption: 'Doce años coordinando talleres de teatro para adolescentes.',
        // Sin foto a propósito: el material disponible muestra adolescentes
        // identificables del Programa Adolescencia. Ver regla 4 arriba.
        image: null,
        alt: 'Todavía sin imagen publicable para este pilar',
        href: '#ensenar',
      },
      {
        key: 'producir',
        label: 'Producir',
        caption: 'Producción ejecutiva en teatro independiente, festivales y rodajes.',
        image: '/img/about/los-golpes-de-clara-afiche.jpg',
        alt: 'Afiche de Los golpes de Clara, obra que Nora produjo',
        credit: 'Nicolás Finoli',
        href: '#producir',
      },
    ],

    about: {
      eyebrow: '36 años en artes escénicas',
      titleLead: 'Treinta y seis años',
      titleAccent: 'arriba y detrás del escenario.',
      body1:
        'Me formé en la Escuela Integral de Teatro IFT y cursé la Licenciatura en Dirección Escénica en la UNA. Trabajé diez años con el grupo Los Ranz, cinco en el Colectivo Teatral Puerta Roja de Marcelo Subiotto, y desde 2015 integro la compañía Boquitas Pintadas.',
      body2:
        'En paralelo coordiné durante doce años el Programa Adolescencia del Gobierno de la Ciudad de Buenos Aires —talleres artísticos para adolescentes en contextos de vulnerabilidad— y trabajé en producción de cine y televisión para Netflix, HBO, Star+ y Disney. Desde 2023 vivo en Dublín, donde participé del St. Patrick’s Festival, Argentina Day y el Rathe Gather Festival.',
      cta: 'Escribime',
      galleryTitle: 'Del archivo',
      /** Aclaración fija al pie del archivo — refuerza la regla 2 en pantalla. */
      galleryNote: 'Cada pieza indica el rol que ocupé en esa producción.',
      gallery: GALLERY_ES,
    },

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
    },
  },

  en: {
    htmlLang: 'en',
    skipLink: 'Skip to content',
    langToggle: { label: 'Ver el sitio en español', short: 'ES' },

    hero: {
      firstName: 'Nora',
      lastName: 'Filmus',
      role: 'Actor · Producer · Theatre educator',
      bio: 'Thirty-six years in the performing arts, between Buenos Aires and Dublin. I act, I produce for stage and screen, and I run arts education programmes.',
      cta: 'See my work',
      location: 'Dublin, Ireland',
      portraitAlt: 'Profile portrait of Nora Filmus',
    },

    nav: { home: 'Home', about: 'About', trayectoria: 'Timeline' },

    crear: {
      eyebrow: 'Acting',
      titleLead: 'On stage',
      titleAccent: 'since 1990.',
      body1:
        'I started studying theatre at fourteen with Alicia Aller, and went on training with Fabio Mosquito Sancineto, Héctor Beacón, Marisa Salas and Marcelo Subiotto, among others — I completed three years of a degree in Stage Direction at Argentina’s National University of the Arts (UNA). I spent ten years acting with the company Los Ranz, performing in venues including the Teatro Colón and the Centro Cultural Recoleta in Buenos Aires, and took part in La Comuna Orgón, directed by Marcelo Subiotto at Teatro Puerta Roja.',
      body2:
        'I co-wrote and performed in Chicha, Carmen y Angelita, joined the cast of Rapiña, and have been part of the company Boquitas Pintadas since 2015, performing in Que no quede huella. In film and television I’ve worked as an extra on productions for Disney, RAI and Telefé.',
      image: {
        src: '/img/about/rapina-foto-5.jpg',
        alt: 'Scene from "Bañera", part of Rapiña',
        credit: 'Marcela Russarabian',
        caption: 'Rapiña · "Bañera" · 2017–2019',
      },
      stageTitle: 'Theatre',
      stageCredits: [
        {
          work: 'Rapiña',
          detail: 'Ensemble cast · Belisario Club de Cultura, Buenos Aires',
          years: '2017–2019',
          image: {
            src: '/img/crear/rapina-tarantulas.jpg',
            alt: 'Scene from "Como las tarántulas", part of Rapiña',
            credit: 'Marcela Russarabian',
          },
        },
        { work: 'Que no quede huella', detail: 'Boquitas Pintadas company', years: 'since 2015' },
        { work: 'Chicha, Carmen y Angelita', detail: 'Writer and performer', years: '2010–2013' },
        { work: 'La Comuna Orgón', detail: 'Dir. Marcelo Subiotto', years: '2010–2011' },
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
        'Since 2012 I have coordinated Programa Adolescencia for the City of Buenos Aires — a rights programme for teenagers in vulnerable social contexts — delivered through three civil associations: the Federación de Instituciones Comunitarias, the Espacio Cultural Oliverio Girondo, and, since 2019, Asociación FACE. I design and coordinate the yearly artistic projects, put together the teaching pairs of artistic instructors and social workers, and act as the point of contact with the City\'s child and adolescent welfare office.',
      body2:
        'I also ran theatre workshops at the Instituto de Menores San Martín (a juvenile detention facility), at secondary schools in Marcos Paz, and at the Las Flores community canteen in Vicente López, and since 2017 I have taught theatre to older adults under PAMI, Argentina\'s public health programme for retirees. I completed a further-education degree in Social Pedagogy with a focus on Human Rights, and was a teaching assistant for Social Pedagogy at IFTS Nº 28. In 2015 and 2018 I won the "Jóvenes Creadores" award (SENAF / Asociación Argentina de Actores) and the "Opresión y Libertad" award (Fondo Metropolitano de la Cultura, las Artes y las Ciencias).',
      statNumber: '12',
      statLabel: 'years coordinating Programa Adolescencia — no publishable photos: the material shows teenagers in vulnerable circumstances.',
      coordTitle: 'Coordination',
      coordCredits: [
        { work: 'Programa Adolescencia', detail: 'Asociación FACE — City of Buenos Aires', years: 'since 2019' },
        { work: 'Programa Adolescencia', detail: 'Espacio Cultural Oliverio Girondo — City of Buenos Aires', years: '2015–2018' },
        { work: 'Programa Adolescencia', detail: 'Federación de Instituciones Comunitarias — City of Buenos Aires', years: '2012–2014' },
      ],
      teachTitle: 'Teaching',
      teachCredits: [
        { work: 'Theatre for older adults', detail: 'Fundación Encanto por la Vida — PAMI programme', years: 'since 2017' },
        { work: 'Teaching assistant, Social Pedagogy', detail: 'IFTS Nº 28', years: '2020–2022' },
        { work: 'Theatre for children and teenagers', detail: 'Escuela de Danzas Reina Reech', years: '2017–2019' },
        { work: 'Theatre for teenagers in detention', detail: 'Instituto de Menores San Martín — Jóvenes Creadores programme', years: '2015–2016' },
        { work: 'Theatre and movement', detail: 'Las Flores community canteen, Vicente López', years: '2014–2015' },
      ],
    },

    producir: {
      eyebrow: 'Production',
      titleLead: 'Behind the scenes,',
      titleAccent: 'in theatre and on screen.',
      body1:
        'I produced independent theatre —Los golpes de Clara, ¡Mujeres a la obra! at CELCIT, Improvisación Mosquito, Maldichas at the Teatro Solís in Montevideo— and managed the Proteatro grant for Que no quede huella. In film and television I worked on production teams for Star+, Netflix and HBO: I was art director on Planners (Star+), and I am a production assistant on By Pass, the film Fernán Mirás is directing for Non Stop and Cinema7.',
      body2:
        'Since moving to Dublin I have added event production to that: I have coordinated Argentina Day for La Clave Group since 2023, worked as a production runner at the St. Patrick\'s Festival and the Rathe Gather Festivalito, and joined the production crew for the TV show The Floor for the production company Bigger Stage.',
      image: {
        src: '/img/about/los-golpes-de-clara-foto-2.jpg',
        alt: 'Scene from Los golpes de Clara, a production Nora produced',
        credit: 'Nicolás Finoli',
        caption: 'Los golpes de Clara · Executive producer · 2017–2025',
      },
      stageTitle: 'Theatre',
      stageCredits: [
        {
          work: 'Los golpes de Clara',
          detail: 'Executive producer — text: Carolina Guevara',
          years: '2017–2025',
          image: {
            src: '/img/about/los-golpes-de-clara-afiche.jpg',
            alt: 'Poster for Los golpes de Clara, a production Nora produced',
            credit: 'Nicolás Finoli',
          },
        },
        {
          work: '¡Mujeres a la obra!',
          detail: 'Producer — theatre & feminism festival, CELCIT',
          years: '2018',
          image: {
            src: '/img/about/mujeres-a-la-obra-afiche.jpg',
            alt: 'Poster for the ¡Mujeres a la obra! season',
            credit: 'CELCIT',
          },
        },
        { work: 'Maldichas', detail: 'Independent production — Teatro Solís, Montevideo', years: '2018–2019' },
        { work: 'Improvisación Mosquito', detail: 'Producer — Productora Demos, Teatro Porteño', years: '2019' },
        { work: 'Que no quede huella', detail: 'Managed the Proteatro grant', years: '2015–2017' },
      ],
      screenTitle: 'Film, TV & streaming',
      screenCredits: [
        { work: 'By Pass', detail: 'Non Stop / Cinema7 — production assistant, dir. Fernán Mirás', years: 'ongoing' },
        { work: 'Planners', detail: 'Star+ / PEGSA Group — art director, dir. Daniel Barone', years: 'season 1' },
        { work: 'El amor después del amor', detail: 'Netflix / More Televisión — production team', years: '2022' },
        { work: 'Todavía', detail: 'Sánchez Cine — head of administration (INCAA)', years: '2017–2018' },
      ],
      irelandTitle: 'Ireland',
      irelandCredits: [
        { work: 'Argentina Day', detail: 'Producer: La Clave Group', years: '2023–2026' },
        { work: 'The Floor', detail: 'TV show — Bigger Stage, production runner', years: '2025' },
        { work: 'Rathe Gather Festivalito', detail: 'Production assistance and runner', years: '2024' },
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
        { year: '2010–2011', title: 'La Comuna Orgón', detail: 'Dir. Marcelo Subiotto — Teatro Puerta Roja', category: 'actuacion', decade: '2010s' },
        { year: '2010–2015', title: 'Chicha, Carmen y Angelita', detail: 'Writer and performer — Boquitas Pintadas company', category: 'actuacion', decade: '2010s' },
        { year: '2012–2013', title: 'Theatre teacher for teenagers', detail: 'Programa Adolescencia — Federación de Instituciones Comunitarias', category: 'docencia', decade: '2010s' },
        { year: '2012–2024', title: 'Coordinator, Programa Adolescencia', detail: 'City of Buenos Aires', category: 'produccion', decade: '2010s' },
        { year: '2014–2015', title: 'Theatre and movement', detail: 'Las Flores community canteen, Vicente López', category: 'docencia', decade: '2010s' },
        { year: '2015–2016', title: 'Theatre for teenagers in detention', detail: 'Instituto de Menores San Martín — Jóvenes Creadores programme', category: 'docencia', decade: '2010s' },
        { year: '2015', title: '"Jóvenes Creadores" award', detail: 'SENAF / Asociación Argentina de Actores', category: 'docencia', decade: '2010s' },
        { year: '2015–2017', title: 'Que no quede huella', detail: 'Boquitas Pintadas company — performer and managed the Proteatro grant', category: 'actuacion', decade: '2010s' },
        { year: '2017–2019', title: 'Theatre for children and teenagers', detail: 'Escuela de Danzas Reina Reech', category: 'docencia', decade: '2010s' },
        { year: 'since 2017', title: 'Theatre for older adults', detail: 'Fundación Encanto por la Vida — PAMI programme', category: 'docencia', decade: '2010s' },
        { year: '2017–2018', title: 'Todavía', detail: 'Sánchez Cine — head of administration (INCAA)', category: 'produccion', decade: '2010s' },
        { year: '2018–2019', title: 'Rapiña', detail: 'Ensemble cast — Belisario Club de Cultura', category: 'actuacion', decade: '2010s' },
        { year: '2018', title: '¡Mujeres a la obra!', detail: 'Producer — CELCIT', category: 'produccion', decade: '2010s' },
        { year: '2018', title: '"Opresión y Libertad" award', detail: 'Fondo Metropolitano de la Cultura, las Artes y las Ciencias', category: 'produccion', decade: '2010s' },
        { year: '2018–2019', title: 'Maldichas', detail: 'Independent production — Teatro Solís, Montevideo', category: 'produccion', decade: '2010s' },
        { year: '2017–2025', title: 'Los golpes de Clara', detail: 'Executive producer — text: Carolina Guevara', category: 'produccion', decade: '2010s' },
        { year: '2019', title: 'Improvisación Mosquito', detail: 'Producer — Productora Demos', category: 'produccion', decade: '2010s' },
        { year: '2020', title: 'Further-education degree in Social Pedagogy', detail: 'Human Rights focus — IFTS Nº 28', category: 'formacion', decade: '2020s' },
        { year: '2020–2022', title: 'Teaching assistant, Social Pedagogy', detail: 'IFTS Nº 28', category: 'docencia', decade: '2020s' },
        { year: '2022', title: 'El amor después del amor', detail: 'Netflix / More Televisión — on-screen extra, production team', category: 'produccion', decade: '2020s' },
        { year: '2023', title: 'Moved to Dublin', detail: 'Ireland', category: 'formacion', decade: '2020s' },
        { year: '2023', title: "St. Patrick's Festival", detail: 'Production runner (volunteer)', category: 'produccion', decade: '2020s' },
        { year: '2023–2026', title: 'Argentina Day', detail: 'Producer: La Clave Group', category: 'produccion', decade: '2020s' },
        { year: 'ongoing', title: 'By Pass', detail: 'Non Stop / Cinema7 — production assistant, dir. Fernán Mirás', category: 'produccion', decade: '2020s' },
        { year: 'season 1', title: 'Planners', detail: 'Star+ / PEGSA Group — art director', category: 'produccion', decade: '2020s' },
        { year: '2024', title: 'Rathe Gather Festivalito', detail: 'Clown performance and production assistance', category: 'actuacion', decade: '2020s' },
        { year: '2025', title: 'The Floor', detail: 'Bigger Stage — production runner', category: 'produccion', decade: '2020s' },
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
        href: '#crear',
      },
      {
        key: 'ensenar',
        label: 'Teach',
        caption: 'Twelve years running theatre workshops for teenagers.',
        image: null,
        alt: 'No publishable image for this strand yet',
        href: '#ensenar',
      },
      {
        key: 'producir',
        label: 'Produce',
        caption: 'Executive production across independent theatre, festivals and film sets.',
        image: '/img/about/los-golpes-de-clara-afiche.jpg',
        alt: 'Poster for Los golpes de Clara, a production Nora produced',
        credit: 'Nicolás Finoli',
        href: '#producir',
      },
    ],

    about: {
      eyebrow: '36 years in the performing arts',
      titleLead: 'Thirty-six years',
      titleAccent: 'on stage and behind it.',
      body1:
        'I trained at the IFT Integral Theatre School and studied Stage Direction at Argentina’s National University of the Arts (UNA). I spent ten years with the company Los Ranz, five with Marcelo Subiotto’s Colectivo Teatral Puerta Roja, and I have been part of the Boquitas Pintadas company since 2015.',
      body2:
        'Alongside that, I spent twelve years coordinating Programa Adolescencia for the City of Buenos Aires — arts workshops for teenagers in vulnerable contexts — and worked in film and television production for Netflix, HBO, Star+ and Disney. Since 2023 I have been based in Dublin, working on the St. Patrick’s Festival, Argentina Day and the Rathe Gather Festival.',
      cta: 'Get in touch',
      galleryTitle: 'From the archive',
      galleryNote: 'Each piece states the role I held in that production.',
      gallery: GALLERY_EN,
    },

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
    },
  },
};

/** Links que no dependen del idioma. */
export const LINKS = {
  instagram: 'https://www.instagram.com/noraritafilmus/',
  linkedin: 'https://www.linkedin.com/in/nora-filmus-ab353013/',
  email: 'mailto:norafilmus@gmail.com',
} as const;
