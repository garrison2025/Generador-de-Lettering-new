import { copyText } from '../utils/copyText';
import { useState, useDeferredValue, useMemo } from 'react';
import { Copy, Check, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { RelatedTools } from '../components/RelatedTools';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const FONTS_DATA: Record<string, string> = {
  // 1-10: Cursivas y Góticas
  cursiva: '𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵',
  cursiva_bold: '𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩',
  gotica: '𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ',
  gotica_bold: '𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅',
  
  // 11-20: Sans y Serif
  doble: '𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ',
  sans: '𝖺𝖻𝖼𝖽𝖾𝖿𝗀𝗁𝗂𝗃𝗄𝗅𝗆𝗇𝗈𝗉𝗊𝗋𝗌𝗍𝗎𝗏𝗐𝗑𝗒𝗓𝖠𝖡𝖢𝖣𝖤𝖥𝖦𝖧𝖨𝖩𝖪𝖫𝖬𝖭𝖮𝖯𝖰𝖱𝖲𝖳𝖴𝖵𝖶𝖷𝖸𝖹',
  sans_bold: '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭',
  sans_italic: '𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘃𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡',
  sans_bold_italic: '𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕',
  serif_italic: '𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍',
  serif_bold: '𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙',
  serif_bold_italic: '𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁',
  
  // 21-30: Burbujas y Cuadrados
  burbujas: 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ',
  burbujas_negra: '🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩',
  cuadrados: '🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉',
  cuadrados_negros: '🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉',
  parentesis: '⒜⒝⒞⒟⒠⒡⒢⒣⒤⒥⒦⒧⒨⒩⒪⒫⒬⒭⒮⒯⒰⒱⒲⒳⒴⒵🄐🄑🄒🄓🄔🄕🄖🄗🄘🄙🄚🄛🄜🄝🄞🄟🄠🄡🄢🄣🄤🄥🄦🄧🄨🄩',

  // 31-40: Estilos Visuales Geométricos y Monospace
  monospace: '𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉',
  vaporwave: 'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ',
  mini_sup: 'ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖᑫʳˢᵗᵘᵛʷˣʸᶻᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾᑫᴿˢᵀᵁⱽᵂˣʸᶻ',
  mini_sub: 'ₐbcdₑfgₕᵢⱼₖₗₘₙₒₚqᵣₛₜᵤᵥwₓyzₐBCDₑFGₕᵢⱼₖₗₘₙₒₚQᵣₛₜᵤᵥWₓYZ',
  small_caps: 'ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ',
  
  // 41-50: Volteadas e Invertidas
  al_reves: 'ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz∀qƆpƎℲפHIſʞ˥WNOԀQRS┴∩ΛMX⅄Z',
  espejo: 'ɒdɔbɘꟻǫdihilʞlmnpqɿꙅtuvwxyzAꓭƆᗡƎꟻꓨHIK⅃MИOꟼỌЯƧTUVWXYZ', 
  invertido_mayusculas: 'ɐqɔpǝɟƃɥıɾʞlɯuodbɹsʇnʌʍxʎz∀ꓭƆᗡƎℲꓨHIſꓘ⅃WNOԀỘꓤSꓕՈΛMX⅄Z',
  
  // 51-60: Falsos Alfabetos / Substituciones
  ruso: 'авсdеfgнijкlмпорqгsтuvwхуzАВСDЕFGНІJКLМПОРQГSТUVWХУZ',
  griego: 'αβcdεfghιjκlmηθpqrsτυvωxyzΑΒCDΕFGHΙJΚLMΝΘPQRSΤΥVΩXYZ',
  arabe: 'ค๒ς๔єfgђเןкl๓ภ๏pqгรtยvwאyzค๒ς๔єfgђเןкl๓ภ๏pqгรtยvwאyz',
  hebreo: 'אבגדהוזחטיכלמנסעפצקרשתךםןףאבגדהוזחטיכלמנסעפצקרשתךםןף',
  asiatico: '卂乃匚刀乇下Ꮆ卄工丁长乚从𠘨口尸㔿尺丂丅凵リ山乂丫乙卂乃匚刀乇下Ꮆ卄工丁长乚从𠘨口尸㔿尺丂丅凵リ山乂丫乙',
  runas: 'ᚨᛒᚲᛞᛖᚠᚷᚺᛁᛃᚲᛚᛗᚾᛟᛈᛩᚱᛊᛏᚢᚡᚹᛪᚤᛉᚨᛒᚲᛞᛖᚠᚷᚺᛁᛃᚲᛚᛗᚾᛟᛈᛩᚱᛊᛏᚢᚡᚹᛪᚤᛉ',
  hacker: '4bcd3f9h1jklmn0pqrs7uvwxy248CD3F6H1JKLMN0PQR57UVWXY2',
};

const FONT_MAPS: Record<string, Record<string, string>> = {};

Object.keys(FONTS_DATA).forEach((key) => {
  const chars = Array.from(FONTS_DATA[key]);
  const alphaChars = Array.from(ALPHABET);
  FONT_MAPS[key] = {};
  alphaChars.forEach((char, i) => {
    FONT_MAPS[key][char] = chars[i] || char;
  });
});

const DECORATORS: Record<string, { pre?: string; post?: string; join?: string; modifier?: string, reverse?: boolean }> = {
  // Modifiers
  tachado: { modifier: '\u0336' },
  subrayado: { modifier: '\u0332' },
  subrayado_doble: { modifier: '\u0333' },
  raya_arriba: { modifier: '\u0305' },
  slash_corto: { modifier: '\u0337' },
  cruz_tachado: { modifier: '\u0338' },
  tilde_tachado: { modifier: '\u0334' },
  flecha_abajo: { modifier: '\u0316' },
  puntos_abajo: { modifier: '\u0324' },
  triangulitos: { modifier: '\u0359' },
  gaviotas: { modifier: '\u033C' },
  
  // Zalgo
  zalgo_mini: { modifier: '\u030D\u030E\u0304\u0310' },
  zalgo_inferno: { modifier: '\u0311\u0302\u0328\u0327\u0326\u0330\u0332' },

  // Joins
  ondas: { join: ' ﹏ ' },
  estrellas: { join: ' ✨ ' },
  corazones: { join: ' 💙 ' },
  flechas: { join: ' ↬ ' },
  cruces: { join: ' ✝ ' },
  diamantes: { join: ' ♢ ' },
  diamantes_negros: { join: ' ♦ ' },
  musica: { join: ' ♫ ' },
  flores: { join: ' ❀ ' },
  rayos: { join: ' ϟ ' },
  mariposas: { join: ' 🦋 ' },
  fuego: { join: ' 🔥 ' },
  luna: { join: ' ☾ ' },
  dioses: { join: ' ⚡ ' },
  corazon_roto: { join: ' 💔 ' },
  nieves: { join: ' ❄ ' },
  espacios: { join: ' ' },
  asteriscos: { join: ' * ' },
  slash: { join: ' / ' },
  puntos: { join: ' • ' },
  coronitas: { join: ' 👑 ' },
  armas: { join: ' ︻╦╤─ ' },

  // Wrappers
  brackets: { pre: '【 ', post: ' 】' },
  cruz_wrapper: { pre: '꧁ ', post: ' ꧂' },
  flechas_wrapper: { pre: '« ', post: ' »' },
  corazones_wrapper: { pre: '♥ ', post: ' ♥' },
  fuego_wrapper: { pre: '🔥 ', post: ' 🔥' },
};

const STYLES = [
  // Mapped Fonts
  { id: 'blue', name: 'Letras Azules' },
  { id: 'cuadrados_negros', name: 'Cuadrados Negros' }, // black_square mapped to cuadrados_negros here
  { id: 'cuadrados', name: 'Cuadrados Blancos' }, // white_square mapped to cuadrados here
  { id: 'cursiva', name: 'Cursiva Mágica' },
  { id: 'cursiva_bold', name: 'Cursiva Intensa' },
  { id: 'gotica', name: 'Gótica Clásica' },
  { id: 'gotica_bold', name: 'Gótica Intensa' },
  { id: 'doble', name: 'Doble Trazo (Outline)' },
  { id: 'sans', name: 'Sans Normal' },
  { id: 'sans_bold', name: 'Sans Negrita' },
  { id: 'sans_italic', name: 'Sans Cursiva' },
  { id: 'sans_bold_italic', name: 'Sans Cursiva Negrita' },
  { id: 'serif_italic', name: 'Serif Cursiva' },
  { id: 'serif_bold', name: 'Serif Negrita' },
  { id: 'serif_bold_italic', name: 'Serif Negrita Cursiva' },
  { id: 'burbujas', name: 'Burbujas Claras' },
  { id: 'burbujas_negra', name: 'Burbujas Oscuras' },
  { id: 'parentesis', name: 'Letras en Paréntesis' },
  { id: 'monospace', name: 'Monospace Espaciado' },
  { id: 'vaporwave', name: 'V A P O R W A V E' },
  { id: 'mini_sup', name: 'Mini Letras Arriba' },
  { id: 'mini_sub', name: 'Mini Letras Abajo' },
  { id: 'small_caps', name: 'Versalitas (Minúsculas Mayúsculas)' },
  { id: 'al_reves', name: 'Invertido (Boca Abajo)' },
  { id: 'espejo', name: 'Espejo' },
  { id: 'invertido_mayusculas', name: 'Espejo Loco' },
  { id: 'ruso', name: 'Falso Ruso (Cyrillic)' },
  { id: 'griego', name: 'Falso Griego' },
  { id: 'arabe', name: 'Falso Árabe' },
  { id: 'hebreo', name: 'Falso Hebreo' },
  { id: 'asiatico', name: 'Letras Asiáticas' },
  { id: 'runas', name: 'Letras Rúnicas' },
  { id: 'hacker', name: 'Leetspeak (Hacker)' },
  
  // Modifiers 
  { id: 'tachado', name: 'Tachado Simple' },
  { id: 'cruz_tachado', name: 'Tachado con Cruces' },
  { id: 'slash_corto', name: 'Tachado Corto (Slash)' },
  { id: 'tilde_tachado', name: 'Tachado Ondulado' },
  { id: 'subrayado', name: 'Subrayado Simple' },
  { id: 'subrayado_doble', name: 'Subrayado Doble' },
  { id: 'raya_arriba', name: 'Raya Superior' },
  { id: 'flecha_abajo', name: 'Flechas Debajo' },
  { id: 'puntos_abajo', name: 'Puntos Inferiores' },
  { id: 'triangulitos', name: 'Triángulos Inferiores' },
  { id: 'gaviotas', name: 'Gaviotas Inferiores' },
  
  // Zalgo Styles
  { id: 'zalgo_mini', name: 'Zalgo Suave' },
  { id: 'zalgo_inferno', name: 'Zalgo Extremo' },

  // Wrappers
  { id: 'cruz_wrapper', name: 'Adorno Floral ꧁ ꧂' },
  { id: 'flechas_wrapper', name: 'Adorno Flechas « »' },
  { id: 'corazones_wrapper', name: 'Adorno Corazones ♥' },
  { id: 'fuego_wrapper', name: 'Adorno Fuego 🔥' },
  { id: 'brackets', name: 'Cajas Brackets 【】' },
  
  // Joins & Decorators
  { id: 'espacios', name: 'E S P A C I O S' },
  { id: 'ondas', name: 'Onditas (﹏)' },
  { id: 'puntos', name: 'Punteado (•)' },
  { id: 'asteriscos', name: 'Asteriscos (*)' },
  { id: 'slash', name: 'Slassh ( / )' },
  { id: 'estrellas', name: 'Estrellitas (✨)' },
  { id: 'corazones', name: 'Corazones (💙)' },
  { id: 'corazon_roto', name: 'Corazón Roto (💔)' },
  { id: 'diamantes', name: 'Diamantes Blancos (♢)' },
  { id: 'diamantes_negros', name: 'Diamantes Negros (♦)' },
  { id: 'flores', name: 'Florcitas (❀)' },
  { id: 'cruces', name: 'Cruces (✝)' },
  { id: 'musica', name: 'Música (♫)' },
  { id: 'flechas', name: 'Flechas (↬)' },
  { id: 'rayos', name: 'Rayos Vintage (ϟ)' },
  { id: 'dioses', name: 'Dioses (⚡)' },
  { id: 'luna', name: 'Lunitas (☾)' },
  { id: 'fuego', name: 'A Fuego (🔥)' },
  { id: 'mariposas', name: 'Mariposas (🦋)' },
  { id: 'nieves', name: 'Nevado (❄)' },
  { id: 'coronitas', name: 'Coronitas VIP (👑)' },
  { id: 'armas', name: 'Pistolas (︻╦╤─)' },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cómo copiar y pegar letras azules para Facebook o WhatsApp?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nuestro generador transforma las letras A-Z en Regional Indicator Symbols de Unicode. Escribe tu texto, pulsa copiar y pégalo en la aplicación que quieras. En algunas plataformas estos símbolos se ven como letras dentro de cuadros de color; en otras pueden verse con un estilo diferente porque el color y la apariencia dependen del sistema y de la fuente."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cómo crear letras en cuadraditos negros o blancos?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Además de la clásica letra azul, hemos integrado opciones para letras encerradas en cuadrados. Solo selecciona las opciones 'Cuadrados Negros' o 'Cuadrados Blancos' en la lista de resultados para obtener esos estilos elegantes directamente, listos para tu biografía de Instagram o descripciones de TikTok."
      }
    },
    {
      "@type": "Question",
      "name": "¿Las letras azules funcionan en todos los celulares (Android e iPhone)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Los Regional Indicator Symbols forman parte de Unicode y los sistemas modernos suelen reconocerlos, pero su apariencia no es idéntica en todos los dispositivos. Según la plataforma pueden mostrarse como símbolos de estilo emoji, letras encuadradas o con otra presentación; dos símbolos consecutivos también pueden combinarse para representar una bandera."
      }
    },
    {
      "@type": "Question",
      "name": "¿Existen otros colores además de las fuentes de letras azules?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unicode define el carácter, no un color fijo para estas letras. El color y el diseño visual los decide el sistema operativo, la aplicación o la fuente utilizada. Por eso no es posible elegir de forma universal una versión roja, verde o amarilla del mismo carácter; para otros efectos puedes usar las variantes de letras cuadradas, invertidas o decoradas del generador."
      }
    }
  ]
};

export default function LetrasAzules() {
  const [inputText, setInputText] = useState('LETRAS AZULES');
  const deferredInput = useDeferredValue(inputText);
  const inputCharacterCount = Array.from(inputText).length;
  const [copiedResult, setCopiedResult] = useState<string | null>(null);

  const convertText = (text: string, styleId: string) => {
    if (!text) return 'Escribe aquí';
    
    if (styleId === 'blue') {
      return Array.from(text.toUpperCase()).map(char => {
        if (char >= 'A' && char <= 'Z') {
          return String.fromCodePoint(0x1F1E6 + char.charCodeAt(0) - 0x41) + ' '; 
        }
        return char;
      }).join('');
    }
    
    let result = text;

    // Appply mapped fonts
    if (FONT_MAPS[styleId]) {
      const map = FONT_MAPS[styleId];
      result = Array.from(result).map(char => {
        if (styleId === 'al_reves' || styleId === 'espejo' || styleId === 'invertido_mayusculas') {
          const mapped = map[char] || map[char.toLowerCase()] || char;
          return mapped;
        }
        return map[char] || char;
      }).join('');
      
      // Si es al revés o espejo, el texto completo también se invierte
      if (styleId === 'al_reves' || styleId === 'espejo' || styleId === 'invertido_mayusculas') {
        result = Array.from(result).reverse().join('');
      }
    }

    // Apply decorators (modifiers & joins)
    if (DECORATORS[styleId]) {
      const dec = DECORATORS[styleId];
      
      if (dec.modifier) {
        result = Array.from(result).map((char) => /\s/u.test(char) ? char : char + dec.modifier).join('');
      }
      
      if (dec.join) {
        result = Array.from(result).join(dec.join);
      }
      
      if (dec.pre || dec.post) {
        result = `${dec.pre || ''}${result}${dec.post || ''}`;
      }
      
      if (dec.reverse) {
        result = Array.from(result).reverse().join('');
      }
    }

    return result;
  };

  const convertedStyles = useMemo(
    () => STYLES.map((style) => ({
      ...style,
      resultText: convertText(deferredInput, style.id),
    })),
    [deferredInput]
  );

  const handleCopy = async (text: string, id: string) => {
    if (!(await copyText(text))) {
      window.alert('No se pudo copiar automáticamente. Selecciona el texto y cópialo manualmente.');
      return;
    }
    setCopiedResult(id);
    setTimeout(() => setCopiedResult(null), 2000);
  };

  return (
    <>
      <SEO 
        title="Letras Azules para Copiar | Generador de Letras en Cuadraditos"
        description="Genera las llamadas letras azules con Regional Indicator Symbols y letras cuadradas Unicode para copiar y pegar en WhatsApp, Facebook, Instagram y otras apps."
        keywords="letras azules, conversor de letras azules, generador letras cuadraditos, letras emojie azules copy paste"
        canonical="https://generadordelettering.org/herramientas/letras-azules"
        jsonSchema={[
          faqSchema, 
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Generador de Letras Azules",
            "url": "https://generadordelettering.org/herramientas/letras-azules",
            "description": "Genera Regional Indicator Symbols y variantes Unicode conocidas como letras azules o letras cuadradas para copiar y pegar; la apariencia final depende de la plataforma.",
            "applicationCategory": "UtilitiesApplication",
            "operatingSystem": "All",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": "https://generadordelettering.org/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Herramientas",
                "item": "https://generadordelettering.org/herramientas"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Letras Azules",
                "item": "https://generadordelettering.org/herramientas/letras-azules"
              }
            ]
          }
        ]}
      />
      <div className="max-w-5xl mx-auto px-4 py-12 w-full">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
          <li>
            <Link to="/" className="hover:text-[#5A4AD2] transition-colors">Inicio</Link>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-gray-500">/</span>
            <span className="text-gray-900" aria-current="page">Letras Azules</span>
          </li>
        </ol>
      </nav>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Letras Azules y Cuadradas</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Generador de <strong>letras emoji azules</strong> y en cuadrados. Copia y pega fácilmente en WhatsApp, Facebook e Instagram.
        </p>
      </div>

      <div className="bg-white justify-center items-center rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 md:p-8 mb-8">
        <div className="flex justify-between items-end mb-3">
          <label htmlFor="text-input" className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Escribe tu texto:</label>
          <span className="text-xs font-medium text-[#2980b9] bg-[#3498db]/10 px-2 py-1 rounded">{inputCharacterCount} caracteres</span>
        </div>
        <div className="relative">
          <input
            id="text-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-0 focus:border-[#5A4AD2] outline-none text-xl font-medium pr-12 transition-all shadow-inner placeholder:text-gray-500"
            placeholder="Introduce una palabra o frase..."
          />
          {inputText && (
            <button 
              onClick={() => setInputText('')}
              className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-500 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition"
              title="Borrar texto"
              aria-label="Borrar texto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {convertedStyles.map((style) => {
          const resultText = style.resultText;
          const isCopied = copiedResult === style.id;
          
          return (
            <div key={style.id} className={`bg-white rounded-2xl p-6 flex flex-col justify-between border shadow-sm transition-all duration-200 hover:-translate-y-1 ${
              isCopied ? 'border-green-400 ring-2 ring-green-100' : 'border-gray-100 hover:border-[#5A4AD2]'
            }`}>
              <div className="mb-6 overflow-hidden">
                <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg mb-4">{style.name}</span>
                <p className="text-2xl break-all min-h-[60px]" style={{ fontFamily: 'system-ui, sans-serif' }}>
                  {resultText}
                </p>
              </div>
              <button
                onClick={() => handleCopy(resultText, style.id)}
                aria-label={`Copiar estilo ${style.name}`}
                className={`w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl font-bold transition-all ${
                  isCopied 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-50 text-gray-700 hover:bg-[#5A4AD2] hover:text-white'
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-5 h-5" />
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copiar
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="prose prose-blue max-w-none text-gray-600 bg-gray-50 p-8 rounded-3xl border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">¿Cómo funcionan las Letras Emoji?</h2>
        <p>
          Las "letras azules" son en realidad un bloque especial de caracteres Unicode conocido como <strong>Regional Indicator Symbols</strong>. Originalmente, están diseñados para combinarse en pares y formar banderas de países (por ejemplo, 🇪 + 🇸 = 🇪🇸).
        </p>
        <p className="mt-4">
          Cuando se usan por separado, algunas plataformas los representan como símbolos de estilo emoji o letras dentro de cuadros, y de ahí viene el nombre popular de "letras azules". Unicode no fija ese color: la apariencia final depende del sistema operativo, la aplicación y la fuente. El generador separa los símbolos para reducir la posibilidad de que dos letras consecutivas se interpreten como una bandera.
        </p>
      </div>

      <section className="mt-16 text-left space-y-8 bg-blue-50/50 p-8 rounded-3xl border border-blue-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Preguntas Frecuentes sobre Letras Azules y Cuadradas</h2>
          <p className="text-gray-600 mt-3">Todo lo que necesitas saber sobre cómo copiar letras azules para tus redes sociales.</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Cómo copiar y pegar letras azules para Facebook o WhatsApp?</h3>
            <p className="text-gray-600 leading-relaxed">
              Nuestro generador transforma las letras A-Z en <strong>Regional Indicator Symbols</strong> de Unicode. Escribe tu texto, pulsa copiar y pégalo en la aplicación que quieras. En algunas plataformas estos símbolos se ven como letras dentro de cuadros de color; en otras pueden verse con un estilo diferente porque la apariencia depende del sistema y de la fuente.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Cómo crear letras en cuadraditos negros o blancos?</h3>
            <p className="text-gray-600 leading-relaxed">
              Además de la clásica <em>letra azul</em>, hemos integrado opciones para <strong>letras encerradas en cuadrados</strong>. Solo selecciona las opciones "Cuadrados Negros" o "Cuadrados Blancos" en la lista de resultados para obtener esos estilos elegantes directamente, listos para tu biografía de Instagram o descripciones de TikTok.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Las letras azules funcionan en todos los celulares (Android e iPhone)?</h3>
            <p className="text-gray-600 leading-relaxed">
              Los <em>Regional Indicator Symbols</em> forman parte de Unicode y los sistemas modernos suelen reconocerlos, pero su apariencia no es idéntica en todos los dispositivos. Según la plataforma pueden mostrarse como símbolos de estilo emoji, letras encuadradas o con otra presentación; dos símbolos consecutivos también pueden combinarse para representar una bandera.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Existen otros colores además de las fuentes de letras azules?</h3>
            <p className="text-gray-600 leading-relaxed">
              Unicode define el carácter, no un color fijo para estas letras. El color y el diseño visual los decide el sistema operativo, la aplicación o la fuente utilizada. Por eso no existe una forma universal de elegir una versión roja, verde o amarilla del mismo símbolo; para otros efectos puedes usar las variantes cuadradas, invertidas o decoradas del generador.
            </p>
          </div>
        </div>
      </section>

      <RelatedTools currentPath="/herramientas/letras-azules" />
    </div>
    </>
  );
}
