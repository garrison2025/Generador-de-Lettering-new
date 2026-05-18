import { useState, useEffect, useDeferredValue } from 'react';
import { Copy, Check, ExternalLink, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

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
  serif: '𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙', // actually serif bold mathematically, but standard mapping in math
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
  armas: '︻╦╤─a︻╦╤─b︻╦╤─c︻╦╤─d︻╦╤─e︻╦╤─f︻╦╤─g︻╦╤─h︻╦╤─i︻╦╤─j︻╦╤─k︻╦╤─l︻╦╤─m︻╦╤─n︻╦╤─o︻╦╤─p︻╦╤─q︻╦╤─r︻╦╤─s︻╦╤─t︻╦╤─u︻╦╤─v︻╦╤─w︻╦╤─x︻╦╤─y︻╦╤─z︻╦╤─A︻╦╤─B︻╦╤─C︻╦╤─D︻╦╤─E︻╦╤─F︻╦╤─G︻╦╤─H︻╦╤─I︻╦╤─J︻╦╤─K︻╦╤─L︻╦╤─M︻╦╤─N︻╦╤─O︻╦╤─P︻╦╤─Q︻╦╤─R︻╦╤─S︻╦╤─T︻╦╤─U︻╦╤─V︻╦╤─W︻╦╤─X︻╦╤─Y︻╦╤─Z', // will just add guns to all char mapped strings
  demoniaco: 'a̶b̶c̶d̶e̶f̶g̶h̶i̶j̶k̶l̶m̶n̶o̶p̶q̶r̶s̶t̶u̶v̶w̶x̶y̶z̶A̶B̶C̶D̶E̶F̶G̶H̶I̶J̶K̶L̶M̶N̶O̶P̶Q̶R̶S̶T̶U̶V̶W̶X̶Y̶Z̶', // we have decorators but these are direct map tests
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
  
  // Zalgo (Multiple modifiers simulated as a decorator here)
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
  // Mapped Fonts
  { id: 'cursiva', name: 'Cursiva Mágica' },
  { id: 'cursiva_bold', name: 'Cursiva Intensa' },
  { id: 'gotica', name: 'Gótica Clásica' },
  { id: 'gotica_bold', name: 'Gótica Intensa' },
  { id: 'doble', name: 'Doble Trazo (Outline)' },
  { id: 'sans', name: 'Sans Normal' },
  { id: 'sans_bold', name: 'Sans Negrita' },
  { id: 'sans_italic', name: 'Sans Cursiva' },
  { id: 'sans_bold_italic', name: 'Sans Cursiva Negrita' },
  { id: 'serif', name: 'Serif Fina' },
  { id: 'serif_italic', name: 'Serif Cursiva' },
  { id: 'serif_bold', name: 'Serif Negrita' },
  { id: 'serif_bold_italic', name: 'Serif Negrita Cursiva' },
  { id: 'burbujas', name: 'Burbujas Claras' },
  { id: 'burbujas_negra', name: 'Burbujas Oscuras' },
  { id: 'cuadrados', name: 'Cuadrados Claros' },
  { id: 'cuadrados_negros', name: 'Cuadrados Oscuros' },
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

function convertText(text: string, styleId: string) {
  if (!text) return '';
  
  let result = text;

  // Appply mapped fonts
  if (FONT_MAPS[styleId]) {
    const map = FONT_MAPS[styleId];
    result = result.split('').map(char => {
      if (styleId === 'al_reves' || styleId === 'espejo' || styleId === 'invertido_mayusculas') {
        const mapped = map[char] || map[char.toLowerCase()] || char;
        return mapped;
      }
      return map[char] || char;
    }).join('');
    
    // Si es al revés o espejo, el texto completo también se invierte
    if (styleId === 'al_reves' || styleId === 'espejo' || styleId === 'invertido_mayusculas') {
      result = result.split('').reverse().join('');
    }
  }

  // Apply decorators (modifiers & joins)
  if (DECORATORS[styleId]) {
    const dec = DECORATORS[styleId];
    
    if (dec.modifier) {
      result = result.split('').map(char => char !== ' ' ? char + dec.modifier : char).join('');
    }
    
    if (dec.join) {
      result = result.split('').join(dec.join);
    }
    
    if (dec.pre || dec.post) {
      result = `${dec.pre || ''}${result}${dec.post || ''}`;
    }
    
    if (dec.reverse) {
      result = result.split('').reverse().join('');
    }
  }

  return result;
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿En qué se diferencian estas letras raras y copy paste de otras?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Nuestro conversor de texto incluye el catálogo de tipografías y fuentes unicode más grande de 2024. Te permite cambiar el tipo de letra normal a negrita, cursivas, góticas, tachadas, al revés y letras especiales de burbujas en un solo clic. Otras herramientas limitan el número de estilos \"aesthetic\", nosotros te presentamos todo junto para que tengas infinitas opciones."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cómo copiar letras al revés, tachadas o subrayadas?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Dentro de la herramienta, escribe tu frase y fíjate en las últimas opciones de la lista. Verás estilos creativos como 'Al revés', 'Tachado (Strikethrough)' y 'Subrayado'. Solo da un toque encima de la tarjeta que te gusto, ¡y listo! Se habrá copiado para publicarlo inmediatamente en Facebook, WhatsApp, Discord o Twitter."
      }
    },
    {
      "@type": "Question",
      "name": "¿Es malo usar tipos de letra diferentes en perfiles y biografías?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "En absoluto. Personalizar tu biografía de Instagram o nombre de usuario de TikTok usando letras 'copy and paste' es una manera excelente de destacar y mostrar personalidad. Solo asegúrate de que siga siendo legible. Te recomendamos usar las letras cursivas elegantes (script) o letras pequeñas si quieres un estilo 'clean' u ordenado."
      }
    },
    {
      "@type": "Question",
      "name": "¿Necesito descargar fuentes (TTF u OTF)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Las letras y estilos de este conversor de letras se basan enteramente en caracteres y símbolos Unicode, no en archivos TTF (fuentes del sistema). Es por eso que puedes copiarlas y quienes visiten tu perfil podrán leerlas sin necesidad de instalar ellos ninguna fuente."
      }
    }
  ]
};

export default function ConversorTexto() {
  const [inputText, setInputText] = useState('Lettering Mágico');
  const deferredInput = useDeferredValue(inputText);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // Removed document.title
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      <SEO 
        title="Conversor de Letras | Cambiar Letras y Fuentes de Texto"
        description="Conversor de letras para cambiar tipos de fuente y copiar y pegar fácilmente. Más de 50 estilos diferentes gratis y sin instalar nada."
        keywords="conversor de letras, cambiar tipo de letra, conversor texto online, letras raras copy paste"
        jsonSchema={faqSchema}
      />
      <div className="max-w-4xl mx-auto px-4 py-12 w-full">
      <Link to="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#5A4AD2] mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Volver a inicio
      </Link>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Conversor de Letras Bonitas</h1>
        <p className="text-lg text-gray-600">
          Transforma tu texto normal en fuentes especiales (con caracteres Unicode) para copiar y pegar en Instagram, TikTok, Twitter o WhatsApp.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 md:p-8 mb-8">
        <div className="flex justify-between items-end mb-3">
          <label htmlFor="text-input" className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Escribe tu texto aquí:</label>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{inputText.length} caracteres / {inputText.split(/\s+/).filter(w => w.length > 0).length} palabras</span>
        </div>
        <div className="relative">
          <textarea
            id="text-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-32 p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:ring-0 focus:border-[#5A4AD2] outline-none resize-none text-xl font-medium pr-12 transition-all shadow-inner placeholder:text-gray-500"
            placeholder="Escribe algo increíble..."
          />
          {inputText && (
            <button 
              onClick={() => setInputText('')}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition"
              title="Borrar texto"
              aria-label="Borrar texto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {STYLES.map((style) => {
          const converted = convertText(deferredInput || 'Escribe algo', style.id);
          
          return (
            <div key={style.id} className="bg-white border text-center md:text-left border-gray-200 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 hover:border-[#5A4AD2]/50 transition-colors">
              <div className="w-full md:w-48 shrink-0">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{style.name}</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xl md:text-2xl text-gray-900 truncate px-4 py-2 border-b md:border-b-0 border-gray-100 w-full" title={converted}>
                  {converted}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(converted, style.id)}
                aria-label={`Copiar estilo ${style.name}`}
                className={`shrink-0 flex items-center justify-center gap-2 px-6 py-3 w-full md:w-auto rounded-xl font-bold transition-all shadow-sm hover:-translate-y-0.5 ${
                  copiedId === style.id 
                    ? 'bg-green-100 text-green-700 ring-2 ring-green-400 border-transparent' 
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-[#5A4AD2] hover:text-white hover:border-[#5A4AD2]'
                }`}
              >
                {copiedId === style.id ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copiar texto
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="mt-12 text-center p-8 bg-gradient-to-br from-[#5A4AD2]/10 to-[#FF6B6B]/10 rounded-2xl border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">¿Buscas crear imágenes o carteles?</h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Este conversor solo funciona para texto en redes sociales. Si quieres diseñar imágenes de alta calidad con diferentes tipografías, colores, sombras y fondos, usa nuestro Editor Principal.
        </p>
        <Link to="/editor" className="inline-flex items-center gap-2 bg-[#5A4AD2] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#4F46E5] transition shadow-sm">
          Ir al Editor Principal
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      <section className="mt-16 text-left space-y-8 bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Preguntas Frecuentes del Conversor de Letras</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿En qué se diferencian estas letras raras y copy paste de otras?</h3>
            <p className="text-gray-600 leading-relaxed">
              Nuestro conversor de texto incluye el catálogo de tipografías y fuentes unicode más grande de 2024. Te permite <strong>cambiar el tipo de letra normal a negrita, cursivas, góticas, tachadas, al revés y letras especiales de burbujas</strong> en un solo clic. Otras herramientas limitan el número de estilos "aesthetic", nosotros te presentamos todo junto para que tengas infinitas opciones.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Cómo copiar letras al revés, tachadas o subrayadas?</h3>
            <p className="text-gray-600 leading-relaxed">
              Dentro de la herramienta, escribe tu frase y fíjate en las últimas opciones de la lista. Verás estilos creativos como "Al revés", "Tachado (Strikethrough)" y "Subrayado". Solo da un toque encima de la tarjeta que te gusto, ¡y listo! Se habrá copiado para publicarlo inmediatamente en Facebook, WhatsApp, Discord o Twitter.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Es malo usar tipos de letra diferentes en perfiles y biografías?</h3>
            <p className="text-gray-600 leading-relaxed">
              En absoluto. Personalizar tu biografía de Instagram o nombre de usuario de TikTok usando letras "copy and paste" es una manera excelente de destacar y mostrar personalidad. Solo asegúrate de que siga siendo legible. Te recomendamos usar las <strong>letras cursivas elegantes (script)</strong> o <strong>letras pequeñas</strong> si quieres un estilo "clean" u ordenado.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¿Necesito descargar fuentes (TTF u OTF)?</h3>
            <p className="text-gray-600 leading-relaxed">
              No. Las letras y estilos de este conversor de letras se basan enteramente en caracteres y símbolos Unicode, no en archivos TTF (fuentes del sistema). Es por eso que puedes copiarlas y quienes visiten tu perfil podrán leerlas sin necesidad de instalar ellos ninguna fuente.
            </p>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
