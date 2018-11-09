/*
 Creates a user interface for a media.
 */
var MediaUI = Class.extend({

  media$write: null,
  options$write: null,

  source$write: null,
  $source$write: null,

  el$write: null,
  $el$write: null,

  inputs: null,
  outputs: null,

  constructor: function MediaUI(media, options) {
    if (!options.uienabled) return this.destroy();

    this.media = media;
    this.media.ui = this.media.ui || new MediaUIList();
    this.media.ui.add(this);

    this.options = options || {};
    if (!(this.options instanceof Media.DefaultOptions)) {
      this.options = new Media.DefaultOptions(options);
    }

    Media.changes.hold(this.media);

    this.options.add({
      ui: this
    });

    this.source = media.el;
    this.$source = elements(media.el);

    this.inputs = {};
    this.outputs = {};

    this.listenTo(media, {
      destroyed: this.onDestroyed
    });

    MediaUI.layouts.load(this.options, function(layout) {
      this.options.uilayout = layout;
      this.ensureElement();
      this.processOptions();
      this.startControllers();
      this.startOutputs();
      this.startInputs();

      Media.changes.resume(this.media);
      this.trigger("ready");
    }.bind(this));

  },

  $: function(selector) {
    return this.$el.query(selector);
  },

  $all: function() {
    var result = this.$("*");
    result.unshift(this.el);
    return result;
  },

  ensureElement$write: function() {
    this.el = this.options.el || this.getRenderedTemplate();
    this.$el = elements(this.el);
  },

  getRenderedTemplate$write: function() {
    var template = this.options.uilayout.template(this.options);
    if (!template) return;
    var element = document.createElement('div');
    element.innerHTML = template;
    return element.children[0];
  },

  processOptions$write: function() {
    this.originalAttributes = this.$source.attrs();
    if (this.options.uireplace) {
      var $mediaseat = this.$('*').filterByAttribute(this.options.outputattribute, "mediaseat");
      this.$source.replaceWith(this.el);
      $mediaseat.prepend(this.source);
    }
    if (this.options.videoplaysinline && this.source.tagName === "VIDEO") {
      this.source.setAttribute("playsinline", true);
    }
    this.source.setAttribute("tabindex", "-1");
    this.source.setAttribute("aria-hidden", "true");
  },

  startControllers$write: function() {
    for (var name in MediaUI.Controller) {
      var Controller = MediaUI.Controller[name];
      if (!(Controller.prototype instanceof MediaUI.Controller)) continue;
      this[name.toLowerCase()] = new Controller(this);
    }
  },

  startInputs$write: function() {
    for (var name in MediaUI.Input) {
      var Input = MediaUI.Input[name];
      if (!(Input.prototype instanceof MediaUI.Input)) continue;
      this.inputs[name.toLowerCase()] = new Input(this);
    }
  },

  startOutputs$write: function() {
    for (var name in MediaUI.Output) {
      var Output = MediaUI.Output[name];
      if (!(Output.prototype instanceof MediaUI.Output)) continue;
      this.outputs[name.toLowerCase()] = new Output(this);
    }
  },

  unprocessOptions$write: function() {
    if (this.options.uireplace) {
      this.$el.replaceWith(this.source);
    }
    this.$source.attrs(this.originalAttributes);
  },

  onDestroyed: function() {
    this.unprocessOptions();
    this.media.ui.remove(this);
    this.media = null;
    this.options = null;
    this.source = null;
    this.$source = null;
    this.el = null;
    this.$el = null;
    this.inputs = null;
    this.outputs = null;
    this.destroy();
  }

}, {

  Input$write: MediaUIInput,
  Output$write: MediaUIOutput,
  Controller$write: MediaUIController

}, {
  instanceEvents: true
});

Media.DefaultOptions.add({

  videoplaysinline: false,
  classprefix: "mediaui--",
  outputattribute: "data-media-output",
  inputattribute: "data-media-input",

  ui: null,
  uienable: false,
  uireplace: false

});

if (typeof exports ==="undefined") {
  window.MediaUI = MediaUI;
} else {
  exports.MediaUI = MediaUI;
}
