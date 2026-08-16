const http = require('http');

async function testRoute(path, expectedStatusOrRedirect) {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          path,
          status: res.statusCode,
          location: res.headers.location,
          ok: typeof expectedStatusOrRedirect === 'number' 
            ? res.statusCode === expectedStatusOrRedirect 
            : (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location?.includes(expectedStatusOrRedirect)),
          dataLength: data.length
        });
      });
    });
    req.on('error', (err) => resolve({ path, error: err.message, ok: false }));
    req.setTimeout(30000, () => {
      req.destroy();
      resolve({ path, error: 'TIMEOUT', ok: false });
    });
  });
}

async function run() {
  console.log('=== STARTING AUTOMATED ROUTE & SECURITY VERIFICATION ===\n');

  const tests = [
    // Marketing pages
    { path: '/', expected: 200, label: 'Landing Page' },
    { path: '/features', expected: 200, label: 'Features Page' },
    { path: '/pricing', expected: 200, label: 'Pricing Page' },
    { path: '/about', expected: 200, label: 'About Page' },
    { path: '/login', expected: 200, label: 'Login Page' },
    { path: '/signup', expected: 200, label: 'Signup Page' },
    { path: '/forgot-password', expected: 200, label: 'Forgot Password Page' },

    // Protected dashboard routes (MUST redirect unauthenticated users to /login)
    { path: '/dashboard', expected: '/login', label: 'Dashboard Home (Protected)' },
    { path: '/dashboard/chat', expected: '/login', label: 'Community Chat (Protected / Relocated)' },
    { path: '/dashboard/workout', expected: '/login', label: 'Daily Workout (Protected)' },
    { path: '/dashboard/games', expected: '/login', label: 'Cognitive Games (Protected)' },
    { path: '/dashboard/missions', expected: '/login', label: 'Weekly Missions (Protected)' },
    { path: '/dashboard/decision-lab', expected: '/login', label: 'Decision Lab (Protected)' },
    { path: '/dashboard/leaderboard', expected: '/login', label: 'Leaderboard (Protected)' },
    { path: '/dashboard/settings', expected: '/login', label: 'Settings (Protected)' },
    { path: '/dashboard/shop', expected: '/login', label: 'Coin Shop (Protected)' },
    { path: '/onboarding', expected: '/login', label: 'Onboarding (Protected)' },

    // API protection checks (Unauthorized without token)
    { path: '/api/paystack/initialize', expected: 405, label: 'Paystack Init (Method Check)' },
    { path: '/api/push/send', expected: 405, label: 'Push Send (Method Check)' },
  ];

  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    const res = await testRoute(t.path, t.expected);
    if (res.ok) {
      console.log(`[PASS] ${t.label}: ${t.path} -> status ${res.status}${res.location ? ` (Redirect: ${res.location})` : ''}`);
      passed++;
    } else {
      console.error(`[FAIL] ${t.label}: ${t.path} -> status ${res.status || res.error}${res.location ? ` (Redirect: ${res.location})` : ''}`);
      failed++;
    }
  }

  console.log(`\n=== SUMMARY: ${passed} PASSED, ${failed} FAILED out of ${tests.length} tests ===`);
  if (failed > 0) process.exit(1);
}

run();
