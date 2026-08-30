// Script de un solo uso: blurrea la multitud de la foto de Marcos Paz para
// que deje de mostrar caras identificables de adolescentes (regla 4), sin
// perder del todo el registro documental (escala del público, arquitectura
// de la sala). No es parte del pipeline permanente — se corre una vez y el
// resultado queda commiteado como fuente ya procesada.
import sharp from 'sharp';

const SRC = '../../content/facebook/10-muestra-alumnos-marcos-paz/media/foto-1.jpg';
const OUT = './marcos-paz-blurred.jpg';

const img = sharp(SRC);
const { width, height } = await img.metadata();

// Dos franjas con gente: el balcón arriba (gente detrás de la baranda) y la
// platea abajo (llena de punta a punta). La franja del medio (pared amarilla,
// sin nadie) queda nítida a propósito — le da profundidad a la toma en vez
// de un blur parejo de cuadro completo, que hubiera leído como una imagen
// rota más que como una decisión de privacidad.
const regions = [
  { left: 0, top: 0, width, height: 80 }, // balcón
  { left: 0, top: 158, width, height: height - 158 }, // platea (empieza mucho antes de lo que parecía a primera vista)
];

let composite = sharp(SRC);
const overlays = [];
for (const r of regions) {
  const blurred = await sharp(SRC)
    .extract(r)
    .blur(28) // sigma alto — nada de rasgos reconocibles, solo masa de color
    .toBuffer();
  overlays.push({ input: blurred, left: r.left, top: r.top });
}

await composite.composite(overlays).jpeg({ quality: 88 }).toFile(OUT);
console.log('listo', width, height);
