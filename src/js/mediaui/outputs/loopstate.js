MediaUI.Output.LoopState = MediaUI.Output.extend({

  ui: null,
  $els: null,

  constructor: function LoopState(ui) {
    MediaUI.Output.apply(this, arguments);
    this.$els = ui.$all().filterByAttribute(ui.options.outputattribute, "loopstate");
    if (!this.$els.length) return;
    this.ui = ui;
    this.listenTo(this.ui.media, {
      "timeupdate play pause ended change": this.onUpdate
    });
    this.onUpdate();
  },

  onUpdate: function(event) {
    if (event && event.type === "timeupdate" && !event.slow) return;
    if (!this.$els.length) return;
    var isLoop = this.ui.source.loop;
    var options = this.ui.options;
    rafer.call(this.$els, "toggleClass", replace("${classprefix}loopstate-looping", options), isLoop);
    rafer.call(this.$els, "toggleClass", replace("${classprefix}loopstate-notlooping", options), !isLoop);
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.$els = null;
  }

});
