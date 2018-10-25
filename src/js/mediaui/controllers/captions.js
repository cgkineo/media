MediaUI.Controller.Captions = MediaUI.Controller.extend({

  ui: null,

  constructor: function Captions(ui) {
    MediaUI.Controller.apply(this, arguments);
    this.ui = ui;
  },

  isActive$get$enum: function() {
    return Boolean(this.ui.media.tracks.default);
  }

});
