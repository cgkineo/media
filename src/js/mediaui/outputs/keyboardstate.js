MediaUI.Output.KeyboardState = MediaUI.Output.extend({

  ui: null,
  $els: null,

  constructor: function KeyboardState(ui) {
    MediaUI.Output.apply(this, arguments);
    this.$els = ui.$all().filterByAttribute(ui.options.outputattribute, "keyboardstate");
    if (!this.$els.length) return;
    this.ui = ui;
    this.listenTo(this.ui, {
      "endinput": this.onUpdate
    });
    this.listenTo(Media.device, {
      "typed": this.onUpdate
    });
    this.onUpdate();
  },

  onUpdate: function(event) {
    var isActive = Media.device.wasUsingKeyboardRecently;
    rafer.call(this.$els, "toggleClass", replace("${classprefix}keyboardstate-inactive", this.ui.options), !isActive);
    rafer.call(this.$els, "toggleClass", replace("${classprefix}keyboardstate-active", this.ui.options), isActive);
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.$els = null;
  }

});
