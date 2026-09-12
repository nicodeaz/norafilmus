import { FileText, Instagram, Linkedin, Mail } from 'lucide-react';
import { CONTACT_FORM_ENABLED, SIGNATURE_WALL_ENABLED } from '@/lib/features';
import { LINKS } from '@/src/i18n/content';
import { useLanguage } from '@/src/i18n/LanguageContext';
import ContactForm from './ContactForm';
import Picture from './Picture';
import Reveal from './Reveal';
import SignatureWall from './SignatureWall';

/**
 * Contacto (F7, 2026-08-30) + formulario/pared de firmas (2026-09-07) —
 * ruta `/contacto`, cierre del sitio. El correo/redes ya vivían como íconos
 * en el Hero y en `Footer` (`LINKS`/`social`, reusados tal cual acá) pero
 * nunca tuvieron una página propia que los presente como CTA —
 * SUPERPROMPT.md §05: "sin esto el sitio no genera un solo trabajo".
 *
 * **Rediseño 2026-09-09, dos vueltas.** Primera vuelta: la página abría con
 * un bloque de texto y recién más abajo, chico, adentro del grid del
 * formulario, aparecía un retrato — se reemplazó por una foto banner a todo
 * el ancho arriba (`DSC01947.jpg`, sesión "Norah_", mismo crédito que
 * `hero.portraitCredit` = "Paula") con el texto centrado debajo.
 *
 * **Segunda vuelta, pedido explícito** ("la foto de Nora a la izquierda y el
 * resto a la derecha"): esa primera versión apilaba foto arriba/texto abajo
 * — lo que el usuario quería en realidad es el split horizontal que ya usa
 * el Hero (`Hero.tsx`), pero espejado: ahí el video sangra por la derecha y
 * el texto vive a la izquierda; acá la foto sangra por la IZQUIERDA (`absolute
 * inset-y-0 left-0`, `mask-image` que funde su borde derecho hacia `bg-ink`
 * en vez de un corte duro) y el bloque de texto (eyebrow, título, bio, CTA de
 * mail, redes — alineado a la izquierda, ya no centrado) ocupa la columna de
 * la derecha, empujado con `padding-left` para no superponerse al panel. En
 * mobile (`md:hidden`) el panel absoluto no cabe — vuelve el banner a todo el
 * ancho arriba de la primera vuelta, apilado sobre el texto.
 *
 * **Tercera vuelta, mismo pedido de proporción exacta** ("la foto 1/3, el
 * container de la derecha 2/3"): primer intento, el panel pasó de
 * `w-[44%]`/`lg:w-[40%]` a `w-1/3` fijo y el `padding-left` del texto a
 * `calc(33.333%+…)`. Roto de fábrica: el panel usaba `position: absolute`
 * (relativo al ancho REAL del viewport), pero el texto vivía en un
 * `max-w-7xl` centrado — el `%` de un `padding-left` se resuelve contra el
 * ancho del *contenedor*, no contra el ancho ya acotado por `max-w-7xl` del
 * propio elemento. En un monitor de 1920px el padding-left comido por el
 * 33% del viewport (~640px) se descontaba de una caja fija de 1280px,
 * dejando una columna de texto más angosta que en un monitor más chico —
 * exactamente al revés de lo esperable — y `norafilmus@gmail.com` volvía a
 * partirse a la mitad.
 *
 * **Cuarta vuelta, mismo día:** se saca el `absolute`/`padding-left`
 * calculado y el `max-w-7xl` de la fila entera — ahora es un flex real
 * (`md:flex-row`, panel `md:w-1/3`, texto `md:w-2/3`), donde el ancho de cada
 * columna es un porcentaje directo del ancho del flex container (la sección
 * completa), sin una segunda caja de ancho fijo compitiendo en el medio. La
 * proporción 1/3·2/3 queda exacta en cualquier viewport, no solo en el que
 * se probó la vez anterior.
 *
 * **Quinta vuelta, mismo día** ("en mobile quiero que la foto se vea a la
 * izquierda y el resto a la derecha, igual que en desktop 1/3 y 2/3"): la
 * fila deja de cambiar a columna apilada bajo `md` — es `flex-row` (1/3·2/3)
 * en cualquier tamaño. Se unifican los dos bloques de foto (panel desktop +
 * banner mobile apilado de la segunda vuelta) en uno solo, siempre visible.
 *
 * **La foto cambia a una toma real en Irlanda, con marca de agua
 * (2026-09-12), pedido explícito.** Primer intento: reemplazar la foto de
 * `DSC01947.jpg` (sesión "Norah_") por una vista de Dublín generada con
 * fal.ai/Seedream (sin foto real de por medio) — el usuario la vio y la
 * rechazó ("ninguna, usemos esta"), pidiendo en cambio una foto real que ya
 * existe en el archivo. Versión final: `rita-universos-DSC01731.jpg` — Nora
 * como su personaje de clown "Rita Universos", en una terraza en Dublín
 * (mismo edificio/sesión que ya usa la galería de `/crear`, crédito "Paula";
 * reusa el archivo ya optimizado en `/img/crear/galeria/`, no se duplica el
 * binario). Sigue siendo una foto real de Nora con su crédito real — la
 * marca de agua (firma de Nora, `nora-firma-roja.png`, chica y
 * semitransparente) se agrega IGUAL, en la esquina opuesta al crédito de
 * foto para no superponerse, como capa extra de marca — no reemplaza al
 * crédito de la fotógrafa, que sigue siendo verdadero acá.
 *
 * `ContactForm` y `SignatureWall` siguen full-width más abajo, fuera de este
 * split — no tiene sentido angostarlos junto a la foto. Los dos están detrás
 * de flags en `lib/features.ts` (`CONTACT_FORM_ENABLED`/
 * `SIGNATURE_WALL_ENABLED`, los dos en `false` desde 2026-09-10 — "sacá esto
 * por ahora... luego lo agregamos"): mientras los dos estén apagados, el
 * bloque entero no se renderiza.
 */
export default function Contacto() {
  const { t } = useLanguage();
  const { contacto, hero } = t;

  return (
    <section className="relative w-full overflow-hidden bg-ink">
      {/* ── Intro: foto a la izquierda (sangra al borde), texto a la derecha ──
          Flex real (`flex-row`, `w-1/3`/`w-2/3`) en vez de un panel
          `absolute` + `padding-left` en porcentaje — ver docblock, "cuarta
          vuelta", por qué. `min-h-[70vh]` le da a la foto una altura real
          de banner en vez de recortarse a la altura del texto.
          **Quinta vuelta (2026-09-10):** "en mobile quiero que la foto se
          vea a la izquierda y el resto a la derecha, igual que en desktop
          1/3 y 2/3" — la fila ya no cambia a columna apilada bajo `md`, es
          fila (1/3·2/3) en todos los tamaños. Se unifican los dos bloques de
          foto que había (panel desktop + banner mobile apilado) en uno solo,
          siempre visible. */}
      <div className="relative flex w-full min-h-[70vh] flex-row sm:min-h-[75vh] md:min-h-[80vh]">
        {/* Panel de foto — columna de 1/3 (pedido explícito) en cualquier
            tamaño, sangra al borde izquierdo del viewport. */}
        <div className="relative w-1/3 shrink-0 overflow-hidden [mask-image:linear-gradient(to_left,transparent,black_28%)] [-webkit-mask-image:linear-gradient(to_left,transparent,black_28%)]">
          <Picture
            src="/img/crear/galeria/rita-universos-DSC01731.jpg"
            alt={contacto.photoAlt}
            sizes="34vw"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            pictureClassName="absolute inset-0 block h-full w-full"
            className="h-full w-full object-cover object-[50%_14%]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/25" />
          {/* Crédito de la foto — regla 3 de content.ts, foto real. */}
          <span className="pointer-events-none absolute bottom-4 left-5 font-label text-[10px] uppercase tracking-[0.15em] text-cream/60 [writing-mode:vertical-rl]">
            Foto: {hero.portraitCredit}
          </span>
          {/* Marca de agua — firma de Nora, chica y sutil, esquina opuesta al
              crédito para no superponerse (pedido explícito, 2026-09-12).
              `top-20` y no `top-4`: el `Header` global es `fixed` y se
              superpone a esta sección desde y=0 (no empuja el layout) — con
              `top-4` la marca de agua quedaba tapada detrás de la barra
              superior, invisible aunque el DOM la tuviera bien puesta. */}
          <Picture
            src="/img/nora-firma-roja.png"
            alt=""
            sizes="80px"
            loading="lazy"
            decoding="async"
            pictureClassName="pointer-events-none absolute left-4 top-20 block w-14 opacity-35 sm:w-16"
            className="h-auto w-full"
          />
        </div>

        {/* Texto — columna de 2/3, alineado a la izquierda como en
            `Act.tsx`/`Hero.tsx`. Ancho real de flex item, no un padding
            calculado — así la proporción 1/3·2/3 se mantiene en cualquier
            viewport, no solo en el que se probó. */}
        <div
          className="relative z-10 flex w-2/3 flex-col justify-center px-4 py-10 sm:px-8 sm:py-16 md:px-12 md:py-16 lg:px-16"
          style={{
            backgroundImage:
              'radial-gradient(circle at 78% 12%, rgba(229,57,53,0.06), transparent 28%)',
          }}
        >
          <Reveal as="div" className="flex items-center gap-3">
            <span className="h-px w-8 bg-brand-red" aria-hidden />
            <span className="font-label text-xs uppercase tracking-[0.25em] text-brand-red">
              {contacto.eyebrow}
            </span>
          </Reveal>

          <Reveal
            as="h2"
            delay={0.1}
            className="mt-6 text-display-l font-display uppercase leading-[0.95] text-cream"
          >
            {contacto.titleLead} <span className="text-brand-red">{contacto.titleAccent}</span>
          </Reveal>

          <Reveal as="p" delay={0.15} className="mt-6 max-w-md text-body font-body leading-relaxed text-cream/80">
            {contacto.body}
          </Reveal>

          <Reveal as="div" delay={0.2} className="mt-10">
            <span className="mb-3 block font-label text-xs uppercase tracking-[0.2em] text-cream/50">
              {contacto.emailLabel}
            </span>
            <a
              href={LINKS.email}
              className="group inline-flex items-center gap-4 font-display text-3xl uppercase leading-none text-cream transition-colors duration-300 hover:text-brand-red sm:text-4xl lg:text-5xl"
            >
              <Mail className="h-7 w-7 shrink-0 text-brand-red transition-transform duration-300 group-hover:-translate-y-0.5 sm:h-9 sm:w-9" />
              {/* `<wbr />` en vez de `break-all`: si la columna de 2/3 no
                  alcanza (viewports angostos tipo tablet, ~768–900px), corta
                  entre usuario y dominio en vez de partir "GMAIL.COM" a la
                  mitad de cualquier manera. */}
              <span>
                {LINKS.email.replace('mailto:', '').split('@')[0]}
                <wbr />@{LINKS.email.replace('mailto:', '').split('@')[1]}
              </span>
            </a>
          </Reveal>

          <Reveal as="div" delay={0.3} className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <a
              href={LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 font-label text-xs uppercase tracking-[0.15em] text-cream/60 transition-colors duration-300 hover:text-brand-red"
            >
              <Instagram className="h-4 w-4" />
              {t.social.instagram}
            </a>
            <a
              href={LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 font-label text-xs uppercase tracking-[0.15em] text-cream/60 transition-colors duration-300 hover:text-brand-red"
            >
              <Linkedin className="h-4 w-4" />
              {t.social.linkedin}
            </a>
            <span className="font-label text-xs uppercase tracking-[0.15em] text-cream/50">
              {hero.location}
            </span>
            <a
              href={LINKS.cv}
              download
              className="inline-flex min-h-11 items-center gap-2 font-label text-xs uppercase tracking-[0.15em] text-cream/60 transition-colors duration-300 hover:text-brand-red"
            >
              <FileText className="h-4 w-4" />
              {t.about.cvLabel}
            </a>
          </Reveal>
        </div>
      </div>

      {/* Formulario + firmas — full width, fuera del split de arriba.
          Los dos ocultos por ahora (2026-09-10, pedido explícito: "sacá esto
          por ahora... luego lo agregamos") — ver `CONTACT_FORM_ENABLED`/
          `SIGNATURE_WALL_ENABLED` en lib/features.ts. Con los dos en `false`
          el bloque entero deja de renderizarse (si no, quedaba un tramo de
          `ink` vacío solo con el padding del wrapper, sin contenido
          adentro). */}
      {(CONTACT_FORM_ENABLED || SIGNATURE_WALL_ENABLED) && (
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 md:px-12 md:py-24">
          {CONTACT_FORM_ENABLED && (
            <Reveal as="div" className="mx-auto max-w-xl border-t border-cream/10 pt-16">
              <ContactForm />
            </Reveal>
          )}

          {/* "Firmá el programa" — pared de firmas pública, ver docblock de SignatureWall. */}
          {SIGNATURE_WALL_ENABLED && (
            <div className={CONTACT_FORM_ENABLED ? 'mt-24 border-t border-cream/10 pt-16' : 'border-t border-cream/10 pt-16'}>
              <SignatureWall />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
