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
  pillars: Pillar[];
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

    pillars: [
      {
        key: 'crear',
        label: 'Crear',
        caption: 'Actriz en teatro, cine y televisión desde 1990.',
        image: '/img/menu/rapina.jpg',
        alt: 'Escena de Rapiña, obra en la que Nora integró el elenco',
        credit: 'Marcela Russarabian',
        href: null,
      },
      {
        key: 'ensenar',
        label: 'Enseñar',
        caption: 'Doce años coordinando talleres de teatro para adolescentes.',
        // Sin foto a propósito: el material disponible muestra adolescentes
        // identificables del Programa Adolescencia. Ver regla 4 arriba.
        image: null,
        alt: 'Todavía sin imagen publicable para este pilar',
        href: null,
      },
      {
        key: 'producir',
        label: 'Producir',
        caption: 'Producción ejecutiva en teatro independiente, festivales y rodajes.',
        image: '/img/about/los-golpes-de-clara-afiche.jpg',
        alt: 'Afiche de Los golpes de Clara, obra que Nora produjo',
        credit: 'Nicolás Finoli',
        href: null,
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

    pillars: [
      {
        key: 'crear',
        label: 'Create',
        caption: 'Acting for stage, film and television since 1990.',
        image: '/img/menu/rapina.jpg',
        alt: 'Scene from Rapiña, a production Nora performed in',
        credit: 'Marcela Russarabian',
        href: null,
      },
      {
        key: 'ensenar',
        label: 'Teach',
        caption: 'Twelve years running theatre workshops for teenagers.',
        image: null,
        alt: 'No publishable image for this strand yet',
        href: null,
      },
      {
        key: 'producir',
        label: 'Produce',
        caption: 'Executive production across independent theatre, festivals and film sets.',
        image: '/img/about/los-golpes-de-clara-afiche.jpg',
        alt: 'Poster for Los golpes de Clara, a production Nora produced',
        credit: 'Nicolás Finoli',
        href: null,
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
  },
};

/** Links que no dependen del idioma. */
export const LINKS = {
  instagram: 'https://www.instagram.com/noraritafilmus/',
  linkedin: 'https://www.linkedin.com/in/nora-filmus-ab353013/',
  email: 'mailto:norafilmus@gmail.com',
} as const;
