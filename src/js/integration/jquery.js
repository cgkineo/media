if ($ && $.fn) {
  // jQuery API
  //
  var Media = (typeof exports === "undefined" ? window : exports).Media
  var MediaUI = (typeof exports === "undefined" ? window : exports).MediaUI;

  Media.JQueryDefaultOptions = Media.DefaultOptions.extend({
    constructor: function JQueryDefaultOptions() {
      Media.DefaultOptions.apply(this, arguments);
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
      if (item[Media.propName]) {
        item[Media.propName].options.add(options);
        return;
      }
      var mediaOptions = new Media.JQueryDefaultOptions(options);
      var media = new Media(item, mediaOptions);
      if (MediaUI) {
        new MediaUI(media, mediaOptions);
      }
    });
    return $medias;

  };

  $.fn.play = function() {
    var $medias = this.find(Media.supportedTags);
    $medias = $medias.add(this.filter(Media.supportedTags));
    $medias.each(function(index, item) {
      if (!item.paused) return;
      var promise = item.play && item.play();
      if (!promise) return;
      promise.then(function() {

      }, function(error) {
        console.log(error);
      });
    });
  };

  $.fn.rewind = function() {
    var $medias = this.find(Media.supportedTags);
    $medias = $medias.add(this.filter(Media.supportedTags));
    $medias.each(function(index, item) {
      try {
        item.currentTime = 0;
      } catch (error) {}
      if (!item.paused) return;
      item.play && item.play();
    });
  };

  $.fn.pause = function() {
    var $medias = this.find(Media.supportedTags);
    $medias = $medias.add(this.filter(Media.supportedTags));
    $medias.each(function(index, item) {
      if (item.paused) return;
      item.pause && item.pause();
    });
  };

  $.fn.mute = function(bool) {
    var $medias = this.find(Media.supportedTags);
    $medias = $medias.add(this.filter(Media.supportedTags));
    $medias.each(function(index, item) {
      if (item.muted === bool) return;
      item.muted = bool;
    });
  };

}
