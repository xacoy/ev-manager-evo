'use strict';
// EV Manager Evo — servidor mínimo sin dependencias externas.
// Sirve la app estática y guarda/lee su estado (JSON) en SQLite.
// Pensado para un único usuario, protegido por delante con Cloudflare Access.

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const PORT = Number(process.env.PORT || 8080);
const DB_PATH = process.env.DB_PATH || '/data/app.db';
const SITE_DIR = process.env.SITE_DIR || path.join(__dirname, 'site');
const MAX_BODY_BYTES = 20 * 1024 * 1024; // 20MB: el estado incluye adjuntos en base64

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec(`
  CREATE TABLE IF NOT EXISTS kv (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`);
const getStmt = db.prepare('SELECT value, updated_at FROM kv WHERE key = ?');
const upsertStmt = db.prepare(`
  INSERT INTO kv (key, value, updated_at) VALUES ('state', ?, ?)
  ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
`);

function getState() {
  const row = getStmt.get('state');
  return row ? row.value : null;
}
function setState(jsonStr) {
  upsertStmt.run(jsonStr, new Date().toISOString());
}

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=()',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; " +
    "connect-src 'self'; manifest-src 'self'; base-uri 'none'; form-action 'none'; " +
    "frame-ancestors 'none'; object-src 'none'",
};

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

function sendJSON(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body);
}

function handleApiState(req, res) {
  if (req.method === 'GET') {
    const value = getState();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(value || 'null');
    return;
  }
  if (req.method === 'PUT') {
    let body = '';
    let size = 0;
    let rejected = false;
    req.on('data', (chunk) => {
      if (rejected) return;
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        rejected = true;
        sendJSON(res, 413, { error: 'payload-too-large', maxBytes: MAX_BODY_BYTES });
        req.destroy();
        return;
      }
      body += chunk;
    });
    req.on('end', () => {
      if (rejected) return;
      try {
        JSON.parse(body); // valida que es JSON antes de persistirlo
      } catch (e) {
        sendJSON(res, 400, { error: 'invalid-json' });
        return;
      }
      try {
        setState(body);
        sendJSON(res, 200, { ok: true });
      } catch (e) {
        console.error('DB write failed', e);
        sendJSON(res, 500, { error: 'db-write-failed' });
      }
    });
    return;
  }
  res.writeHead(405, { Allow: 'GET, PUT' });
  res.end('Method Not Allowed');
}

function serveStatic(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    res.end('Method Not Allowed');
    return;
  }
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.normalize(path.join(SITE_DIR, urlPath));
  if (!filePath.startsWith(SITE_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath);
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
    res.writeHead(200);
    res.end(req.method === 'HEAD' ? undefined : data);
  });
}

const server = http.createServer((req, res) => {
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.setHeader(k, v);
  if (req.url === '/api/state') {
    handleApiState(req, res);
    return;
  }
  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`EV Manager Evo escuchando en :${PORT} (SQLite: ${DB_PATH}, site: ${SITE_DIR})`);
});
