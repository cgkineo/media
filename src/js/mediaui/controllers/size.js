MediaUI.Controller.Size = MediaUI.Controller.extend({

  ui: null,

  constructor: function Size(ui) {
    MediaUI.Controller.apply(this, arguments);
    this.ui = ui;
  },

  height: function(element) {
    return element.videoHeight || element.originalHeight || element.height;
  },

  width: function(element) {
    return element.videoWidth || element.originalWidth || element.width;
  }

});
