// Relax Tax — tiny static file server with HTTP Range support (needed for audio/video).
// Run: node serve.mjs   (or double-click START SERVER.bat)
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3090;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  let filePath = path.join(__dirname, urlPath);

  // pretty urls: /services -> /services.html
  if (!path.extname(filePath) && fs.existsSync(filePath + '.html')) filePath += '.html';

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404</h1><p>Not found: ' + urlPath + '</p>');
      return;
    }

    const type = TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    const total = stat.size;
    const range = req.headers.range;

    if (range) {
      // e.g. "bytes=12345-" or "bytes=0-1023"
      const m = /bytes=(\d*)-(\d*)/.exec(range);
      let start = m && m[1] ? parseInt(m[1], 10) : 0;
      let end = m && m[2] ? parseInt(m[2], 10) : total - 1;
      if (isNaN(start) || start < 0) start = 0;
      if (isNaN(end) || end >= total) end = total - 1;
      if (start > end) { start = 0; end = total - 1; }
      res.writeHead(206, {
        'Content-Type': type,
        'Content-Range': `bytes ${start}-${end}/${total}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1,
        'Cache-Control': 'no-cache',
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Type': type,
        'Content-Length': total,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache',
      });
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

server.listen(PORT, () => {
  console.log('\n  Relax Tax is running.');
  console.log('  Open:  http://localhost:' + PORT + '\n');
});
