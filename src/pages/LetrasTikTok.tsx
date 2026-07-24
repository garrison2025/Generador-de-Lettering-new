import { useState, useEffect, useDeferredValue } from 'react';
import { Copy, Check, Instagram, Heart, ChevronLeft } from 'lucide-react';
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
  sans_bold: '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧Ｕ𝗩𝗪𝗫𝗬𝗭',
  sans_italic: '𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘃𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡',
  sans_bold_italic: '𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕',
  serif: '𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙',
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
  monospace: '𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶ＨＩ𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉',
  vaporwave: 'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ',
  mini_sup: 'ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖᑫʳˢᵗᵘᵘᵛʷˣʸᶻᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾᑫᴿˢᵀᵁᵁⱽᵂˣʸᶻ',
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
  hebreo: 'אבכדעהגהיזקלמנאפקרסטואוזאבכדעהגהיזקלמנאפקרסטואוז',
  asiatico: '卂乃匚刀乇下Ꮆ卄工丁长乚从𠘨口尸㔿尺丂丅凵リ山乂丫乙卂乃匚刀乇下Ꮆ卄工丁长乚从𠘨口尸㔿尺丂丅凵リ山乂丫乙',
  runas: 'ᚨᛒᚲᛞᛖᚠᚷᚺᛁᛃᚲᛚᛗᚾᛟᛈᛩᚱᛊᛏᚢᚡᚹᛪᚤᛉᚨᛒᚲᛞᛖᚠᚷᚺᛁᛃᚲᛚᛗᚾᛟᛈᛩᚱᛊᛏᚢᚡᚹᛪᚤᛉ',
  hacker: '4bcd3f9h1jklmn0pqrs7uvwxy248CD3F6H1JKLMN0PQR57UVWXY2',
  armas: '︻╦╤─a︻╦╤─b︻╦╤─c︻╦╤─d︻╦╤─e︻╦╤─f︻╦╤─g︻╦╤─h︻╦╤─i︻╦╤─j︻╦╤─k︻╦╤─l︻╦╤─m︻╦╤─n︻╦╤─o︻╦╤─p︻╦╤─q︻╦╤─r︻╦╤─s︻╦╤─t︻╦╤─u︻╦╤─v︻╦╤─w︻╦╤─x︻╦╤─y︻╦╤─z︻╦╤─A︻╦╤─B︻╦╤─C︻╦╤─D︻╦╤─E︻╦╤─F︻╦╤─G︻╦╤─H︻╦╤─I︻╦╤─J︻╦╤─K︻╦╤─L︻╦╤─M︻╦╤─N︻╦╤─O︻╦╤─P︻╦╤─Q︻╦╤─R︻╦╤─S︻╦╤─T︻╦╤─U︻╦╤─V︻╦╤─W︻╦╤─X︻╦╤─Y︻╦╤─Z', 
  demoniaco: 'a̶b̶c̶d̶e̶f̶g̶h̶i̶j̶k̶l̶m̶n̶o̶p̶q̶r̶s̶t̶u̶v̶w̶x̶y̶z̶A̶B̶C̶D̶E̶F̶G̶H̶I̶J̶K̶L̶M̶N̶O̶P̶Q̶R̶S̶T̶U̶V̶W̶X̶Y̶Z̶',
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
  
  // Custom Reversals
  espejo_invertido: { reverse: true },
};

const STYLES = [
  // TikTok specific favorites
  { id: 'cursiva', name: 'Aesthetic Cursiva', deco: '✨ {text} ✨' },
  { id: 'cursiva_bold', name: 'Cursiva Intensa', deco: '🍷 {text} 🍷' },
  { id: 'cursiva', name: 'Coquette Chic', deco: '🎀 ৎ {text} ୭ 🎀' },
  { id: 'gotica', name: 'Gótica Dark', deco: '🦇 {text} 🦇' },
  { id: 'gotica_bold', name: 'Gótica Rebelde', deco: '⛓️ {text} ⛓️' },
  { id: 'monospace', name: 'Dark Academia', deco: '☕ {text} 🤎' },
  { id: 'doble', name: 'Doble Contorno', deco: '☁️ {text} ☁️' },
  { id: 'burbujas', name: 'Soft Kawaii', deco: '🌸 {text} 🌸' },
  { id: 'cuadrados', name: 'Cuadrados', deco: '📦 {text} 📦' },
  { id: 'vaporwave', name: 'Vaporwave Espaciado', deco: '🌴 {text} 🌴' },
  { id: 'mini_sup', name: 'Letras Chiquitas', deco: '🧸 {text} 🧸' },
  { id: 'normal', name: 'Estrellas Cute', deco: '✮ ⋆ ˚｡𖦹 ⋆｡°✩ {text} ✩°｡⋆ 𖦹˚ ⋆ ✮' },
  { id: 'normal', name: 'Y2K Vibes', deco: '★ {text} ★' },
  { id: 'normal', name: 'Fairycore', deco: '🍄 🧚‍♀️ {text} 🧚‍♀️ 🍄' },
  { id: 'normal', name: 'Kaomoji Feliz', deco: '(≧◡≦) {text} (≧◡≦)' },

  // The rest of the 50+ list without deco
  { id: 'sans', name: 'Sans Normal', deco: '{text}' },
  { id: 'sans_bold', name: 'Sans Negrita', deco: '{text}' },
  { id: 'sans_italic', name: 'Sans Cursiva', deco: '{text}' },
  { id: 'sans_bold_italic', name: 'Sans Cursiva Negrita', deco: '{text}' },
  { id: 'serif', name: 'Serif Fina', deco: '{text}' },
  { id: 'serif_italic', name: 'Serif Cursiva', deco: '{text}' },
  { id: 'serif_bold', name: 'Serif Negrita', deco: '{text}' },
  { id: 'serif_bold_italic', name: 'Serif Negrita Cursiva', deco: '{text}' },
  { id: 'burbujas_negra', name: 'Burbujas Oscuras', deco: '{text}' },
  { id: 'cuadrados_negros', name: 'Cuadrados Oscuros', deco: '{text}' },
  { id: 'parentesis', name: 'Letras en Paréntesis', deco: '{text}' },
  { id: 'mini_sub', name: 'Mini Letras Abajo', deco: '{text}' },
  { id: 'small_caps', name: 'Versalitas (Minúsculas Mayúsculas)', deco: '{text}' },
  { id: 'al_reves', name: 'Invertido (Boca Abajo)', deco: '{text}' },
  { id: 'espejo', name: 'Espejo', deco: '{text}' },
  { id: 'invertido_mayusculas', name: 'Espejo Loco', deco: '{text}' },
  { id: 'ruso', name: 'Falso Ruso (Cyrillic)', deco: '{text}' },
  { id: 'griego', name: 'Falso Griego', deco: '{text}' },
  { id: 'arabe', name: 'Falso Árabe', deco: '{text}' },
  { id: 'hebreo', name: 'Falso Hebreo', deco: '{text}' },
  { id: 'asiatico', name: 'Letras Asiáticas', deco: '{text}' },
  { id: 'runas', name: 'Letras Rúnicas', deco: '{text}' },
  { id: 'hacker', name: 'Leetspeak (Hacker)', deco: '{text}' },
  
  // Modifiers 
  { id: 'tachado', name: 'Tachado Simple', deco: '{text}' },
  { id: 'cruz_tachado', name: 'Tachado con Cruces', deco: '{text}' },
  { id: 'slash_corto', name: 'Tachado Corto (Slash)', deco: '{text}' },
  { id: 'tilde_tachado', name: 'Tachado Ondulado', deco: '{text}' },
  { id: 'subrayado', name: 'Subrayado Simple', deco: '{text}' },
  { id: 'subrayado_doble', name: 'Subrayado Doble', deco: '{text}' },
  { id: 'raya_arriba', name: 'Raya Superior', deco: '{text}' },
  { id: 'flecha_abajo', name: 'Flechas Debajo', deco: '{text}' },
  { id: 'puntos_abajo', name: 'Puntos Inferiores', deco: '{text}' },
  { id: 'triangulitos', name: 'Triángulos Inferiores', deco: '{text}' },
  { id: 'gaviotas', name: 'Gaviotas Inferiores', deco: '{text}' },
  
  // Zalgo Styles
  { id: 'zalgo_mini', name: 'Zalgo Suave', deco: '{text}' },
  { id: 'zalgo_inferno', name: 'Zalgo Extremo', deco: '{text}' },

  // Wrappers
  { id: 'cruz_wrapper', name: 'Adorno Floral ꧁ ꧂', deco: '{text}' },
  { id: 'flechas_wrapper', name: 'Adorno Flechas « »', deco: '{text}' },
  { id: 'corazones_wrapper', name: 'Adorno Corazones ♥', deco: '{text}' },
  { id: 'fuego_wrapper', name: 'Adorno Fuego 🔥', deco: '{text}' },
  { id: 'brackets', name: 'Cajas Brackets 【】', deco: '{text}' },
  
  // Joins & Decorators
  { id: 'espacios', name: 'E S P A C I O S', deco: '{text}' },
  { id: 'ondas', name: 'Onditas (﹏)', deco: '{text}' },
  { id: 'puntos', name: 'Punteado (•)', deco: '{text}' },
  { id: 'asteriscos', name: 'Asteriscos (*)', deco: '{text}' },
  { id: 'slash', name: 'Slassh ( / )', deco: '{text}' },
  { id: 'estrellas', name: 'Estrellitas (✨)', deco: '{text}' },
  { id: 'corazones', name: 'Corazones (💙)', deco: '{text}' },
  { id: 'corazon_roto', name: 'Corazón Roto (💔)', deco: '{text}' },
  { id: 'diamantes', name: 'Diamantes Blancos (♢)', deco: '{text}' },
  { id: 'diamantes_negros', name: 'Diamantes Negros (♦)', deco: '{text}' },
  { id: 'flores', name: 'Florcitas (❀)', deco: '{text}' },
  { id: 'cruces', name: 'Cruces (✝)', deco: '{text}' },
  { id: 'musica', name: 'Música (♫)', deco: '{text}' },
  { id: 'flechas', name: 'Flechas (↬)', deco: '{text}' },
  { id: 'rayos', name: 'Rayos Vintage (ϟ)', deco: '{text}' },
  { id: 'dioses', name: 'Dioses (⚡)', deco: '{text}' },
  { id: 'luna', name: 'Lunitas (☾)', deco: '{text}' },
  { id: 'fuego', name: 'A Fuego (🔥)', deco: '{text}' },
  { id: 'mariposas', name: 'Mariposas (🦋)', deco: '{text}' },
  { id: 'nieves', name: 'Nevado (❄)', deco: '{text}' },
  { id: 'coronitas', name: 'Coronitas VIP (👑)', deco: '{text}' },
  { id: 'armas', name: 'Pistolas (︻╦╤─)', deco: '{text}' },
];

function convertText(text: string, styleId: string, deco: string) {
  if (!text) text = 'letras bonitas';
  let converted = text;

  // Appply mapped fonts
  if (FONT_MAPS[styleId]) {
    const map = FONT_MAPS[styleId];
    converted = converted.split('').map(char => {
      if (styleId === 'al_reves' || styleId === 'espejo' || styleId === 'invertido_mayusculas') {
        const mapped = map[char] || map[char.toLowerCase()] || char;
        return mapped;
      }
      return map[char] || char;
    }).join('');
    
    // Si es al revés o espejo, el texto completo también se invierte
    if (styleId === 'al_reves' || styleId === 'espejo' || styleId === 'invertido_mayusculas') {
      converted = converted.split('').reverse().join('');
    }
  }

  // Apply decorators (modifiers & joins)
  if (DECORATORS[styleId]) {
    const dec = DECORATORS[styleId];
    
    if (dec.modifier) {
      converted = converted.split('').map(char => char !== ' ' ? char + dec.modifier : char).join('');
    }
    
    if (dec.join) {
      converted = converted.split('').join(dec.join);
    }
    
    if (dec.pre || dec.post) {
      converted = `${dec.pre || ''}${converted}${dec.post || ''}`;
    }
    
    if (dec.reverse) {
      converted = converted.split('').reverse().join('');
    }
  }
  
  return deco.replace('{text}', converted);
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cómo cambiar la letra en TikTok? (Bio, nombre y comentarios)",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Dentro de la aplicación de TikTok no hay una opción nativa para cambiar el tipo de letra de tu biografía o nombre de usuario. Para lograrlo, necesitas usar un generador de letras bonitas para TikTok como el nuestro. Solo tienes que escribir tu texto en la parte superior, elegir la tipografía aesthetic, cursiva o gótica que más te guste, hacer clic en copiar y luego pegarlo directamente en tu perfil de TikTok (Editar perfil > Nombre / Descripción)."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué son las fuentes aesthetic o letras raras para TikTok?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Las \"letras raras\", fuentes aesthetic o \"letras invisibles\" en realidad no son tipografías (fuentes) tradicionales, sino caracteres especiales del sistema Unicode que todos los teléfonos modernos (iOS y Android) pueden leer. Cuando usas nuestro conversor para obtener letras cursivas, góticas, tachadas o con símbolos, estás combinando estos símbolos únicos. Por esto puedes copiarlas y pegarlas en cualquier red social como Instagram, WhatsApp o Free Fire."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuáles son las letras bonitas más usadas en TikTok?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Entre las tipografías más buscadas por los usuarios destacan: las letras cursivas elegantes (ideales para biografías tipo \"Coquette\" o románticas), las letras góticas o dark (muy usadas para la estética Dark Academia o Grunge), las letras chiquitas y los nombres combinados con símbolos (estrellas, corazones, mariposas y cruces). Nuestro conversor cuenta con todas ellas y más de 50 estilos VIP diferentes."
      }
    },
    {
      "@type": "Question",
      "name": "¿Puedo usar este conversor de letras para nombres de Free Fire o Instagram?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "¡Sí, absolutamente! Aunque hemos seleccionado las decoraciones favoritas de TikTok, cualquier texto generado aquí es 100% compatible como letras para Instagram, nombres para Free Fire, Roblox, WhatsApp y Facebook. Al estar basados en Unicode, son aceptados prácticamente en cualquier plataforma de internet."
      }
    }
  ]
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Generador de Letras Aesthetic para TikTok",
  "url": "https://generadordelettering.org/herramientas/letras-tiktok",
  "description": "Conversor online de texto normal a letras aesthetic, cursivas y decoradas ideal para las biografías y videos de TikTok.",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
};

export default function LetrasTikTok() {
  const [inputText, setInputText] = useState('');
  const deferredInput = useDeferredValue(inputText);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      <SEO 
        title="Conversor de Letras Bonitas para TikTok | Generador de Lettering"
        description="Generador de letras bonitas y aesthetic para TikTok. Copia y pega letras cursivas, góticas y símbolos para mejorar tu perfil y videos."
        keywords="letras para tiktok, letras bonitas tiktok, generador de letras tiktok, nombres para tiktok"
        canonical="https://generadordelettering.org/herramientas/letras-tiktok"
        jsonSchema={[
          faqSchema, 
          softwareSchema,
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
                "item": "https://generadordelettering.org/"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Letras para TikTok",
                "item": "https://generadordelettering.org/herramientas/letras-tiktok"
              }
            ]
          }
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 py-12 w-full">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
          <li>
            <Link to="/" className="hover:text-pink-600 transition-colors">Inicio</Link>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-gray-500">/</span>
            <span className="text-gray-900" aria-current="page">Letras para TikTok</span>
          </li>
        </ol>
      </nav>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Conversor de Letras Bonitas para TikTok</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          La mejor herramienta para <strong>conversiones de letras bonitas</strong>. Personaliza tu biografía, nombre y comentarios en TikTok, Instagram o WhatsApp.
        </p>
        <div className="flex justify-center gap-3">
           <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100 text-pink-700 font-semibold rounded-full text-sm"><Instagram className="w-4 h-4"/> Instagram</span>
           <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white font-semibold rounded-full text-sm"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002-.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/></svg> TikTok</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl shadow-sm border border-pink-100 p-6 md:p-8 mb-10">
        <div className="flex justify-between items-end mb-3">
          <label htmlFor="text-input" className="block text-sm font-bold text-gray-800 uppercase tracking-wide">¿Qué quieres convertir?</label>
          <span className="text-xs font-medium text-pink-500 bg-pink-100 px-2 py-1 rounded">{inputText.length} caracteres</span>
        </div>
        <div className="relative">
          <input
            id="text-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-16 pl-6 pr-14 bg-white border-2 border-pink-200 rounded-xl focus:ring-4 focus:ring-pink-100 focus:border-pink-400 outline-none text-xl font-medium shadow-sm transition-all"
            placeholder="Escribe aquí tu frase aesthetic..."
          />
          {inputText && (
            <button 
              onClick={() => setInputText('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-500 hover:text-pink-500 hover:bg-pink-50 rounded-full p-2 transition-colors"
              title="Borrar todo"
              aria-label="Borrar texto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {STYLES.map((style, idx) => {
          const converted = convertText(deferredInput, style.id, style.deco);
          
          return (
            <div key={idx} className="bg-white border text-center md:text-left border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 hover:border-pink-300 hover:shadow-md transition-all group">
              <div className="w-full md:w-48 shrink-0">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{style.name}</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xl md:text-2xl text-gray-900 truncate px-4 py-2 border-b md:border-b-0 border-gray-100 w-full" title={converted}>
                  {converted}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(converted, String(idx))}
                aria-label={`Copiar estilo ${style.name}`}
                className={`shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all w-full md:w-auto ${
                  copiedId === String(idx) 
                    ? 'bg-pink-500 text-white shadow-pink-500/20 shadow-lg' 
                    : 'bg-pink-50 text-pink-600 hover:bg-pink-100 group-hover:scale-105'
                }`}
              >
                {copiedId === String(idx) ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copiado ૮ ՛ﻌ՝ ა
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
      
      <div className="mt-16 bg-white rounded-2xl p-8 border border-gray-200 text-center flex flex-col items-center">
        <Heart className="w-12 h-12 text-pink-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Dale más estilo a tus redes</h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          ¿Necesitas algo más que texto? Prueba nuestro Editor de Lettering para crear imágenes, carteles y gráficos espectaculares con fuentes personalizadas y fondos gradientes.
        </p>
        <Link to="/editor" className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition shadow-md hover:shadow-lg">
          Ir al Editor de Imágenes
        </Link>
      </div>

      <section className="mt-16 text-left space-y-8 bg-pink-50/50 p-8 rounded-3xl border border-pink-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Preguntas Frecuentes sobre Letras para TikTok</h2>
          <p className="text-gray-600 mt-3">Todo lo que necesitas saber sobre cómo cambiar la letra en tus vídeos y perfil de TikTok.</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Cómo cambiar la letra en TikTok? (Bio, nombre y comentarios)</h3>
            <p className="text-gray-600 leading-relaxed">
              Dentro de la aplicación de TikTok no hay una opción nativa para cambiar el tipo de letra de tu biografía o nombre de usuario. Para lograrlo, necesitas usar un <strong>generador de letras bonitas para TikTok</strong> como el nuestro. Solo tienes que escribir tu texto en la parte superior, elegir la tipografía <em>aesthetic</em>, cursiva o gótica que más te guste, hacer clic en copiar y luego pegarlo directamente en tu perfil de TikTok (Editar perfil &gt; Nombre / Descripción).
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Qué son las fuentes aesthetic o letras raras para TikTok?</h3>
            <p className="text-gray-600 leading-relaxed">
              Las "letras raras", fuentes <em>aesthetic</em> o "letras invisibles" en realidad no son tipografías (fuentes) tradicionales, sino caracteres especiales del sistema Unicode que todos los teléfonos modernos (iOS y Android) pueden leer. Cuando usas nuestro conversor para obtener <strong>letras cursivas, góticas, tachadas o con símbolos</strong>, estás combinando estos símbolos únicos. Por esto puedes copiarlas y pegarlas en cualquier red social como Instagram, WhatsApp o Free Fire.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Cuáles son las letras bonitas más usadas en TikTok?</h3>
            <p className="text-gray-600 leading-relaxed">
              Entre las tipografías más buscadas por los usuarios destacan: las <strong>letras cursivas elegantes</strong> (ideales para biografías tipo "Coquette" o románticas), las <strong>letras góticas o dark</strong> (muy usadas para la estética Dark Academia o Grunge), las letras chiquitas y los nombres combinados con símbolos (estrellas, corazones, mariposas y cruces). Nuestro conversor cuenta con todas ellas y más de 50 estilos VIP diferentes.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Puedo usar este conversor de letras para nombres de Free Fire o Instagram?</h3>
            <p className="text-gray-600 leading-relaxed">
              ¡Sí, absolutamente! Aunque hemos seleccionado las decoraciones favoritas de TikTok, cualquier texto generado aquí es 100% compatible como <strong>letras para Instagram</strong>, nombres para <strong>Free Fire, Roblox, WhatsApp</strong> y Facebook. Al estar basados en Unicode, son aceptados prácticamente en cualquier plataforma de internet.
            </p>
          </div>
        </div>
      </section>

      <RelatedTools currentPath="/herramientas/letras-tiktok" />
    </div>
    </>
  );
}
