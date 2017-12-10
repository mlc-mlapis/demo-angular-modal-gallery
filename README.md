# demo-angular-modal-gallery
The demo of using &lt;angular-modal-gallery&gt; with SystemJS loader in AOT mode of a simple Angular app.

The purpose of this demo is to show how to include `ModalGalleryModule` to Angular application which is compiled via `ngc` compiler and run as an app in AOT mode. It should help to solve the issue described here:  https://github.com/Ks89/angular-modal-gallery/issues/110

How to run this demo:

* Make a local clone of this repo
* Run: `npm install`

**For JIT:**
* Run: `npm run tsc` for compiling the app for JIT
* Run: `gulp serve` for runnig the app on `localhost:8081` in JIT mode

console.log.jit.png

**For AOT:**
* Run: `npm run ngc` for compiling the app for AOT
* Run: `gulp serve:aot` for runnig the app on `localhost:8080` in AOT mode

console.log.aot.png