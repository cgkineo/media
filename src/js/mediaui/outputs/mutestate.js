MediaUI.Output.MuteState = MediaUI.Output.extend({

  ui: null,
  $els: null,

  constructor: function MuteState(ui) {
    MediaUI.Output.apply(this, arguments);
    this.$els = ui.$all().filterByAttribute(ui.options.outputattribute, "mutestate");
    if (!this.$els.length) return;
    this.ui = ui;
    this.listenTo(this.ui.media, {
      "volumechange": this.onVolumeChange
    });
    this.onVolumeChange();
  },

  onVolumeChange$bind: function() {
    rafer.call(this.$els, "toggleClass", replace("${classprefix}mutestate-muted", this.ui.options), this.ui.source.muted);
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.$els = null;
  }

});
