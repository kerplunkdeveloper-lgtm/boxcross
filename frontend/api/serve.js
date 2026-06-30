const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const url = req.url || '';
  
  // Default values: Membership page (/)
  let title = 'Membership Plans | Box & Cross';
  let description = 'Discover a community where serious athletes train together to become something more than just training partners. At Box & Cross, you belong here.';
  let image = 'https://membership.boxandcross.com/og-membership.png';
  let pageUrl = 'https://membership.boxandcross.com/';

  // Route-specific configurations
  if (url.includes('/events')) {
    title = 'Events & Class Schedules | Box & Cross';
    description = 'View and register for active training sessions, elite gym schedules, and competitive athletic events at Box & Cross.';
    image = 'https://membership.boxandcross.com/og-events.jpg';
    pageUrl = 'https://membership.boxandcross.com/events';
  } else if (url.includes('/community')) {
    title = 'Community & Tribe | Box & Cross';
    description = 'The community that forms when serious people train together long enough to become something more than training partners. You train here. You belong here.';
    image = 'https://membership.boxandcross.com/og-community.png';
    pageUrl = 'https://membership.boxandcross.com/community';
  }

  const metaTagsString = `<!-- SEO_START -->
  <title>${title}</title>
  <meta name="description" content="${description}" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="${pageUrl}" />
  <meta property="twitter:title" content="${title}" />
  <meta property="twitter:description" content="${description}" />
  <meta property="twitter:image" content="${image}" />
  <!-- SEO_END -->`;

  try {
    const filePath = path.join(process.cwd(), 'dist', 'index.html');
    
    if (!fs.existsSync(filePath)) {
      console.error('index.html not found at path:', filePath);
      return res.status(404).send('Application build files not found.');
    }

    let html = fs.readFileSync(filePath, 'utf8');

    // Replace default SEO tags block with the dynamic ones
    html = html.replace(/<!-- SEO_START -->[\s\S]*?<!-- SEO_END -->/, metaTagsString);

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error serving index.html dynamically:', error);
    res.status(500).send('Error serving the application page');
  }
};
