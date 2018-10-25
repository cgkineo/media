var MediaUIComponent = Class.extend({

  constructor: function MediaUIComponent(ui) {
    this.listenTo(ui.media, {
      destroyed: function() {
        this.destroy();
      }
    });
  }

}, null, {
  instanceEvents: true
});
