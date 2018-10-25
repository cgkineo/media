Media.Class.Resize = Media.Class.extend({

  constructor: function Resize(media) {
    bindAll(this, "onWindowResize", "onFullScreenChanged");
    this.listenTo(Media, {
      "created": this.onCreated,
      "resize": this.onResize
    });
    this.addEventListeners();
  },

  addEventListeners$write: function() {
    window.removeEventListener("resize", this.onWindowResize);
    window.addEventListener("resize", this.onWindowResize);
    document.addEventListener("fullscreenchange", this.onFullScreenChanged);
  },

  onCreated: function(media) {
    this.triggerMediaResize(media);
  },

  onFullScreenChanged$write: function() {
    this.resizeAllPlayers();
  },

  onResize: function(media, event) {
    if (event.fake) return;
    this.resizeAllPlayers();
  },

  onWindowResize$write: function() {
    this.resizeAllPlayers();
  },

  resizeAllPlayers$write: function() {
    for (var i = 0, l = Media.players.length; i < l; i++) {
      var media = Media.players[i];
      this.triggerMediaResize(media);
    }
  },

  triggerMediaResize: function(media) {
    var options = media.options;
    media.dispatchEvent("resize", {
      fullscreen: new Media.Class.Dimensions(options.mediafullscreensize, options.mediafullscreenratio, options.mediafullscreenposition),
      normal: new Media.Class.Dimensions(options.mediasize, options.mediaratio, options.mediaposition)
    });
    media.dispatchEvent("postresize", {
      fullscreen: new Media.Class.Dimensions(options.mediafullscreensize, options.mediafullscreenratio, options.mediafullscreenposition),
      normal: new Media.Class.Dimensions(options.mediasize, options.mediaratio, options.mediaposition)
    });
  },

  removeEventListeners$write: function() {
    window.removeEventListener("resize", this.onWindowResize);
    document.removeEventListener("fullscreenchange", this.onFullScreenChanged);
  }

});

Media.defineProperties({
  resize$write: new Media.Class.Resize()
});

Media.DOMEvents.add([
  "resize",
  "postresize"
]);
Media.DefaultOptions.add({
  mediasize: "contain",
  mediaratio: "16/9",
  mediaposition: "none none",
  mediafullscreensize: function() {
    return this.mediasize;
  },
  mediafullscreenratio: function() {
    return this.mediaratio;
  },
  mediafullscreenposition: function() {
    return this.mediaposition;
  }
});
