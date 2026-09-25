const fs = require('fs');
const content = fs.readFileSync('src/components/skalalar/BurnBodyMap.tsx', 'utf8');
const polygons = [...content.matchAll(/<polygon\s+id="([^"]+)"[\s\S]*?points="([^"]+)"/g)];
const centroids = {};

for (const match of polygons) {
  const id = match[1];
  const points = match[2].trim().split(/\s+/).map(p => p.split(',').map(Number));
  
  let area = 0;
  let cx = 0;
  let cy = 0;

  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    const x0 = points[i][0];
    const y0 = points[i][1];
    const x1 = points[j][0];
    const y1 = points[j][1];
    const a = x0 * y1 - x1 * y0;
    area += a;
    cx += (x0 + x1) * a;
    cy += (y0 + y1) * a;
  }
  area *= 0.5;
  cx = Math.round(cx / (6 * area));
  cy = Math.round(cy / (6 * area));
  
  // fallback to bounding box center
  if (isNaN(cx) || isNaN(cy)) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const [x, y] of points) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    cx = Math.round((minX + maxX)/2);
    cy = Math.round((minY + maxY)/2);
  }

  centroids[id] = { x: cx, y: cy };
}
fs.writeFileSync('centroids.json', JSON.stringify(centroids, null, 2));
