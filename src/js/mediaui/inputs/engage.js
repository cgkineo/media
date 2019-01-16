MediaUI.Input.Engage = MediaUI.Input.extend({

  ui: null,
  isEngaged: false,
  engageHandle: null,

  constructor: function Engage(ui) {
    MediaUI.Input.apply(this, arguments);
    this.ui = ui;
    this.setUpListeners();
  },

  setUpListeners: function() {
    this.listenTo(Media.device, {
      typed: this.onTyped
    });
    this.listenTo(this.ui, {
      begininput: this.onBeginInput,
      tap: this.onTap,
      endinput: this.onEndInput,
      ready: this.onUIReady
    });
    this.listenTo(this.ui.media, {
      play: this.startDisengage,
      "pause skip": this.engage
    });
  },

  onUIReady$bind: function() {
    this.engage();
  },

  onBeginInput$bind: function(event) {
    if (this.ui.media.el.paused) return;
    this.isInInput = true;
    if (Media.device.wasUsingTouchRecently) return;
    this.stopDisengage();
    this.engage();
  },

  onTap$bind: function(event) {
    if (this.ui.media.el.paused) return;
    if (this.checkForceEngage(event)) return;
    if (this.isEngaged && Media.device.wasUsingTouchRecently) {
      this.disengage();
      return;
    }
    this.engage();
  },

  onTyped$bind: function(event) {
    if (this.ui.media.el.paused) return;
    this.engage();
  },

  onEndInput$bind: function(event) {
    if (this.ui.media.el.paused) return;
    if (Media.device.wasUsingTouchRecently) return;
    if (this.checkForceEngage(event)) return;
    this.startDisengage();
  },

  checkForceEngage: function(event) {
    if (event.type === "mouseout") return false;
    var $target = elements(event.target);
    var path = $target.path().filterByAttribute(this.ui.options.inputattribute, "engage");
    if (Boolean(path.length) && !$target.isHidden()) {
      this.stopDisengage();
      return true;
    }
    return false;
  },

  engage$bind: function() {
    this.stopDisengage();
    if (this.isEngaged) return;
    this.isEngaged = true;
    this.ui.trigger("engage");
  },

  disengage$bind: function() {
    if (!this.isEngaged) return;
    this.isEngaged = false;
    this.ui.trigger("disengage");
  },

  startDisengage: function() {
    if (Media.device.wasUsingTouchRecently) return;
    if (!this.isEngaged) return;
    if (this.engageHandle) this.stopDisengage();
    this.engageHandle = setTimeout(this.disengage, this.ui.options.uiengagetimeout || 2000);
  },

  stopDisengage: function() {
    if (!this.engageHandle) return;
    clearTimeout(this.engageHandle);
    this.engageHandle = null;
  },

  destroy: function() {
    MediaUI.Input.prototype.destroy.apply(this, arguments);
    this.ui = null;
  }

});

Media.DefaultOptions.add({
  "uiengagetimeout": 2000
});
