if ($ && $.fn) {
  // jQuery API
  //
  var Media = (typeof exports === "undefined" ? window : exports).Media
  var MediaUI = (typeof exports === "undefined" ? window : exports).MediaUI;

  Media.JQueryDefaultOptions = Media.DefaultOptions.extend({
    constructor: function JQueryDefaultOptions() {
      Media.DefaultOptions.prototype.constructor.apply(this, arguments);
    }
  });
  Media.JQueryDefaultOptions.add({
    uienabled: true,
    uireplace: true
  });

  $.fn.medias = function(options) {

    // Get all media tags selected and make Media instances for them
    var $medias = this.find(Media.supportedTags);
    $medias = $medias.add(this.filter(Media.supportedTags));

    switch (options) {
      case "destroy":
        // Tear down all media class + dom associations
        $medias.each(function(index, item) {
          if (!(item[Media.propName] instanceof Media)) return;
          item[Media.propName].destroy();
        });
        return $medias;
    }

    $medias.each(function(index, item) {
      if (item[Media._prop]) return;
      options = new Media.JQueryDefaultOptions(options);
      var media = new Media(item, options);
      if (MediaUI) {
        new MediaUI(media, options);
      }
    });
    return $medias;

  };

  $.fn.play = function() {
    var $medias = this.find(Media.supportedTags);
    $medias = $medias.add(Media.supportedTags);
    $medias.each(function(index, item) {
      item.play && item.play();
    });
  };

  $.fn.pause = function() {
    var $medias = this.find(Media.supportedTags);
    $medias = $medias.add(this.filter(Media.supportedTags));
    $medias.each(function(index, item) {
      item.pause && item.pause();
    });
  };

}
