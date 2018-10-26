Media.Class.TextTrack = Media.Class.extend({

  activeCues: null,
  cues: null,
  readyState: 0,
  label: null,
  kind: null,
  language: null,
  el: null,
  media: null,
  mode: "hidden",

  _default: false,

  default$get$enum: function() {
    return this._default;
  },

  default$set$enum: function(value) {
    if (this._default === value) return;
    this._default = value;
    this.trigger("change", true);
    this.media.dispatchEvent("texttrackchange", {
      track: this
    });
    for (var i = 0, l = this.activeCues.length; i < l; i++) {
      this.activeCues[i].isLive = false;
    }
    this.activeCues.length = 0;
  },

  constructor: function TextTrack(media, el) {
    this.cues = [];
    this.activeCues = [];
    this.el = el;
    this.defineProperties({
      media$write: media
    });
    this.default = (this.el.getAttribute("default")!==null);
    this.language = this.el.getAttribute("srclang");;
    this.label = this.el.getAttribute("label");
    this.kind = this.el.getAttribute("kind");
    this._previousMode = this.el.mode;
    this.el.mode = "disabled";
    if (this.el.track) this.el.track.mode = "disabled";
    this.fetch();
  },

  addCue: function(addCue) {
    for (var i = this.cues.length-1; i > -1; i--) {
      var cue = this.cues[i];
      if (cue !== addCue && cue.id !== addCue.id) continue;
      return;
    }
    this.cues.push(addCue);
  },

  removeCue: function(removeCue) {
    for (var i = this.cues.length-1; i > -1; i--) {
      var cue = this.cues[i];
      if (cue !== removeCue && cue.id !== removeCue.id) continue;
      this.cues.splice(i, 1);
    }
  },

  update$write: function() {
    if (!this.default) return;
    this.el.mode = "disabled";
    if (this.el.track) this.el.track.mode = "disabled";
    var ct = this.media.el.currentTime;
    var newLiveCues = this.cues.filter(function(cue) {
      return (cue.startTime <= ct && cue.endTime >= ct && !cue.isLive);
    });
    var toRemove = this.activeCues.filter(function(cue) {
      return (cue.startTime > ct || cue.endTime < ct) && cue.isLive;
    });
    if (newLiveCues.length === 0 && toRemove.length === 0) return;
    toRemove.forEach(function(cue) {
      cue.isLive = false;
    });
    this.activeCues = this.activeCues.filter(function(cue) {
      return !(cue.startTime > ct || cue.endTime < ct);
    });
    this.activeCues.push.apply(this.activeCues, newLiveCues);
    newLiveCues.forEach(function(cue) {
      cue.isLive = true;
    });
    this.media.dispatchEvent("cuechange", {
      track: this,
      media: this
    });
  },

  fetch$write: function() {
    this.readyState = Media.Class.TextTrack.READYSTATE.LOADING;
    getUrl(this.el.src, function(data) {
      if (!data) {
        this.readyState = Media.Class.TextTrack.READY_STATE.ERROR;
        return;
      }
      if (!this.parse(data)) {
        this.readyState = Media.Class.TextTrack.READYSTATE.ERROR;
      } else {
        this.readyState = Media.Class.TextTrack.READYSTATE.LOADED;
      }
      this.trigger("load", this);
    }, this);
  },

  parse$write: function(raw) {

    var eolChars = raw.indexOf("\r\n") > -1 ? "\r\n" : "\n";
    var lines = raw.split(eolChars);

    var groups = [];
    var group = [];

    // Get groups by line breaks
    for (var i = 0, l = lines.length; i < l; i++) {
      var line = lines[i];

      var isEnd = (i === lines.length-1);
      var isBlank = !line;

      if (isEnd && !isBlank) {
        group.push(line);
      }

      // form group
      if ((isEnd || isBlank) && group.length) {

        if (group[0].toLowerCase().indexOf("webvtt") > -1) {
          // drop webvtt line
          group.splice(0, 1);
          // drop group if empty
          if (!group.length) continue;
        }

        groups.push({
          title: null,
          lines: group
        });

        group = [];
        continue;

      }

      if (isBlank) continue;

      group.push(line);

    }

    // Remove NOTES and STYLES
    try {
      for (var i = 0, l = groups.length; i < l; i++) {
        group = groups[i];
        var isNote = (group.lines[0].indexOf("NOTE") === 0);
        if (isNote) continue;

        var isStyle = (group.lines[0].indexOf("STYLE") === 0);
        if (isStyle) {
          console.log("Media does not support STYLE lines in WebVTT yet. Please leave an issue if needed.");
          // TODO: make style parser
          // https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API#Styling_WebTT_cues
          continue;
        }

        if (group.lines[0].indexOf("-->") === -1) {
          group.title = group.lines[0];
          group.lines.shift();
        }

        if (group.lines[0].indexOf("-->") === -1) {
          this.readyState = Media.Class.TextTrack.READYSTATE.ERROR;
          break;
        } else {
          extend(group, this.parseTimePlacement(group.lines[0]));
          group.lines.shift();
        }

        var cue = new Media.Class.TextTrackCue(group.startTime, group.endTime, group.lines.join("\n"));
        cue.defineProperties({
          track$write: this
        });
        cue.lineAlign = group.align;
        cue.line = group.line;
        cue.position = group.position;
        cue.size = group.size;
        cue.vertical = group.vertical;
        this.addCue(cue);

      }
    } catch (error) {
      console.log(error);
      return false;
    }

    // TODO: make line tag parser if required
    // https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API#Cue_payload_text_tags

    return true;
  },

  parseTimePlacement$write: function(line) {

    line = line.trim();

    var breakpoint = indexOfRegex(line, /-->/);
    if (breakpoint === -1) throw "Time declaration error, no -->";
    var start = line.slice(0, breakpoint).trim();
    line = line.slice(breakpoint);

    var startpoint = indexOfRegex(line, /[0-9]+/);
    if (startpoint === -1) throw "Time declaration error, no end time";
    line = line.slice(startpoint);

    breakpoint = indexOfRegex(line, /[ ]{1}/);
    if (breakpoint === -1) breakpoint = line.length;
    var end = line.slice(0, breakpoint).trim();
    line = line.slice(breakpoint);

    return extend({
      startTime: this.parseTime(start),
      endTime: this.parseTime(end)
    }, this.parsePlacement(line));

  },

  timeUnits$write: [1/1000, 1, 60, 360],
  parseTime$write: function(time) {

    var blocks = time.split(/[\:\.\,]{1}/g).reverse();
    if (blocks.length < 3) throw "Time declaration error, mm:ss.ttt or hh:mm:ss.tt";
    var seconds = 0;
    for (var i = 0, l = blocks.length; i < l; i++) {
      seconds += this.timeUnits[i]*parseInt(blocks[i]);
    }
    return seconds;

  },

  parsePlacement$write: function(line) {

    var items = line.split(" ").filter(function(item) {return item;});
    var parsed = {
      line: -1,
      position: "50%",
      size: "100%",
      align: "middle"
    };
    items.forEach(function(item) {
      var parts = item.split(":");
      var valueParts = parts[1].split(",");
      var name = parts[0].toLowerCase();
      switch (name) {
        case "d": name = "vertical"; break;
        case "l": name = "line"; break;
        case "t": name = "position"; break;
        case "s": name = "size"; break;
        case "a": name = "align"; break;
        case "vertical": case "line": case "position": case "size": case "align": break;
        default:
          throw "Bad position declaration, "+name;
      }
      parsed[name] = valueParts[0] || parsed[name];
    });

    // set vertical to rl/lr/horizontal
    parsed.vertical = (parsed.vertical === "vertical") ?
      "rl" :
      (parsed.vertical === "vertical-lr") ?
      "lr" :
      "horizontal";

    for (var name in parsed) {
      var value = parsed[name];
      switch (name) {
        case "line":
          value = String(value || -1);
          break;
        case "position":
          value = String(value || "0%");
          break;
        case "size":
          value = String(value || "100%");
          break;
        case "align":
          value = String(value || "middle");
          switch (value) {
            case "start": case "middle": case "end":
              break;
            default:
              throw "Invalid align declaration";
          }
          break;
      }
    }

    return parsed;
  },

  destroy: function() {
    for (var i = 0, l = this.cues.length; i < l; i++) {
      this.cues[i].destroy();
    }
    this.el.mode = this._previousMode;
    this.cues.length = 0;
    this.activeCues.length = 0;
    this.media = null;
    this.el = null;
    this.stopListening();
  }

}, {

  READYSTATE: {
    NONE: 0,
    LOADING: 1,
    LOADED: 2,
    ERROR: 3
  }

});

Media.DOMEvents.add([
  "texttrackchange",
  "cuechange"
]);
