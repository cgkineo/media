Media.Class.Dimensions =Media.Class.extend({

  _size$write: "contain",
  _aspect$write: "16/9",
  _position$write: "top left",

  width: parseUnit(0, "px"),
  height: parseUnit(0, "px"),
  ratio: 16/9,
  x: parseUnit(0, "px"),
  y: parseUnit(0, "px"),

  constructor: function Dimensions(size, aspect, position) {
    if (size instanceof HTMLElement) {
      var element = size;
      var rect = element.getBoundingClientRect();
      this.width = parseUnit(rect.width, "px");
      this.height = parseUnit(rect.height, "px");
      this.ratio = rect.width / rect.height;
      return;
    } else if (size === window) {
      this.width = parseUnit(window.innerWidth, "px");
      this.height = parseUnit(window.innerHeight, "px");
      this.ratio = this.width.value / this.height.value;
      return;
    }
    this.size = size === undefined ? this._size : size;
    this.aspect = aspect === undefined ? this._aspect : aspect;
    this.position = position === undefined ? this._position : position;
  },

  size$set$snum: function(size) {
    this._size = size;
    size = size.trim();
    var sizeParts = size.split(" ");
    var sizeWidth = parseUnit(sizeParts[0] || "none");
    var sizeHeight = parseUnit(sizeParts[1] || "none");
    switch (sizeHeight.unit) {
      case "auto":
      case "none":
        sizeHeight.value = sizeHeight.unit;
        break;
      case "contain":
      case "cover":
      case "fill":
      case "retain":
        sizeWidth.value = sizeHeight.value = sizeHeight.unit = sizeWidth.unit;
        break;
    }
    switch (sizeWidth.unit) {
      case "auto":
      case "none":
        sizeWidth.value = sizeWidth.unit;
        break;
      case "contain":
      case "cover":
      case "fill":
      case "retain":
        sizeWidth.value = sizeHeight.value = sizeHeight.unit = sizeWidth.unit;
        break;
    }
    this.width = sizeWidth;
    this.height = sizeHeight;
  },

  size$get$enum: function() {
    return this._size;
  },

  aspect$set$enum: function(aspect) {
    this._aspect = aspect;
    aspect = aspect.trim();
    aspect = aspect.replace(/\:/g, " ");
    aspect = aspect.replace(/\//g, " ");
    aspect = aspect.replace(/\*/g, "");
    var aspectParts = aspect.split(" ");
    var aspectWidth = parseUnit(aspectParts[0] || "none");
    var aspectheight = parseUnit(aspectParts[1] || "none");
    this.ratio = aspectWidth.value / aspectheight.value;
  },

  aspect$get$enum: function() {
    return this._aspect;
  },

  position$set$enum: function(position) {
    var output = new Array(4);
    position = position.trim();
    var positionParts = position.split(" ");
    // based upon https://developer.mozilla.org/en-US/docs/Web/CSS/position_value
    switch (positionParts.length) {
      case 1:
        switch (positionParts[0]) {
          case "center":
          case "none":
            output[0] = positionParts[0];
            output[1] = 0;
            output[2] = positionParts[0];
            output[3] = 0;
            break;
          case "left":
          case "top":
          case "bottom":
            output[0] = positionParts[0];
            output[1] = 0;
            output[2] = "none";
            output[3] = 0;
            break;
          default:
            output[0] = "left";
            output[1] = positionParts[0];
            output[2] = "top";
            output[3] = "50%";
            break;
        }
        break;
      case 2:
        switch (positionParts[0]) {
          case "left":
          case "top":
          case "bottom":
          case "center":
          case "none":
            output[0] = positionParts[0];
            output[1] = 0;
            break;
          default:
            output[0] = "auto";
            output[1] = positionParts[0];
        }
        switch (positionParts[1]) {
          case "left":
          case "top":
          case "bottom":
          case "center":
          case "none":
            output[2] = positionParts[0];
            output[3] = 0;
            break;
          default:
            output[2] = "auto";
            output[3] = positionParts[0];
        }
        break;
      case 3:
        throw "Unable to process a 3 part position '"+position+"'";
      case 4:
        output = positionParts;
        break;
    }

    // set first keyword if auto
    switch (output[0]) {
      case "auto":
        switch (output[2]) {
          case "auto":
          case "top":
          case "bottom":
            output[0] = "left";
            break;
          case "left":
          case "right":
            output[0] = "top";
            break;
        }
        break;
    }

    // set second keyword if auto
    switch (output[2]) {
      case "auto":
        switch (output[0]) {
          case "auto":
          case "top":
          case "bottom":
            output[2] = "left";
            break;
          case "left":
          case "right":
            output[2] = "top";
            break;
        }
        break;
    }

    // swap x & y if need be
    switch (output[2]) {
      case "left":
      case "right":
        var t1 = output[0];
        var t2 = output[1];
        output[0] = output[2];
        output[1] = output[3];
        output[2] = t1;
        output[3] = t2;
        break;
    }

    this.x = {
      keyword: output[0],
      value: output[1]
    };
    this.y = {
      keyword: output[2],
      value: output[3]
    };

  },

  position$get$enum: function() {
    return this._position;
  }

});
