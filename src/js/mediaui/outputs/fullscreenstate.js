MediaUI.Output.FullScreenState = MediaUI.Output.extend({

  ui: null,
  el: null,

  constructor: function FullScreenState(ui) {
    MediaUI.Output.apply(this, arguments);
    this.el = ui.$all().filterByAttribute(ui.options.outputattribute, "fullscreenstate")[0];
    if (!this.el) return;
    this.ui = ui;
    this.listenTo(this.ui.media, {
      "resize": this.onResize
    });
  },

  onResize$bind: function(event) {
    rafer.call(toggleClass, null, this.el, this.ui.options.classprefix+"fullscreenstate-"+this.ui.fullscreen.type, this.ui.fullscreen.isActive);
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.el = null;
  }

});
