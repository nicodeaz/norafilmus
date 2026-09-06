import { ClipboardList } from 'lucide-react';
import { useLanguage } from '@/src/i18n/LanguageContext';
import Act from './Act';
import CreditList from './CreditList';

/**
 * Acto III — Producir, el pilar productora, último de los tres. Fuente:
 * `CV/Historial Para CV de distintas areas.docx`, la más detallada de las
 * que hay (trae referencia y contacto por proyecto).
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
 *   producción; el crédito de actriz para el mismo título vive en el Acto I.
 *
 * Foto ancla: `los-golpes-de-clara-foto-2.jpg`, una toma de función distinta
 * del afiche (`los-golpes-de-clara-afiche.jpg`) que ya usa el mosaico del
 * Hero — ese afiche sigue vivo, pero adentro del acordeón de "Los golpes de
 * Clara", no repetido acá arriba. `align="right"` para que el Acto III no
 * sea un espejo idéntico del Acto I.
 *
 * Fase 3 (2026-08-28) — diferenciación visual real: ícono `ClipboardList`
 * junto al eyebrow (planilla de producción, no máscaras de teatro) y las
 * tres `CreditList` en variante `dossier` (índice `[01]` en monoespacio en
 * vez del romano en itálica de Crear) — lee como expediente/planilla, no
 * como programa de sala.
 *
 * Más fotos por crédito (2026-09-04) — mismo criterio que Crear: los
 * créditos de ¡Mujeres a la obra! y Los golpes de Clara traen varias fotos
 * cada uno (`producir.stageCredits[…].images` en `content.ts`) en vez de
 * una galería aparte al pie del Acto. Ver el docblock de `CreditList.tsx`.
 */
export default function Producir() {
  const { t } = useLanguage();
  const { producir } = t;

  return (
    <Act
      id="producir"
      numeral="III"
      align="right"
      icon={<ClipboardList className="h-4 w-4" />}
      eyebrow={producir.eyebrow}
      titleLead={producir.titleLead}
      titleAccent={producir.titleAccent}
      image={producir.image}
      childrenFullWidth
      body={
        <>
          <p>{producir.body1}</p>
          <p className="mt-4">{producir.body2}</p>
        </>
      }
    >
      {/* Tres columnas a ancho completo — es lo que diferencia
          estructuralmente al Acto III del Acto I (dos columnas): antes los dos
          se leían como la misma página espejada (auditoría H9), y encima las
          tres listas quedaban apretadas dentro de la columna de texto. */}
      <div className="grid gap-10 md:grid-cols-3 md:gap-12">
        <CreditList title={producir.stageTitle} items={producir.stageCredits} variant="dossier" />
        <CreditList title={producir.screenTitle} items={producir.screenCredits} variant="dossier" />
        <CreditList title={producir.irelandTitle} items={producir.irelandCredits} variant="dossier" />
      </div>
    </Act>
  );
}
