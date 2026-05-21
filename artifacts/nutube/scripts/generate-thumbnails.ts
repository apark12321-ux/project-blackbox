import fs from 'fs';
import path from 'path';
import { INITIAL_POSTS } from '../src/data';
import { renderThumbnailSvg } from '../src/utils/thumbnail-mapping';

const publicThumbnailsDir = path.join(process.cwd(), 'public', 'thumbnails');

// Ensure thumbnails output directory exists
if (!fs.existsSync(publicThumbnailsDir)) {
  fs.mkdirSync(publicThumbnailsDir, { recursive: true });
  console.log(`Created directory: ${publicThumbnailsDir}`);
}

console.log(`Generating SVG Thumbnails for all ${INITIAL_POSTS.length} posts...`);

let successCount = 0;
for (const post of INITIAL_POSTS) {
  try {
    const svgContent = renderThumbnailSvg(post.slug, post.title, post.subtitle, post.category);
    const fileName = `${post.slug}.svg`;
    const filePath = path.join(publicThumbnailsDir, fileName);
    
    fs.writeFileSync(filePath, svgContent, 'utf-8');
    successCount++;
  } catch (err) {
    console.error(`Failed to generate thumbnail for slug: ${post.slug}`, err);
  }
}

console.log(`Successfully generated ${successCount}/${INITIAL_POSTS.length} thumbnails at '/public/thumbnails/'!`);
