Media.Class.PauseOnOtherPlay = Media.Class.extend({

  requiredAPI$write: ['paused'],

  constructor: function PauseOnOtherPlay() {
    this.listenTo(Media, {
      "created": this.onCreated,
      "play": this.onPlay
    });
  },

  onCreated: function(media) {
    media.defineProperties({
      pauseonotherplay$enum$write: media.options.pauseonotherplay
    });
  },

  onPlay: function(media) {
    for (var i = 0, l = Media.players; i < l; i++) {
      var player = Media.players[i];
      if (!player.pauseonotherplay) continue;
      if (media.hasAPI('paused')) player.el.pause();
    }
  }

});

Media.defineProperties({
  pauseonotherplay: new Media.Class.PauseOnOtherPlay()
});
Media.DefaultOptions.add({
  pauseonotherplay: false
});
