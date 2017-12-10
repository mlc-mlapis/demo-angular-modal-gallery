import { NgModule, ModuleWithProviders } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { SliderModule } from 'primeng/components/slider/slider';
import { ModalGalleryModule } from 'angular-modal-gallery';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		ReactiveFormsModule,
		SliderModule,
		ModalGalleryModule.forRoot()
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
	static forRoot(): ModuleWithProviders {
		return {ngModule: AppModule, providers: []};
	}
}
