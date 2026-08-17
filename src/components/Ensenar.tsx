import { useLanguage } from '@/src/i18n/LanguageContext';
import CreditList from './CreditList';
import Reveal from './Reveal';
import Section from './Section';

/**
 * `#ensenar` — el pilar pedagoga (SUPERPROMPT.md §6, F3). El desafío de esta
 * sección es que NO tiene foto: el material de docencia disponible viene del
 * Programa Adolescencia y muestra adolescentes en situación de vulnerabilidad
 * social, identificables — no se publica sin consentimiento escrito (regla 4
 * de `content.ts`). En vez de dejar un hueco o forzar una imagen que no
 * corresponde, el lugar de la foto lo ocupa el mismo tratamiento que ya usa
 * `PillarMenu` para este mismo pilar cuando no hay imagen: un bloque con
 * borde tenue (`border-cream/10 bg-cream/[0.03]`) — acá, en vez de vacío,
 * lleva el dato que más define el rol: los años coordinando el programa.
 *
 * Créditos curados de `CV/NoraFilmus2023PedCoord.docx` y
 * `CV/FilmusProgramaAdolescencia.docx` — no es la lista completa (eso es
 * Trayectoria, F5).
 */
export default function Ensenar() {
  const { t } = useLanguage();
  const { ensenar } = t;

  return (
    <Section
      id="ensenar"
      eyebrow={ensenar.eyebrow}
      titleLead={ensenar.titleLead}
      titleAccent={ensenar.titleAccent}
      body={
        <>
          <p>{ensenar.body1}</p>
          <p className="mt-4">{ensenar.body2}</p>
        </>
      }
    >
      <div className="grid gap-10 md:grid-cols-2 md:gap-14">
        <Reveal
          as="div"
          delay={0.1}
          className="flex flex-col justify-center gap-4 rounded-lg border border-cream/10 bg-cream/[0.03] p-8 md:p-10"
        >
          <span className="font-display text-display-xl leading-none text-brand-red">
            {ensenar.statNumber}
          </span>
          <p className="max-w-[28ch] font-label text-xs leading-relaxed text-cream/50">
            {ensenar.statLabel}
          </p>
        </Reveal>

        <div className="flex flex-col gap-10">
          <CreditList title={ensenar.coordTitle} items={ensenar.coordCredits} />
          <CreditList title={ensenar.teachTitle} items={ensenar.teachCredits} />
        </div>
      </div>
    </Section>
  );
}
