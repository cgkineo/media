MediaUI.Output.ControlBarState = MediaUI.Output.extend({

  ui: null,
  $els: null,

  constructor: function CaptionsState(ui) {
    MediaUI.Output.apply(this, arguments);
    this.$el = ui.$el;
    this.ui = ui;
    this.$el.on({
      focus: onFocus,
      blur: onBlur
    });
    this.onTextTrackChange();
  },

  onTextTrackChange$bind: function(event) {
    rafer.call(this.$els, "toggleClass", this.ui.options.classprefix+"captionsstate-active", this.ui.captions.isActive);
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.$els = null;
  }

});
