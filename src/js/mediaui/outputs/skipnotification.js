MediaUI.Output.SkipState = MediaUI.Output.extend({

  ui: null,
  $els: null,

  constructor: function SkipState(ui) {
    MediaUI.Output.apply(this, arguments);
    this.ui = ui;
    this.$els = this.ui.$("*").filterByAttribute(this.ui.options.outputattribute, "skipstate");
    this.listenTo(this.ui.media, {
      "skip": this.onSkip
    });
  },

  onSkip: function(event) {
    if (!this.$els.length) return;
    if (!event.skipAmount) return;
    // TODO: add classes to show skip ui
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.$els = null;
  }

});
