MediaUI.Output.FullScreenAria = MediaUI.Output.extend({

  ui: null,
  $els: null,

  constructor: function FullScreenAria(ui) {
    MediaUI.Output.apply(this, arguments);
    this.$els = ui.$all().filterByAttribute(ui.options.outputattribute, "fullscreenaria");
    if (!this.$els.length) return;
    this.ui = ui;
    this.listenTo(this.ui.media, {
      "resize": this.onUpdate
    });
    this.onUpdate();
  },

  onUpdate: function(event) {
    if (!this.$els.length) return;
    var options = this.ui.options;
    MediaUI.languages.load(options, function(language) {
      var isFullScreen = this.ui.fullscreen.isActive
      var value;
      if (isFullScreen) {
        value = replace("${Fullscreen}", language.hash);
      } else {
        value = replace("${Non-Fullscreen}", language.hash);
      }
      rafer.call(this.$els, "attr", "aria-label", value);
      rafer.call(this.$els, "attr", "aria-pressed", isFullScreen);
    }.bind(this));
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.$els = null;
  }

});
