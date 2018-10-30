MediaUI.defineProperties({

  Layout$write: Class.extend({

    constructor: function Layout(name, template) {
      this.defineProperties({
        _isLoaded$write: false,
        _template$write: null
      });
      this.layoutName = name;
      this.template = template;

    },

    isLoaded$get$enum: function() {
      return this._isLoaded;
    },

    template$set$enum: function(value) {
      if (!value) return;
      this._template = value;
      this._isLoaded = true;
      MediaUI.layouts.trigger("layout:"+this.layoutName, this);
    },

    template$get$enum: function() {
      return this._template;
    }

  })

});
