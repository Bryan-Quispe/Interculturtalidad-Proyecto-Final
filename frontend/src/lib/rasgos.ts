import { TranslationKey } from './i18n/translations';

/**
 * Rasgos de la mascota como lista cerrada.
 *
 * La descripción libre no se puede traducir: no existe traducción automática
 * al kichwa ecuatoriano —lo que ofrecen los servicios comerciales es quechua
 * sureño, otra variedad y fuera de la norma ALKI— y reescribir lo que alguien
 * contó de su animal sería hablar por él.
 *
 * El resultado era que un kichwahablante veía la ficha rotulada en su lengua
 * pero no llegaba a saber cómo es el animal ni qué carácter tiene, que es
 * justamente lo que sirve para reconocerlo. Pasando esa información a una
 * lista cerrada deja de ser prosa y pasa a ser un dato, y un dato sí se
 * muestra en cualquiera de las dos lenguas, como ya ocurre con el tamaño y el
 * color. La descripción libre se conserva como complemento opcional.
 */
export interface GrupoRasgos {
  id: string;
  tituloKey: TranslationKey;
  rasgos: string[];
}

/**
 * Los identificadores no se traducen ni se muestran: son la clave que viaja a
 * la base de datos. El rótulo sale de `trait.<id>` en cada idioma, así que
 * añadir una lengua no obliga a migrar ningún dato.
 */
export const GRUPOS_RASGOS: GrupoRasgos[] = [
  {
    id: 'caracter',
    tituloKey: 'traits.character',
    rasgos: [
      'carinoso',
      'asustadizo',
      'tranquilo',
      'jugueton',
      'buenoConNinos',
      'noConOtrosAnimales',
    ],
  },
  {
    id: 'pelaje',
    tituloKey: 'traits.coat',
    rasgos: [
      'manchado',
      'peloLargo',
      'peloCorto',
      'peloRizado',
      'sinPelo',
    ],
  },
  {
    id: 'senas',
    tituloKey: 'traits.marks',
    rasgos: [
      'cojea',
      'orejasCaidas',
      'colaLarga',
      'colaCorta',
      'faltaUnOjo',
      'llevaCollar',
    ],
  },
];

/** Todos los identificadores válidos, para descartar lo que no reconocemos. */
export const RASGOS_VALIDOS = new Set(GRUPOS_RASGOS.flatMap((grupo) => grupo.rasgos));

/** Clave de traducción del rótulo de un rasgo. */
export function claveRasgo(id: string): TranslationKey {
  return `trait.${id}` as TranslationKey;
}

/** Filtra lo que llegue de la base de datos a los rasgos que existen hoy. */
export function rasgosValidos(valor: unknown): string[] {
  if (!Array.isArray(valor)) return [];
  return valor.filter((item): item is string => typeof item === 'string' && RASGOS_VALIDOS.has(item));
}
