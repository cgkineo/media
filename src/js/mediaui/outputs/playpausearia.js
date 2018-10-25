MediaUI.Output.PlayPauseAria = MediaUI.Output.extend({

  ui: null,
  $els: null,

  constructor: function PlayPauseAria(ui) {
    MediaUI.Output.apply(this, arguments);
    this.$els = ui.$all().filterByAttribute(ui.options.outputattribute, "playpausearia");
    if (!this.$els.length) return;
    this.ui = ui;
    this.listenTo(this.ui.media, {
      "play pause": this.onUpdate
    });
    this.onUpdate();
  },

  onUpdate: function(event) {
    if (!this.$els.length) return;
    var options = this.ui.options;
    MediaUI.languages.load(options.uilang||"en", function(language) {
      var isPaused = this.ui.source.paused;
      var value;
      if (isPaused) {
        value = template("${options.Pause}", language.hash);
      } else {
        value = template("${options.Play}", language.hash);
      }
      rafer.call(this.$els, "attr", "aria-label", value);
    }.bind(this));
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.$els = null;
  }

});
