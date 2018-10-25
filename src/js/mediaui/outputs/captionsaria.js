MediaUI.Output.CaptionsAria = MediaUI.Output.extend({

  ui: null,
  $els: null,

  constructor: function CaptionsAria(ui) {
    MediaUI.Output.apply(this, arguments);
    this.$els = ui.$all().filterByAttribute(ui.options.outputattribute, "captionsaria");
    if (!this.$els.length) return;
    this.ui = ui;
    this.listenTo(this.ui.media, {
      "texttrackchange": this.onUpdate
    });
    this.onUpdate();
  },

  onUpdate: function(event) {
    if (!this.$els.length) return;
    var options = this.ui.options;
    MediaUI.languages.load(options.uilang||"en", function(language) {
      var isCaptionsActive = this.ui.captions.isActive;
      var value;
      if (isCaptionsActive) {
        value = template("${options.Captions}", language.hash);
      } else {
        value = template("${options.Captions}", language.hash);
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
