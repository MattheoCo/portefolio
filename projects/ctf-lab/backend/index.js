const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 4200;

app.use(bodyParser.raw({ type: '*/*', limit: '1mb' }));

// In-memory storage (no validation)
const store = [];

app.all('/store', (req, res) => {
  const entry = {
    method: req.method,
    headers: req.headers,
    body: req.body ? req.body.toString() : null,
    timestamp: Date.now()
  };
  // Direct push without type-checking / ACL
  store.push(entry);
  res.json({ ok: true, stored: entry, total: store.length });
});

app.get('/dump', (req, res) => {
  res.json({ count: store.length, entries: store });
});

app.listen(PORT, () => console.log(`CTF backend listening on ${PORT}`));
