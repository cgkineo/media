MediaUI.Output.ControlsState = MediaUI.Output.extend({

  ui: null,
  $els: null,

  constructor: function ControlsState(ui) {
    MediaUI.Output.apply(this, arguments);
    this.$els = ui.$all().filterByAttribute(ui.options.outputattribute, "controlsstate");
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
    if (!options.uiallowcontrols) {
      rafer.call(this.$els, "toggleClass", replace("${classprefix}controlsstate-disabled", options), true);
      rafer.call(this.$els, "toggleClass", replace("${classprefix}controlsstate-force", options), false);
      return;
    }
    rafer.call(this.$els, "toggleClass", replace("${classprefix}controlsstate-disabled", options), false);
    rafer.call(this.$els, "toggleClass", replace("${classprefix}controlsstate-force", options), options.uialwaysshowcontrols);
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.$els = null;
  }

});

Media.DefaultOptions.add({
  uialwaysshowcontrols: false,
  uiallowcontrols: true
});
