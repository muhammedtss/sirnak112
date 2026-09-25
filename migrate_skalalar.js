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
      
      // Extract title from header
      const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
      const title = titleMatch ? titleMatch[1].trim() : 'Skala';
      
      // Check if it already uses PageShell
      if (!content.includes('PageShell')) {
        // Add imports
        content = content.replace(
          /import Link from "next\/link";/g,
          `import { PageShell } from "@/components/layout/PageShell";\nimport { AppHeader } from "@/components/layout/AppHeader";\nimport { ArrowLeft } from "lucide-react";`
        );
        
        // Replace header section
        const headerRegex = /<header[\s\S]*?<\/header>/;
        const newHeader = `<AppHeader title="${title}" back="/skalalar" icon={<ArrowLeft style={{ width: 16, height: 16 }} />} />`;
        content = content.replace(headerRegex, newHeader);
        
        // Replace root div with PageShell
        content = content.replace(/<div className="min-h-\[100svh\] bg-slate-100 flex flex-col font-sans select-none">/, '<PageShell>');
        
        // Replace last </div> with </PageShell>
        const lastDivIndex = content.lastIndexOf('</div>');
        if (lastDivIndex !== -1) {
          content = content.substring(0, lastDivIndex) + '</PageShell>' + content.substring(lastDivIndex + 6);
        }
        
        // Minor spacing adjustments for main
        content = content.replace(/<main className="([^"]*)"([^>]*)>/, (match, classes, rest) => {
           let newClasses = classes.replace('bg-white', '').replace('shadow-sm', '').trim();
           if (!newClasses.includes('flex-1')) newClasses = 'flex-1 ' + newClasses;
           return `<main className="${newClasses}"${rest}>`;
        });
        
        fs.writeFileSync(pagePath, content, 'utf-8');
        console.log(`Migrated: ${file}/page.tsx`);
      }
    }
  }
});
