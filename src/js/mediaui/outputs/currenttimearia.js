MediaUI.Output.CurrentTimeAria = MediaUI.Output.extend({

  ui: null,
  $els: null,

  constructor: function CurrentTimeAria(ui) {
    MediaUI.Output.apply(this, arguments);
    this.$els = ui.$all().filterByAttribute(ui.options.outputattribute, "currenttimearia");
    if (!this.$els.length) return;
    this.ui = ui;
    this.listenTo(this.ui.media, {
      "timeupdate": this.onUpdate
    });
    this.onUpdate();
  },

  onUpdate: function(event) {
    if (event && (!event.fake || !event.medium)) return;
    if (!this.$els.length) return;
    var options = this.ui.options;
    MediaUI.languages.load(options, function(language) {
      var currentTime = parseInt(this.ui.source.currentTime);
      var duration = parseInt(this.ui.source.duration || 0);
      var ariaLabel = language.hash["Progress Bar"] + " " + language.hash["progress bar timing: currentTime={1} duration={2}"||""].replace("{1}", currentTime).replace("{2}", duration);
      rafer.call(this.$els, "attr", "role", "slider");
      rafer.call(this.$els, "attr", "aria-valuemax", duration);
      rafer.call(this.$els, "attr", "aria-valuemin", 0);
      rafer.call(this.$els, "attr", "aria-valuenow", currentTime);
      rafer.call(this.$els, "attr", "aria-label", ariaLabel);
    }.bind(this));
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.$els = null;
  }

});
