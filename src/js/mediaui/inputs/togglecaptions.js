MediaUI.Input.ToggleCaptions = MediaUI.Input.extend({

  ui: null,
  $els: null,

  constructor: function ToggleCaptions(ui) {
    MediaUI.Input.apply(this, arguments);
    bindAll(this, "onClick");
    this.ui = ui;
    this.$els = this.ui.$all().filterByAttribute(this.ui.options.inputattribute, "togglecaptions");
    this.$els.on({
      "click": this.onClick
    });
  },

  onClick: function() {
    if (this.ui.media.captions.isActive) {
      this.ui.media.tracks.default.default = false;
      return;
    }
    if (!this.ui.media.tracks.length) return;
    this.ui.media.tracks[0].default = true;
  },

  destroy: function() {
    MediaUI.Input.prototype.destroy.apply(this, arguments);
    this.$els.off("click", this.onClick);
    this.ui = null;
  }

});

