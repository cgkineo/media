MediaUI.Output.Captions = MediaUI.Output.extend({

  ui: null,
  $els: null,

  constructor: function Captions(ui) {
    MediaUI.Output.apply(this, arguments);
    bindAll(this, "onTextTrackChange", "onCueEnter", "onCueExit");
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

  onTextTrackChange: function(event) {
    this.$els.forEach(function(el) {
      rafer.set(el, "innerHTML", "");
    });
  },

  onCueEnter: function(event) {
    this.$els.forEach(function(el) {
      rafer.call(el, "appendChild", event.cue.getCueAsHTML());
    });
  },

  onCueExit: function(event) {
    this.$els.forEach(function(el) {
      var cueElements = el.querySelectorAll("#"+event.cue.id);
      for (var i = 0, l = cueElements.length; i < l; i++) {
        var cueElement = cueElements[i];
        rafer.call(null, removeElement, cueElement);
      }
    });
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.$els = null;
  }

});
