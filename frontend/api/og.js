export default async function handler(req, res) {
  const { id } = req.query;
  const frontendUrl = "https://membership.boxandcross.com";
  const defaultRedirect = `${frontendUrl}/events`;

  // Default SEO fallback values (if event not found or fetch fails)
  let title = "Events & Class Schedules | Box & Cross";
  let description = "View and register for active training sessions, elite gym schedules, and competitive athletic events at Box & Cross.";
  let imageUrl = `${frontendUrl}/og-events.jpg`;
  let targetUrl = defaultRedirect;

  if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
    try {
      // Fetch all events from Hostinger backend using a standard browser User-Agent
      const backendRes = await fetch("https://mediumblue-llama-100354.hostingersite.com/api/events", {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });

      if (backendRes.ok) {
        const result = await backendRes.json();
        if (result && result.success && Array.isArray(result.data)) {
          const event = result.data.find(e => e._id === id);
          if (event) {
            targetUrl = `${frontendUrl}/events/${event._id}`;
            title = `${event.title} | Box & Cross`;
            
            // Clean description - strip HTML tags and limit character count
            const rawDesc = event.description || "";
            const plainDesc = rawDesc.replace(/<[^>]*>/g, "").trim();
            description = plainDesc.length > 0
              ? (plainDesc.length > 150 ? plainDesc.substring(0, 147) + "..." : plainDesc)
              : `Join the ${event.title} event at Box & Cross. View schedule and book your slot now!`;
            
            imageUrl = event.imageUrl
              ? `${event.imageUrl}?v=${new Date(event.updatedAt || Date.now()).getTime()}`
              : `${frontendUrl}/og-events.jpg?v=1`;
          }
        }
      }
    } catch (err) {
      console.error("Vercel Serverless OG Generator Error:", err.message);
    }
  }

  // Generate dynamic HTML with crawlers-friendly metadata and client-side redirect for actual users
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />

  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Box &amp; Cross" />
  <meta property="og:url" content="${targetUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${title}" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${targetUrl}" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${imageUrl}" />

  <!-- Redirect real users to the SPA page immediately -->
  <meta http-equiv="refresh" content="0; url=${targetUrl}" />
  <link rel="canonical" href="${targetUrl}" />
  <script>window.location.replace("${targetUrl}");</script>
</head>
<body>
  <p>Redirecting to <a href="${targetUrl}">${title}</a>...</p>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  return res.status(200).send(html);
}
