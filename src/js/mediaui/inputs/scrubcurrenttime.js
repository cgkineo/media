MediaUI.Input.ScrubCurrentTime = MediaUI.Input.extend({

  ui: null,
  $els: null,
  wasPlaying: false,
  isMouseDown: false,
  inTouch: false,

  constructor: function ScrubCurrentTime(ui) {
    MediaUI.Input.apply(this, arguments);
    this.ui = ui;
    this.$els = this.ui.$all().filterByAttribute(this.ui.options.inputattribute, "scrubcurrenttime");
    bindAll(this, [
      "onMouseDown",
      "onMouseMove",
      "onMouseUp",
      "onTouchStart",
      "onTouchMove",
      "onTouchEnd"
    ]);
    this.addEventListeners();
  },

  addEventListeners: function() {
    this.$els.on({
      "mousedown": this.onMouseDown,
      "touchstart": this.onTouchStart
    }, {
      passive: false
    });
    elements(document.body).on({
      "mouseup": this.onMouseUp,
      "mousemove": this.onMouseMove
    }, {
      passive: true
    });
    elements(document.body).on({
      "touchend": this.onTouchEnd,
      "touchmove": this.onTouchMove
    }, {
      passive: false
    });
  },

  onMouseDown: function(event) {
    if (!(event.buttons & 1)) return;
    event.stopPropagation();
    this.wasPlaying = !this.ui.source.paused;
    this.isMouseDown = true;
    this.ui.source.pause();
    var left = event.clientX;
    this.setTimeFromLeft(left);
  },

  onMouseMove: function(event) {
    if (!this.isMouseDown) return;
    if (!(event.buttons & 1)) {
      this.onMouseUp();
      return;
    }
    var left = event.clientX;
    this.setTimeFromLeft(left);
  },

  onMouseUp: function() {
    this.isMouseDown = false;
    if (!this.wasPlaying) return;
    this.wasPlaying = false;
    this.ui.source.play();
  },

  onTouchStart: function(event) {
    this.wasPlaying = !this.ui.source.paused;
    this.inTouch = true;
    this.ui.source.pause();
    var left = event.touches[0].clientX;
    this.setTimeFromLeft(left);
  },

  onTouchMove: function(event) {
    if (!this.inTouch) return;
    var left = event.touches[0].clientX;
    this.setTimeFromLeft(left);
  },

  onTouchEnd: function(event) {
    this.inTouch = false;
    if (!this.wasPlaying) return;
    event.stopPropagation();
    this.wasPlaying = false;
    this.ui.source.play();
  },

  setTimeFromLeft: function(left) {
    var clientRect = this.$els[0].getBoundingClientRect();
    var width = this.$els[0].clientWidth;
    var x = clamp(0, left - clientRect.left, width);
    var ratio = x / width;
    var currentTime = this.ui.source.duration * ratio;
    if (!this.ui.source.duration) return;
    this.ui.source.currentTime = currentTime;
    this.ui.media.dispatchEvent('timeupdate', {
      slow: true
    });
  },

  removeEventListeners: function() {
    this.$els.off({
      "mousedown": this.onMouseDown,
      "touchstart": this.onTouchStart
    });
    elements(document.body).off({
      "mouseup": this.onMouseUp,
      "mousemove": this.onMouseMove,
      "touchend": this.onTouchEnd,
      "touchmove": this.onTouchMove
    }, {
      passive: true
    });
  },

  destroy: function() {
    MediaUI.Input.prototype.destroy.apply(this, arguments);
    this.removeEventListeners();
    this.ui = null;
    this.$els = null;
  }

});
