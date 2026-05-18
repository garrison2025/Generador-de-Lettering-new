import fs from 'fs';
let data = fs.readFileSync('src/data/blogPosts.ts', 'utf8');

// The best way is to evaluate it then re-serialize
data = data.replace(/"$/, '`'); // that would only replace at end of file.

// Let's just fix the end quotes of the strings
data = data.replace(/BOOYAH!\\*\\*\\."/g, 'BOOYAH!**.`');
data = data.replace(/detalle\\."/g, 'detalle.`');
data = data.replace(/mano\\."/g, 'mano.`');

fs.writeFileSync('src/data/blogPosts.ts', data);
console.log('Fixed quotes');
