MediaUI.Output.PlayPauseState = MediaUI.Output.extend({

  floorPrecision: 10,

  ui: null,
  $els: null,

  constructor: function PlayPauseState(ui) {
    MediaUI.Output.apply(this, arguments);
    this.$els = ui.$all().filterByAttribute(ui.options.outputattribute, "playpausestate");
    if (!this.$els.length) return;
    this.ui = ui;
    this.listenTo(this.ui.media, {
      "timeupdate play pause ended": this.onTimeUpdate
    });
    this.onTimeUpdate();
  },

  onTimeUpdate: function(event) {
    if (event && event.type === "timeupdate" && !event.slow) return;
    if (!this.$els.length) return;
    var options = this.ui.options;
    var isAtStart = this.isAtStart();
    var isAtEnd = this.isAtEnd();
    var isPaused = this.ui.source.paused;
    rafer.call(this.$els, "toggleClass", template("${options.classprefix}playpausestate-playing", options), !isPaused);
    rafer.call(this.$els, "toggleClass", template("${options.classprefix}playpausestate-paused", options), isPaused);
    rafer.call(this.$els, "toggleClass", template("${options.classprefix}playpausestate-start", options), isAtStart);
    rafer.call(this.$els, "toggleClass", template("${options.classprefix}playpausestate-end", options), isAtEnd);
    rafer.call(this.$els, "toggleClass", template("${options.classprefix}playpausestate-middle", options), !isAtEnd && !isAtStart);
  },

  isAtStart: function() {
    var currentTime = this.ui.source.currentTime;
    return (Math.floor(currentTime * this.floorPrecision) <= 1);
  },

  isAtEnd: function() {
    var currentTime = this.ui.source.currentTime;
    var duration = this.ui.source.duration;
    return (Math.abs(Math.floor(currentTime * this.floorPrecision) - Math.floor(duration * this.floorPrecision)) <= 1);
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.$els = null;
  }

});
