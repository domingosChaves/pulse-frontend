// Quick API health check for dev
// Usage: node scripts/check-api.mjs [--proxy]
// - Tests key endpoints on backend base (API_BASE env or http://localhost:8081/api)
// - If --proxy is passed, also tests via dev proxy at http://localhost:4200/api

const DEFAULT_BACKEND = process.env.API_BASE || 'http://localhost:8081/api';
const TEST_PROXY = process.argv.includes('--proxy');
const PROXY_BASE = 'http://localhost:4200/api';

const redirectUri = encodeURIComponent('http://localhost:4200/auth/callback');

const endpoints = [
  { method: 'GET', path: '/fabricantes' },
  { method: 'GET', path: '/produtos' },
  { method: 'GET', path: '/produtos/paged?size=1' },
  { method: 'GET', path: '/produtos/relatorio' },
  // Auth: we accept 200/3xx/4xx as "reachable", network failures are the problem we're hunting
  { method: 'POST', path: '/auth/login', body: { username: 'dev', password: 'invalid' } },
  { method: 'GET', path: '/auth/me' },
  { method: 'GET', path: `/auth/oauth/authorize?provider=google&redirect_uri=${redirectUri}`, opts: { redirect: 'manual' } },
  { method: 'GET', path: `/auth/oauth/authorize?provider=github&redirect_uri=${redirectUri}`, opts: { redirect: 'manual' } },
];

async function checkBase(base) {
  console.log(`\n=== Testing base: ${base} ===`);
  for (const ep of endpoints) {
    const url = base.replace(/\/$/, '') + ep.path;
    try {
      const init = { method: ep.method, headers: { 'Content-Type': 'application/json' } };
      if (ep.opts && ep.opts.redirect) init.redirect = ep.opts.redirect;
      if (ep.body) init.body = JSON.stringify(ep.body);
      const res = await fetch(url, init);
      const status = res.status;
      const statusText = res.statusText;
      const reachable = true; // any HTTP response counts as reachable for our purpose
      const note = status >= 500 ? 'server error' : status >= 400 ? 'client/unauthorized (ok for probe)' : status >= 300 ? 'redirect (expected for oauth)' : 'ok';
      console.log(`${ep.method.padEnd(6)} ${ep.path.padEnd(70)} -> ${status} ${statusText} | ${note}`);
    } catch (e) {
      console.log(`${ep.method.padEnd(6)} ${ep.path.padEnd(70)} -> NETWORK ERROR | ${e.message}`);
    }
  }
}

(async () => {
  await checkBase(DEFAULT_BACKEND);
  if (TEST_PROXY) {
    await checkBase(PROXY_BASE);
  }
})();

