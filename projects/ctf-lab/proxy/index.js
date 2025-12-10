const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fetch = globalThis.fetch || require('node-fetch');

const app = express();
const PORT = process.env.PORT || 4100;
const BACKEND = process.env.BACKEND_URL || 'http://backend:4200';
const LEVEL = parseInt(process.env.LEVEL || '0', 10);

app.use(morgan('dev'));

// Serve static frontend
app.use('/', express.static(path.join(__dirname, '../frontend')));

// Level 0: pass-through
app.all('/api/*', async (req, res) => {
  const target = `${BACKEND}${req.path.replace('/api', '')}`; // forward /api/store -> /store
  // No validation/auth in level 0
  const method = req.method;
  const headers = {};
  if (req.headers['content-type']) headers['content-type'] = req.headers['content-type'];
  let body = null;
  try {
    body = await req.text();
  } catch (e) { body = null; }

  const fetchOptions = { method, headers };
  if (body && body.length) fetchOptions.body = body;

  // Forward request to backend
  const r = await fetch(target, fetchOptions);
  const text = await r.text();
  res.status(r.status);
  r.headers.forEach((v, k) => res.setHeader(k, v));
  res.send(text);
});

app.listen(PORT, () => console.log(`CTF proxy listening on ${PORT} (LEVEL ${LEVEL})`));
