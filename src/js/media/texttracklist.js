/**
 * TextTrackList keeps all of the VTT tracks from the media component for use
 * in rendering captions or subtitles.
 * TODO: update track list when dom changes
 */
Media.Class.TextTrackList = Media.Class.List.extend({

  media$write: null,

  constructor: function TextTrackList(media) {
    this.defineProperties({
      media$write: media
    });
    delay(this.fetch, 0);
  },

  default$get: function() {
    return this.find(function(track) {
      return track.default;
    });
  },

  fetch$write$bind: function() {
    this.destroy();
    var tracks = {};
    var trackElements = this.media.el.querySelectorAll("track[type='text/vtt']");
    toArray(trackElements).forEach(function(el) {
      var lang = el.getAttribute("srclang");
      var src = el.getAttribute("src");
      if (!lang || !src || tracks[lang]) return;
      tracks[lang] = new Media.Class.TextTrack(this.media, el);
    }, this);
    var textTracks = [];
    for (var lang in tracks) {
      textTracks.push(tracks[lang]);
    }
    this.addTracks(textTracks);
  },

  addTracks$write: function(tracks) {
    for (var i = 0, l = tracks.length; i < l; i++) {
      this.addTrack(tracks[i]);
    }
  },

  addTrack: function(track) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === track) return;
    }
    this.push(track);
    this.trigger("add", track, this);
    this.media.dispatchEvent("addtexttrack", {
      track: track
    });
  },

  removeTrack: function(track) {
    var isRemoved = false;
    for (var i = this.length-1; i > -1; i--) {
      if (this[i] !== track) continue;
      this.splice(i, 1);
      isRemoved = true;
    }
    if (!isRemoved) return;
    this.trigger("remove", track, this);
    this.media.dispatchEvent("removetexttrack", {
      track: track
    });
  },

  getTrackById: function(id) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i].el.id === id) return this[i];
    }
    return null;
  },

  destroy: function() {
    for (var i = this.length - 1; i > -1; i--) {
      this.removeTrack(this[i]);
    }
    this.stopListening();
  }

});

Media.DOMEvents.add([
  "addtexttrack",
  "removetexttrack"
]);
