import 'zone.js';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode, isDevMode } from '@angular/core';
import { AppModule } from './app.module';

import 'zone-patch-rxjs';

console.log('... development mode is used:', isDevMode());

platformBrowserDynamic().bootstrapModule(AppModule);
