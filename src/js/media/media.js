var Media = Class.extend({

  el: null,
  $el: null,
  options: null,

  constructor: function Media(element, options) {
    // Return a preexiting player if it exists
    if (element[Media.propName]) return element;

    this.defineProperties({
      proxyEvent$write: this.proxyEvent.bind(this)
    });

    this.el = element;
    this.el[Media.propName] = this;
    this.$el = elements(this.el);

    this.options = options || {};
    if (!(this.options instanceof Media.DefaultOptions)) {
      this.options = new Media.DefaultOptions(this.options);
    }

    this.options.add({
      media: this,
      id: this.el.id
    });

    this.initialize();

  },

  initialize: function() {
    Media.players.push(this);
    Media.trigger("create", this);
    this.trigger("create");
    this.attachEvents();
    delay(function() {
      Media.trigger("created", this);
      this.trigger("created");
      this.checkPlaying();
    }.bind(this), 1);
  },

  checkPlaying$write: function() {
    if (this.el.paused) return;
    this.dispatchEvent("play");
  },

  attachEvents$write: function() {
    for (var i = 0, l = Media.DOMEvents.length; i < l; i++) {
      this.el.addEventListener(Media.DOMEvents[i], this.proxyEvent);
    }
  },

  dispatchEvent: function(name, options) {
    if (name === "timeupdate") {
      options = defaults(options, {
        fast: true,
        medium: true,
        slow: true
      });
    }
    options = extend(options, {
      fake: true
    });
    this.$el.dispatchEvent(name, options)
  },

  proxyEvent$write: function(event) {
    var isRealTimeUpdate = (!event.fake && event.type === "timeupdate");
    if (isRealTimeUpdate) return;
    var isRealResize = (!event.fake && event.type === "resize");
    if (!isRealResize) {
      this.trigger(event.type, event);
    }
    Media.trigger(event.type, this, event);
  },

  destroy: function() {
    Media.trigger("destroy", this);
    this.trigger("destroy");
    for (var i = Media.players.length-1; i > -1; i--) {
      if (Media.players[i] !== this) continue;
      Media.players.splice(i, 1);
    }
    this.detachEvents();
    this.selector = null;
    this.options = null;
    delay(function() {
      delete this.el[Media.propName];
      this.el = null;
      Media.trigger("destroyed", this);
      this.trigger("destroyed");
    }.bind(this), 1);
  },

  detachEvents$write: function() {
    for (var i = 0, l = Media.DOMEvents.length; i < l; i++) {
      this.el.removeEventListener(Media.DOMEvents[i], this.proxyEvent);
    }
  }

}, {

  supportedTags$enum$write: "video, audio, canvas, img",
  propName$enum$write: "player",

  Class$write: Class.extend({
    constructor: function MediaClass() {}
  }, {
    List: List.extend({
      constructor: function MediaClassList() {}
    }, null, {
      instanceEvents: true
    })
  }, {
    instanceEvents: true
  })

},{
  classEvents: true,
  instanceEvents: true
});

if (typeof exports ==="undefined") {
  window.Media = Media;
} else {
  exports.Media = Media;
}
