'use strict';

var gulp = require('gulp'),
	server = require('gulp-server-livereload'),
	systemjsbuilder = require("systemjs-builder");

// >>> GULP TASK to run app's standalone web server for JIT app
gulp.task('serve', function() {

	var webroot = '.';
	var webfolders = [webroot];

	gulp.src(webfolders)
	.pipe(server({
		host: 'localhost',
		port: '8080',
		defaultFile: 'index.html',
		fallback: 'index.html',
		livereload: false,
		directoryListing: false,
		open: false
	}));
});
// <<< GULP TASK to run app's standalone web server for JIT app

// >>> GULP TASK to run app's standalone web server for AOT app
gulp.task('serve:aot', function() {

	var webroot = '.';
	var webfolders = [webroot];

	gulp.src(webfolders)
	.pipe(server({
		host: 'localhost',
		port: '8081',
		defaultFile: 'index.aot.html',
		fallback: 'index.aot.html',
		livereload: false,
		directoryListing: false,
		open: false
	}));
});
// <<< GULP TASK to run app's standalone web server for AOT app

// >>> GULP TASK to run app's bundled standalone web server for AOT app
gulp.task('serve:bundles', function() {
	
	var webroot = '.';
	var webfolders = [webroot];

	gulp.src(webfolders)
		.pipe(server({
			host: 'localhost',
			port: '8082',
			defaultFile: 'index.bundles.html',
			fallback: 'index.bundles.html',
			livereload: false,
			directoryListing: false,
			open: false
		}));
	});
// <<< GULP TASK to run app's bundled standalone web server for AOT app

// >>> GULP TASK to create the RxJS re-bundle
gulp.task('rxjs', function() {
	// SystemJS build options
	var options = {
		normalize: true,
		runtime: false,
		sourceMaps: false,
		sourceMapContents: false,
		minify: true,
		mangle: true
	};
	var builder = new systemjsbuilder('./');
	builder.config({
		paths: {
			"n:*": "node_modules/*",
			"rxjs/*": "node_modules/rxjs/*.js",
		},
		map: {
			"rxjs": "n:rxjs",
		},
		packages: {
			"rxjs": {main: "Rx.js", defaultExtension: "js"},
		}
	});
	builder.bundle('rxjs', 'assets/rxjs-bundle/Rx.min.js', options);
});
// <<< GULP TASK to create the RxJS re-bundle

// >>> GULP TASK to create app's JS bundles with AOT
gulp.task('bundles:aot', function() {
	var options = {
		normalize: true,
		runtime: false,
		sourceMaps: false,
		sourceMapContents: false,
		minify: true,
		mangle: true,
		format: 'cjs'
	};
	var builder = new systemjsbuilder('.');

	builder.bundle(
		'[app/**/*.js] - [app/boot.js] - [app/systemjs.config.js]',
		'app-bundles/app.bundle.aot.min.js',
		options
	);

	builder.bundle(
		'[node_modules/primeng/components/dom/domhandler.js] + ' +
		'[node_modules/primeng/components/slider/*.js]',
		'app-bundles/primeng.bundle.aot.min.js',
		options
	);

});
// <<< GULP TASK to create app's JS bundles with AOT