MediaUI.Input.Skip = MediaUI.Input.extend({

  floorPrecision: 10,

  ui: null,
  interactions: null,
  lastEvent: 0,
  skipped: 0,

  constructor: function Skip(ui) {
    MediaUI.Input.apply(this, arguments);
    this.interactions = [];
    this.clear = debounce(this.clear.bind(this), 500);
    this.ui = ui;
    this.listenTo(this.ui, {
      "tap": this.onSingleTap,
      "dbltap": this.onDoubleTap
    });
  },

  onSingleTap: function(event) {
    if (!this.ui.options.uiskip) return;
    if (!Media.device.wasTouchedRecently) return;
    this.interactions.length = 0;
  },

  onDoubleTap$bind: function(event) {
    if (!this.ui.options.uiskip) return;
    if (!Media.device.wasTouchedRecently) return;
    var kind = elements(event.target).path().filterByAttribute(this.ui.options.inputattribute, "skip");
    if (!kind.length) return;

    event.preventDefault();

    var now = Date.now();
    var offsetParent = event.target.offsetParent;
    var parentBound = offsetParent.getBoundingClientRect();
    var x = (event.type === "touchend") ?
      event.changedTouches[0].clientX - parentBound.left :
      event.offsetX;
    var width = offsetParent.clientWidth;
    var lateralRatio = (x / width);
    var direction = (lateralRatio < 0.5) ?
      'left' :
      (lateralRatio > 0.5) ?
      'right' :
      'none';
    this.interactions.push({
      direction: direction
    });

    this.skip();
    this.clear();
  },

  skip: function() {
    var skipAmount = this.getSkipAmount();
    if (!skipAmount) return;
    var skipNow = skipAmount - this.skipped;
    var currentTime = this.ui.source.currentTime;
    var duration = this.ui.source.duration;
    skipNow = clamp(-currentTime, skipNow, duration - currentTime);
    if (!skipNow) return;
    this.ui.source.currentTime += skipNow
    this.skipped += skipNow;
    this.ui.media.dispatchEvent("skip", { skipAmount: skipAmount });
    this.ui.media.dispatchEvent("timeupdate", { fast: true, medium: true, slow: true });
  },

  clear: function() {
    var skipAmount = this.getSkipAmount();
    if (!skipAmount) return;
    this.interactions.length = 0;
    this.skipped = 0;
  },

  getSkipAmount: function() {
    var interactions = this.interactions.slice(0);
    if (interactions === undefined) return;

    var unit = this.ui.options.uiskipseconds || 10;

    var rights = 0, lefts = 0;
    for (var i = 0, l = interactions.length; i < l; i++) {
      switch (interactions[i].direction) {
        case "left":
          lefts++;
          break;
        case "right":
          rights++;
          break;
      }
    }

    if (!rights && !lefts) return;
    if (rights - lefts === 0) return;

    var total = (lefts > rights) ?
      -(lefts - rights):
      rights - lefts;

    var skipAmount = total * unit;
    return skipAmount;
  }

});

Media.DefaultOptions.add({
  uiskip: true,
  uiskipseconds: 10
});
Media.DOMEvents.add("skip");
