MediaUI.Input.ToggleMute = MediaUI.Input.extend({

  ui: null,
  $els: null,

  constructor: function ToggleMute(ui) {
    MediaUI.Input.apply(this, arguments);
    bindAll(this, "onClick");
    this.ui = ui;
    this.$els = this.ui.$all().filterByAttribute(this.ui.options.inputattribute, "togglemute");
    this.$els.on({
      "click": this.onClick
    });
  },

  onClick: function() {
    this.ui.source.muted = !this.ui.source.muted;
  },

  destroy: function() {
    MediaUI.Input.prototype.destroy.apply(this, arguments);
    this.$els.off("click", this.onClick);
    this.ui = null;
  }

});
