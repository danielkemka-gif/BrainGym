const https = require('https');

const routes = [
  '/',
  '/dashboard',
  '/login',
  '/coach',
  '/manifest.json',
  '/sw.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-512.png',
  '/icons/apple-touch-icon.png'
];

async function checkRoute(path) {
  return new Promise((resolve) => {
    https.get('https://brain-gym-nsu6.vercel.app' + path, (res) => {
      resolve({ path, status: res.statusCode, type: res.headers['content-type'], length: res.headers['content-length'] });
    }).on('error', (err) => {
      resolve({ path, error: err.message });
    });
  });
}

(async () => {
  console.log('Verifying key routes on https://brain-gym-nsu6.vercel.app ...');
  for (const r of routes) {
    const res = await checkRoute(r);
    console.log(`${res.path.padEnd(28)} -> HTTP ${res.status} [${res.type || ''}]`);
  }
})();
