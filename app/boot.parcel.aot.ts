import 'zone.js';

import { platformBrowser } from '@angular/platform-browser';
import { ApplicationRef, enableProdMode, isDevMode } from '@angular/core';
import { AppModuleNgFactory } from './app.module.ngfactory';

import 'zone-patch-rxjs';

enableProdMode();
console.log('... production mode is used:', !isDevMode());

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory).then((module) => {
	let appRef = module.injector.get(ApplicationRef);
});
