MediaUI.defineProperties({

  Language$write: Class.extend({

    constructor: function Language(options) {
      defaults(this, options);
      this.defineProperties({
        _isLoaded$write: false,
        _hash$write: null
      });
    },

    isLoaded$get$enum: function() {
      return this._isLoaded;
    },

    hash$set$enum: function(value) {
      this._hash = value;
      this._isLoaded = true;
      MediaUI.languages.trigger("language:"+this.langCode, this);
    },

    hash$get$enum: function() {
      return this._hash;
    }

  })

});
