MediaUI.Input.Taps = MediaUI.Input.extend({

  ui: null,
  $els: null,
  isMouseDown: false,
  isTouchDown: false,
  lastEnd: 0,
  taps: 0,
  tapHandle: null,

  constructor: function Taps(ui) {
    MediaUI.Input.apply(this, arguments);
    bindAll(this, "onTouchStart", "onTouchEnd", "onMouseDown", "onMouseMove", "onMouseOut", "onMouseUp", "triggerSingleTap");
    this.ui = ui;
    this.$els = this.ui.$("*").filterByAttribute(this.ui.options.inputattribute, "taps");
    this.setUpListeners();
  },

  setUpListeners: function() {
    this.listenTo(this.ui, {
      stoptap: this.stopSingleTap
    });
    this.$els.on({
      touchstart: this.onTouchStart,
      mousedown: this.onMouseDown,
      mousemove: this.onMouseMove,
      mouseout: this.onMouseOut
    });
    elements(document.body).on({
      mouseup: this.onMouseUp,
      touchend: this.onTouchEnd
    });
  },

  onTouchStart: function(event) {
    this.isTouchDown = true;
    this.ui.trigger("begininput", event);
  },

  onMouseDown: function(event) {
    if (Media.device.wasTouchedRecently) return;
    if (this.isTouchDown) return;
    if (!(event.buttons & 1)) return;
    this.isMouseDown = true;
    this.ui.trigger("begininput", event);
  },

  onMouseMove: function(event) {
    if (Media.device.wasTouchedRecently) return;
    if (this.isMouseDown || this.isTouchDown || this.tapHandle) return;
    this.ui.trigger("begininput", event);
    this.ui.trigger("endinput", event);
  },

  onMouseOut: function(event) {
    if (Media.device.wasTouchedRecently) return;
    if (this.isMouseDown || this.isTouchDown) return;
    this.ui.trigger("endinput", event);
  },

  onMouseUp: function(event) {
    if (Media.device.wasTouchedRecently) return;
    if (!this.isMouseDown) return;
    this.isMouseDown = false;
    this.ui.trigger("endinput", event);
    this.onEndInput(event);
  },

  onTouchEnd: function(event) {
    if (!this.isTouchDown) return;
    this.isTouchDown = false;
    this.ui.trigger("endinput", event);
    this.onEndInput(event);
  },

  onEndInput: function(event) {
    this.stopSingleTap();
    if (this.isNoTaps(event)) return;
    this.taps++;
    var now = Date.now();
    if (now - this.lastEnd < (this.ui.options.uitapinterval || 500)) {
      if (this.taps >= 2) {
        this.ui.trigger("dbltap", event);
        this.taps = 0;
      }
    } else {
      this.singleTapEvent = event;
      this.startSingleTap();
    }
    this.lastEnd = now;
  },

  startSingleTap: function() {
    if (this.tapHandle) this.stopSingleTap();
    this.tapHandle = setTimeout(this.triggerSingleTap, (this.ui.options.uitapinterval || 500));
  },

  stopSingleTap: function() {
    if (!this.tapHandle) return;
    clearTimeout(this.tapHandle);
    this.tapHandle = null;
  },

  triggerSingleTap: function() {
    clearTimeout(this.tapHandle);
    this.tapHandle = null;
    if (this.taps === 0) return;
    this.taps = 0;
    this.ui.trigger("tap", this.singleTapEvent);
  },

  isNoTaps: function(event) {
    var $target = elements(event.target);
    return $target.stack().filterByAttribute("stoptappropagation").length;
  },

  destroy: function() {
    MediaUI.Input.prototype.destroy.apply(this, arguments);
    this.$els.off({
      touchstart: this.onTouchStart,
      mousedown: this.onMouseDown,
      mousemove: this.onMouseMove,
      mouseout: this.onMouseOut
    });
    elements(document.body).off({
      mouseup: this.onMouseUp,
      touchend: this.onTouchEnd
    });
    this.ui = null;
    this.$els = null;
  }

});

Media.DefaultOptions.add({
  uitapinterval: 300
});
