MediaUI.Output.PlayPauseState = MediaUI.Output.extend({

  floorPrecision: 10,

  ui: null,
  $els: null,

  requiredAPI: ['paused', 'currentTime', 'duration'],

  constructor: function PlayPauseState(ui) {
    MediaUI.Output.apply(this, arguments);
    this.$els = ui.$all().filterByAttribute(ui.options.outputattribute, "playpausestate");
    if (!this.$els.length) return;
    this.ui = ui;
    this.listenTo(this.ui.media, {
      "timeupdate play pause ended": this.onUpdate
    });
    this.onUpdate();
  },

  onUpdate: function(event) {
    if (event && event.type === "timeupdate" && !event.slow) return;
    if (!this.$els.length) return;
    var options = this.ui.options;
    if (!this.ui.media.hasAPI(this.requiredAPI)) {
      rafer.call(this.$els, "toggleClass", replace("${classprefix}playpausestate-disabled", options), true);
      rafer.call(this.$els, "toggleClass", replace("${classprefix}playpausestate-playing", options), false);
      rafer.call(this.$els, "toggleClass", replace("${classprefix}playpausestate-paused", options), true);
      rafer.call(this.$els, "toggleClass", replace("${classprefix}playpausestate-start", options), true);
      rafer.call(this.$els, "toggleClass", replace("${classprefix}playpausestate-end", options), false);
      rafer.call(this.$els, "toggleClass", replace("${classprefix}playpausestate-middle", options), false);
      return;
    }
    var isAtStart = this.isAtStart();
    var isAtEnd = this.isAtEnd();
    var isPaused = this.ui.media.hasAPI(this.requiredAPI) ? this.ui.source.paused : true;
    rafer.call(this.$els, "toggleClass", replace("${classprefix}playpausestate-disabled", options), false);
    rafer.call(this.$els, "toggleClass", replace("${classprefix}playpausestate-playing", options), !isPaused);
    rafer.call(this.$els, "toggleClass", replace("${classprefix}playpausestate-paused", options), isPaused);
    rafer.call(this.$els, "toggleClass", replace("${classprefix}playpausestate-start", options), isAtStart);
    rafer.call(this.$els, "toggleClass", replace("${classprefix}playpausestate-end", options), isAtEnd);
    rafer.call(this.$els, "toggleClass", replace("${classprefix}playpausestate-middle", options), !isAtEnd && !isAtStart);
  },

  isAtStart: function() {
    var currentTime = this.ui.media.hasAPI(this.requiredAPI) ? this.ui.source.currentTime : 0;
    return (Math.floor(currentTime * this.floorPrecision) <= 1);
  },

  isAtEnd: function() {
    var hasRequiredAPI = this.ui.media.hasAPI(this.requiredAPI);
    var currentTime = hasRequiredAPI ? this.ui.source.currentTime : 0;
    var duration = hasRequiredAPI ? this.ui.source.duration : 0;
    return (Math.abs(Math.floor(currentTime * this.floorPrecision) - Math.floor(duration * this.floorPrecision)) <= 1);
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.$els = null;
  }

});
