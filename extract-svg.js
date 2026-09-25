const fs = require('fs');

const svgContent = fs.readFileSync('./public/burn-maket.svg', 'utf8');

// Find the base64 image data
const imgMatch = svgContent.match(/<image\s+href="data:image\/png;base64,([^"]+)"/);

if (imgMatch) {
  const base64Data = imgMatch[1];
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync('./public/burn-maket-bg.png', buffer);
  console.log('Successfully saved burn-maket-bg.png');
  
  // Create a version of the SVG with the image href pointing to the new file
  const newSvgContent = svgContent.replace(/<image\s+href="data:image\/png;base64,[^"]+"/g, '<image href="/burn-maket-bg.png"');
  fs.writeFileSync('./public/burn-maket-clean.svg', newSvgContent);
  console.log('Successfully saved burn-maket-clean.svg');
} else {
  console.log('No base64 image found');
}
