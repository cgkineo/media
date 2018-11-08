MediaUI.Controller.FullScreen = MediaUI.Controller.extend({

  ui: null,

  constructor: function FullScreen(ui) {
    MediaUI.Controller.apply(this, arguments);
    this.ui = ui;
  },

  isDisabled$get$enum: function() {
    return !this.ui.options.uiallowfullscreen;
  },

  isActive$get$enum: function() {
    return (this.ui.el === document.fullscreenElement || document.fullscreenElement === this.ui.source);
  },

  type$get$enum: function() {
    return (window.fullscreenPolyfill.useFullWindow) ? "fullwindow" : "browser";
  }

});

Media.DefaultOptions.add({
  uiallowfullscreen: true
});
