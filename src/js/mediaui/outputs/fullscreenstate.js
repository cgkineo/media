MediaUI.Output.FullScreenState = MediaUI.Output.extend({

  ui: null,
  $els: null,

  constructor: function FullScreenState(ui) {
    MediaUI.Output.apply(this, arguments);
    this.$els = ui.$all().filterByAttribute(ui.options.outputattribute, "fullscreenstate");
    if (!this.$els.length) return;
    this.ui = ui;
    this.listenTo(this.ui.media, {
      "resize": this.onResize
    });
    elements(document).on({
      fullscreenchange: this.onFullScreenChange
    }, {
      passive: false
    });
  },

  onFullScreenChange$bind: function(event) {
    this.$els.toggleClass(this.ui.options.classprefix+"fullscreenstate-"+this.ui.fullscreen.type, this.ui.fullscreen.isActive);
  },

  onResize$bind: function(event) {
    this.$els.toggleClass(this.ui.options.classprefix+"fullscreenstate-"+this.ui.fullscreen.type, this.ui.fullscreen.isActive);
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    elements(document).off({
      fullscreenchange: this.onFullScreenChange
    });
    this.ui = null;
    this.$els = null;
  }

});
