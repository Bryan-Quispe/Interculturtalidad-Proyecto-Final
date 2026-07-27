/**
 * Genera los documentos de la entrega final a partir de un contenido común.
 *
 * Se mantiene como script y no como seis archivos escritos a mano porque los
 * seis comparten hoja de estilo y portada: editarlos por separado garantiza
 * que acaben divergiendo. Para regenerarlos:
 *
 *     node generar-documentos.js
 */

const fs = require('fs');
const path = require('path');

const AUTOR = 'Bryan Quispe';
const PROYECTO = 'Wasi Wiwakuna 3D';
const MATERIA = 'DES SOFT APLI DOMI DE INTERCUL';

/** El contenido vive en el documento maestro; aquí solo se reparte. */
const MAESTRO = path.join(__dirname, '_contenido.html');

/**
 * Reparto de secciones. Cada documento agrupa las secciones del maestro que
 * tratan un mismo asunto, y sus títulos se renumeran desde uno.
 */
const DOCUMENTOS = [
  {
    archivo: '01-especificacion-de-requisitos.html',
    titulo: 'Especificación de Requisitos de Software',
    secciones: ['s1', 's2'],
  },
  {
    archivo: '02-casos-de-uso.html',
    titulo: 'Casos de uso',
    secciones: ['s3'],
  },
  {
    archivo: '03-proceso-scrum.html',
    titulo: 'Documentación del proceso Scrum',
    secciones: ['s4', 's5', 's6'],
  },
  {
    archivo: '04-arquitectura.html',
    titulo: 'Arquitectura y modelo de datos',
    secciones: ['s7'],
  },
  {
    archivo: '05-calidad-y-pruebas.html',
    titulo: 'Plan de calidad, pruebas y trazabilidad',
    secciones: ['s8', 's9'],
  },
  {
    archivo: '06-riesgos-y-cierre.html',
    titulo: 'Gestión de riesgos y cierre del proyecto',
    secciones: ['s10', 's11', 's12'],
  },
];

// ── Lectura del maestro ─────────────────────────────────────────────────────

const maestro = fs.readFileSync(MAESTRO, 'utf8');

const estilos = maestro.match(/<style>[\s\S]*?<\/style>/)[0];

/**
 * Trocea el cuerpo por encabezados de nivel dos. Cada sección abarca desde su
 * `<h2 id="sN">` hasta el siguiente, o hasta el pie del documento.
 */
function trocear(html) {
  const trozos = {};
  const regex = /<h2 id="(s\d+)">([\s\S]*?)<\/h2>/g;
  const marcas = [];
  let m;
  while ((m = regex.exec(html)) !== null) {
    marcas.push({ id: m[1], titulo: m[2], inicio: m.index, finEncabezado: regex.lastIndex });
  }
  marcas.forEach((marca, i) => {
    const hasta = i + 1 < marcas.length ? marcas[i + 1].inicio : html.indexOf('<p class="pie">');
    trozos[marca.id] = {
      titulo: marca.titulo.replace(/^\d+\.\s*/, ''),
      cuerpo: html.slice(marca.finEncabezado, hasta).trim(),
    };
  });
  return trozos;
}

const secciones = trocear(maestro);

// ── Composición ─────────────────────────────────────────────────────────────

function portada(titulo) {
  return `<header class="cover">
  <p class="institution">${MATERIA}</p>
  <p class="proyecto">${PROYECTO}</p>
  <h1>${titulo}</h1>
  <p class="autor">${AUTOR}</p>
</header>`;
}

/**
 * Renumera los encabezados para que cada documento empiece por uno. El maestro
 * numera de corrido y esa numeración no tiene sentido en un archivo suelto.
 */
function renumerar(cuerpo, numeroOriginal, numeroNuevo) {
  return cuerpo.replace(
    new RegExp(`<h3>${numeroOriginal}\\.(\\d+)\\s`, 'g'),
    (_, sub) => `<h3>${numeroNuevo}.${sub} `,
  );
}

function indice(partes) {
  if (partes.length < 2) return '';
  const lineas = partes
    .map((parte, i) => `    <li><a href="#${parte.id}">${i + 1}. ${parte.titulo}</a></li>`)
    .join('\n');
  return `<nav class="toc">
  <h2>Contenido</h2>
  <ol>
${lineas}
  </ol>
</nav>\n\n`;
}

let generados = 0;

for (const doc of DOCUMENTOS) {
  const partes = doc.secciones.map((id) => {
    if (!secciones[id]) throw new Error(`Falta la sección ${id} en el documento maestro`);
    return { id, ...secciones[id] };
  });

  const cuerpo = partes
    .map((parte, i) => {
      const numeroOriginal = Number(parte.id.slice(1));
      const renumerado = renumerar(parte.cuerpo, numeroOriginal, i + 1);
      return `<h2 id="${parte.id}">${i + 1}. ${parte.titulo}</h2>\n${renumerado}`;
    })
    .join('\n\n');

  const pie = `<p class="pie">
  ${PROYECTO} · ${doc.titulo}<br>
  ${MATERIA} · ${AUTOR}
</p>`;

  const salida = `<title>${PROYECTO} — ${doc.titulo}</title>

${estilos}

${portada(doc.titulo)}

${indice(partes)}${cuerpo}

${pie}
`;

  fs.writeFileSync(path.join(__dirname, doc.archivo), salida, 'utf8');
  console.log(`  ${doc.archivo}  (${Math.round(salida.length / 1024)} KB)`);
  generados += 1;
}

console.log(`\n${generados} documentos generados.`);
