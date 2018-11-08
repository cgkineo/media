MediaUI.Output.PosterState = MediaUI.Output.extend({

  ui: null,
  $els: null,

  constructor: function PosterState(ui) {
    MediaUI.Output.apply(this, arguments);
    this.$els = ui.$all().filterByAttribute(ui.options.outputattribute, "posterstate");
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
    if (!options.uiallowposter) {
      rafer.call(this.$els, "toggleClass", replace("${classprefix}posterstate-disabled", options), true);
      rafer.call(this.$els, "toggleClass", replace("${classprefix}posterstate-force", options), false);
      return;
    }
    rafer.call(this.$els, "toggleClass", replace("${classprefix}posterstate-disabled", options), false);
    rafer.call(this.$els, "toggleClass", replace("${classprefix}posterstate-force", options), options.uialwaysshowposter);
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.$els = null;
  }

});

Media.DefaultOptions.add({
  uialwaysshowposter: false,
  uiallowposter: true
});
