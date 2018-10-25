MediaUI.Output.ResizeState = MediaUI.Output.extend({

  ui: null,
  el: null,

  constructor: function ResizeComponent(ui) {
    MediaUI.Output.apply(this, arguments);
    bindAll(this, "onResize");
    this.el = ui.$all().filterByAttribute(ui.options.outputattribute, "resizestate")[0];
    if (!this.el) return;
    this.ui = ui;
    this.listenTo(this.ui.media, {
      "resize": this.onResize
    });
  },

  onResize: function(event) {
    toggleClass(this.el, this.ui.options.classprefix+"fullscreen-"+this.ui.fullscreen.type, this.ui.fullscreen.isActive);
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.el = null;
  }

});
