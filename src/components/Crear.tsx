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
 * Foto ancla → slider vertical (2026-09-12): la foto única curada
 * (`rapina-foto-5.jpg`, "Bañera") se reemplazó por `crear.gallery`, 66 fotos
 * de archivo elegidas por el usuario en el artifact "Casting del Archivo"
 * (ver memoria `casting-del-archivo-artifact` y el docblock de
 * `VerticalPhotoSlider.tsx`) — cubre Rapiña, Chicha Carmen y Angelita,
 * Pizarn-i-kett, Varieté de clown, book actoral, Rita Universos, el book de
 * estudio y ~20 posts del blog viejo (2010–2014). Ninguna repite el archivo
 * que usa el mosaico del Hero (`rapina.jpg`) ni las que ya viven adentro del
 * acordeón de Rapiña (`rapina-tarantulas*.jpg`, etc.) — son selecciones
 * independientes, sin deduplicar entre sí a propósito (la del usuario, tal
 * cual la pegó).
 *
 * Ícono junto al eyebrow (Fase 3, 2026-08-28) — `Drama` de lucide, el
 * marcador más directo para "Actuación". Pasó brevemente (2026-09-09 a
 * 2026-09-12) por `NoraMasksIcon`, un ícono de marca generado con IA
 * (Seedream + vectorizado con potrace/svgo) — el usuario pidió sacar todo
 * ese set del sitio ("quiero sacar los iconos que creamos de todo el
 * sitio"), así que vuelve al ícono genérico de siempre. Los créditos se
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
      gallery={crear.gallery}
      texture="poster"
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
