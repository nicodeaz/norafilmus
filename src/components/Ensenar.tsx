import { GraduationCap } from 'lucide-react';
import { useLanguage } from '@/src/i18n/LanguageContext';
import Act from './Act';
import CreditList from './CreditList';

/**
 * Acto II — Enseñar, el pilar pedagoga. Sin foto a propósito: el material
 * de docencia disponible viene del Programa Adolescencia y muestra
 * adolescentes en situación de vulnerabilidad social, identificables — no
 * se publica sin consentimiento escrito (regla 4 de `content.ts`).
 *
 * En vez de dejar el lugar de la foto vacío, ahí va el "12" (años
 * coordinando el programa) en `font-display` a la misma escala que llevaría
 * una imagen — el `aside` de `Act.tsx` está pensado justo para este caso:
 * la restricción resuelta con tipografía, no disimulada.
 *
 * Créditos curados de `CV/NoraFilmus2023PedCoord.docx` y
 * `CV/FilmusProgramaAdolescencia.docx` — no es la lista completa (eso es
 * la Trayectoria).
 *
 * Tercer `CreditList` (Reconocimientos, 2026-08-28): mismo patrón a ancho
 * completo que ya usa `Producir.tsx` (`childrenFullWidth` + `md:grid-cols-3`)
 * — no un componente nuevo.
 *
 * Fase 3 (2026-08-28) — diferenciación visual real: ícono `GraduationCap`
 * junto al eyebrow, las tres `CreditList` en variante `notebook` (índice
 * manuscrito en vez del romano en itálica de Crear), y una textura de renglón
 * apenas visible detrás del "12" — el Acto sin foto es el que más se presta a
 * leerse como una página de cuaderno en vez de un afiche.
 *
 * Slider vertical (2026-09-12): `aside` (el "12" en tipografía) queda
 * reemplazado por `gallery` — ver el docblock de `content.ts` en `ensenar` y
 * memoria `casting-del-archivo-artifact`. `Act.tsx` prioriza `gallery` sobre
 * `aside` cuando los dos están presentes, así que no hace falta sacar la
 * prop `aside` del componente para que el slider gane: alcanza con pasar
 * `gallery={ensenar.gallery}` acá. `numeralDiscreto`/`texture="notebook"` se
 * quedan igual — eran para que el numeral "II" no compitiera con el "12",
 * y siguen aplicando aunque el "12" ya no se vea (el numeral de por sí ya
 * pasó a ser chico en este Acto, no hace falta revertirlo).
 *
 * Texto madre de Nora (2026-08-31): `body1`/`body2` del Acto pasaron de
 * narrar el historial del Programa Adolescencia en prosa (redundante con
 * `coordCredits`/`teachCredits` de abajo, que ya lo listan completo) a
 * explicar el "por qué" de su práctica — mismo criterio que ya sigue el resto
 * del sitio de separar narrativa (`body`) de detalle (`CreditList`). El
 * remate "Mi mirada" (`approach*` en `content.ts`) que cerraba el Acto se
 * sacó a pedido del usuario (2026-09-10) — los campos siguen en
 * `SiteContent` sin usarse acá por si se retoma en otro lugar del sitio.
 *
 * Las tres tarjetas de modalidad (Talleres, 1:1, Grupos y organizaciones) se
 * mudaron a Home el mismo día y volvieron acá minutos después (2026-09-12,
 * pedido explícito, primero "sacarlos de ensenar", después "vuelve a la
 * sección enseñar como antes") — quedan otra vez a ancho completo, antes de
 * los créditos, con su tratamiento original (sin ícono ni caja, solo el
 * índice en `font-signature` + texto corrido). `HomeModalities.tsx` (el
 * componente que las mostraba en Home) se borró entero.
 */
export default function Ensenar() {
  const { t } = useLanguage();
  const { ensenar } = t;

  return (
    <Act
      id="ensenar"
      numeral="II"
      align="left"
      icon={<GraduationCap className="h-4 w-4" />}
      eyebrow={ensenar.eyebrow}
      titleLead={ensenar.titleLead}
      titleAccent={ensenar.titleAccent}
      body={
        <>
          <p>{ensenar.body1}</p>
          <p className="mt-4">{ensenar.body2}</p>
        </>
      }
      texture="notebook"
      numeralDiscreto
      childrenFullWidth
      gallery={ensenar.gallery}
      aside={
        // Sin caja: el "12" ES el material de este acto, no una tarjeta al
        // costado. Va a escala de titular y el numeral "II" queda chico
        // arriba — antes los dos números rojos competían a la misma escala y
        // en mobile se leían como un error de numeración (auditoría H9).
        //
        // Textura de renglón (Fase 3): `repeating-linear-gradient` en vez de
        // un asset — un cuaderno real tiene líneas horizontales, y esto le da
        // esa lectura al "12" sin competir con el número (opacity muy bajo,
        // el mismo cream de la paleta, nada de color nuevo).
        <div
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent, transparent 27px, rgba(245,239,230,0.05) 28px)',
          }}
        >
          <span className="block font-display text-[clamp(5rem,20vw,11rem)] leading-[0.85] text-brand-red">
            {ensenar.statNumber}
          </span>
          <p className="mt-5 max-w-[26ch] border-t border-cream/10 pt-4 font-label text-xs leading-relaxed text-cream/50">
            {ensenar.statLabel}
          </p>
        </div>
      }
    >
      {/* Las tres modalidades — estático, sin acordeón: a diferencia de los
          créditos de abajo no hay nada que expandir, así que se leen como
          página abierta, no como otro `CreditList`. El índice en
          `font-signature` reusa el mismo marcador manuscrito que ya
          distingue a Enseñar en su variante `notebook`. */}
      <div className="grid gap-10 border-b border-cream/10 pb-10 md:grid-cols-3 md:gap-12 md:pb-12">
        {ensenar.modalities.map((m, i) => (
          <div key={m.title}>
            <span className="font-signature text-2xl text-brand-red" aria-hidden>
              {['i.', 'ii.', 'iii.'][i]}
            </span>
            <h3 className="mt-2 font-label text-xs uppercase tracking-[0.2em] text-cream">{m.title}</h3>
            <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-cream/70">{m.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-12 md:mt-12">
        <CreditList title={ensenar.coordTitle} items={ensenar.coordCredits} variant="notebook" />
        <CreditList title={ensenar.teachTitle} items={ensenar.teachCredits} variant="notebook" />
        <CreditList
          title={ensenar.recognitionTitle}
          items={ensenar.recognitionCredits}
          variant="notebook"
        />
      </div>

      <div className="mt-12 border-t border-cream/10 pt-10 md:mt-16 md:pt-12">
        <h3 className="font-label text-label uppercase tracking-[0.2em] text-brand-red">
          {ensenar.approachTitle}
        </h3>
        <p className="mt-4 max-w-3xl text-body font-body leading-relaxed text-cream/80">
          {ensenar.approachBody}
        </p>
        <p className="mt-5 font-display text-display-m uppercase leading-none text-cream">
          {ensenar.approachClosing}
        </p>
      </div>
    </Act>
  );
}
