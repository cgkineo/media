/*
This is needed as sometimes browsers doesn't call the "ended" event properly.
It forces the ended event to trigger if the duration and current time are
within 0.01 of each other and the media is paused.
 */
Media.Class.Ended = Media.Class.extend({

  floorPrecision$write: 10,
  requiredAPI$write: ['paused', 'pause', 'currentTime', 'duration'],

  constructor: function Ended() {
    this.listenTo(Media, {
      "created": this.onCreated,
      "play": this.onPlay,
      "timeupdate pause": this.onUpdate,
      "ended": this.onEnded
    });
  },

  onCreated$write: function(media) {
    media.defineProperties({
      hasFiredEnded$write: false
    });
  },

  onPlay$write: function(media) {
    if (!media.hasAPI(this.requiredAPI)) return;
    if (this.isEnded(media) && media.hasFiredEnded) {
      media.el.currentTime = 0;
    }
    media.hasFiredEnded = false;
  },

  onUpdate$write: function(media) {
    if (!media.hasAPI(this.requiredAPI)) return;
    if (!this.isEnded(media) || media.isAtEnd) {
      media.hasFiredEnded = false;
      return;
    }
    setTimeout(function() {
      if (!media.el) return;
      if (media.hasFiredEnded) return;
      if (!this.isEnded(media)) return;
      media.el.currentTime = media.el.duration;
      if (!media.el.paused) media.el.pause();
      media.dispatchEvent('ended');
    }.bind(this), 150);
  },

  onEnded$write: function(media) {
    if (!media.hasAPI(this.requiredAPI)) return;
    media.hasFiredEnded = true;
  },

  isEnded: function(media) {
    if (!media.hasAPI(this.requiredAPI)) return false;
    return (Math.abs(Math.floor(media.el.currentTime*this.floorPrecision) - Math.floor(media.el.duration*this.floorPrecision)) <= 1);
  }

});

Media.defineProperties({
  ended: new Media.Class.Ended()
});
