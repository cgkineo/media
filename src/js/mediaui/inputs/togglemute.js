MediaUI.Input.ToggleMute = MediaUI.Input.extend({

  ui: null,
  $els: null,

  requiredAPI$write: ['muted'],

  constructor: function ToggleMute(ui) {
    MediaUI.Input.apply(this, arguments);
    this.ui = ui;
    this.$els = this.ui.$all().filterByAttribute(this.ui.options.inputattribute, "togglemute");
    this.$els.on({
      "click": this.onClick
    });
  },

  onClick$bind: function() {
    if (!this.ui.media.hasAPI(this.requiredAPI)) return;
    this.ui.source.muted = !this.ui.source.muted;
  },

  destroy: function() {
    MediaUI.Input.prototype.destroy.apply(this, arguments);
    this.$els.off("click", this.onClick);
    this.ui = null;
  }

});
