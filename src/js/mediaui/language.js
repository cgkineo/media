MediaUI.defineProperties({

  Language$write: Class.extend({

    constructor: function Language(langCode, hash) {
      this.defineProperties({
        _isLoaded$write: false,
        _hash$write: null
      });
      this.langCode = langCode;
      this.hash = hash;
    },

    isLoaded$get$enum: function() {
      return this._isLoaded;
    },

    hash$set$enum: function(value) {
      if (!value) return;
      this._hash = value;
      this._isLoaded = true;
      MediaUI.languages.trigger("language:"+this.langCode, this);
    },

    hash$get$enum: function() {
      return this._hash;
    }

  })

});
