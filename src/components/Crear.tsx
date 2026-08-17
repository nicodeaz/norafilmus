import { useLanguage } from '@/src/i18n/LanguageContext';
import Act from './Act';
import CreditList from './CreditList';

/**
 * Acto I — Crear, el pilar actriz. Fuente de los créditos:
 * `CV/cv cuasi completo_.docx` (Experiencia Actoral, Cine/Publicidad) y
 * `content/alternativa-teatral-panel/notes.md` — no la lista completa del
 * CV (eso es trabajo de la Trayectoria), sino una selección curada.
 *
 * `Los golpes de Clara` NO aparece acá aunque tenga fotos disponibles: Nora
 * lo produjo pero no actuó (es un unipersonal de Carolina Guevara) — va en
 * el Acto III. Ver regla 2 del docblock de `content.ts`.
 *
 * Foto ancla: `rapina-foto-5.jpg` ("Bañera") — un archivo distinto del que
 * usa el mosaico del Hero para este pilar (`rapina.jpg`) y del que ya vive
 * adentro del acordeón de Rapiña (`rapina-tarantulas.jpg`, "Tarántulas").
 * Tres fotos reales de la misma obra, ninguna repetida.
 */
export default function Crear() {
  const { t } = useLanguage();
  const { crear } = t;

  return (
    <Act
      id="crear"
      numeral="I"
      align="left"
      eyebrow={crear.eyebrow}
      titleLead={crear.titleLead}
      titleAccent={crear.titleAccent}
      image={crear.image}
      body={
        <>
          <p>{crear.body1}</p>
          <p className="mt-4">{crear.body2}</p>
        </>
      }
    >
      <div className="grid gap-10 md:grid-cols-2 md:gap-12">
        <CreditList title={crear.stageTitle} items={crear.stageCredits} />
        <CreditList title={crear.screenTitle} items={crear.screenCredits} />
      </div>
    </Act>
  );
}
