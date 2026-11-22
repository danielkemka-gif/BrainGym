async function testAssets() {
  const res = await fetch('https://brain-gym-nsu6.vercel.app/dashboard');
  const html = await res.text();
  const scriptRegex = /src="(\/_next\/static\/[^"]+\.js)"/g;
  const cssRegex = /href="(\/_next\/static\/[^"]+\.css)"/g;
  
  const scripts = [];
  let m;
  while ((m = scriptRegex.exec(html)) !== null) scripts.push(m[1]);
  while ((m = cssRegex.exec(html)) !== null) scripts.push(m[1]);

  console.log(`Testing ${scripts.length} static assets on https://brain-gym-nsu6.vercel.app/dashboard`);
  let failed = 0;
  for (const src of scripts) {
    const url = 'https://brain-gym-nsu6.vercel.app' + src;
    try {
      const r = await fetch(url);
      if (!r.ok) {
        console.error(`FAILED (${r.status}): ${url}`);
        failed++;
      }
    } catch(e) {
      console.error(`ERROR (${e.message}): ${url}`);
      failed++;
    }
  }
  if (failed === 0) {
    console.log('ALL ASSETS LOADED WITH HTTP 200 OK!');
  } else {
    console.log(`${failed} assets failed to load!`);
  }
}

testAssets();
