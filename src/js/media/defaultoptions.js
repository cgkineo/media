Media.DefaultOptions = Class.extend({

  constructor: function DefaultOptions(options) {
    this.add(options);
  },

  add$write: function(options) {
    extend(this, options);
  },

  get$write: function(name) {
    return this[name];
  },

  toJSON$write: function() {
    var options = {};
    for (var name in this) {
      options[name] = this[name];
    }
    return options;
  }

}, {

  add$write$enum: function(options) {
    var create = function(name, value) {
      Object.defineProperty(this.prototype, name, {
        enumerable: true,
        get: function() {
          if (typeof this["_"+name] === "function") {
            return this["_"+name]();
          }
          return this["_"+name];
        },
        set: function(value) {
          if (!this.hasOwnProperty("_"+name)) {
            Object.defineProperty(this, "_"+name, {
              enumerable: false,
              writable: true,
              value: null
            });
          }
          this["_"+name] = value;
        }
      });
      this.prototype[name] = value;
    }.bind(this);
    for (var name in options) {
      create(name, options[name]);
    }
  },

  get$write$enum: function(name) {
    return this.prototype[name];
  },

  toJSON$write$enum: function() {
    var options = {};
    for (var name in this.prototype) {
      options[name] = this.prototype[name];
    }
    return options;
  }

}, {
  inheritClassEnumerables: true
});

Media.DefaultOptions.add({
  id: "",
  media: null
});
