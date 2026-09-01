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
 * Texto madre de Nora (2026-08-31): `body1`/`body2` del Acto pasaron de
 * narrar el historial del Programa Adolescencia en prosa (redundante con
 * `coordCredits`/`teachCredits` de abajo, que ya lo listan completo) a
 * explicar el "por qué" de su práctica — mismo criterio que ya sigue el resto
 * del sitio de separar narrativa (`body`) de detalle (`CreditList`). Debajo
 * de `body` se agregan dos bloques nuevos, ambos a ancho completo:
 * `modalities` (las tres formas en que trabaja — Talleres, 1:1, Grupos y
 * organizaciones), antes de los créditos, y `approach` ("Mi mirada") como
 * remate editorial después de ellos — mismo lugar que ocuparía un colofón.
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
      numeralDiscreto
      childrenFullWidth
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

      {/* "Mi mirada" — remate del Acto, no un cuarto crédito: regla roja a la
          izquierda (mismo dispositivo que ya usa el cierre del lightbox de
          Presente y el colofón del Footer) y la línea final en
          `font-signature`, eco de la firma del Hero. */}
      <div className="mt-12 max-w-2xl border-l-2 border-brand-red pl-6 md:mt-16">
        <p className="font-label text-xs uppercase tracking-[0.25em] text-brand-red">{ensenar.approachTitle}</p>
        <p className="mt-4 text-body font-body leading-relaxed text-cream/80">{ensenar.approachBody}</p>
        <p className="mt-4 font-signature text-2xl text-cream">{ensenar.approachClosing}</p>
      </div>
    </Act>
  );
}
