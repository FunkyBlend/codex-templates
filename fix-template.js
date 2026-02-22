const fs = require('fs');

const file = fs.readFileSync('template.jsx', 'utf8');

// The JSX is broken and missing all punctuation for tags, let's fix it manually or rewrite it cleanly
// Actually let's just create a proper React component from scratch based on the structure of template.jsx since it looks like an OCR/bad copy paste output where punctuation < > = "" etc was stripped.

