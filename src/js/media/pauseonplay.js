Media.Class.PauseOnPlay = Media.Class.extend({

  constructor: function PauseOnPlay() {
    this.listenTo(Media, {
      "created": this.onCreated,
      "play": this.onPlay
    });
  },

  onCreated: function(media) {
    media.defineProperties({
      pauseonplay$enum$write: media.options.pauseonplay
    });
  },

  onPlay: function(media) {
    for (var i = 0, l = Media.players; i < l; i++) {
      var player = Media.players[i];
      if (!player.pauseonplay) continue;
      player.el.pause();
    }
  }

});

Media.defineProperties({
  pauseonplay: new Media.Class.PauseOnPlay()
});
Media.DefaultOptions.add({
  pauseonplay: false
});
