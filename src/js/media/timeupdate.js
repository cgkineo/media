/*
This makes timeupdate events trigger at greater frequency, 120fps, 60fps and
12fps rather than the 4fps in most browsers.
*/
Media.Class.TimeUpdate = Media.Class.extend({

  playing: null,
  interval: null,
  slowInterval: null,
  inRaf: false,
  lastTickTime: null,
  slowLastTickTime: null,
  mediumLastTickTime: null,

  constructor: function TimeUpdate() {
    this.playing = [];
    this.listenTo(Media, {
      "play": this.onPlay,
      "pause finish destroyed": this.onPause
    });
    this.onRaf = this.onRaf.bind(this);
  },

  onPlay: function(media) {
    for (var i = 0, l = this.playing.length; i < l; i++) {
      if (this.playing[i] === media) return;
    }
    this.playing.push(media);
    if (this.inRaf) return;
    rafer.request(this.onRaf);
    this.inRaf = true;
  },

  onRaf: function() {
    var fpsfast = Media.DefaultOptions.get("fpsfast");
    this.interval = 1000/fpsfast;
    this.mediumInterval = 1000/(Media.DefaultOptions.get("fpsmedium") || fpsfast / 2);
    this.slowInterval = 1000/(Media.DefaultOptions.get("fpsslow") || fpsfast / 3);
    var now = Date.now();
    if (now < this.lastTickTime + this.interval) {
      if (!this.playing.length) {
        return this.inRaf = false;
      }
      return rafer.request(this.onRaf);
    }
    var options = {
      fast: true,
      medium: false,
      slow: false,
    }
    if (now >= this.mediumLastTickTime + this.mediumInterval) {
      this.mediumLastTickTime = now;
      options.medium = true;
    }
    if (now >= this.slowLastTickTime + this.slowInterval) {
      this.slowLastTickTime = now;
      options.slow = true;
    }
    this.lastTickTime = now;
    for (var i = 0, l = this.playing.length; i < l; i++) {
      this.playing[i].dispatchEvent('timeupdate', options);
    }

    return rafer.request(this.onRaf);
  },

  onPause: function(media) {
    for (var i = this.playing.length-1; i > -1; i--) {
      if (this.playing[i] !== media) continue;
      this.playing.splice(i, 1);
    }
  }

}, null, {
  instanceEvents: true
});

Media.defineProperties({
  "timeupdate$write": new Media.Class.TimeUpdate()
});
Media.DefaultOptions.add({
  fpsfast: 60, // Browser max : video manipulation
  fpsmedium: 30, // Movie standard : ui
  fpsslow: 12 // Half speed : subtitles
});
