MediaUI.Output.BigPlayPauseState = MediaUI.Output.extend({

  ui: null,
  $els: null,

  requiredAPI: ['paused'],

  constructor: function BigPlayPauseState(ui) {
    MediaUI.Output.apply(this, arguments);
    this.$els = ui.$all().filterByAttribute(ui.options.outputattribute, "bigplaypausestate");
    if (!this.$els.length) return;
    this.ui = ui;
    this.listenTo(this.ui.media, {
      "change": this.onUpdate
    });
    this.onUpdate();
  },

  onUpdate: function(event) {
    if (!this.$els.length) return;
    var options = this.ui.options;
    if (!this.ui.media.hasAPI(this.requiredAPI) || !this.ui.options.uishowbigplaypause) {
      rafer.call(this.$els, "toggleClass", replace("${classprefix}bigplaypausestate-hidden", options), true);
      return;
    }
    rafer.call(this.$els, "toggleClass", replace("${classprefix}bigplaypausestate-hidden", options), false);
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.$els = null;
  }

});

Media.DefaultOptions.add({
  uishowbigplaypause: true
});
