MediaUI.Output.BufferedWidth = MediaUI.Output.extend({

  ui: null,
  $els: null,

  requiredAPI$write: ['duration', 'buffered', 'seekable'],

  constructor: function BufferedWidth(ui) {
    MediaUI.Output.apply(this, arguments);
    this.$els = ui.$all().filterByAttribute(ui.options.outputattribute, "bufferedwidth");
    if (!this.$els.length) return;
    this.ui = ui;
    this.listenTo(this.ui.media, {
      "timeupdate postresize ended change": this.onTimeUpdate,
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
    if (!this.ui.media.hasAPI(this.requiredAPI)) {
      for (var i = 0, l = this.$els.length; i < l; i++) {
        var el = this.$els[i];
        rafer.set(el.style, "width", "0%");
      }
      return;
    }
    if (!buffered.length && this.ui.source.seekable.length) buffered = this.ui.source.seekable;
    var start = 0;
    var lastEnd = 0;
    for (var b = 0, bl = buffered.length; b < bl; b++) {
      var end = buffered.end(b);
      if (lastEnd < end) lastEnd = end;
    }
    var position = ((lastEnd - start) / duration) || 0;
    for (var i = 0, l = this.$els.length; i < l; i++) {
      var el = this.$els[i];
      var value = position * 100 + "%";
      rafer.set(el.style, "width", value);
    }
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.$els = null;
  }

});
