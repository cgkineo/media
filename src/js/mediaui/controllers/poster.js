MediaUI.Controller.Poster = MediaUI.Controller.extend({

  ui: null,

  constructor: function Poster(ui) {
    MediaUI.Controller.apply(this, arguments);
    this.ui = ui;
  },

  value$get: function() {
    return this.ui.source.poster || this.ui.source.getAttribute("poster");
  }

});
