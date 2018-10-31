MediaUI.Output.ScrubbingState = MediaUI.Output.extend({

  ui: null,
  $els: null,

  constructor: function ScrubbingState(ui) {
    MediaUI.Output.apply(this, arguments);
    this.$els = ui.$all().filterByAttribute(ui.options.outputattribute, "scrubbingstate");
    if (!this.$els.length) return;
    this.ui = ui;
    this.listenTo(this.ui.media, {
      "scrubbing": this.onScrubbing,
      "scrubbed": this.onScrubbed
    });
    this.onScrubbed();
  },

  onScrubbing$bind: function() {
    rafer.call(this.$els, "toggleClass", replace("${classprefix}scrubbingstate-active", this.ui.options), true);
    rafer.call(this.$els, "toggleClass", replace("${classprefix}scrubbingstate-inactive", this.ui.options), false);
  },

  onScrubbed$bind: function() {
    rafer.call(this.$els, "toggleClass", replace("${classprefix}scrubbingstate-inactive", this.ui.options), true);
    rafer.call(this.$els, "toggleClass", replace("${classprefix}scrubbingstate-active", this.ui.options), false);
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.$els = null;
  }

});
