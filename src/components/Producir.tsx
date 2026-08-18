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
 */
export default function Producir() {
  const { t } = useLanguage();
  const { producir } = t;

  return (
    <Act
      id="producir"
      numeral="III"
      align="right"
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
        <CreditList title={producir.stageTitle} items={producir.stageCredits} />
        <CreditList title={producir.screenTitle} items={producir.screenCredits} />
        <CreditList title={producir.irelandTitle} items={producir.irelandCredits} />
      </div>
    </Act>
  );
}
