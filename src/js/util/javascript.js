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

var getUrl = function(url, callback, context) {
  var req = new XMLHttpRequest();
  req.addEventListener("load", function(event) {
    callback.call(context, event.target.responseText);
  });
  req.open("GET", url);
  req.send();
};


var postUrl = function(url, data, callback, context) {
  var req = new XMLHttpRequest();
  req.addEventListener("load", function(event) {
    callback.call(context, event.target.responseText);
  });
  req.open("POST", url);
  req.send(data);
};
