import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';
import ts from 'typescript';

// Compile with the project's existing compiler; no new test runtime dependency.
function moduleUrl(file, replacements = {}) {
  let code = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext }
  }).outputText;
  for (const [from, to] of Object.entries(replacements)) code = code.replace(from, to);
  return `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
}
const unicodeUrl = moduleUrl('src/data/unicodeStyles.ts');
const { smallText, descriptionParts, SYMBOL_GROUPS } = await import(moduleUrl('src/data/freeFireTools.ts', { './unicodeStyles': unicodeUrl }));
const { generateBios } = await import(moduleUrl('src/data/aestheticBios.ts'));

test('small text preserves unsupported Spanish characters, emoji and empty strings', () => {
  assert.equal(smallText('pro', 'mini_sup'), 'ᵖʳᵒ');
  assert.equal(smallText('pro', 'small_caps'), 'ᴘʀᴏ');
  assert.equal(smallText('ñé🙂', 'mini_sup'), 'ñé🙂');
  assert.equal(smallText('', 'mini_sup'), '');
  assert.equal(smallText('0123456789', 'mini_sup'), '⁰¹²³⁴⁵⁶⁷⁸⁹');
});
test('six-digit color tags switch only subsequent text and do not execute markup', () => {
  assert.deepEqual(descriptionParts('A[ff0000]B[00FF00]C'), [
    { text: 'A', color: '#FFFFFF' }, { text: 'B', color: '#ff0000' }, { text: 'C', color: '#00FF00' }
  ]);
  assert.equal(descriptionParts('[bad]<script>alert(1)</script>')[0].text, '[bad]<script>alert(1)</script>');
  assert.deepEqual(descriptionParts(''), [{ text: '', color: '#FFFFFF' }]);
  assert.equal(descriptionParts('[FFFFFF][000000]')[0].color, '#000000');
});
test('each mood generates three substantively different editable bios', () => {
  for (const style of ['Coquette', 'Dark', 'Minimal', 'Kawaii']) {
    const bios = generateBios('José', 'designer', 'art, coffee', style);
    assert.equal(bios.length, 3);
    assert.equal(new Set(bios.map(lines => lines.join('\n'))).size, 3);
    for (const lines of bios) {
      assert(lines.join('\n').includes('José'));
      assert(lines.join('\n').includes('designer'));
      assert(lines.join('\n').includes('art · coffee'));
      assert(!lines.some(line => !line.trim()));
    }
  }
});
test('empty bio details yield no fake identity; partial details omit empty fields', () => {
  assert.deepEqual(generateBios(' ', '', ', ,', 'Minimal'), []);
  const bios = generateBios('José', '', '', 'Dark');
  assert.equal(bios.length, 3);
  assert(!bios.flat().some(line => line.includes('undefined') || !line.trim()));
});
test('symbol groups cover every requested category without duplicate entries', () => {
  assert.deepEqual(SYMBOL_GROUPS.map(group => group.name), ['Coronas', 'Corazones', 'Alas', 'Estrellas', 'Insanos', 'Figuras especiales']);
  const all = SYMBOL_GROUPS.flatMap(group => group.symbols);
  assert(SYMBOL_GROUPS.every(group => group.symbols.length > 0));
  assert.equal(new Set(all).size, all.length);
});
