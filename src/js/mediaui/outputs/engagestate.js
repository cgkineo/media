MediaUI.Output.EngageState = MediaUI.Output.extend({

  ui: null,
  $els: null,

  constructor: function EngageState(ui) {
    MediaUI.Output.apply(this, arguments);
    this.$els = ui.$all().filterByAttribute(ui.options.outputattribute, "engagestate");
    if (!this.$els.length) return;
    this.ui = ui;
    this.listenTo(this.ui, {
      "engage": this.onEngage,
      "disengage": this.onDisengage
    });
  },

  onEngage$bind: function() {
    rafer.call(this.$els, "toggleClass", replace("${classprefix}engagestate-engaged", this.ui.options), true);
    rafer.call(this.$els, "toggleClass", replace("${classprefix}engagestate-disengaged", this.ui.options), false);
  },

  onDisengage$bind: function() {
    rafer.call(this.$els, "toggleClass", replace("${classprefix}engagestate-disengaged", this.ui.options), true);
    rafer.call(this.$els, "toggleClass", replace("${classprefix}engagestate-engaged", this.ui.options), false);
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.$els = null;
  }

});
