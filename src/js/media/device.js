/*
Check for device capabilities.
 */

Media.Class.Device = Media.Class.extend({

  isUsingTouch: false,
  lastTouch: null,
  isUsingKeyboard: false,
  lastKey: null,

  constructor: function Device() {
    this.checkTouchDevice();
    this.checkKeyboardUse();
  },

  isIOS$get$enum: function() {
    return /(iPad|iPhone|iPod)/g.test(navigator.userAgent) && !window.MSStream;
  },

  isIE11$get$enum: function() {
    if ((/*@cc_on!@*/false) || (document.documentMode)) return true;
    return false;
  },

  wasUsingTouchRecently$get$enum: function() {
    var now = Date.now();
    return (now - this.lastTouch < 600);
  },

  wasUsingKeyboardRecently$get$enum: function() {
    var now = Date.now();
    return (now - this.lastKey < 600);
  },

  checkTouchDevice$write: function() {
    var touchListener = function(event) {
      this.lastTouch = Date.now();
      this.isUsingTouch = true;
      this.trigger("touched", event);
    }.bind(this);
    window.addEventListener("touchstart", touchListener, { capture: true, passive: false });
    window.addEventListener("touchend", touchListener, { capture: true, passive: false });
  },

  checkKeyboardUse$write: function() {
    var keyListener = function(event) {
      this.lastKey = Date.now();
      this.isUsingKeyboard = true;
      var ignorekeyboardinputselector = Media.DefaultOptions.get("ignorekeyboardinputselector");
      if (elements(event.srcElement).matches(ignorekeyboardinputselector)) return;
      this.trigger("typed", event);
    }.bind(this);
    window.addEventListener("keydown", keyListener, { capture: true, passive: false });
    window.addEventListener("keyup", keyListener, { capture: true, passive: false });
  }

}, null, {
  instanceEvents: true
});

Media.defineProperties({
  device$enum: new Media.Class.Device()
});

Media.DefaultOptions.add({
  ignorekeyboardinputselector: "input, textarea"
});
