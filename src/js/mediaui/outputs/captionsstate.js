MediaUI.Output.CaptionsState = MediaUI.Output.extend({

  ui: null,
  $els: null,

  constructor: function CaptionsState(ui) {
    MediaUI.Output.apply(this, arguments);
    this.$els = ui.$all().filterByAttribute(ui.options.outputattribute, "captionsstate");
    if (!this.$els.length) return;
    this.ui = ui;
    this.listenTo(this.ui.media, {
      "addtexttrack texttrackchange removetexttrack": this.onTextTrackChange,
    });
    this.onTextTrackChange();
  },

  onTextTrackChange$bind: function(event) {
    if (!this.ui.media.tracks || !this.ui.media.tracks.length) {
      rafer.call(this.$els, "toggleClass", this.ui.options.classprefix+"captionsstate-disabled", true);
      rafer.call(this.$els, "toggleClass", this.ui.options.classprefix+"captionsstate-inactive", true);
      rafer.call(this.$els, "toggleClass", this.ui.options.classprefix+"captionsstate-active", false);
      return;
    }
    rafer.call(this.$els, "toggleClass", this.ui.options.classprefix+"captionsstate-disabled", false);
    rafer.call(this.$els, "toggleClass", this.ui.options.classprefix+"captionsstate-inactive", !this.ui.captions.isActive);
    rafer.call(this.$els, "toggleClass", this.ui.options.classprefix+"captionsstate-active", this.ui.captions.isActive);
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.$els = null;
  }

});
