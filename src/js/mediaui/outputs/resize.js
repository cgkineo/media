MediaUI.Output.Resize = MediaUI.Output.extend({

  ui: null,
  el: null,

  constructor: function ResizeComponent(ui) {
    MediaUI.Output.apply(this, arguments);
    this.el = ui.$all().filterByAttribute(ui.options.outputattribute, "resize")[0];
    if (!this.el) return;
    this.ui = ui;
    this.listenTo(this.ui.media, {
      "resize": this.onResize
    });
  },

  onResize$bind: function(event) {
    var uiDimensions = this.getUIDimensions();
    var uiOffsetParent = this.ui.el.offsetParent || window;
    var parentDimensions = new Media.Class.Dimensions(uiOffsetParent);
    this.applyStyles(this.el, parentDimensions, uiDimensions[this.ui.fullscreen.isActive ? 'fullscreen' : 'normal']);

    var isUISourceParent = Boolean(find(elements(this.ui.source).stack(), function(item) {
      return item === this.ui.el;
    }));
    var sourceOffsetParent = isUISourceParent ?
      this.ui.el.offsetParent :
      this.ui.source.offsetParent;
    parentDimensions =  new Media.Class.Dimensions(sourceOffsetParent || window);
    this.applyStyles(this.ui.source, parentDimensions, event[this.ui.fullscreen.isActive ? 'fullscreen' : 'normal']);
  },

  applyStyles: function(el, parentDimensions, dimensions) {
    var style = {};
    style['object-fit'] = "fill";
    switch (dimensions.width.unit) {
      case "contain":
        if (dimensions.ratio <= parentDimensions.ratio) {
          // Full height
          style.height = "100%";//makeUnit(parentDimensions.height.value, parentDimensions.height.unit);
          style.width = makeUnit((parentDimensions.height.value * dimensions.ratio), parentDimensions.height.unit);
        } else {
          // Full width
          style.width = "100%";//makeUnit(parentDimensions.width.value, parentDimensions.width.unit);
          style.height = makeUnit((parentDimensions.width.value / dimensions.ratio), parentDimensions.width.unit);
        }
        break;
      case "cover":
        if (dimensions.ratio <= parentDimensions.ratio) {
          // Full width
          style.width = "100%";//makeUnit(parentDimensions.width.value, parentDimensions.width.unit);
          style.height = makeUnit((parentDimensions.width.value / dimensions.ratio), parentDimensions.width.unit);
        } else {
          // Full height
          style.height = "100%";//makeUnit(parentDimensions.height.value, parentDimensions.height.unit);
          style.width = makeUnit((parentDimensions.height.value * dimensions.ratio), parentDimensions.height.unit);
        }
        break;
      case "retain":
        var height = clamp(0, parentDimensions.height.value, el.videoHeight || el.originalHeight || el.height);
        var width = clamp(0, parentDimensions.width.value, el.videoWidth || el.originalWidth || el.width);
        if (dimensions.ratio <= parentDimensions.ratio) {
          // Full height
          style.height = "100%";//makeUnit(height, parentDimensions.height.unit);
          style.width = makeUnit((height * dimensions.ratio), parentDimensions.height.unit);
        } else {
          // Full width
          style.width = "100%";//makeUnit(width, parentDimensions.width.unit);
          style.height = makeUnit((width / dimensions.ratio), parentDimensions.width.unit);
        }
        break;
      case "fill":
        // Full height and width
        style.height = "100%";//makeUnit(parentDimensions.height.value, parentDimensions.height.unit);
        style.width = "100%";//makeUnit(parentDimensions.width.value, parentDimensions.width.unit);
        break;
      case "none":
        style.height = "";
        style.width = "";
        break;
      default:
        // Apply specific units unless auto
        if (dimensions.width.unit !== "auto") {
          style.width = makeUnit(dimensions.width.value, dimensions.width.unit);
        }
        if (dimensions.height.unit !== "auto") {
          style.height = makeUnit(dimensions.height.value, dimensions.height.unit);
        }
        // Calculate auto after applying united values
        if (dimensions.width.unit === "auto") {
          style.width = makeUnit((parentDimensions.height.value * dimensions.ratio), "px");
        }
        if (dimensions.height.unit === "auto") {
          style.height = makeUnit((parentDimensions.width.value / dimensions.ratio), "px");
        }
        break;
    }

    var isAbsolute = false;
    var isTranslate = false;
    var translate = ["0","0"];
    var size = ["","","",""];

    switch (dimensions.x.keyword) {
      case "center":
        isAbsolute = true;
        isTranslate = true;
        size[3] = "50%";
        translate[0] = "-50%";
        break;
      case "left":
        isAbsolute = true;
        size[3] = dimensions.x.value
        break;
      case "right":
        isAbsolute = true;
        size[1] = dimensions.x.value
        break;
    }

    switch (dimensions.y.keyword) {
      case "center":
        isAbsolute = true;
        isTranslate = true;
        size[0] = "50%";
        translate[1] = "-50%";
        break;
      case "top":
        isAbsolute = true;
        size[0] = dimensions.y.value
        break;
      case "bottom":
        isAbsolute = true;
        size[2] = dimensions.y.value
        break;
    }

    if (isAbsolute) {
      style.position = "absolute";
    } else {
      style.position = "";
    }

    if (isTranslate) {
      style.transform = "translate("+translate.join(",")+")";
    } else {
      style.transform = "";
    }

    style.top = size[0];
    style.right = size[1];
    style.bottom = size[2];
    style.left = size[3];

    // Perform this immediately as subsequent styles rely on these values.
    for (var name in style) {
      el.style[name] = style[name];
    }

  },

  getUIDimensions: function() {
    var options = this.ui.options;
    return {
      fullscreen: new Media.Class.Dimensions(options.uifullscreensize, options.uifullscreenratio, options.uifullscreenposition),
      normal: new Media.Class.Dimensions(options.uisize, options.uiratio, options.uiposition)
    };
  },

  destroy: function() {
    MediaUI.Output.prototype.destroy.apply(this, arguments);
    this.ui = null;
    this.el = null;
  }

});

Media.DefaultOptions.add({
  uisize: function() {
    return this.mediasize;
  },
  uiratio: function() {
    return this.mediaratio;
  },
  uiposition: "none none",
  uifullscreensize: function() {
    return this.uisize;
  },
  uifullscreenratio: function() {
    return this.uiratio;
  },
  uifullscreenposition: function() {
    return this.uiposition
  }
});
