MediaUI.Output.Resize = MediaUI.Output.extend({

  ui: null,
  $els: null,
  $elsinner: null,
  initial: true,

  constructor: function ResizeComponent(ui) {
    MediaUI.Output.apply(this, arguments);
    this.$els = ui.$all().filterByAttribute(ui.options.outputattribute, "resize");
    this.$elsinners = ui.$all().filterByAttribute(ui.options.outputattribute, "resizeinner");
    if (!this.$els.length) return;
    this.ui = ui;
    this.listenTo(this.ui.media, {
      "resize": this.onResize
    });
  },

  onOptionsChange: function(name, value, oldValue) {
    switch (name) {
      case "mediasize":
      case "mediaposition":
      case "mediaratio":
      case "mediafullscreensize":
      case "mediafullscreenposition":
      case "mediafullscreenratio":
      case "uisize":
      case "uiposition":
      case "uiratio":
      case "uifullscreensize":
      case "uifullscreenposition":
      case "uifullscreenratio":
        this.onResize(Media.resize.getDimensions(this.ui.media));
        break;
    }
  },

  onResize$bind: function(event) {
    var uiDimensions = this.getUIDimensions();
    var uiOffsetParent = this.ui.fullscreen.isActive ? window : this.ui.el.offsetParent || window;
    var uiParentDimensions = new Media.Class.Dimensions(uiOffsetParent);
    var uiConfig = uiDimensions[this.ui.fullscreen.isActive ? 'fullscreen' : 'normal'];

    // UI config exceptions
    var isUIAutoAuto = uiConfig.height.unit === "auto" && uiConfig.width.unit === "auto";
    if (isUIAutoAuto) {
      uiConfig.height.value = "contain";
      uiConfig.height.unit = "contain";
      uiConfig.width.value = "contain";
      uiConfig.width.unit = "contain";
    }
    var isUICover = uiConfig.height.value === "cover";
    if (isUICover) {
      uiConfig.height.value = "fill";
      uiConfig.height.unit = "fill";
      uiConfig.width.value = "fill";
      uiConfig.width.unit = "fill";
    }

    this.$els.forEach(function(el) {
      var uiStyle = this.getStyles(el, this.ui.source, uiParentDimensions, uiConfig);
      for (var k in uiStyle) {
        if (!this.initial) {
          rafer.set(el.style, k, uiStyle[k]);
        } else {
          el.style[k] = uiStyle[k];
        }
      }
    }.bind(this));

    var isUISourceParent = Boolean(elements(this.ui.source).path().find(function(item) {
      return item === this.ui.el;
    }.bind(this)));
    var sourceOffsetParent = isUISourceParent ? this.ui.el.offsetParent : this.ui.source.offsetParent;
    var sourceParentDimensions =  new Media.Class.Dimensions(this.ui.fullscreen.isActive ? window : sourceOffsetParent || window);
    var sourceConfig = event[this.ui.fullscreen.isActive ? 'fullscreen' : 'normal'];

    // Source config exceptions
    var usePxValues = false;
    if (isUISourceParent) {
      switch (uiConfig.height.value) {
        case "contain":
          var isSourceFillOrCover = sourceConfig.height.value === "fill" || sourceConfig.height.value === "cover";
          var isSourceAutoAuto = sourceConfig.height.unit === "auto" && sourceConfig.width.unit === "auto";
          if (isSourceFillOrCover || isSourceAutoAuto) {
            sourceConfig.height.value = "contain";
            sourceConfig.height.unit = "contain";
            sourceConfig.width.value = "contain";
            sourceConfig.width.unit = "contain";
          }
          break;
        case "fill":
          var isSourceAutoAuto = sourceConfig.height.unit === "auto" && sourceConfig.width.unit === "auto";
          if (isSourceAutoAuto) {
            sourceConfig.height.value = "cover";
            sourceConfig.height.unit = "cover";
            sourceConfig.width.value = "cover";
            sourceConfig.width.unit = "cover";
          }
          break;
        case "retain":
          sourceConfig.height.value = "retain";
          sourceConfig.height.unit = "retain";
          sourceConfig.width.value = "retain";
          sourceConfig.width.unit = "retain";
          break;
      }
    }

    this.$elsinners.forEach(function(el) {
      var sourceStyle = this.getStyles(el, this.ui.source, sourceParentDimensions, sourceConfig, {
        usePxValues: usePxValues,
        transform: Media.device.isIE11 ? "scale(1.02)" : ""
      });
      for (var k in sourceStyle) {
        if (!this.initial) {
          rafer.set(el.style, k, sourceStyle[k]);
        } else {
          el.style[k] = sourceStyle[k];
        }
      }
    }.bind(this));

    this.initial = false;

  },

  getStyles: function(el, source, parentDimensions, dimensions, options) {
    options = options || {};
    options.transform = options.transform || "";

    var style = {};
    style['object-fit'] = "fill";

    switch (dimensions.width.unit) {
      case "contain":
        if (dimensions.ratio <= parentDimensions.ratio) {
          // Full height
          style.height = options.usePxValues ? makeUnit(parentDimensions.height.value, parentDimensions.height.unit) : "100%";;
          style.width = makeUnit((parentDimensions.height.value * dimensions.ratio), parentDimensions.height.unit);
        } else {
          // Full width
          style.width = options.usePxValues ? makeUnit(parentDimensions.width.value, parentDimensions.width.unit) : "100%";
          style.height = makeUnit((parentDimensions.width.value / dimensions.ratio), parentDimensions.width.unit);
        }
        break;
      case "cover":
        if (dimensions.ratio <= parentDimensions.ratio) {
          // Full width
          style.width = options.usePxValues ? makeUnit(parentDimensions.width.value, parentDimensions.width.unit) : "100%";
          style.height = makeUnit((parentDimensions.width.value / dimensions.ratio), parentDimensions.width.unit);
        } else {
          // Full height
          style.height = options.usePxValues ? makeUnit(parentDimensions.height.value, parentDimensions.height.unit) : "100%";
          style.width = makeUnit((parentDimensions.height.value * dimensions.ratio), parentDimensions.height.unit);
        }
        break;
      case "retain":
        var height = clamp(0, parentDimensions.height.value, this.ui.size.height(source));
        var width = clamp(0, parentDimensions.width.value, this.ui.size.width(source));
        if (dimensions.ratio <= parentDimensions.ratio) {
          // Full height
          style.height = makeUnit(height, parentDimensions.height.unit);
          style.width = makeUnit((height * dimensions.ratio), parentDimensions.height.unit);
        } else {
          // Full width
          style.width = makeUnit(width, parentDimensions.width.unit);
          style.height = makeUnit((width / dimensions.ratio), parentDimensions.width.unit);
        }
        break;
      case "fill":
        // Full height and width
        style.width = options.usePxValues ? makeUnit(parentDimensions.width.value, parentDimensions.width.unit) : "100%";;
        style.height = options.usePxValues ? makeUnit(parentDimensions.height.value, parentDimensions.height.unit) : "100%";;
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

    var transform = [options.transform];
    if (isTranslate) {
      transform.unshift("translate("+translate.join(",")+")");
    }

    if (transform.length) {
      style.transform = transform.join(" ");
    } else {
      style.transform = "";
    }

    style.top = size[0];
    style.right = size[1];
    style.bottom = size[2];
    style.left = size[3];

    return style;

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
    return this.uiposition;
  }
});
