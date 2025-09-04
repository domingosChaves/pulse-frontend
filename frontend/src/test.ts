// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Descobrir e carregar todos os arquivos *.spec.ts
const webpackContext = (require && require.context) ?
  require.context('./', true, /\.spec\.ts$/) :
  // fallback para Webpack 5 via import.meta.webpackContext
  (import.meta as any).webpackContext('./', { recursive: true, regExp: /\.spec\.ts$/ });

webpackContext.keys().forEach(webpackContext);
