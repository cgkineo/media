Media.Class.Players = Media.Class.List.extend({

  constructor: function Players() {
    List.apply(this, arguments);
  },

  findById: function(id) {
    for (var i = 0, l = this.length; i < l; i++) {
      var player = this[i];
      if (!player.el) continue;
      if (player.el.id !== id) continue;
      return player;
    }
    return null;
  },

  findByElement: function(el) {
    for (var i = 0, l = this.length; i < l; i++) {
      var player = this[i];
      if (!player.el) continue;
      if (player.el.id !== el) continue;
      return player;
    }
    return null;
  }

});

Media.defineProperties({
  players$enum$write: new Media.Class.Players()
});
