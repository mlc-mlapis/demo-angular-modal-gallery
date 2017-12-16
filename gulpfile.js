'use strict';

var gulp = require('gulp'),
	server = require('gulp-server-livereload'),
	rename = require('gulp-rename'),
	intercept = require('gulp-intercept'),
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

// >>> GULP TASK to eliminate decorators from packages' JS for pure AOT app
gulp.task('removing-decorators-from-packages', function() {

	var packagesRoot = './node_modules';
	var paths = {
		jsSource: [
			packagesRoot + '/**/angular-modal-gallery/bundles/angular-modal-gallery.umd.js'
		],
		jsOutput: packagesRoot
	};

	return gulp.src(paths.jsSource)
		.pipe(intercept(function(file) {
			var decoratorsRegex = /(.*\.decorators\s{0,}=\s{0,}\[[\s\S]*?\]\s{0,};\s{0,}(\r\n|\n))/gm;
			var codeSource = file.contents.toString();
			file.contents = new Buffer(codeSource.replace(/(.*\.decorators\s{0,}=\s{0,}\[[\s\S]*?\]\s{0,};\s{0,}(\r\n|\n))/gm, ''));
			return file;
		}))
		.pipe(rename(function (path) {
			var parts = path.basename.split('.');
			var baseBundleName = parts[0];
			baseBundleName = baseBundleName + '.' + 'aot';
			parts[0] = baseBundleName;
			path.basename = parts.join('.');
		}))
		.pipe(gulp.dest(paths.jsOutput));
});
// <<< GULP TASK to eliminate decorators from packages' JS for pure AOT app

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

	builder.bundle(
		'[node_modules/primeng/components/dom/domhandler.js] + ' +
		'[node_modules/primeng/components/slider/*.js]',
		'app-bundles/packages/primeng.bundle.aot.min.js',
		options
	);

	builder.bundle(
		'[node_modules/angular-modal-gallery/bundles/angular-modal-gallery.aot.umd.js] + ' +
		'[node_modules/angular-modal-gallery/angular-modal-gallery.ngfactory.js]',
		'app-bundles/packages/angular-modal-gallery.bundle.aot.min.js',
		options
	);

});
// <<< GULP TASK to create app's JS bundles with AOT