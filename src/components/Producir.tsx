import { useLanguage } from '@/src/i18n/LanguageContext';
import CreditList from './CreditList';
import Picture from './Picture';
import Reveal from './Reveal';
import Section from './Section';

/**
 * `#producir` — el pilar productora, último de los tres (SUPERPROMPT.md §6,
 * F4). Fuente: `CV/Historial Para CV de distintas areas.docx`, la más
 * detallada de las que hay (trae referencia y contacto por proyecto).
 *
 * Dos correcciones que salieron de leer esta fuente con cuidado:
 * - `Improvisación Mosquito` estaba marcada como rol sin verificar en
 *   `content/alternativa-teatral/notes.md` (no aparece en la ficha pública
 *   de la obra, el dato venía solo del usuario). Esta fuente lo confirma en
 *   primera persona ("Obra 'Improvisación Mosquito' Productora Demos") —
 *   ya se puede usar con confianza.
 * - `El amor después del amor` (Netflix) figura en la sección de actuación
 *   del mismo CV como "Extra", no como el crédito de producción que decía
 *   un borrador de CV anterior. Acá se cuenta como trabajo de equipo de
 *   producción (coherente con la lista general de productoras del CV:
 *   "asistente de producción/productora de arte... para Star+, Netflix,
 *   HBO"); el crédito de actriz para el mismo título ya vive en `Crear.tsx`.
 *   Las dos cosas pueden ser ciertas a la vez, no se contradicen.
 *
 * Imagen: mismo afiche de `Los golpes de Clara` que usa el pilar en
 * `PillarMenu` — no se repite ninguna foto de `Crear`.
 */
export default function Producir() {
  const { t } = useLanguage();
  const { producir } = t;

  return (
    <Section
      id="producir"
      eyebrow={producir.eyebrow}
      titleLead={producir.titleLead}
      titleAccent={producir.titleAccent}
      body={
        <>
          <p>{producir.body1}</p>
          <p className="mt-4">{producir.body2}</p>
        </>
      }
    >
      <div className="grid gap-10 md:grid-cols-2 md:gap-14">
        <Reveal as="figure" delay={0.1}>
          <Picture
            src={producir.image.src}
            alt={producir.image.alt}
            sizes="(min-width: 768px) 50vw, 100vw"
            loading="lazy"
            decoding="async"
            className="w-full rounded-lg object-cover"
          />
          <figcaption className="mt-3 font-label text-xs leading-snug text-cream/50">
            <span className="block text-cream/70">{producir.image.caption}</span>
            <span className="block text-cream/30">Foto: {producir.image.credit}</span>
          </figcaption>
        </Reveal>

        <div className="flex flex-col gap-10">
          <CreditList title={producir.stageTitle} items={producir.stageCredits} />
          <CreditList title={producir.screenTitle} items={producir.screenCredits} />
          <CreditList title={producir.irelandTitle} items={producir.irelandCredits} />
        </div>
      </div>
    </Section>
  );
}
