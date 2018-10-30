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
        layout = this.add(options.uilayoutname);
        getUrl(options.uilayoutpath+options.uilayoutname+options.uilayoutstyleextension, function(data) {
          var style = document.createElement("style");
          var cssText = document.createTextNode(data)
          style.appendChild(cssText);
          elements("head").append(style);
        }.bind(this), function() {
          throw "Could not find media player layout `"+options.uilayoutname+"`";
        }.bind(this));
        getUrl(options.uilayoutpath+options.uilayoutname+options.uilayouttemplateextension, function(data) {
          layout.template = function(options) {
            return replace(data, options);
          };
        }.bind(this), function() {
          throw "Could not find media player layout `"+options.uilayoutname+"`";
        }.bind(this));
        return;
      }
      if (!layout.isLoaded) return;
      MediaUI.layouts.trigger("layout:"+options.uilayoutname, layout);
    },

    add$enum$write: function(name, template) {
      var layout = new MediaUI.Layout(name, template);
      this.push(layout);
      return layout;
    },

    search$enum$write: function(layoutName) {
      var found;
      for (var i = 0, l = this.length; i < l; i++) {
        var layout = this[i];
        if (layout.layoutName !== layoutName) continue;
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
  uilayouttemplateextension: ".html",
  uilayoutstyleextension: ".css"
});
