MediaUI.Output.Captions = MediaUI.Output.extend({

  ui: null,
  $els: null,

  constructor: function Captions(ui) {
    MediaUI.Output.apply(this, arguments);
    this.ui = ui;
    this.getElements();
    this.setUpListeners();
  },

  getElements: function() {
    this.$els = this.ui.$("*:not(track)").filterByAttribute(this.ui.options.outputattribute, "captions");
  },

  setUpListeners: function() {
    this.listenTo(this.ui.media, {
      texttrackchange: this.onTextTrackChange,
      cueenter: this.onCueEnter,
      cueexit: this.onCueExit
    });
  },

  onTextTrackChange$bind: function(event) {
    this.$els.forEach(function(el) {
      rafer.set(el, "innerHTML", "");
    });
  },

  onCueEnter$bind: function(event) {
    this.$els.forEach(function(el) {
      rafer.call(el, "appendChild", event.cue.getCueAsHTML());
    });
  },

  onCueExit$bind: function(event) {
    this.$els.forEach(function(el) {
      var cueElements = el.querySelectorAll("#"+event.cue.id);
      for (var i = 0, l = cueElements.length; i < l; i++) {
        var $cueElement = elements(cueElements[i]);
        rafer.call($cueElement, "remove");
      }
    });
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.$els = null;
  }

});
