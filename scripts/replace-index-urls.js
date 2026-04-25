const fs = require('fs');

const file = './src/index.html';
const url = 'https://your-domain.com';

let content = fs.readFileSync(file, 'utf8');

content = content.replace(/%APP_URL%/g, url);

fs.writeFileSync(file, content);
console.log('✔ index.html updated');
