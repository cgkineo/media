Media.Class.TextTracks = Media.Class.extend({

  constructor: function TextTracks() {
    this.listenTo(Media, {
      create: this.onCreate,
      timeupdate: this.onTimeUpdate,
      destroy: this.onDestroy,
      change: this.onChange
    });
  },

  onCreate: function(media) {
    media.defineProperties({
      tracks$enum$write: new Media.Class.TextTrackList(media)
    });
  },

  onTimeUpdate: function(media, event) {
    if (event && !event.slow) return;
    for (var i = 0, l = media.tracks.length; i < l; i++) {
      var track = media.tracks[i];
      track.update();
    }
  },

  onChange: function(media) {
    this.onDestroy(media);
    this.onCreate(media);
    this.onTimeUpdate(media);
  },

  onDestroy: function(media) {
    if (!media.tracks) return;
    media.tracks.destroy();
    delete media.tracks;
  }

}, null, {
  instanceEvents: true
});

Media.defineProperties({
  texttracks$write: new Media.Class.TextTracks()
});
