MediaUI.Output.WaitingState = MediaUI.Output.extend({

  ui: null,
  $els: null,

  constructor: function WaitingState(ui) {
    MediaUI.Output.apply(this, arguments);
    this.$els = ui.$all().filterByAttribute(ui.options.outputattribute, "waitingstate");
    if (!this.$els.length) return;
    this.ui = ui;
    this.listenTo(this.ui.media, {
      "loadstart seeking waiting stalled error": this.onWaiting,
      "canplay seeked playing timeupdate suspend pause": this.offWaiting
    });
    this.offWaiting();
  },

  onWaiting: function() {
    this.$els.forEach(function(element) {
      var $el = elements(element);
      rafer.call($el, "toggleClass", replace("${classprefix}waitingstate-active", this.ui.options), true);
      rafer.call($el, "toggleClass", replace("${classprefix}waitingstate-inactive", this.ui.options), false);
    }.bind(this));
  },

  offWaiting: function() {
    this.$els.forEach(function(element) {
      var $el = elements(element);
      rafer.call($el, "toggleClass", replace("${classprefix}waitingstate-inactive", this.ui.options), true);
      rafer.call($el, "toggleClass", replace("${classprefix}waitingstate-active", this.ui.options), false);
    }.bind(this));
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.$els = null;
  }

});
