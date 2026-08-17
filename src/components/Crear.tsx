import { useLanguage } from '@/src/i18n/LanguageContext';
import CreditList from './CreditList';
import Picture from './Picture';
import Reveal from './Reveal';
import Section from './Section';

/**
 * `#crear` — el pilar actriz. Primer sección construida sobre la primitiva
 * `Section` de F0 (SUPERPROMPT.md §6, F2). Fuente de los créditos:
 * `CV/cv cuasi completo_.docx` (Experiencia Actoral, Cine/Publicidad) y
 * `content/alternativa-teatral-panel/notes.md` — no la lista completa del
 * CV (eso es trabajo de la Trayectoria en F5), sino una selección curada.
 *
 * `Los golpes de Clara` NO aparece acá aunque tenga fotos disponibles: Nora
 * lo produjo pero no actuó (es un unipersonal de Carolina Guevara) — va en
 * `#producir` (F4). Ver regla 2 del docblock de `content.ts`.
 */
export default function Crear() {
  const { t } = useLanguage();
  const { crear } = t;

  return (
    <Section
      id="crear"
      eyebrow={crear.eyebrow}
      titleLead={crear.titleLead}
      titleAccent={crear.titleAccent}
      body={
        <>
          <p>{crear.body1}</p>
          <p className="mt-4">{crear.body2}</p>
        </>
      }
    >
      <div className="grid gap-10 md:grid-cols-2 md:gap-14">
        <Reveal as="figure" delay={0.1}>
          <Picture
            src={crear.image.src}
            alt={crear.image.alt}
            sizes="(min-width: 768px) 50vw, 100vw"
            loading="lazy"
            decoding="async"
            className="w-full rounded-lg object-cover"
          />
          <figcaption className="mt-3 font-label text-xs leading-snug text-cream/50">
            <span className="block text-cream/70">{crear.image.caption}</span>
            <span className="block text-cream/30">Foto: {crear.image.credit}</span>
          </figcaption>
        </Reveal>

        <div className="flex flex-col gap-10">
          <CreditList title={crear.stageTitle} items={crear.stageCredits} />
          <CreditList title={crear.screenTitle} items={crear.screenCredits} />
        </div>
      </div>
    </Section>
  );
}
