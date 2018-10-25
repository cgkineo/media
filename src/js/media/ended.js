/*
This is needed as sometimes browsers doesn't call the "ended" event properly.
It forces the ended event to trigger if the duration and current time are
within 0.01 of each other and the media is paused.
 */
Media.Class.Ended = Media.Class.extend({

  floorPrecision: 10,

  constructor: function Ended() {
    this.listenTo(Media, {
      "created": this.onCreated,
      "play": this.onPlay,
      "pause": this.onPause,
      "ended": this.onEnded
    });
  },

  onCreated: function(media) {
    media.defineProperties({
      hasFiredEnded$write: false
    });
  },

  onPlay: function(media) {
    media.hasFiredEnded = false;
  },

  onPause: function(media) {
    if (!this.isEnded(media) || media.isAtEnd) return;
    setTimeout(function() {
      if (!media.el) return;
      if (media.hasFiredEnded) return;
      if (!this.isEnded(media)) return;
      media.el.dispatchEvent(createEvent('ended'));
    }.bind(this), 150);
  },

  onEnded: function(media) {
    media.hasFiredEnded = true;
  },

  isEnded: function(media) {
    return (Math.abs(Math.floor(media.el.currentTime*this.floorPrecision) - Math.floor(media.el.duration*this.floorPrecision)) <= 1);
  }

});

Media.defineProperties({
  ended: new Media.Class.Ended()
});
