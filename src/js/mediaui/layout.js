MediaUI.defineProperties({

  Layout$write: Class.extend({

    constructor: function Layout(options) {
      defaults(this, options);
      this.defineProperties({
        _isLoaded$write: false,
        _template$write: null
      });
    },

    isLoaded$get$enum: function() {
      return this._isLoaded;
    },

    template$set$enum: function(value) {
      this._template = value;
      this._isLoaded = true;
      MediaUI.layouts.trigger("layout:"+this.langCode, this);
    },

    template$get$enum: function() {
      return this._template;
    }

  })

});
