(function() {

  if (window.fullscreenPolyfill) return;

  var debug = false;

  var isObject = function(obj) {
    return Object.prototype.toString.call(obj) == '[object Object]';
  };

  var extend = function(obj) {
    for (var i = 1, l = arguments.length; i < l; i++) {
      var arg = arguments[i];
      for (var k in arg) {
        obj[k] = arg[k];
      }
    }
    return obj;
  };

  var deepDefaults = function(subject) {
    subject = subject || {};
    for (var i = 1, l = arguments.length; i < l; i++) {
      var arg = arguments[i];
      for (var k in arg) {
        if (!subject.hasOwnProperty(k)) subject[k] = arg[k];
        if (!isObject(subject[k])) continue;
        subject[k] = deepDefaults(subject[k], arg[k]);
      }
    }
    return subject;
  };

  var toArray = function(args, start) {
    if (!args) return [];
    return Array.prototype.slice.call(args, start || 0);
  };

  var includes = function(value, search, start) {
    if (typeof start !== 'number') start = 0;
    if (typeof value === "string" && start + search.length > value.length) return false;
    return value.indexOf(search, start) !== -1;
  };

  var createEvent = function(name) {
    if (!createEvent._ie11) {
      try {
        var event = new Event(name);
        return event;
      } catch (e) {
        createEvent._ie11 = true;
      }
    }
    if (!createEvent._ie11) return;
    var event = document.createEvent('Event');
    event.initEvent(name, true, true);
    return event;
  };

  var toggleClass = function(element, classNames, bool) {
    switch (typeof classNames) {
      case "string":
        classNames = classNames.split(" ");
        break;
    }
    bool = (bool === undefined) ? true : bool;
    var classList = element.classList;
    for (var n = 0, nl = classNames.length; n < nl; n++) {
      var nameItem = classNames[n];
      var api = false;
      for (var i = 0, l = classList.length; i < l; i++) {
        var classItem = classList[i];
        if (classItem !== nameItem) continue;
        api = true;
      }
      if (!api && bool) classList.add(nameItem);
      else if (api && !bool) classList.remove(nameItem);
    }
  };

  var removeElement = function(element) {
    if (element.remove) return element.remove();
    element.parentNode.removeChild(element);
  };

  var api = {
    fullscreenElement: null,
    exitFullscreen: null,
    requestFullscreen: null,
    fullscreenEnabled: null,
    onfullscreenchange: null,
    onfullscreenerror: null
  };

  var alternativeNames = {
    fullscreenElement: [
      "webkitFullscreenElement",
      "mozFullScreenElement",
      "msFullscreenElement"
    ],
    exitFullscreen: [
      "webkitExitFullscreen",
      "mozCancelFullScreen",
      "msExitFullscreen"
    ],
    requestFullscreen: [
      "webkitRequestFullscreen",
      "mozRequestFullScreen",
      "msRequestFullscreen"
    ],
    fullscreenEnabled: [
      "webkitFullscreenEnabled",
      "mozFullScreenEnabled",
      "msFullscreenEnabled"
    ],
    onfullscreenchange: [
      "onwebkitfullscreenchange",
      "onmozfullscreenchange",
      "onmsfullscreenchange"
    ],
    onfullscreenerror: [
      "onwebkitfullscreenerror",
      "onmozfullscreenerror",
      "onmsfullscreenerror"
    ],
    fullscreenchange: [
      "webkitfullscreenchange",
      "mozfullscreenchange",
      "msfullscreenchange"
    ],
    fullscreenerror: [
      "webkitfullscreenerror",
      "mozfullscreenerror",
      "msfullscreenerror"
    ]
  };

  var proxiedEventListeners = false;
  function proxyEventListener() {
    if (proxiedEventListeners) return;
    proxiedEventListeners = true;
    var redirectFullScreenChange = function (event) {
      event = deepDefaults(createEvent('fullscreenchange'), event);
      document.dispatchEvent(event);
    };
    var redirectFullScreenError = function (event) {
      event = deepDefaults(createEvent('fullscreenerror'), event);
      document.dispatchEvent(event);
    };
    for (var i = 0, l = alternativeNames.onfullscreenchange.length; i < l; i++) {
      if (document[alternativeNames.onfullscreenchange[i]] === undefined) continue;
      document[alternativeNames.onfullscreenchange[i]] = redirectFullScreenChange;
    }
    for (var i = 0, l = alternativeNames.onfullscreenerror.length; i < l; i++) {
      if (document[alternativeNames.onfullscreenerror[i]] === undefined) continue;
      document[alternativeNames.onfullscreenerror[i]] = redirectFullScreenError;
    }
  }

  var isAllSame = true;
  var isAllFound = true;

  var check = function(el, apiName, callback) {
    if (el[apiName] !== undefined) {
      api[apiName] = apiName;
      return;
    }
    for (var i = 0, l = alternativeNames[apiName].length; i < l; i++) {
      var knownAlternative = alternativeNames[apiName][i];
      if (el[knownAlternative] === undefined) continue;
      isAllSame = false;
      api[apiName] = knownAlternative;
      return;
    }
    isAllSame = false;
    isAllFound = false;
    api[apiName] = null;
  };

  var useFullWindow = false;
  var fullWindowElement = null;
  var addToElements = [];
  var removeFromElements = [];
  var requestByFullscreen = false;

  var applied = {
    fullscreenElement: false,
    fullscreenEnabled: false,
    exitFullscreen: false,
    requestFullscreen: false,
    onfullscreenchange: false,
    onfullscreenerror: false
  };

  function fixFullScreenElement() {
    if (applied.fullscreenElement) return;
    applied.fullscreenElement = true;
    var fullscreenElement = Object.getOwnPropertyDescriptor(Document.prototype, "fullscreenElement") || {
      get: function() {
        return document[api["fullscreenElement"]];
      },
      set: function(value) {
        document[api["fullscreenElement"]] = value;
      }
    };
    Object.defineProperty(document, "fullscreenElement", {
      get: function() {
        if (useFullWindow) {
          debug && console.log("get fullscreenElement", fullWindowElement);
          return fullWindowElement;
        }
        debug && console.log("get fullscreenElement", document[api["fullscreenElement"]]);
        return fullscreenElement.get.apply(document);
      },
      set: function(value) {
        return fullscreenElement.set.apply(document, value);
      }
    });
  }

  function fixFullScreenEnabled() {
    if (applied.fullscreenEnabled) return;
    applied.fullscreenEnabled = true;
    var fullscreenEnabled = Object.getOwnPropertyDescriptor(Document.prototype, "fullscreenEnabled") || {
      get: function() {
        return document[api["fullscreenEnabled"]];
      }
    };
    Object.defineProperty(document, "fullscreenEnabled", {
      get: function() {
        if (useFullWindow) {
          debug && console.log("get fullscreenEnabled", true);
          return true;
        }
        debug && console.log("get fullscreenEnabled", document[api["fullscreenEnabled"]]);
        return fullscreenEnabled.get.apply(document);
      }
    });
  }

  function fixExitFullScreen() {
    if (applied.exitFullscreen) return;
    applied.exitFullscreen = true;
    var exitFullscreen = document[api.exitFullscreen];
    document.exitFullscreen = function() {
      debug && console.log("exitFullscreen");
      if (useFullWindow) {
        fullWindowElement = null;
        document.dispatchEvent(createEvent("fullscreenchange"));
        return;
      }
      return exitFullscreen.apply(document, arguments);
    }
  }

  function fixRequestFullScreen() {
    if (applied.requestFullscreen) return;
    applied.requestFullscreen = true;
    var requestFullscreen = Element.prototype[api.requestFullscreen];
    Element.prototype.requestFullscreen = function() {
      requestByFullscreen = true;
      debug && console.log("requestFullscreen", this);
      if (useFullWindow) {
        fullWindowElement = this;
        document.dispatchEvent(createEvent("fullscreenchange"));
        return;
      }
      return requestFullscreen.apply(this, arguments);
    };
  }

  function fixOnFullScreenChange() {
    if (api.onfullscreenchange === "onfullscreenchange") return;
    if (applied.onfullscreenchange) return;
    applied.onfullscreenchange = true;
    Object.defineProperty(document, "onfullscreenchange", {
      get: function() {
        debug && console.log("get onfullscreenchange", document[api["onfullscreenchange"]]);
        return document[api["onfullscreenchange"]];
      },
      set: function(value) {
        debug && console.log("set onfullscreenchange", document[api["onfullscreenchange"]]);
        document[api["onfullscreenchange"]] = value;
      }
    });
  }

  function fixOnFullScreenError() {
    if (api.onfullscreenerror === "onfullscreenerror") return;
    if (applied.onfullscreenerror) return;
    applied.onfullscreenerror = true;
    Object.defineProperty(document, "onfullscreenerror", {
      get: function() {
        debug && console.log("get onfullscreenerror", document[api["onfullscreenerror"]]);
        return document[api["onfullscreenerror"]];
      },
      set: function(value) {
        debug && console.log("set onfullscreenerror", document[api["onfullscreenerror"]]);
        document[api["onfullscreenerror"]] = value;
      }
    });
  }

  document.addEventListener("fullscreenchange", function(event) {
    if (document.fullscreenElement && requestByFullscreen) {
      requestByFullscreen = false;
    }
    debug && console.log("fullscreenchange", document.fullscreenElement, event);
  });

  document.addEventListener("fullscreenerror", function(event) {
    requestByFullscreen = false;
    debug && console.log("fullscreenerror", document.fullscreenElement, event);
    useFullWindow = true;
    document.exitFullscreen && document.exitFullscreen();
  });

  check(document, "fullscreenElement");
  check(document, "exitFullscreen");
  check(Element.prototype, "requestFullscreen");
  check(document, "fullscreenEnabled");
  check(document, "onfullscreenchange");
  check(document, "onfullscreenerror");

  function onKeyUp (event) {
    if (event.keyCode !== 27) return;
    if (!fullWindowElement) return;
    if (!useFullWindow) return;
    document.exitFullscreen();
  }

  function fixEscapeKey() {
    window.removeEventListener("keyup", onKeyUp);
    window.addEventListener("keyup", onKeyUp);
  }

  proxyEventListener();

  fixFullScreenElement();
  fixFullScreenEnabled();
  fixExitFullScreen();
  fixRequestFullScreen();
  fixOnFullScreenChange();
  fixOnFullScreenError();
  fixEscapeKey();

  useFullWindow = !document.fullscreenEnabled;

  window['fullscreenPolyfill'] = {};
  Object.defineProperties(window['fullscreenPolyfill'], {
    useFullWindow: {
      get: function() {
        return useFullWindow;
      },
      set: function(value) {
        useFullWindow = value;
      },
      enumerable: true
    },
    api: {
      get: function() {
        return api;
      },
      enumerable: true
    },
    applied: {
      get: function() {
        return applied;
      },
      enumerable: true
    },
    debug: {
      get: function() {
        return debug;
      },
      set: function(value) {
        debug = value;
      }
    }
  });

  if (!isAllFound) {
    console.log("Fullscreen API (from broken API).");
  } else if (isAllSame) {
    console.log("Fullscreen API (from perfect API).");
  } else {
    console.log("Fullscreen API (from partially implemented API).");
  }

})();
