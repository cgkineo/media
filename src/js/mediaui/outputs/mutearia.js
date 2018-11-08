MediaUI.Output.MuteAria = MediaUI.Output.extend({

  ui: null,
  $els: null,

  constructor: function MuteAria(ui) {
    MediaUI.Output.apply(this, arguments);
    this.$els = ui.$all().filterByAttribute(ui.options.outputattribute, "mutearia");
    if (!this.$els.length) return;
    this.ui = ui;
    this.listenTo(this.ui.media, {
      "volumechange": this.onUpdate
    });
    this.onUpdate();
  },

  onUpdate: function(event) {
    if (!this.$els.length) return;
    var options = this.ui.options;
    MediaUI.languages.load(options, function(language) {
      var isMuted = Boolean(this.ui.source.muted);
      var value;
      if (isMuted) {
        value = replace("${Unmute}", language.hash);
      } else {
        value = replace("${Mute}", language.hash);
      }
      rafer.call(this.$els, "attr", "aria-label", value);
      rafer.call(this.$els, "attr", "aria-pressed", isMuted);
    }.bind(this));
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.$els = null;
  }

});
