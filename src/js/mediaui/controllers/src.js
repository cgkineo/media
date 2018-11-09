MediaUI.Controller.Src = MediaUI.Controller.extend({

  ui: null,

  constructor: function Src(ui) {
    MediaUI.Controller.apply(this, arguments);
    this.ui = ui;
  },

  value$get: function() {
    var value = this.ui.source.src || this.ui.source.getAttribute("src");
    if (value === location.origin+location.pathname) return;
    return value;
  }

});
