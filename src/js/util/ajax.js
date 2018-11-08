var getURL = function(url, callback, context) {
  var req = new XMLHttpRequest();
  req.addEventListener("load", function(event) {
    callback.call(context, event.target.responseText);
  });
  req.open("GET", url);
  req.send();
};
