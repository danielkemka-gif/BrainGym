const https = require('https');

https.get('https://brain-gym-nsu6.vercel.app/dashboard?t=' + Date.now(), (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('HTTP Status:', res.statusCode);
    console.log('Headers:', JSON.stringify(res.headers, null, 2));
    console.log('Length:', data.length);
    console.log('Includes ChunkLoadError:', data.includes('ChunkLoadError'));
    console.log('Includes reset=:', data.includes('reset='));
    console.log('Includes akuche:open-book-experience:', data.includes('akuche:open-book-experience'));
    const chunks = data.match(/_next\/static\/chunks\/[^\"]+\.js/g) || [];
    console.log('Unique chunks count:', new Set(chunks).size);
    console.log('Sample chunk:', chunks[0]);
  });
}).on('error', err => console.error(err));
