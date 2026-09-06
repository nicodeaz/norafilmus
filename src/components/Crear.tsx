import { Drama } from 'lucide-react';
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
 *
 * Ícono `Drama` junto al eyebrow (Fase 3, 2026-08-28) — las máscaras de
 * teatro son el marcador más directo para "Actuación". Los créditos se
 * quedan en la variante `cast` (default) de `CreditList`: es el Acto que
 * define ese tratamiento, los otros dos se diferencian de este.
 *
 * Más fotos por crédito (2026-09-04) — el usuario pidió mostrar más
 * imágenes acá, pero pegadas a la obra que corresponde, no en una galería
 * aparte al pie del Acto: el crédito de Rapiña en `stageCredits` trae siete
 * fotos (`crear.stageCredits[0].images` en `content.ts`), no una — el resto
 * de los créditos siguen con una sola. Ver el docblock de `CreditList.tsx`.
 */
export default function Crear() {
  const { t } = useLanguage();
  const { crear } = t;

  return (
    <Act
      id="crear"
      numeral="I"
      align="left"
      icon={<Drama className="h-4 w-4" />}
      eyebrow={crear.eyebrow}
      titleLead={crear.titleLead}
      titleAccent={crear.titleAccent}
      image={crear.image}
      childrenFullWidth
      body={
        <>
          <p>{crear.body1}</p>
          <p className="mt-4">{crear.body2}</p>
        </>
      }
    >
      <div className="grid gap-10 md:grid-cols-2 md:gap-14">
        <CreditList title={crear.stageTitle} items={crear.stageCredits} />
        <CreditList title={crear.screenTitle} items={crear.screenCredits} />
      </div>
    </Act>
  );
}
