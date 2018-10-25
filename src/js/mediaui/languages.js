MediaUI.defineProperties({
  Languages: List.extend({

    constructor: function Languages() {
      this.load("en");
    },

    load$enum$write: function(langCode, callback) {
      var language = this.search(langCode);
      this.once("language:"+langCode, function(language) {
        callback && callback(language);
      });
      if (!language) {
        language = this.add({
          langCode: langCode
        });
        getUrl("./lang/"+langCode+".json", function(data) {
          language.hash = JSON.parse(data);
        }.bind(this), function() {
          throw "Could not find media player language `"+langCode+"`";
        }.bind(this));
        return;
      }
      if (!language.isLoaded) return;
      MediaUI.languages.trigger("language:"+langCode, language);
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
        if (language.langCode !== langCode) return;
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
  uilang: "en"
});
