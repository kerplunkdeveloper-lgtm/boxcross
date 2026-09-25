import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.resolve(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');
const publicPath = path.resolve(__dirname, 'public');
const srcAssetsPath = path.resolve(__dirname, 'src', 'assets');

// Helper to safely escape HTML characters in meta tags without double escaping
const escapeHtml = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&amp;/g, '&')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

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
  <title>${escapeHtml(route.title)}</title>
  <meta name="description" content="${escapeHtml(route.description)}" />

  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Box &amp; Cross" />
  <meta property="og:url" content="${route.url}" />
  <meta property="og:title" content="${escapeHtml(route.title)}" />
  <meta property="og:description" content="${escapeHtml(route.description)}" />
  <meta property="og:image" content="${route.image}" />
  <meta property="og:image:secure_url" content="${route.image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${escapeHtml(route.imageAlt || route.title)}" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${route.url}" />
  <meta name="twitter:title" content="${escapeHtml(route.title)}" />
  <meta name="twitter:description" content="${escapeHtml(route.description)}" />
  <meta name="twitter:image" content="${route.image}" />
  <!-- SEO_END -->`;

// Function to inject meta tags into HTML template with fallback support
const injectMetaTags = (html, metaTags) => {
  if (/<!-- SEO_START -->[\s\S]*?<!-- SEO_END -->/.test(html)) {
    return html.replace(/<!-- SEO_START -->[\s\S]*?<!-- SEO_END -->/, metaTags);
  }
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<\/head>/i, `${metaTags}\n</head>`);
};

// Function to fetch all events from backend or MongoDB
async function fetchAllEvents() {
  const candidateUrls = [
    'http://127.0.0.1:5000/api/events',
    'http://localhost:5000/api/events',
    'https://api.boxandcross.com/api/events'
  ];

  for (const url of candidateUrls) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) {
        const json = await res.json();
        if (json && json.success && Array.isArray(json.data)) {
          console.log(`Fetched ${json.data.length} events from ${url}`);
          return json.data;
        }
      }
    } catch (e) {
      // Try next candidate URL
    }
  }

  // Fallback: connect directly to MongoDB if backend .env exists
  try {
    const backendEnvPath = path.resolve(__dirname, '../backend/.env');
    if (fs.existsSync(backendEnvPath)) {
      const envContent = fs.readFileSync(backendEnvPath, 'utf8');
      const mongoMatch = envContent.match(/MONGODB_URI=(.+)/);
      if (mongoMatch) {
        const mongoUri = mongoMatch[1].trim();
        const mongoosePath = path.resolve(__dirname, '../backend/node_modules/mongoose');
        if (fs.existsSync(mongoosePath)) {
          const mongoose = require(mongoosePath);
          const conn = await mongoose.createConnection(mongoUri, { serverSelectionTimeoutMS: 4000 }).asPromise();
          const EventModel = conn.model('Event', new mongoose.Schema({}, { strict: false }));
          const events = await EventModel.find({}).lean();
          await conn.close();
          console.log(`Fetched ${events.length} events directly from MongoDB`);
          return events;
        }
      }
    }
  } catch (err) {
    console.warn('MongoDB direct fallback during prerender:', err.message);
  }

  return [];
}

async function runPrerender() {
  // 1. Prerender standard static pages
  const staticRoutes = [
    {
      path: 'events',
      title: 'Events & Class Schedules | Box & Cross',
      description: 'View and register for active training sessions, elite gym schedules, and competitive athletic events at Box & Cross.',
      image: 'https://membership.boxandcross.com/og-events.jpg',
      imageAlt: 'Box and Cross Events and Schedules',
      url: 'https://membership.boxandcross.com/events'
    },
    {
      path: 'community',
      title: 'Community & Tribe | Box & Cross',
      description: 'The community that forms when serious people train together long enough to become something more than training partners. You train here. You belong here.',
      image: 'https://membership.boxandcross.com/og-community.jpg',
      imageAlt: 'Box and Cross Community and Tribe',
      url: 'https://membership.boxandcross.com/community'
    }
  ];

  staticRoutes.forEach(route => {
    const routeDir = path.join(distPath, route.path);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }

    const metaTagsString = buildMetaTags(route);
    const routeHtml = injectMetaTags(originalHtml, metaTagsString);

    fs.writeFileSync(path.join(routeDir, 'index.html'), routeHtml, 'utf8');
    console.log(`Prerendered SEO HTML for route: /${route.path}`);
  });

  // 2. Prerender dynamic event pages
  console.log('Fetching dynamic events for SEO Open Graph prerendering...');
  const events = await fetchAllEvents();

  if (events && events.length > 0) {
    const frontendUrl = 'https://membership.boxandcross.com';
    events.forEach(event => {
      const eventId = (event._id || '').toString();
      if (!eventId) return;

      const eventDir = path.join(distPath, 'events', eventId);
      if (!fs.existsSync(eventDir)) {
        fs.mkdirSync(eventDir, { recursive: true });
      }

      const rawDesc = event.description || '';
      const plainDesc = rawDesc.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      const cleanDesc = plainDesc.length > 0
        ? (plainDesc.length > 155 ? plainDesc.substring(0, 152) + '...' : plainDesc)
        : `Join the ${event.title} event at Box & Cross. View schedule and book your slot now!`;

      const eventRoute = {
        path: `events/${eventId}`,
        title: `${event.title} | Box & Cross`,
        description: cleanDesc,
        image: event.imageUrl || `${frontendUrl}/og-events.jpg`,
        imageAlt: event.title,
        url: `${frontendUrl}/events/${eventId}`
      };

      const metaTagsString = buildMetaTags(eventRoute);
      const eventHtml = injectMetaTags(originalHtml, metaTagsString);

      fs.writeFileSync(path.join(eventDir, 'index.html'), eventHtml, 'utf8');
      console.log(`Prerendered SEO HTML for dynamic event: /events/${eventId} (${event.title})`);
    });
  } else {
    console.warn('No dynamic events found to prerender.');
  }

  // 3. Update root index.html for membership
  const membershipRoute = {
    title: 'Membership Plans | Box & Cross – Performance Arena',
    description: 'At Box & Cross (BXC), every plan is designed to give you access to our premium performance arena, structured coaching, and the BXC community. Choose the plan that suits your goals.',
    image: 'https://membership.boxandcross.com/og-membership.png',
    imageAlt: 'Box and Cross Membership Plans',
    url: 'https://membership.boxandcross.com/'
  };

  const membershipMetaTags = buildMetaTags(membershipRoute);
  const updatedMainHtml = injectMetaTags(originalHtml, membershipMetaTags);
  fs.writeFileSync(indexPath, updatedMainHtml, 'utf8');
  console.log('Updated landing page index.html with membership OG meta tags.');
}

runPrerender().catch(err => {
  console.error('Prerender error:', err);
});
