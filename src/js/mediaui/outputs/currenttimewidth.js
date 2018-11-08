MediaUI.Output.CurrentTimeWidth = MediaUI.Output.extend({

  ui: null,
  $els: null,

  requiredAPI: ['currentTime', 'duration'],

  constructor: function CurrentTimeWidth(ui) {
    MediaUI.Output.apply(this, arguments);
    this.$els = ui.$all().filterByAttribute(ui.options.outputattribute, "currenttimewidth");
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
    if (!this.ui.media.hasAPI(this.requiredAPI)) {
      for (var i = 0, l = this.$els.length; i < l; i++) {
        var rail = this.$els[i];
        rafer.set(rail.style, "width", 0);
      }
      return;
    }
    var position = (this.ui.source.currentTime / this.ui.source.duration) || 0;
    for (var i = 0, l = this.$els.length; i < l; i++) {
      var rail = this.$els[i];
      var value = position * 100 + "%";
      rafer.set(rail.style, "width", value);
    }
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.$els = null;
  }

});
