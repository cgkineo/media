MediaUI.defineProperties({
  Layouts: List.extend({

    constructor: function Layouts() {},

    load$enum$write: function(options, callback) {
      options = options || {};
      options.uilayoutname = options.uilayoutname || "default";
      options.uilayoutpath = options.uilayoutpath || "./layout/";
      options.uilayoutextension = options.uilayoutextension || ".html";
      var layout = this.search(options.uilayoutname);
      this.once("layout:"+options.uilayoutname, function(layout) {
        callback && callback(layout);
      });
      if (!layout) {
        layout = this.add({
          langCode: options.uilayoutname
        });
        getUrl(options.uilayoutpath+options.uilayoutname+options.uilayoutextension, function(data) {
          layout.template = data;
        }.bind(this), function() {
          throw "Could not find media player layout `"+options.uilayoutname+"`";
        }.bind(this));
        return;
      }
      if (!layout.isLoaded) return;
      MediaUI.layouts.trigger("layout:"+options.uilayoutname, layout);
    },

    add$enum$write: function(options, template) {
      var layout = new MediaUI.Layout(options, template);
      this.push(layout);
      return layout;
    },

    search$enum$write: function(langCode) {
      var found;
      for (var i = 0, l = this.length; i < l; i++) {
        var layout = this[i];
        if (layout.langCode !== langCode) continue;
        found = layout;
        break;
      }
      return found || null;
    }

  }, null, {
    instanceEvents: true
  })
});

MediaUI.defineProperties({
  layouts$enum$write: new MediaUI.Layouts()
});

Media.DefaultOptions.add({
  uilayout: null,
  uilayoutpath: "./layout/",
  uilayoutname: "default",
  uilayoutextension: ".html"
});
