Media.Class.DOMEvents = Media.Class.List.extend({

  constructor: function DOMEvents() {},

  add: function(arr) {
    if (!(arr instanceof Array)) return this.push(arr);
    return this.push.apply(this, arr);
  }

});

Media.defineProperties({
  DOMEvents$write: new Media.Class.DOMEvents()
});

Media.DOMEvents.add([
  "abort",
  "canplay",
  "canplaythrough",
  "durationchange",
  "emptied",
  "ended",
  "error",
  "loadeddata",
  "loadedmetadata",
  "loadstart",
  "pause",
  "play",
  "playing",
  "process",
  "ratechange",
  "seeked",
  "seeking",
  "stalled",
  "suspend",
  "timeupdate",
  "volumechange",
  "waiting"
]);
