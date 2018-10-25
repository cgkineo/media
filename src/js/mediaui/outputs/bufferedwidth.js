MediaUI.Output.BufferedWidth = MediaUI.Output.extend({

  floorPrecision: 10,

  ui: null,
  $els: null,

  constructor: function BufferedWidth(ui) {
    MediaUI.Output.apply(this, arguments);
    this.$els = ui.$all().filterByAttribute(ui.options.outputattribute, "bufferedwidth");
    if (!this.$els.length) return;
    this.ui = ui;
    this.listenTo(this.ui.media, {
      "timeupdate postresize ended": this.onTimeUpdate,
      "destroyed": this.destroy
    });
    this.onTimeUpdate();
  },

  onTimeUpdate: function(event) {
    if (event && event.type === "timeupdate" && !event.medium) return;
    this.update();
  },

  update: function() {
    if (!this.$els.length) return;
    var duration = this.ui.source.duration;
    var buffered = this.ui.source.buffered;
    if (!buffered.length && this.ui.source.seekable.length) buffered = this.ui.source.seekable;
    var length = 0;
    for (var b = 0, bl = buffered.length; b < bl; b++) {
      var start = buffered.start(b);
      var end = buffered.end(b);
      length += end-start;
    }
    var position = (length / duration) || 0;
    for (var i = 0, l = this.$els.length; i < l; i++) {
      var buffered = this.$els[i];
      var value = buffered.offsetParent.clientWidth * position + "px";
      rafer.set(buffered.style, "width", value);
    }
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.$els = null;
  }

});
