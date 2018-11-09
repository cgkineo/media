MediaUI.Output.FullScreenState = MediaUI.Output.extend({

  ui: null,
  $els: null,

  constructor: function FullScreenState(ui) {
    MediaUI.Output.apply(this, arguments);
    this.$els = ui.$all().filterByAttribute(ui.options.outputattribute, "fullscreenstate");
    if (!this.$els.length) return;
    this.ui = ui;
    this.listenTo(this.ui.media, {
      "resize change": this.onUpdate
    });
    elements(document).on({
      fullscreenchange: this.onUpdate
    }, {
      passive: false
    });
    this.onUpdate();
  },

  onUpdate$bind: function(event) {
    if (this.ui.fullscreen.isDisabled || !this.ui.src.value) {
      this.$els.toggleClass(this.ui.options.classprefix+"fullscreenstate-disabled", true);
      this.$els.toggleClass(this.ui.options.classprefix+"fullscreenstate-"+this.ui.fullscreen.type, false);
      return;
    }
    this.$els.toggleClass(this.ui.options.classprefix+"fullscreenstate-disabled", false);
    this.$els.toggleClass(this.ui.options.classprefix+"fullscreenstate-"+this.ui.fullscreen.type, this.ui.fullscreen.isActive);
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    elements(document).off({
      fullscreenchange: this.onUpdate
    });
    this.ui = null;
    this.$els = null;
  }

});
