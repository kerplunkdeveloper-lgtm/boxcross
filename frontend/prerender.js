import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.resolve(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');
const publicPath = path.resolve(__dirname, 'public');
const srcAssetsPath = path.resolve(__dirname, 'src', 'assets');

// 1. Copy the social sharing images to public/ and dist/ folders
const filesToCopy = [
  { src: 'banner.png', dest: 'og-membership.png' },
  { src: 'cover.jpg', dest: 'og-events.jpg' },
  { src: 'com.png', dest: 'og-community.png' }
];

filesToCopy.forEach(file => {
  const srcFilePath = path.join(srcAssetsPath, file.src);
  
  if (fs.existsSync(srcFilePath)) {
    // Copy to public/ for local development
    const publicDestPath = path.join(publicPath, file.dest);
    fs.copyFileSync(srcFilePath, publicDestPath);
    console.log(`Copied ${file.src} to public/${file.dest}`);

    // Copy to dist/ if build output exists
    if (fs.existsSync(distPath)) {
      const distDestPath = path.join(distPath, file.dest);
      fs.copyFileSync(srcFilePath, distDestPath);
      console.log(`Copied ${file.src} to dist/${file.dest}`);
    }
  } else {
    console.warn(`Warning: Source asset not found: ${srcFilePath}`);
  }
});

// 2. Perform SEO Pre-rendering
if (!fs.existsSync(indexPath)) {
  console.log('index.html not found in dist. (This is expected before you build the project). Skipping meta-tag injection.');
  process.exit(0);
}

const originalHtml = fs.readFileSync(indexPath, 'utf8');

// Configuration for each route we want to prerender
const routes = [
  {
    path: 'events',
    title: 'Events & Class Schedules | Box & Cross',
    description: 'View and register for active training sessions, elite gym schedules, and competitive athletic events at Box & Cross.',
    image: 'https://membership.boxandcross.com/og-events.jpg',
    url: 'https://membership.boxandcross.com/events'
  },
  {
    path: 'community',
    title: 'Community & Tribe | Box & Cross',
    description: 'The community that forms when serious people train together long enough to become something more than training partners. You train here. You belong here.',
    image: 'https://membership.boxandcross.com/og-community.png',
    url: 'https://membership.boxandcross.com/community'
  }
];

routes.forEach(route => {
  const routeDir = path.join(distPath, route.path);
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }

  const metaTagsString = `<!-- SEO_START -->
  <title>${route.title}</title>
  <meta name="description" content="${route.description}" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${route.url}" />
  <meta property="og:title" content="${route.title}" />
  <meta property="og:description" content="${route.description}" />
  <meta property="og:image" content="${route.image}" />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="${route.url}" />
  <meta property="twitter:title" content="${route.title}" />
  <meta property="twitter:description" content="${route.description}" />
  <meta property="twitter:image" content="${route.image}" />
  <!-- SEO_END -->`;

  const routeHtml = originalHtml.replace(
    /<!-- SEO_START -->[\s\S]*?<!-- SEO_END -->/,
    metaTagsString
  );

  fs.writeFileSync(path.join(routeDir, 'index.html'), routeHtml, 'utf8');
  console.log(`Prerendered SEO HTML for route: /${route.path}`);
});

// Also update the main index.html to match the default screenshot preview
const membershipMetaTags = `<!-- SEO_START -->
  <title>Box & Cross – Performance Arena</title>
  <meta name="description" content="Experience premium boxing, fitness, and performance training at Box & Cross." />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://membership.boxandcross.com/" />  
  <meta property="og:title" content="Box & Cross – Performance Arena" />
  <meta property="og:description" content="Experience premium boxing, fitness, and performance training at Box & Cross." />
  <meta property="og:image" content="https://membership.boxandcross.com/logg.jpeg" />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://membership.boxandcross.com/" />
  <meta property="twitter:title" content="Box & Cross – Performance Arena" />
  <meta property="twitter:description" content="Experience premium boxing, fitness, and performance training at Box & Cross." />
  <meta property="twitter:image" content="https://membership.boxandcross.com/logg.jpeg" />
  <!-- SEO_END -->`;

const updatedMainHtml = originalHtml.replace(
  /<!-- SEO_START -->[\s\S]*?<!-- SEO_END -->/,
  membershipMetaTags
);
fs.writeFileSync(indexPath, updatedMainHtml, 'utf8');
console.log('Updated landing page index.html with default screenshot fallback.');

