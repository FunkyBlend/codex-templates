const fs = require('fs');
const content = fs.readFileSync('src/app/page.tsx', 'utf8');
try {
  require('@babel/core').parse(content, { presets: ['@babel/preset-react', '@babel/preset-typescript'], filename: 'test.tsx' });
  console.log("Parses fine with babel");
} catch(e) {
  console.error(e.message);
}
