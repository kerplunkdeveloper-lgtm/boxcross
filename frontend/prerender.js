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
  { src: 'og-membership.png', dest: 'og-membership.png' },
  { src: 'og-events.jpg', dest: 'og-events.jpg' },
  { src: 'og-community.jpg', dest: 'og-community.jpg' }
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

const buildMetaTags = (route) => `<!-- SEO_START -->
  <title>${route.title}</title>
  <meta name="description" content="${route.description}" />

  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Box &amp; Cross" />
  <meta property="og:url" content="${route.url}" />
  <meta property="og:title" content="${route.title}" />
  <meta property="og:description" content="${route.description}" />
  <meta property="og:image" content="${route.image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${route.imageAlt}" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${route.url}" />
  <meta name="twitter:title" content="${route.title}" />
  <meta name="twitter:description" content="${route.description}" />
  <meta name="twitter:image" content="${route.image}" />
  <!-- SEO_END -->`;

// Configuration for each route we want to prerender
const routes = [
  {
    path: 'events',
    title: 'Events &amp; Class Schedules | Box &amp; Cross',
    description: 'View and register for active training sessions, elite gym schedules, and competitive athletic events at Box & Cross.',
    image: 'https://membership.boxandcross.com/og-events.jpg',
    imageAlt: 'Box and Cross Events and Schedules',
    url: 'https://membership.boxandcross.com/events'
  },
  {
    path: 'community',
    title: 'Community &amp; Tribe | Box &amp; Cross',
    description: 'The community that forms when serious people train together long enough to become something more than training partners. You train here. You belong here.',
    image: 'https://membership.boxandcross.com/og-community.jpg',
    imageAlt: 'Box and Cross Community and Tribe',
    url: 'https://membership.boxandcross.com/community'
  }
];

routes.forEach(route => {
  const routeDir = path.join(distPath, route.path);
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }

  const metaTagsString = buildMetaTags(route);

  const routeHtml = originalHtml.replace(
    /<!-- SEO_START -->[\s\S]*?<!-- SEO_END -->/,
    metaTagsString
  );

  fs.writeFileSync(path.join(routeDir, 'index.html'), routeHtml, 'utf8');
  console.log(`Prerendered SEO HTML for route: /${route.path}`);
});

// Update the main index.html for the membership/home page
const membershipRoute = {
  title: 'Membership Plans | Box &amp; Cross \u2013 Performance Arena',
  description: 'At Box & Cross (BXC), every plan is designed to give you access to our premium performance arena, structured coaching, and the BXC community. Choose the plan that suits your goals.',
  image: 'https://membership.boxandcross.com/og-membership.png',
  imageAlt: 'Box and Cross Membership Plans',
  url: 'https://membership.boxandcross.com/'
};

const membershipMetaTags = buildMetaTags(membershipRoute);
const updatedMainHtml = originalHtml.replace(
  /<!-- SEO_START -->[\s\S]*?<!-- SEO_END -->/,
  membershipMetaTags
);
fs.writeFileSync(indexPath, updatedMainHtml, 'utf8');
console.log('Updated landing page index.html with membership OG meta tags.');


