MediaUI.Input.ToggleFullScreen = MediaUI.Input.extend({

  ui: null,
  $els: null,

  constructor: function ToggleFullScreen(ui) {
    MediaUI.Input.apply(this, arguments);
    this.ui = ui;
    this.$els = this.ui.$all().filterByAttribute(this.ui.options.inputattribute, "togglefullscreen");
    this.$els.on({
      "click": this.onClick
    });
    this.listenTo(this.ui, {
      "dbltap": this.onDoubleTap
    });
  },

  onClick$bind: function() {
    var options = this.ui.options;
    if (this.ui.options.usefullwindow) {
      window.fullscreenPolyfill.useFullWindow = true;
    }
    var iOSWithNativeFullScreen = (Media.device.isIOS && options.iosnativefullscreen);
    if (iOSWithNativeFullScreen) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        return;
      }
      this.ui.source.requestFullscreen();
      return;
    }
    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }
    this.ui.el.requestFullscreen();
  },

  onDoubleTap$bind: function() {
    if (Media.device.wasUsingTouchRecently) return;
    this.onClick();
  },

  destroy: function() {
    MediaUI.Input.prototype.destroy.apply(this, arguments);
    this.$els.off("click", this.onClick);
    this.ui = null;
  }

});

Media.DefaultOptions.add({
  iosnativefullscreen: true,
  usefullwindow: false
});
