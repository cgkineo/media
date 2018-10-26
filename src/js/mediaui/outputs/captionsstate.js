MediaUI.Output.CaptionsState = MediaUI.Output.extend({

  ui: null,
  el: null,

  constructor: function CaptionsState(ui) {
    MediaUI.Output.apply(this, arguments);
    this.el = ui.$all().filterByAttribute(ui.options.outputattribute, "captionsstate")[0];
    if (!this.el) return;
    this.ui = ui;
    this.listenTo(this.ui.media, {
      texttrackchange: this.onTextTrackChange
    });
    this.onTextTrackChange();
  },

  onTextTrackChange$bind: function(event) {
    rafer.call(toggleClass, null, this.el, this.ui.options.classprefix+"captionsstate-active", this.ui.captions.isActive);
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.el = null;
  }

});
