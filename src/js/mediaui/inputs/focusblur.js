MediaUI.Input.FocusBlur = MediaUI.Input.extend({

  ui: null,
  isInFocus: false,

  constructor: function FocusBlur(ui) {
    MediaUI.Input.apply(this, arguments);
    this.ui = ui;
    this.setUpListeners();
  },

  setUpListeners: function() {
    elements(document.body).on({
      focusin: this.onFocus
    }, {
      passive: true
    });
  },

  onFocus$bind: function(event) {
    var $target = elements(event.target);
    var isNewTargetInUI = Boolean($target.parents().filter(function(parent) {
      return parent === this.ui.el;
    }.bind(this)).length);
    if (isNewTargetInUI) {
      this.ui.trigger("begininput", event);
      this.isInFocus = true;
      return;
    }
    if (!this.isInFocus) return;
    this.isInFocus = false;
    this.ui.trigger("endinput", event);
  },

  destroy: function() {
    MediaUI.Input.prototype.destroy.apply(this, arguments);
    elements(document.body).off({
      focusin: this.onFocus
    });
    this.ui = null;
  }

});
