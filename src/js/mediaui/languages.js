MediaUI.defineProperties({
  Languages: List.extend({

    constructor: function Languages() {},

    load$enum$write: function(options, callback) {
      options = options || {};
      options.uilangcode = options.uilangcode || "en";
      options.uilangpath = options.uilangpath || "./lang/";
      options.uilangextension = options.uilangextension || ".txt";
      var language = this.search(options.uilangcode);
      this.once("language:"+options.uilangcode, function(language) {
        callback && callback(language);
      });
      if (!language) {
        language = this.add({
          langCode: options.uilangcode
        });
        getUrl(options.uilangpath+options.uilangcode+options.uilangextension, function(data) {
          language.hash = JSON.parse(data);
        }.bind(this), function() {
          throw "Could not find media player language `"+options.uilangcode+"`";
        }.bind(this));
        return;
      }
      if (!language.isLoaded) return;
      MediaUI.languages.trigger("language:"+options.uilangcode, language);
    },

    add$enum$write: function(options, hash) {
      var language = new MediaUI.Language(options, hash);
      this.push(language);
      return language;
    },

    search$enum$write: function(langCode) {
      var found;
      for (var i = 0, l = this.length; i < l; i++) {
        var language = this[i];
        if (language.langCode !== langCode) continue;
        found = language;
        break;
      }
      return found || null;
    }

  }, null, {
    instanceEvents: true
  })
});

MediaUI.defineProperties({
  languages$enum$write: new MediaUI.Languages()
});

Media.DefaultOptions.add({
  uilangcode: "en",
  uilangpath: "./lang/",
  uilangextension: ".txt"
});
