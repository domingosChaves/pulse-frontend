// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

// habilita Chrome headless via Puppeteer quando disponível; caso contrário usa Chrome do sistema
try {
  // Puppeteer v20+ é ESM; este require pode lançar ERR_REQUIRE_ESM
  // Em ambientes onde funcione, define o caminho do Chromium embutido
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const puppeteer = require('puppeteer');
  if (puppeteer && typeof puppeteer.executablePath === 'function') {
    process.env.CHROME_BIN = puppeteer.executablePath();
  }
} catch (e) {
  // Fallback silencioso para Chrome do sistema
}

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/frontend'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ],
      check: {
        global: {
          statements: 80,
          branches: 70,
          functions: 80,
          lines: 80,
        },
      },
    },
    // custom launcher para ambientes CI/containers/Windows
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-setuid-sandbox',
          '--no-first-run',
          '--no-zygote'
        ]
      }
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: [process.env.KARMA_BROWSER || 'ChromeHeadless'],
    singleRun: true,
    restartOnFileChange: true
  });
};
