/*
Check for device capabilities.
 */

Media.Class.Device = Media.Class.extend({

  isUsingTouch: false,
  lastTouch: null,

  constructor: function Device() {
    this.checkTouchDevice();
  },

  isIOS$get$enum: function() {
    return /(iPad|iPhone|iPod)/g.test(navigator.userAgent) && !window.MSStream;
  },

  isIE11$get$enum: function() {
    if ((/*@cc_on!@*/false) || (document.documentMode)) return true;
    return false;
  },

  wasTouchedRecently$get$enum: function() {
    var now = Date.now();
    return (now - this.lastTouch < 600);
  },

  checkTouchDevice$write: function() {
    var touchListener = function() {
      this.lastTouch = Date.now();
      this.isUsingTouch = true;
    }.bind(this);
    window.addEventListener("touchstart", touchListener, { capture: true, passive: true });
    window.addEventListener("touchend", touchListener, { capture: true, passive: true });
  }

});

Media.defineProperties({
  device$enum: new Media.Class.Device()
});
