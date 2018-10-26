MediaUI.Input.ScrubCurrentTimeAria = MediaUI.Input.extend({

  ui: null,
  $els: null,
  wasPlaying: false,
  isMouseDown: false,
  inTouch: false,

  constructor: function ScrubCurrentTimeAria(ui) {
    MediaUI.Input.apply(this, arguments);
    this.ui = ui;
    this.$els = this.ui.$all().filterByAttribute(this.ui.options.inputattribute, "scrubcurrenttimearia");
    this.addEventListeners();
  },

  addEventListeners: function() {
    this.$els.on({
      "keydown": this.onKeyDown
    }, {
      passive: false
    });
  },

  onKeyDown$bind: function(event) {
    if (event.target !== document.activeElement) return;
    switch (event.keyCode) {
      case 37: case 40: // left, down
        this.moveTimeBySeconds(-1);
        break;
      case 39: case 38: // right, up
        this.moveTimeBySeconds(1);
        break;
      case 34: // pagedown
        this.moveTimeBySeconds(-10);
        break;
      case 33: // pageup
        this.moveTimeBySeconds(10);
        break;
      case 35: // end
        this.moveTimeBySeconds(this.ui.source.duration || 0);
        break;
      case 36: // home
        this.moveTimeBySeconds(-this.ui.source.duration || 0);
      default:
        return;
    }
  },

  moveTimeBySeconds: function(seconds) {
    if (!this.ui.source.duration) return;
    var currentTime = clamp(0, this.ui.source.currentTime + seconds, this.ui.source.duration);
    this.ui.source.currentTime = currentTime;
    this.ui.media.dispatchEvent('timeupdate', {
      slow: true
    });
  },

  removeEventListeners: function() {
    this.$els.off({
      "keydown": this.onKeyDown
    });
  },

  destroy: function() {
    MediaUI.Input.prototype.destroy.apply(this, arguments);
    this.removeEventListeners();
    this.ui = null;
    this.$els = null;
  }

});
