MediaUI.Output.Poster = MediaUI.Output.extend({

  ui: null,
  $els: null,

  constructor: function Poster(ui) {
    MediaUI.Output.apply(this, arguments);
    this.$els = ui.$all().filterByAttribute(ui.options.outputattribute, "poster");
    if (!this.$els.length) return;
    this.ui = ui;
    this.addImage();
  },

  addImage: function() {
    this.$els.forEach(function(element) {
      switch (element.nodeName) {
        case "IMG":
          element.src = this.ui.source.poster;
          break;
        default:
          element.style.backgroundImage = "url("+this.ui.source.poster+")";
          break;
      }
    }.bind(this));
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.$els = null;
  }

});
