/*
 * Runner para testes com cobertura usando o Chrome do Puppeteer (ESM) quando disponível.
 * Garante compatibilidade no Windows/CI e gera coverage.
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

(async () => {
  const markerDir = __dirname ? path.resolve(__dirname, '..') : process.cwd();
  try { fs.writeFileSync(path.join(markerDir, 'test-run-started.txt'), new Date().toISOString()); } catch {}

  let chromeBin = null;
  try {
    const puppeteer = await import('puppeteer');
    const pp = puppeteer && (puppeteer.default || puppeteer);
    if (pp && typeof pp.executablePath === 'function') {
      chromeBin = pp.executablePath();
      console.log(`[runner] Usando Chromium do Puppeteer em: ${chromeBin}`);
    }
  } catch (e) {
    console.log('[runner] Puppeteer não disponível como ESM, usando Chrome do sistema se presente.');
  }

  const env = { ...process.env };
  if (chromeBin) env.CHROME_BIN = chromeBin;
  env.KARMA_BROWSER = 'ChromeHeadlessCI';

  const isWin = process.platform === 'win32';
  const bin = isWin ? 'npx.cmd' : 'npx';
  const args = ['ng', 'test', '--watch=false', '--code-coverage', '--browsers=ChromeHeadlessCI'];

  const child = spawn(bin, args, { stdio: 'inherit', env });
  child.on('exit', (code) => {
    try { fs.writeFileSync(path.join(markerDir, `test-run-finished-${code}.txt`), new Date().toISOString()); } catch {}
    process.exit(code);
  });
})();
