MediaUI.Output.MuteState = MediaUI.Output.extend({

  ui: null,
  $els: null,

  requiredAPI: ['muted'],

  constructor: function MuteState(ui) {
    MediaUI.Output.apply(this, arguments);
    this.$els = ui.$all().filterByAttribute(ui.options.outputattribute, "mutestate");
    if (!this.$els.length) return;
    this.ui = ui;
    this.listenTo(this.ui.media, {
      "volumechange change": this.onUpdate
    });
    this.onUpdate();
  },

  onUpdate$bind: function() {
    if (!this.ui.media.hasAPI(this.requiredAPI)) {
      rafer.call(this.$els, "toggleClass", replace("${classprefix}mutestate-disabled", this.ui.options), true);
      rafer.call(this.$els, "toggleClass", replace("${classprefix}mutestate-muted", this.ui.options), true);
      return;
    }
    rafer.call(this.$els, "toggleClass", replace("${classprefix}mutestate-disabled", this.ui.options), false);
    rafer.call(this.$els, "toggleClass", replace("${classprefix}mutestate-muted", this.ui.options), this.ui.source.muted);
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.$els = null;
  }

});
