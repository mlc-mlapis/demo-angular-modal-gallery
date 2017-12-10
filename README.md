# demo-angular-modal-gallery
The demo of using &lt;angular-modal-gallery&gt; with SystemJS loader in AOT mode of a simple Angular app.

The purpose of this demo is to show how to include `ModalGalleryModule` to Angular application which is compiled via `ngc` compiler and run as an app in AOT mode. It should help to solve the issue described here:  https://github.com/Ks89/angular-modal-gallery/issues/110

To show the difference between `angular-modal-gallery` and `primeng` components, the `slider` PrimeNG component is included.

The main problem for `angular-modal-gallery`: It is not possible to create a single bundle which would include files:
* angular-modal-gallery.js (it is in ES6/ES2015 module format)
* angular-modal-gallery.ngfactory.js (it is in ES5/CommonJS module format)

And it is necessary to load `angular-modal-gallery.umd.min.js` and `angular-modal-gallery.ngfactory.js` separatelly.

How to run this demo:

* Make a local clone of this repo
* Run: `npm install`

**For JIT:**
* Run: `npm run tsc` for compiling the app for JIT
* Run: `gulp serve` for runnig the app on `localhost:8080` in JIT mode

![console.log for JIT](./console.log.jit.png)

**For AOT:**
* Run: `npm run ngc` for compiling the app for AOT
* Run: `gulp serve:aot` for runnig the app on `localhost:8081` in AOT mode

![console.log for AOT](./console.log.aot.png)

**For BUNDLED AOT:**
* Run: `npm run ngc` for compiling the app for AOT
* Run: `gulp bundles:aot` for creating bundles of the app for AOT
* Run: `gulp serve:bundles` for runnig the app on `localhost:8082` in AOT mode

![console.log for BUNDLED AOT](./console.log.bundles.png)