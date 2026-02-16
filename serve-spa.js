import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 5173;

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback - serve index.html for all non-file routes
app.use((req, res) => {
  // Skip API routes
  if (req.url.startsWith('/api')) {
    return res.status(404).json({ error: 'API not found' });
  }

  const indexPath = path.join(__dirname, 'dist', 'index.html');
  
  // Check if the requested path is a file (has extension)
  if (path.extname(req.url)) {
    return res.status(404).send('File not found');
  }

  // Serve index.html for all routes
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Not found - run: npm run build');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✓ Food Bliss Server ready`);
  console.log(`✓ Access at: http://192.168.29.136:${PORT}`);
  console.log(`✓ SPA routing enabled\n`);
});
