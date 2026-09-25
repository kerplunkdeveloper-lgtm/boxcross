const getOptimizedOgImageUrl = (rawUrl, fallback = "https://membership.boxandcross.com/og-events.jpg") => {
  if (!rawUrl || typeof rawUrl !== "string" || !rawUrl.trim()) {
    return fallback;
  }
  let url = rawUrl.trim().replace(/^http:\/\//i, "https://");

  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    const uploadIdx = url.indexOf("/upload/");
    const base = url.substring(0, uploadIdx + "/upload/".length);
    let afterUpload = url.substring(uploadIdx + "/upload/".length);

    const vIndex = afterUpload.search(/v\d+\//);
    if (vIndex !== -1) {
      afterUpload = afterUpload.substring(vIndex);
    } else {
      afterUpload = afterUpload.replace(/^(?:(?:[a-zA-Z0-9_]+_[a-zA-Z0-9_:,.-]+,?)+\/)+/, "");
    }

    // Force 4:5 Portrait (1080x1350) with q_auto:eco (< 150KB) and universal progressive JPEG
    return `${base}c_fill,w_1080,h_1350,g_auto,q_auto:eco,f_jpg/${afterUpload}`;
  }

  return url;
};

export default async function handler(req, res) {
  const { id } = req.query;
  const frontendUrl = "https://membership.boxandcross.com";
  const defaultRedirect = `${frontendUrl}/events`;

  // Dynamic backend base URL from Vercel environment variables or local fallback
  const backendBaseUrl = (process.env.VITE_API_URL || "https://api.boxandcross.com").replace(/\/$/, "");

  // 1. Primary Strategy: Try to fetch the fully compiled HTML with OG tags from the backend
  if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
    try {
      const ogEndpoint = `${backendBaseUrl}/api/events/${id}/og`;
      console.log(`Attempting to proxy OG metadata from: ${ogEndpoint}`);
      
      const backendRes = await fetch(ogEndpoint, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });

      if (backendRes.ok) {
        const html = await backendRes.text();
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("Cache-Control", "public, max-age=3600");
        return res.status(200).send(html);
      } else {
        console.warn(`Backend OG route returned status ${backendRes.status}. Falling back to list query.`);
      }
    } catch (err) {
      console.error("Failed to proxy from backend OG endpoint:", err.message);
    }
  }

  // 2. Fallback Strategy: Retrieve all events and build the OG HTML page locally
  // Default SEO fallback values (if event not found or fetch fails)
  let title = "Events & Class Schedules | Box & Cross";
  let description = "View and register for active training sessions, elite gym schedules, and competitive athletic events at Box & Cross.";
  let imageUrl = `${frontendUrl}/og-events.jpg`;
  let targetUrl = defaultRedirect;

  if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
    try {
      // Fetch all events from backend using a standard browser User-Agent
      const eventsEndpoint = `${backendBaseUrl}/api/events`;
      console.log(`Fetching events list from: ${eventsEndpoint}`);
      const backendRes = await fetch(eventsEndpoint, {
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
            const plainDesc = rawDesc.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
            description = plainDesc.length > 0
              ? (plainDesc.length > 155 ? plainDesc.substring(0, 152) + "..." : plainDesc)
              : `Join the ${event.title} event at Box & Cross. View schedule and book your slot now!`;
            
            imageUrl = getOptimizedOgImageUrl(event.imageUrl, `${frontendUrl}/og-events.jpg`);
          }
        }
      }
    } catch (err) {
      console.error("Vercel Serverless OG Generator Fallback Error:", err.message);
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
  <meta property="og:image:secure_url" content="${imageUrl}" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1080" />
  <meta property="og:image:height" content="1350" />
  <meta property="og:image:alt" content="${title}" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${targetUrl}" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${imageUrl}" />

  <!-- Canonical -->
  <link rel="canonical" href="${targetUrl}" />
  <script>
    if (!/bot|crawler|spider|whatsapp|facebookexternalhit|twitterbot|slackbot|discordbot|telegrambot/i.test(navigator.userAgent)) {
      window.location.replace("${targetUrl}");
    }
  </script>
</head>
<body>
  <p>Redirecting to <a href="${targetUrl}">${title}</a>...</p>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  return res.status(200).send(html);
}
