import { FONT_MAPS } from './unicodeStyles';

export const SYMBOL_GROUPS = [
  { name: 'Coronas', heading: 'Símbolos de corona para Free Fire', terms: 'corona rey reina crown', symbols: ['♛', '♚', '♕', '♔', '亗', '👑'] },
  { name: 'Corazones', heading: 'Corazón para Free Fire', terms: 'corazon corazón amor heart', symbols: ['♡', '♥', 'ღ', '❥', '❦', '❤', '💙', '🖤', '💔'] },
  { name: 'Alas', heading: 'Símbolos de alas para Free Fire', terms: 'alas wings angel ángel', symbols: ['ʚ', 'ɞ', '༺', '༻', '꧁', '꧂', '𓆩', '𓆪'] },
  { name: 'Estrellas', heading: 'Estrellas para Free Fire', terms: 'estrella star brillo', symbols: ['★', '☆', '✦', '✧', '✩', '✪', '✫', '✬', '✯', '⋆'] },
  { name: 'Insanos', heading: 'Símbolos insanos para Free Fire', terms: 'insano signos demonio calavera rayo', symbols: ['☠', '༒', '乂', 'メ', 'ϟ', '⚡', '×͜×', '╰‿╯'] },
  { name: 'Figuras especiales', heading: 'Signos para Free Fire: figuras especiales', terms: 'especial patron patrón flor musica música signo', symbols: ['❖', '✿', '❀', 'ツ', 'シ', '۞', '☯', '☂', '☾', '♫', '♪', '✓', '〆', '『', '』', '【', '】'] },
];

export function smallText(text: string, style: 'mini_sup' | 'small_caps') {
  return Array.from(text).map(char => style === 'mini_sup' && /^[0-9]$/.test(char) ? '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(char)] : FONT_MAPS[style][char] || char).join('');
}

// Only six-digit color tags are interpreted. Unknown tags remain visible text.
export function descriptionParts(text: string) {
  const parts: { text: string; color: string }[] = [];
  let color = '#FFFFFF';
  let start = 0;
  for (const match of text.matchAll(/\[([a-fA-F0-9]{6})\]/g)) {
    if (match.index! > start) parts.push({ text: text.slice(start, match.index), color });
    color = `#${match[1]}`;
    start = match.index! + match[0].length;
  }
  parts.push({ text: text.slice(start), color });
  return parts;
}

export const DESCRIPTION_TEMPLATES = [
  { style: 'Competitivo', text: '[FFD700]★ Juego con calma, gano con mi equipo.' },
  { style: 'Competitivo', text: '[FF5555]Cada partida es una oportunidad para mejorar.' },
  { style: 'Minimal', text: '[FFFFFF]Menos ruido. Más estrategia.' },
  { style: 'Minimal', text: '[AAAAAA]Concentración · respeto · equipo' },
  { style: 'Amistad', text: '[55DDFF]♡ Las mejores victorias son compartidas.' },
  { style: 'Amistad', text: '[88FFAA]Aquí se juega y se hacen amigos.' },
  { style: 'Dark', text: '[BB88FF]☾ Silencio en el perfil, energía en la partida.' },
  { style: 'Dark', text: '[CCCCCC]Entre sombras encuentro mi camino.' },
  { style: 'Divertido', text: '[FFAA55]Mi plan A era no fallar. Voy por el B.' },
  { style: 'Divertido', text: '[FF88CC]Si me pierdo, sigo buscando botín. ツ' },
];
