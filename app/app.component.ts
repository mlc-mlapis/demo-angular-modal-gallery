import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { delay } from 'rxjs/operators';

import { Image } from 'angular-modal-gallery';

@Component({
	selector: 'app',
	template: `
		<div>APP COMPONENT</div>
		<hr />
		<div [formGroup]="sliderControl">
			<p-slider
				formControlName="limits"
				[step]="10"
				[min]="minLimit"
				[max]="maxLimit"
				[range]="true"
				(onChange)="handleSliderChange($event.values)"
				(onSlideEnd)="handleSliderEnd($event.values)"
			></p-slider>
		</div>
		<hr />
		<modal-gallery [modalImages]="images"></modal-gallery>
	`
})
export class AppComponent {

	constructor() {
		console.log('... creating a new instance of APP component');
	}

	public imagesArray: Image[] = [
		new Image(
			'../assets/images/gallery/img1.jpg',
			'../assets/images/gallery/thumbs/img1.jpg',
			null,
			'http://www.google.com'
		),
		new Image(
			'../assets/images/gallery/img2.png',
			'../assets/images/gallery/thumbs/img2.jpg',
			'Description 2',
			null
		),
		new Image(
			'../assets/images/gallery/img3.jpg',
			'../assets/images/gallery/thumbs/img3.png',
			'Description 3',
			'http://www.google.com'
		),
		new Image(
			'../assets/images/gallery/img4.jpg',
			'../assets/images/gallery/thumbs/img4.jpg',
			'Description 4',
			'http://www.google.com'
		),
		new Image(
			'../assets/images/gallery/img5.jpg',
			'../assets/images/gallery/thumbs/img5.jpg',
			null,
			null
		)
	];

	// Observable of an array of images with a delay to simulate a network request
	images: Observable<Image[]> = of(this.imagesArray).pipe(delay(600));

	// Public properties for PrimeNG Slider component
	public minLimit = 1000;
	public maxLimit = 2000;
	public limits = [1150, 1650];

	public sliderControl = new FormGroup({
		limits: new FormControl(this.limits)
	});

	handleSliderChange(limits: number[]) {
		console.log('Slider limits changed to:', limits);
	}

	handleSliderEnd(limits: number[]) {
		console.log('Slider limits ended on:', limits);
	}
}
