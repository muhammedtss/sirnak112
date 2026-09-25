const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/app/skalalar');
const files = fs.readdirSync(dir);

files.forEach(file => {
  const fullPath = path.join(dir, file);
  const stat = fs.statSync(fullPath);
  
  if (stat.isDirectory()) {
    const pagePath = path.join(fullPath, 'page.tsx');
    if (fs.existsSync(pagePath)) {
      let content = fs.readFileSync(pagePath, 'utf-8');
      
      // Match missing colors
      content = content.replace(/bg-(pink|orange|purple|fuchsia|violet|cyan|sky|blue|indigo|teal|rose|emerald|amber|red)-[67]00 text-white/g, 'bg-$1-500/15 text-$1-400 border-b border-white/10');
      
      content = content.replace(/bg-(pink|orange|purple|fuchsia|violet|cyan|sky|blue|indigo|teal|rose|emerald|amber|red)-50"/g, 'bg-$1-500/15"');
      content = content.replace(/bg-(pink|orange|purple|fuchsia|violet|cyan|sky|blue|indigo|teal|rose|emerald|amber|red)-100"/g, 'bg-$1-500/20"');

      content = content.replace(/text-(pink|orange|purple|fuchsia|violet|cyan|sky|blue|indigo|teal|rose|emerald|amber|red)-700/g, 'text-$1-400');
      content = content.replace(/bg-(pink|orange|purple|fuchsia|violet|cyan|sky|blue|indigo|teal|rose|emerald|amber|red)-600 text-white/g, 'bg-$1-500 text-white shadow-sm border border-$1-400');

      fs.writeFileSync(pagePath, content, 'utf-8');
      console.log(`UI Migrated: ${file}/page.tsx`);
    }
  }
});
