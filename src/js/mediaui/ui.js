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

  constructor: function UI(media, options) {
    if (!options.uienabled) return this.destroy();

    this.media = media;
    this.media.ui = this.media.ui || new MediaUIList();
    this.media.ui.add(this);

    this.options = options || {};
    if (!(this.options instanceof Media.DefaultOptions)) {
      this.options = new Media.DefaultOptions(options);
    }
    this.options.add({
      ui: this
    });

    this.source = media.el;
    this.$source = elements(media.el);

    this.inputs = {};
    this.outputs = {};

    this.ensureElement();
    this.processOptions();
    this.startControllers();
    this.startOutputs();
    this.startInputs();

    this.listenTo(media, {
      destroyed: this.onDestroyed
    });

    this.trigger("ready");

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
    var template = this.options.uitemplate;
    if (!template) return;
    var element = document.createElement('div');
    element.innerHTML = template;
    return element.children[0];
  },

  processOptions$write: function() {
    this.originalAttributes = this.$source.attrs();
    if (this.options.uireplace) {
      var mediaseat = this.$('*').filterByAttribute(this.options.outputattribute, "mediaseat")[0];
      replaceWith(this.source, this.el);
      prependElement(mediaseat, this.source);
    }
    if (this.options.videoplaysinline && this.source.tagName === "VIDEO") {
      this.source.setAttribute("playsinline", true);
    }
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
      replaceWith(this.el, this.source);
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
  classprefix: "media--",
  outputattribute: "data-media-output",
  inputattribute: "data-media-input",

  ui: null,
  uienable: false,
  uienablecaptions: true,
  uienableposter: true,
  uienablewaiting: true,
  uienableskip: true,
  uienablecontrols: true,
  uienablebigplaypause: true,
  uienablecontrolsbar: true,
  uienablelittleplaypause: true,
  uienablerailduration: true,
  uienablerailback: true,
  uienablerailbuffered: true,
  uienablerailcurrent: true,
  uienablelittlecaptions: true,
  uienablelittlefullscreen: true,
  uireplace: false,
  uitemplate: function() {
    var options = this;
    return template('\
<div class="${options.classprefix}main" ${options.outputattribute}="resizestate playpausestate captionsstate volumestate waitingstate posterstate engagestate">\
  <div class="${options.classprefix}resizecontainer" ${options.outputattribute}="resize mediaseat">\
    ${options.uienablecaptions && \'<div class="${options.classprefix}captions" ${options.outputattribute}="captions"></div>\'}\
    ${options.uienableposter && \'<div class="${options.classprefix}poster" ${options.outputattribute}="poster"></div>\'}\
    ${options.uienablewaiting && \'<div class="${options.classprefix}waiting"></div>\'}\
    ${options.uienableskip && \'<div class="${options.classprefix}skip" ${options.outputattribute}="skipnotification"></div>\'}'+
    (options.uienablecontrols &&
   '<div class="${options.classprefix}controls" ${options.outputattribute}="controlsstate" ${options.inputattribute}="taps skip toggleplaypause:notouch">\
      ${options.uienablebigplaypause && \'<button class="${options.classprefix}bigplaypause" ${options.outputattribute}="playpausearia" ${options.inputattribute}="toggleplaypause engage" aria-hidden="true"></button>\'}'+
      (options.uienablecontrolsbar &&
     '<div class="${options.classprefix}controlsbar" ${options.inputattribute}="engage stoptappropagation">\
        ${options.uienablelittleplaypause && \'<button class="${options.classprefix}littleplaypause" ${options.inputattribute}="toggleplaypause" ${options.outputattribute}="playpausearia"></button>\'}'+
        (options.uienablerailduration &&
       '<div class="${options.classprefix}railduration" ${options.inputattribute}="scrubcurrenttime">\
          ${options.uienablerailback && \'<div class="${options.classprefix}railback"></div>\'}\
          ${options.uienablerailbuffered && \'<div class="${options.classprefix}railbuffered" ${options.outputattribute}="bufferedwidth"></div>\'}\
          ${options.uienablerailcurrent && \'<div class="${options.classprefix}railcurrent" ${options.outputattribute}="currenttimewidth"></div>\'}\
        </div>' || '') +
       '${options.uienablelittlemute && \'<button class="${options.classprefix}littlemute" ${options.outputattribute}="mutearia" ${options.inputattribute}="togglemute"></button>\'}\
        ${options.uienablelittlecaptions && \'<button class="${options.classprefix}littlecaptions" ${options.outputattribute}="captionsaria" ${options.inputattribute}="togglecaptions"></button>\'}\
        ${options.uienablelittlefullscreen && \'<button class="${options.classprefix}littlefullscreen" ${options.outputattribute}="fullscreenaria" ${options.inputattribute}="togglefullscreen"></button>\'}\
      </div>' || '') +
   '</div>' || '') +
 '</div>\
</div>\
', options);
  }

});
