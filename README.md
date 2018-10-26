# media

### Building
You'll need to clone the project and edit the source files.
Run the following to get the build output.

Install [Java](https://www.java.com/en/download/)
```
$ npm install
$ npm run build
```

### Usage example
```javascript

    var $video = $('video').medias({
      uilangpath: "../dist/mediaui/lang/",
      uilayoutpath: "../dist/mediaui/layout/",
      mediasize: "100% auto",
      mediaposition: "center",
      uisize: "100% auto",
      uiposition: "none",
      usefullwindow: true,
      mediafullscreensize: "contain",
      mediafullscreenposition: "center",
      uifullscreensize: "contain",
      uifullscreenposition: "center"
   });
   $video.play();

```

```html
    <video id="c-40" preload="none" src="c-40.mp4" loop="true" muted="true" poster="c-40.jpg">
        <track kind="captions" src="c-40-de.vtt" type="text/vtt" srclang="de" label="Deutsch">
        <track kind="captions" src="c-40-en.vtt" type="text/vtt" srclang="en" label="English" default="true">
    </video>
```
