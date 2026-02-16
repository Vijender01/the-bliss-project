import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();
  
  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  // Use Vite's connect instance as middleware
  app.use(vite.middlewares);

  // SPA fallback: serve index.html for all non-file routes
  app.use((req, res) => {
    // Skip API routes
    if (req.url.startsWith('/api')) {
      return res.status(404).send('Not found');
    }
    
    // Serve index.html for all other routes
    vite.transformIndexHtml(req.url, `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Food Bliss</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" src="/src/main.jsx"></script>
        </body>
      </html>
    `).then(html => {
      res.end(html);
    });
  });

  return { app, vite };
}

createServer().then(({ app }) => {
  const PORT = 5173;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n✓ Vite Dev Server ready at http://192.168.29.136:${PORT}\n`);
    console.log('SPA routing enabled - refresh on any route works!\n');
  });
});
