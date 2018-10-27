MediaUI.Output.ControlBarOrder = MediaUI.Output.extend({

  ui: null,
  $els: null,

  constructor: function ControlBarOrder(ui) {
    MediaUI.Output.apply(this, arguments);
    this.$els = ui.$all().filterByAttribute(ui.options.outputattribute, "controlbarorder");
    if (!this.$els.length) return;
    this.ui = ui;
    this.reorder();
  },

  reorder: function() {
    var config = this.ui.options.uicontrolbarorder || [
      "playpause",
      "rail",
      "mute",
      "captions",
      "fullscreen"
    ];
    var lineUp = {};
    config.forEach(function(name, index) {
      lineUp[name] = index + 1;
    });
    this.$els.forEach(function(el) {
      var $el = elements(el);
      var $children = $el.children();
      var orderItems = $children.map(function(child) {
        var orderName = child.getAttribute(this.ui.options.controlbarorderattribute);
        return {
          el: child,
          order: orderName && lineUp[orderName] || null
        };
      }.bind(this));
      orderItems.sort(function(a, b) {
        if (a.order === null && b.order === null) return 0;
        if (a.order === null) return -1;
        if (b.order === null) return 1;
        return a.order - b.order;
      }.bind(this));
      $children.remove();
      orderItems.forEach(function(item) {
        if (!item.order) return;
        $el.append(item.el);
      });
    }.bind(this));
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.$els = null;
  }

});

Media.DefaultOptions.add({
  controlbarorderattribute: "data-media-controlbarorder",
  uicontrolbarorder: [
    "playpause",
    "rail",
    "mute",
    "captions",
    "fullscreen"
  ]
});
