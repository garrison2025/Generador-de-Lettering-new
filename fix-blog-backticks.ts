import fs from 'fs';
let data = fs.readFileSync('src/data/blogPosts.ts', 'utf8');

// Replace " with ` for the content field to safely support newlines
data = data.replace(/content: "\\n/g, 'content: `\\n');
data = data.replace(/content: "En/g, 'content: `En');
data = data.replace(/content: "La/g, 'content: `La');
data = data.replace(/content: "¿/g, 'content: `¿');

data = data.replace(/BOOYAH!\\*\\*\\."/g, 'BOOYAH!**.`');
data = data.replace(/detalle\\."/g, 'detalle.`');
data = data.replace(/mano\\."/g, 'mano.`');

fs.writeFileSync('src/data/blogPosts.ts', data);
console.log('Done mapping backticks');
