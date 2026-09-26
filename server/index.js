const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_FILE = process.env.DATA_FILE || '/data/state.json';
const AUTH_USER = process.env.AUTH_USER || '';
const AUTH_PASS = process.env.AUTH_PASS || '';
const STATIC_DIR = path.join(__dirname, 'public-assets');

const app = express();
app.use(express.json({ limit: '5mb' }));

app.get('/healthz', (req, res) => res.json({ ok: true }));

if (AUTH_USER && AUTH_PASS) {
  app.use((req, res, next) => {
    if (req.path === '/healthz') return next();
    const header = req.headers.authorization || '';
    const [scheme, encoded] = header.split(' ');
    if (scheme === 'Basic' && encoded) {
      const [user, pass] = Buffer.from(encoded, 'base64').toString('utf8').split(':');
      if (user === AUTH_USER && pass === AUTH_PASS) return next();
    }
    res.set('WWW-Authenticate', 'Basic realm="EV Manager Evo"');
    res.status(401).send('Authentication required');
  });
} else {
  console.warn('[ev-manager-evo] AUTH_USER/AUTH_PASS no definidos: el servidor arranca SIN autenticación.');
}

app.get('/api/data', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, raw) => {
    if (err) {
      if (err.code === 'ENOENT') return res.json({});
      console.error('[ev-manager-evo] error leyendo el estado', err);
      return res.status(500).json({ error: 'read_failed' });
    }
    try {
      res.json(JSON.parse(raw));
    } catch (parseErr) {
      console.error('[ev-manager-evo] datos corruptos en', DATA_FILE, parseErr);
      res.status(500).json({ error: 'corrupt_data' });
    }
  });
});

app.put('/api/data', (req, res) => {
  const dir = path.dirname(DATA_FILE);
  const tmpFile = `${DATA_FILE}.tmp`;
  fs.mkdir(dir, { recursive: true }, (mkdirErr) => {
    if (mkdirErr) return res.status(500).json({ error: 'write_failed' });
    fs.writeFile(tmpFile, JSON.stringify(req.body, null, 2), (writeErr) => {
      if (writeErr) return res.status(500).json({ error: 'write_failed' });
      fs.rename(tmpFile, DATA_FILE, (renameErr) => {
        if (renameErr) return res.status(500).json({ error: 'write_failed' });
        res.json({ ok: true });
      });
    });
  });
});

app.use(express.static(STATIC_DIR, { index: 'index.html' }));

app.listen(PORT, () => {
  console.log(`[ev-manager-evo] escuchando en :${PORT} — datos en ${DATA_FILE}`);
});
