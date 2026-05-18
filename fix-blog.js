const fs = require('fs');
let data = fs.readFileSync('src/data/blogPosts.ts', 'utf8');
data = data.replace(/\\\\n/g, '\\n');
fs.writeFileSync('src/data/blogPosts.ts', data);
console.log('Done');
