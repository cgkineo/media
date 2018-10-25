MediaUI.Input.Engage = MediaUI.Input.extend({

  ui: null,
  isEngaged: false,
  engageHandle: null,

  constructor: function Engage(ui) {
    MediaUI.Input.apply(this, arguments);
    bindAll(this, "onUIReady", "onTap", "onBeginInput", "onEndInput", "engage", "disengage");
    this.ui = ui;
    this.setUpListeners();
  },

  setUpListeners: function() {
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

  onUIReady: function() {
    this.engage();
  },

  onBeginInput: function(event) {
    if (this.ui.media.el.paused) return;
    this.isInInput = true;
    if (Media.device.wasTouchedRecently) return;
    this.stopDisengage();
    this.engage();
  },

  onTap: function(event) {
    if (this.ui.media.el.paused) return;
    if (this.checkForceEngage(event)) return;
    if (this.isEngaged) this.disengage();
    else this.engage();
  },

  onEndInput: function(event) {
    if (this.ui.media.el.paused) return;
    if (Media.device.wasTouchedRecently) return;
    if (this.checkForceEngage(event)) return;
    this.startDisengage();
  },

  checkForceEngage: function(event) {
    if (event.type === "mouseout") return false;
    var $target = elements(event.target);
    var stack = $target.stack().filterByAttribute(this.ui.options.inputattribute, "engage");
    if (Boolean(stack.length) && !$target.isHidden()) {
      this.stopDisengage();
      return true;
    }
    return false;
  },

  engage: function() {
    if (this.isEngaged) return;
    this.isEngaged = true;
    this.ui.trigger("engage");
  },

  disengage: function() {
    if (!this.isEngaged) return;
    this.isEngaged = false;
    this.ui.trigger("disengage");
  },

  startDisengage: function() {
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
