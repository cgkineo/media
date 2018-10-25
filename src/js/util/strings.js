var indexOfRegex = function(value, regex, fromIndex){
  fromIndex = fromIndex || 0;
  var str = fromIndex ? value.substring(fromIndex) : value;
  var match = str.match(regex);
  return match ? str.indexOf(match[0]) + fromIndex : -1;
};

var lastIndexOfRegex = function(value, regex, fromIndex){
  fromIndex = fromIndex || 0;
  var str = fromIndex ? value.substring(0, fromIndex) : value;
  var match = str.match(regex);
  return match ? str.lastIndexOf(match[match.length-1]) : -1;
};

var includes = function(value, search, start) {
  if (typeof start !== 'number') start = 0;
  if (typeof value === "string" && start + search.length > value.length) return false;
  return value.indexOf(search, start) !== -1;
};

var replace = function(string, attributes, options) {
  var options = options || { clean: true };
  replace.cache = replace.cache || {};
  for (var k in attributes) {
    var regexStr = "\\$\\{"+k+"\\}";
    var regex = replace.cache[regexStr] = replace.cache[regexStr] ||
      new RegExp("\\$\\{"+k+"\\}", "gi");
    string = string.replace(regex, attributes[k]);
  }
  if (options.clean) {
    string = string.replace(/\$\{[^\}]+\}/g, "");
  }
  return string;
};

var template = function(string, options) {
  var regexStr = /\$\{[^\^\$}]*\}/;
  var pieces = [];
  while (string.match(regexStr)) {
    while (string && (match = string.match(regexStr))) {
      var start = match.index;
      pieces.push(string.slice(0, start));
      var end = match.index+match[0].length;
      var evaluate = string.slice(start+2, end-1);
      pieces.push(eval(evaluate))
      string = string.slice(end);
    }
    pieces.push(string);
    string = pieces.join("");
    pieces.length = 0;
  }
  return string;
};
