System.config({
	baseURL: '.',
	paths: {
		'npm:': './node_modules/'
	},
	map: {
		'@angular/core': 'npm:@angular/core/bundles/core.umd.min.js',
		'@angular/common': 'npm:@angular/common/bundles/common.umd.min.js',
		'@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.min.js',
		'@angular/http': 'npm:@angular/http/bundles/http.umd.min.js',
		'@angular/router': 'npm:@angular/router/bundles/router.umd.min.js',
		'@angular/forms': 'npm:@angular/forms/bundles/forms.umd.min.js',
		'@angular/animations': 'npm:@angular/animations/bundles/animations.umd.min.js',
		'@angular/animations/browser': 'npm:@angular/animations/bundles/animations-browser.umd.min.js',
		'@angular/platform-browser/animations': 'npm:@angular/platform-browser/bundles/platform-browser-animations.umd.min.js',
		'@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.min.js',
		'@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.min.js',
		'primeng': 'npm:primeng',
		'angular-modal-gallery': 'npm:angular-modal-gallery',
		'zone-patch-rxjs': './assets/zone.js'
	},
	bundles: {
		"assets/rxjs-bundle/Rx.min.js": [
			"rxjs/*",
			"rxjs/operator/*",
			"rxjs/operators/*",
			"rxjs/observable/*",
			"rxjs/add/operator/*",
			"rxjs/operators/*",
			"rxjs/add/observable/*",
			"rxjs/scheduler/*",
			"rxjs/symbol/*",
			"rxjs/util/*"
		],
		"app-bundles/app.bundle.aot.min.js": [
			"app/app.component.*",
			"app/app.module.*",
			"app/boot.aot.*"
		],
		"app-bundles/primeng.bundle.aot.min.js": [
			"node_modules/primeng/*"
		]
	},
	packages: {
		'app': {
			format: 'cjs',
			defaultExtension: 'js'
		},
		'primeng': {
			defaultExtension: 'js'
		},
		'angular-modal-gallery': {
			main: 'bundles/angular-modal-gallery.umd.min.js',
			defaultExtension: 'js'
		},
		'zone-patch-rxjs': {
			main: 'zone-patch-rxjs.js',
			format: 'cjs',
			defaultExtension: 'js'
		}
	}
});
