var delay = function(callback, time) {
  setTimeout(callback, time);
};

var debounce = function(callback, time) {
  var handle = null;
  return function() {
    var args = arguments;
    clearTimeout(handle);
    handle = setTimeout(function() {
      callback.apply(this, args);
    }.bind(this), time || 0);
  }
};
