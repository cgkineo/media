(function(window, $){
var parseUnit = function(value, unit, defaultUnit) {
  value = String(value || 0) + String(unit || "");
  var unitMatch = value.match(/[^0-9\.]+/g);
  var unit = defaultUnit === undefined ? "px" : defaultUnit;
  if (unitMatch) unit = unitMatch[0];
  return {
    value: parseFloat(value) || 0,
    unit: unit
  };
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
    var found = false;
    for (var i = 0, l = classList.length; i < l; i++) {
      var classItem = classList[i];
      if (classItem !== nameItem) continue;
      found = true;
    }
    if (!found && bool) classList.add(nameItem);
    else if (found && !bool) classList.remove(nameItem);
  }
  if (element.classList.length === 0) {
    removeAttribute(element, "class");
  }
};

var removeAttribute = function(element, name) {
  if (element.removeAttribute) return element.removeAttribute(name);
  if (element.attributes.removeNamedItem && element.attributes.getNamedItem(name)) {
    return element.attributes.removeNamedItem(name);
  }
  element.setAttribute(name, "");
};

var removeElement = function(element) {
  if (element.remove) return element.remove();
  element.parentNode.removeChild(element);
};

var replaceWith = function(element, withElement) {
  if (element.replaceWith) return element.replaceWith(withElement);
  var parent = element.parentNode;
  for (var i = 0, l = parent.childNodes.length; i < l; i++) {
    if (parent.childNodes[i] !== element) continue;
    parent.insertBefore(withElement, element);
    removeElement(element);
    return;
  }
};

var prependElement = function(container, element) {
  if (!container.childNodes.length) {
    return container.appendChild(element);
  }
  container.insertBefore(element, container.childNodes[0]);
};

var createEvent = function(name, options) {
  options = defaults(options, {
    bubbles: false,
    cancelable: true
  });
  if (!createEvent._ie11) {
    try {
      var event = new Event(name, options);
      return event;
    } catch (e) {
      createEvent._ie11 = true;
    }
  }
  if (!createEvent._ie11) return;
  var event = document.createEvent('Event');
  event.initEvent(name, options.bubbles, options.cancelable);
  return event;
};

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

var bindAll = function(subject, fromArgs) {
  var startIndex = 0;
  var names = fromArgs;
  if (!(fromArgs instanceof Array)) {
    names = arguments;
    startIndex = 1;
  }
  var enumerableNames = {};
  for (var k in subject) enumerableNames[k] = true;
  for (var i = startIndex, l = names.length; i < l; i++) {
    var name = names[i];
    var desc = Object.getOwnPropertyDescriptor(subject, name);
    if (desc && !desc.writable) continue;
    if (!(subject[name] instanceof Function)) {
      var error = "Cannot bindAll to non-function '"+name+"'";
      console.log(error, subject);
      throw error;
    }
    var isEnumerable = enumerableNames[name];
    Object.defineProperty(subject, name, {
      value: subject[name].bind(subject),
      enumerable: isEnumerable,
      writable: true,
      configurable: true
    });
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

var toArray = function(args, start) {
  if (!args) return [];
  return Array.prototype.slice.call(args, start || 0);
};

var isArray = function(obj) {
  return Object.prototype.toString.call(obj) == '[object Array]';
};

var find = function(obj, callback) {
  for (var i = 0, l = obj.length; i < l; i++) {
    if (callback) return obj;
  }
  return null;
};

var clamp = function(low, value, hi) {
  return (value < low) ? low : (value > hi) ? hi : value;
};

var isNumber = function(obj) {
  return Object.prototype.toString.call(obj) == '[object Number]';
};

var isObject = function(obj) {
  return Object.prototype.toString.call(obj) == '[object Object]';
};

var ObjectValues = function(obj) {
  var values = [];
  for (var k in obj) {
    values.push(obj[k]);
  }
  return values;
};

var extendNotEnumerable = function(subject, fromItemsArgs) {
  for (var i = 1, l = arguments.length; i < l; i++) {
    var arg = arguments[i];
    if (!arg) continue;
    var names = Object.keys(arg);
    for (var i = 0, l = names.length; i < l; i++) {
      var k = names[i];
      var desc = Object.getOwnPropertyDescriptor(arg, k);
      if (!desc.configurable) continue;
      Object.defineProperty(subject, k, {
        configurable: true,
        value: arg[k],
        enumerable: false,
        writable: true
      });
    }
  }
  return subject;
};

var extend = function(subject, fromItemsArgs) {
  subject = subject || {};
  for (var i = 1, l = arguments.length; i < l; i++) {
    var arg = arguments[i];
    for (var k in arg) {
      subject[k] = arg[k];
    }
  }
  return subject;
};

var deepDefaults = function(subject, fromItemsArgs) {
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

var defaults = function(subject, fromItemsArgs) {
  subject = subject || {};
  for (var i = 1, l = arguments.length; i < l; i++) {
    var arg = arguments[i];
    for (var k in arg) {
      if (!subject.hasOwnProperty(k)) subject[k] = arg[k];
    }
  }
  return subject;
};

var get = function(object, name) {
  var path = name.split(/[\/\.\:]/g);
  do {
    object = object[path.shift()];
  } while (typeof object === "object" && object !== null && path.length)
  return object;
};

var set = function(object, name, value) {
  var path = name.split(/[\/\.\:]/g);
  var part;
  do {
    if (path.length === 1) break;
    part = path.shift();
    if (!object[part]) object[part] = {};
    object = object[part];
  } while (typeof object === "object" && object !== null)
  part = path.shift();
  if (value === undefined) delete object[part];
  else object[part] = value;
};

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

/**
 * A tool for easily creating getter and setters in ES5
 * Class({
 *   funcName$write : function() {
 *     // this function is not enumerable, writable or configurable
 *   },
 *   propName$set$enum$config: function(value) {
 *     this._propName = value;
 *   },
 *   propName$get: function() {
 *     return this._propName;
 *   }
 * });
 * @param  {Object} cls Class on which to apply properties pattern
 * @return {Object}     Return cls, modified.
 */
var properties = function(cls, fromCls) {
  var isForce = !!fromCls;
  fromCls = fromCls || cls;
  var props = {};
  var names = Object.getOwnPropertyNames(fromCls);
  for (var i = 0, l = names.length; i < l; i++) {
    var name = names[i];
    var dollar = name.indexOf("$");
    if (dollar === -1 && !isForce) continue;
    var end;
    var begin;
    if (dollar === -1) {
      end = "";
      begin = name;
    } else {
      end = name.slice(dollar);
      begin = name.slice(0, dollar);
    }
    if (!begin) continue;
    var values = end.split("$");
    var isGet = includes(values, "get");
    var isSet = includes(values, "set");
    var isValue = includes(values, "value");
    var isEnum = includes(values, "enum");
    var isWriteable = includes(values, "write");
    var isConfigurable = includes(values, "config");
    var defs = 0;
    defs += isGet ? 1 : 0;
    defs += isSet ? 1 : 0;
    defs += isValue ? 1 : 0;
    if (defs > 1) throw "Cannot have two types in one definition.";
    defs += isEnum ? 1 : 0;
    defs += isWriteable ? 1 : 0;
    defs += isConfigurable ? 1 : 0;
    var prop = props[begin] = props[begin] || {
      value: fromCls[name]
    };
    if (isValue) prop.value = fromCls[name];
    if (isGet) prop.get = fromCls[name];
    if (isSet) prop.set = fromCls[name];
    if (isEnum) prop.enumerable = true;
    if (isWriteable) prop.writable = true;
    if (isConfigurable) prop.configurable = true;
    if (prop.value && (prop.get || prop.set)) delete prop.value;
    delete fromCls[name];
    delete cls[begin];
  }
  if (!Object.keys(props).length) return cls;
  Object.defineProperties(cls, props);
  return cls;
};

var EventsInitialize = function(subject) {
  if (subject.events && subject.trigger) return;
  if (!subject.events) {
    Object.defineProperty(subject, 'events', {
      value: new EventsRegistry(),
      enumerable: false,
      writable: true
    });
  }
  if (!subject.trigger) {
    Object.defineProperty(subject, 'trigger', {
      value: Events.trigger,
      enumerable: false,
      writable: true
    });
  }
};

var EventsArgumentsNotation = function(name, callback, subject, each, that) {
  if (name instanceof Object) {
    var object = name;
    subject = subject || that;
    for (var k in object) {
      var names = k.split(" ");
      for (var i = 0, l = names.length; i < l; i++) {
        var eventName = names[i];
        var callback = object[k];
        each.call(that, eventName, callback, subject);
      }
    }
  } else if (typeof name === "string") {
    subject = subject || that;
    var names = name.split(" ");
    for (var i = 0, l = names.length; i < l; i++) {
      var eventName = names[i];
      each.call(that, eventName, callback, subject);
    }
  } else if (name === undefined && callback === undefined && subject === undefined) {
    return each.call(that, null, null, null);
  }
};

var EventsRegistry = function() {};
EventsRegistry.prototype = new Array();

var EventRegister = function(options) {
  if (!options.name) return;
  if (!options.callback) {
    throw "Cannot find callback";
  }
  EventsInitialize(options.from);
  EventsInitialize(options.to);
  this.from = options.from;
  this.to = options.to;
  this.context = options.context;
  this.name = options.name;
  this.callback = options.callback;
  this.once = options.once;
  this.from.events.push(this);
  if (this.from === this.to) return;
  this.to.events.push(this);
};
EventRegister.prototype.destroy = function() {
  this.from.events = this.from.events.filter(function(event) {
    return event !== this;
  }.bind(this));
  if (this.from === this.to) return;
  this.to.events = this.to.events.filter(function(event) {
    return event !== this;
  }.bind(this));
};

var Events = {

  events: null,

  listenTo: function(subject, name, callback) {
    EventsArgumentsNotation(name, callback, subject, function(name, callback, subject) {
      new EventRegister({
        from: subject,
        to: this,
        context: this,
        name: name,
        callback: callback,
        once: false
      });
    }, this);
  },

  listenToOnce: function(subject, name, callback) {
    EventsArgumentsNotation(name, callback, subject, function(name, callback, subject) {
      new EventRegister({
        from: subject,
        to: this,
        context: this,
        name: name,
        callback: callback,
        once: true
      });
    }, this);
  },

  stopListening: function(subject, name, callback) {
    EventsArgumentsNotation(name, callback, subject, function(name, callback, subject) {
      if (!this.events) return;
      for (var i = this.events.length - 1; i > -1; i--) {
        var event = this.events[i];
        if (event.to.events !== this.events) continue;
        if (name !== null && event.name !== name) continue;
        if (callback !== null && event.callback !== callback) continue;
        event.destroy();
      }
    }, this);
  },

  on: function(name, callback, context) {
    EventsArgumentsNotation(name, callback, context, function(name, callback, context) {
      new EventRegister({
        from: this,
        to: this,
        context: context,
        name: name,
        callback: callback,
        once: false
      });
    }, this);
  },

  once: function(name, callback, context) {
    EventsArgumentsNotation(name, callback, context, function(name, callback, context) {
      new EventRegister({
        from: this,
        to: this,
        context: context,
        name: name,
        callback: callback,
        once: true
      });
    }, this);
  },

  off: function(name, callback, context) {
    EventsArgumentsNotation(name, callback, context, function(name, callback, context) {
      if (!this.events) return;
      for (var i = this.events.length - 1; i > -1; i--) {
        var event = this.events[i];
        if (event.from.events !== this.events) continue;
        if (name !== null && event.name !== name) continue;
        if (callback !== null && event.callback !== callback) continue;
        event.destroy();
      }
    }, this);
  },

  trigger: function(name) {
    EventsInitialize(this);
    var events = [];
    if (!this.events) return;
    for (var i = 0, l = this.events.length; i < l; i++) {
      var event = this.events[i];
      if (event.from.events !== this.events) continue;
      if (event.name !== "*" && event.name !== name) continue;
      events.push(event);
    }
    events.reverse();
    for (var i = events.length - 1; i > -1; i--) {
      var event = events[i];
      if (event.name === "*") {
        event.callback.apply(event.context, arguments);
      } else {
        event.callback.apply(event.context, toArray(arguments, 1));
      }
      if (!event.once) continue;
      event.destroy();
    }
  },

  destroy: function() {
    this.stopListening();
  }

};

/**
 * A simple class implementation akin to Backbonejs.
 * var cls = Class({
 *  instanceFunction: function() {
 *    console.log("parent function");
 *  }
 * }, {
 *  classFunction: function() {
 *    console.log("class function");
 *  }
 * }, {
 *    inheritClassEnumerables: false,
 *    classEvents: false,
 *    classProperties: true,
 *    instanceEvents: false,
 *    instanceProperties: true
 * });
 * @param {Object} proto  An object describing the Class prototype properties.
 * @param {Object} parent An object describing the Class properties.
 */
var ClassExtend = function(proto, cls, classOptions) {
  var parent = this;
  var child;

  // Create or pick constructor
  if (proto && proto.hasOwnProperty("constructor")) child = proto.constructor;
  else child = function UnnamedConstructor() { return parent.apply(this, arguments); };

  Object.defineProperty(child, 'classOptions', {
    value: defaults(classOptions, parent.classOptions, {
      extendFunction: true,
      inheritClassEnumerables: false,
      classEvents: false,
      classProperties: true,
      instanceEvents: false,
      instanceProperties: true
    }),
    enumerable: false,
    writable: true
  });

  // Generate new prototype chain
  child.prototype = Object.create(parent.prototype);

  // Add extend function
  if (child.classOptions.extendFunction) {
    extendNotEnumerable(child, {
      extend: ClassExtend
    });
  }

  // Add events system to Class
  if (child.classOptions.classEvents) {
    extendNotEnumerable(child, Events);
  }

  // Extend constructor with parent functions and cls properties
  if (child.classOptions.inheritClassEnumerables) extend(child, parent);
  extend(child, cls);

  // Add events system to prototype
  if (child.classOptions.instanceEvents && child.prototype.events === undefined) {
    extendNotEnumerable(child.prototype, Events);
  }

  // Extend constructor.prototype with prototype chain
  extend(child.prototype, proto);

  // Apply properties pattern to constructor prototype
  if (child.classOptions.instanceProperties) {
    Object.defineProperty(child.prototype, "defineProperties", {
      value: function(props) {
        return properties(this, props);
      },
      enumerable: false,
      writable: false,
      configurable: false
    });
    properties(child.prototype);
  }

  // Apply properties pattern to constructor
  if (child.classOptions.classProperties) {
    Object.defineProperty(child, "defineProperties", {
      value: function(props) {
        return properties(this, props);
      },
      enumerable: false,
      writable: false,
      configurable: false
    });
    properties(child);
  }

  // Reassign constructor
  extendNotEnumerable(child.prototype, {
    constructor: child
  });

  return child;
};

var ClassParent = function Class(proto, cls) {};
var ListParent = function List(proto, cls) {};
ListParent.prototype = new Array();
if (!Array.prototype.find) {
  List.prototype.find = function(iterator) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (iterator(this[i], i)) return true;
    }
    return false;
  };
}

// Create base Class and List prototypes
// Add Events system to both class and instances
var Class = ClassExtend.call(ClassParent, { constructor: function Class() {} }, {}, { classEvents: false, instanceEvents: false });
var List = ClassExtend.call(ListParent, { constructor: function List() {} }, {}, { classEvents: false, instanceEvents: false });

var Elements = List.extend({

  subject: null,

  constructor: function Elements(selector, subject) {
    this.subject = subject || document;
    this.add(selector, this.subject);
    this.selector = selector;
  },

  filterByAttribute: function(attrName, filterValue) {
    var items = this.filter(function(item) {
      var attrValue = item.getAttribute(attrName);
      if (!attrValue) return;
      var attrValues = attrValue.split(" ");
      if (includes(attrValues, filterValue)) return true;
    });
    return new Elements(items);
  },

  filterByTypes: function(type) {
    var types = type.split(",").map(function(type) { return type.trim(); });
    var items = this.filter(function(item) {
      var typeValue = item.tagName.toLowerCase();
      if (includes(types, typeValue)) return true;
    });
    return new Elements(items);
  },

  query: function(selector) {
    var result = new Elements();
    this.forEach(function(item) {
      result.push.apply(result, item.querySelectorAll(selector));
    });
    return result;
  },

  isHidden: function() {
    var stack = this.stack();
    return Boolean(stack.find(function(item) {
      var style = window.getComputedStyle(item);
      var isHidden = style.visibility == "hidden" ||
        style.display == "none" || style.opacity == 0;
      return isHidden;
    }));
  },

  stack: function(selector) {
    var stack = this.parents();
    stack.unshift(this[0]);
    if (selector) {
      stack = stack.filter(function(item) {
        return (item.matches(selector));
      });
    }
    return stack;
  },

  parents: function(selector) {
    var parent = this[0];
    var parents = new Elements();
    do {
      parent = parent.parentNode;
      if (parent) parents.add(parent);
    } while (parent)
    if (selector) {
      parents = parents.filter(function(item) {
        return (item.matches(selector));
      });
    }
    return parents;
  },

  value: function() {
    return this[0].value;
  },

  add: function(selector, subject) {
    this.selector = "";
    subject = subject || document;
    if (selector instanceof HTMLElement) {
      this.push(selector);
      return this;
    }
    if (selector instanceof Array || selector instanceof NodeList) {
      for (var i = 0, l = selector.length; i < l; i++) {
        this.add(selector[i]);
      }
      return this;
    }
    if (typeof selector === "string") {
      var elements = subject.querySelectorAll(selector);
      for (var i = 0, l = elements.length; i < l; i++) {
        this.push(elements[i]);
      }
      return this;
    }
    return this;
  },

  clone: function(deep) {
    var clones = [];
    for (var i = 0, l = this.length; i < l; i++) {
      clones.push(this[i].cloneNode(deep));
    }
    return new Elements(clones, this.subject);
  },

  on: function(name, callback, options) {
    options = options || {};
    options.passive = options.passive !== false ? true : options.passive;
    if (name instanceof Object) {
      for (var k in name) {
        this.on(k, name[k], callback);
      }
      return this;
    }
    this.forEach(function(element) {
      element.addEventListener(name, callback, options);
    });
    return this;
  },

  off: function(name, callback) {
    if (name instanceof Object) {
      for (var k in name) {
        this.off(k, name[k]);
      }
      return this;
    }
    this.forEach(function(element) {
      element.removeEventListener(name, callback);
    });
    return this;
  },

  removeAttributes: function(obj) {
    if (obj) return this.removeAttribute(obj);
    obj = this.attrs();
    return this.removeAttribute(obj);
  },

  removeAttribute: function(name) {
    if (name instanceof Object) {
      for (var k in name) {
        this.removeAttribute(k);
      }
      return this;
    }
    this.forEach(function(element) {
      removeAttribute(element, name);
    });
    return this;
  },

  attrs: function(obj) {
    if (obj) return this.attr(obj);
    obj = {};
    for (var i = 0, l = this[0].attributes.length; i < l; i++) {
      obj[this[0].attributes[i].name] = this[0].attributes[i].value;
    }
    return obj;
  },

  attr: function(name, value) {
    if (name instanceof Object) {
      for (var k in name) {
        this.attr(k, name[k]);
      }
      return this;
    }
    this.forEach(function(element) {
      element.setAttribute(name, value);
    });
    return this;
  },

  toggleClass: function(name, value) {
    this.forEach(function(element) {
      toggleClass(element, name, value);
    });
    return this;
  }

});

var elements = function(selector, subject) { return new Elements(selector, subject); };
extend(elements, Elements);

var Rafer = Class.extend({

  deferred: null,
  requests: null,
  isWaiting: false,
  mode: "ram",
  ramLimit: 50,
  currentDeferredLength: 0,
  currentRequestsLength: 0,

  constructor: function Rafer() {
    bindAll(this, "frame");
    this.defineProperties({
      deferred$write: new Array(100),
      requests$write: new Array(100),
      currentDeferredLength$write: 0,
      currentRequestsLength$write: 0,
      isWaiting$write: false
    });
  },

  resizeDeferred$write: function() {
    var currentSize = this.deferred.length;
    var newSize = currentSize * 2;
    this.deferred.length = newSize;
  },

  resizeRequests$write: function() {
    var currentSize = this.requests.length;
    var newSize = currentSize * 2;
    this.requests.length = newSize;
  },

  set: function(subject, name, value) {
    if (!this.isWaiting) {
      this.request(this.dummy);
    }
    if (this.currentDeferredLength === this.deferred.length - 1) {
      this.resizeDeferred();
    }
    var item = {
      subject: subject,
      name: name,
      value: value,
      type: "set"
    };
    this.deferred[this.currentDeferredLength] = item;
    this.currentDeferredLength++;
  },

  get: function(subject, name) {
    for (var i = 0, l = this.currentDeferredLength; i < l; i++) {
      var item = this.deferred[i];
      if (item.subject !== subject) continue;
      if (item.name !== name) continue;
      return item.value;
    }
    return subject[name];
  },

  call: function(subject, name, args) {
    if (!this.isWaiting) {
      this.request(this.dummy);
    }
    if (this.currentDeferredLength === this.deferred.length - 1) {
      this.resizeDeferred();
    }
    var item = {
      order: 0,
      subject: subject,
      name: name,
      value: toArray(arguments, 2),
      type: "call"
    }
    this.deferred[this.currentDeferredLength] = item;
    this.currentDeferredLength++;
  },

  callLast: function(subject, name, args) {
    if (!this.isWaiting) {
      this.request(this.dummy);
    }
    if (this.currentDeferredLength === this.deferred.length - 1) {
      this.resizeDeferred();
    }
    var item = {
      order: 1,
      subject: subject,
      name: name,
      value: toArray(arguments, 2),
      type: "call"
    }
    this.deferred[this.currentDeferredLength] = item;
    this.currentDeferredLength++;
  },

  dummy$write: function() {
    // call me to force a raf call
  },

  flush$write: function() {
    var rams = 0;
    do {
      var deferred = [];
      var oldLength = this.currentDeferredLength;
      for (var i = 0, l = oldLength; i < l; i++) {
        deferred.push(this.deferred[i]);
        this.deferred[i] = null;
      }
      deferred.sort(function(a,b) {
        return b.order - a.order;
      });
      this.currentDeferredLength = 0;
      for (var i = 0, l = oldLength; i < l; i++) {
        var wait = deferred[i];
        try {
          switch (wait.type) {
            case "set":
              wait.subject[wait.name] = wait.value;
              break;
            case "call":
              if (!wait.name && typeof wait.subject === "function") {
                wait.subject.apply(wait.name, wait.value);
              } else if (!wait.subject && typeof wait.name === "function") {
                wait.name.apply(wait.subject, wait.value);
              } else {
                wait.subject[wait.name].apply(wait.subject, wait.value);
              }
              break;
          }
        } catch (error) {
          debugger;
        }
      }
      if (this.currentDeferredLength) rams++;
    } while (this.mode === "ram" && this.currentDeferredLength !== 0 && rams < this.ramLimit)
    if (rams === this.ramLimit) {
      this.mode = "wait";
      console.log("Deferred queue modified by queue, switching to wait mode.");
    }
  },

  request: function(callback, allowMultipleCalls) {
    if (callback && (!callback._raferQueuePosition || allowMultipleCalls)) {
      if (this.currentRequestsLength === this.requests.length) {
        this.resizeRequests();
      }
      this.requests[this.currentRequestsLength] = callback;
      callback._raferQueuePosition = this.currentRequestsLength+1;
      this.currentRequestsLength++;
    }
    if (!this.currentRequestsLength) return;
    if (this.isWaiting) return;
    this.isWaiting = true;
    window.requestAnimationFrame(this.frame);
  },

  frame$write: function() {
    var requests = [];
    var oldLength = this.currentRequestsLength;
    for (var i = 0, l = oldLength; i < l; i++) {
      requests.push(this.requests[i]);
      this.requests[i] = null;
    }
    this.currentRequestsLength = 0;
    for (var i = 0, l = oldLength; i < l; i++) {
      requests[i]._raferQueuePosition = null;
      requests[i]();
      requests[i] = null;
    }
    this.isWaiting = false;
    this.flush();
    this.request();
  }

});

var rafer = new Rafer();

var Media = Class.extend({

  el: null,
  options: null,

  constructor: function Media(element, options) {
    // Return a preexiting player if it exists
    if (element[Media.propName]) return element;

    this.defineProperties({
      proxyEvent$write: this.proxyEvent.bind(this)
    });

    this.el = element;
    this.el[Media.propName] = this;

    this.options = options || {};
    if (!(this.options instanceof Media.DefaultOptions)) {
      this.options = new Media.DefaultOptions(this.options);
    }

    this.options.add({
      media: this,
      id: this.el.id
    });

    this.initialize();

  },

  initialize: function() {
    Media.players.push(this);
    Media.trigger("create", this);
    this.trigger("create");
    this.attachEvents();
    delay(function() {
      Media.trigger("created", this);
      this.trigger("created");
      this.checkPlaying();
    }.bind(this), 1);
  },

  checkPlaying$write: function() {
    if (this.el.paused) return;
    this.dispatchEvent("play");
  },

  attachEvents$write: function() {
    for (var i = 0, l = Media.DOMEvents.length; i < l; i++) {
      this.el.addEventListener(Media.DOMEvents[i], this.proxyEvent);
    }
  },

  dispatchEvent: function(name, options) {
    if (name === "timeupdate") {
      options = defaults(options, {
        fast: true,
        medium: true,
        slow: true
      });
    }
    var event = createEvent(name, options);
    event.fake = true;
    extend(event, options);
    this.el.dispatchEvent(event);
  },

  proxyEvent$write: function(event) {
    var isRealTimeUpdate = (!event.fake && event.type === "timeupdate");
    if (isRealTimeUpdate) return;
    //this.trigger("*", event);
    var isRealResize = (!event.fake && event.type === "resize");
    if (!isRealResize) {
      this.trigger(event.type, event);
    }
    Media.trigger(event.type, this, event);
  },

  destroy: function() {
    Media.trigger("destroy", this);
    this.trigger("destroy");
    for (var i = Media.players.length-1; i > -1; i--) {
      if (Media.players[i] !== this) continue;
      Media.players.splice(i, 1);
    }
    this.detachEvents();
    this.selector = null;
    this.options = null;
    delay(function() {
      delete this.el[Media.propName];
      this.el = null;
      Media.trigger("destroyed", this);
      this.trigger("destroyed");
    }.bind(this), 1);
  },

  detachEvents$write: function() {
    for (var i = 0, l = Media.DOMEvents.length; i < l; i++) {
      this.el.removeEventListener(Media.DOMEvents[i], this.proxyEvent);
    }
  }

}, {

  supportedTags$enum$write: "video, audio, canvas, img",
  propName$enum$write: "player",

  Class$write: Class.extend({
    constructor: function MediaClass() {}
  }, {
    List: List.extend({
      constructor: function MediaClassList() {}
    }, null, {
      instanceEvents: true
    })
  }, {
    instanceEvents: true
  })

},{
  classEvents: true,
  instanceEvents: true
});

window.Media = Media;

Media.DefaultOptions = Class.extend({

  constructor: function DefaultOptions(options) {
    this.add(options);
  },

  add$write: function(options) {
    extend(this, options);
  },

  get$write: function(name) {
    return this[name];
  },

  toJSON$write: function() {
    var options = {};
    for (var name in this) {
      options[name] = this[name];
    }
    return options;
  }

}, {

  add$write$enum: function(options) {
    var create = function(name, value) {
      Object.defineProperty(this.prototype, name, {
        enumerable: true,
        get: function() {
          if (typeof this["_"+name] === "function") {
            return this["_"+name]();
          }
          return this["_"+name];
        },
        set: function(value) {
          if (!this.hasOwnProperty("_"+name)) {
            Object.defineProperty(this, "_"+name, {
              enumerable: false,
              writable: true,
              value: null
            });
          }
          this["_"+name] = value;
        }
      });
      this.prototype[name] = value;
    }.bind(this);
    for (var name in options) {
      create(name, options[name]);
    }
  },

  get$write$enum: function(name) {
    return this.prototype[name];
  },

  toJSON$write$enum: function() {
    var options = {};
    for (var name in this.prototype) {
      options[name] = this.prototype[name];
    }
    return options;
  }

}, {
  inheritClassEnumerables: true
});

Media.DefaultOptions.add({
  id: "",
  media: null
});

Media.Class.DOMEvents = Media.Class.List.extend({

  constructor: function DOMEvents() {},

  add: function(arr) {
    if (!(arr instanceof Array)) return this.push(arr);
    return this.push.apply(this, arr);
  }

});

Media.defineProperties({
  DOMEvents$write: new Media.Class.DOMEvents()
});

Media.DOMEvents.add([
  "abort",
  "canplay",
  "canplaythrough",
  "durationchange",
  "emptied",
  "ended",
  "error",
  "loadeddata",
  "loadedmetadata",
  "loadstart",
  "pause",
  "play",
  "playing",
  "process",
  "ratechange",
  "seeked",
  "seeking",
  "stalled",
  "suspend",
  "timeupdate",
  "volumechange",
  "waiting"
]);

/*
Check for device capabilities.
 */

Media.Class.Device = Media.Class.extend({

  isUsingTouch: false,
  lastTouch: null,

  constructor: function Device() {
    this.checkTouchDevice();
  },

  isIOS$get$enum: function() {
    return /(iPad|iPhone|iPod)/g.test(navigator.userAgent) && !window.MSStream;
  },

  wasTouchedRecently$get$enum: function() {
    var now = Date.now();
    return (now - this.lastTouch < 600);
  },

  checkTouchDevice$write: function() {
    var touchListener = function() {
      this.lastTouch = Date.now();
      this.isUsingTouch = true;
    }.bind(this);
    window.addEventListener("touchstart", touchListener, { capture: true, passive: true });
    window.addEventListener("touchend", touchListener, { capture: true, passive: true });
  }

});

Media.defineProperties({
  device$enum: new Media.Class.Device()
});

if ($ && $.fn) {
  // jQuery API

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
      new MediaUI(media, options);
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

Media.Class.Dimensions =Media.Class.extend({

  _size$write: "contain",
  _aspect$write: "16/9",
  _position$write: "top left",

  width: parseUnit(0, "px"),
  height: parseUnit(0, "px"),
  ratio: 16/9,
  x: parseUnit(0, "px"),
  y: parseUnit(0, "px"),

  constructor: function Dimensions(size, aspect, position) {
    if (size instanceof HTMLElement) {
      var element = size;
      var rect = element.getBoundingClientRect();
      this.width = parseUnit(rect.width, "px");
      this.height = parseUnit(rect.height, "px");
      this.ratio = rect.width / rect.height;
      return;
    } else if (size === window) {
      this.width = parseUnit(window.innerWidth, "px");
      this.height = parseUnit(window.innerHeight, "px");
      this.ratio = this.width.value / this.height.value;
      return;
    }
    this.size = size === undefined ? this._size : size;
    this.aspect = aspect === undefined ? this._aspect : aspect;
    this.position = position === undefined ? this._position : position;
  },

  size$set$snum: function(size) {
    this._size = size;
    size = size.trim();
    var sizeParts = size.split(" ");
    var sizeWidth = parseUnit(sizeParts[0] || "none");
    var sizeHeight = parseUnit(sizeParts[1] || "none");
    switch (sizeHeight.unit) {
      case "auto":
      case "none":
        sizeHeight.value = sizeHeight.unit;
        break;
      case "contain":
      case "cover":
      case "fill":
      case "retain":
        sizeWidth.value = sizeHeight.value = sizeHeight.unit = sizeWidth.unit;
        break;
    }
    switch (sizeWidth.unit) {
      case "auto":
      case "none":
        sizeWidth.value = sizeWidth.unit;
        break;
      case "contain":
      case "cover":
      case "fill":
      case "retain":
        sizeWidth.value = sizeHeight.value = sizeHeight.unit = sizeWidth.unit;
        break;
    }
    this.width = sizeWidth;
    this.height = sizeHeight;
  },

  size$get$enum: function() {
    return this._size;
  },

  aspect$set$enum: function(aspect) {
    this._aspect = aspect;
    aspect = aspect.trim();
    aspect = aspect.replace(/\:/g, " ");
    aspect = aspect.replace(/\//g, " ");
    aspect = aspect.replace(/\*/g, "");
    var aspectParts = aspect.split(" ");
    var aspectWidth = parseUnit(aspectParts[0] || "none");
    var aspectheight = parseUnit(aspectParts[1] || "none");
    this.ratio = aspectWidth.value / aspectheight.value;
  },

  aspect$get$enum: function() {
    return this._aspect;
  },

  position$set$enum: function(position) {
    var output = new Array(4);
    position = position.trim();
    var positionParts = position.split(" ");
    // based upon https://developer.mozilla.org/en-US/docs/Web/CSS/position_value
    switch (positionParts.length) {
      case 1:
        switch (positionParts[0]) {
          case "center":
          case "none":
            output[0] = positionParts[0];
            output[1] = 0;
            output[2] = positionParts[0];
            output[3] = 0;
            break;
          case "left":
          case "top":
          case "bottom":
            output[0] = positionParts[0];
            output[1] = 0;
            output[2] = "none";
            output[3] = 0;
            break;
          default:
            output[0] = "left";
            output[1] = positionParts[0];
            output[2] = "top";
            output[3] = "50%";
            break;
        }
        break;
      case 2:
        switch (positionParts[0]) {
          case "left":
          case "top":
          case "bottom":
          case "center":
          case "none":
            output[0] = positionParts[0];
            output[1] = 0;
            break;
          default:
            output[0] = "auto";
            output[1] = positionParts[0];
        }
        switch (positionParts[1]) {
          case "left":
          case "top":
          case "bottom":
          case "center":
          case "none":
            output[2] = positionParts[0];
            output[3] = 0;
            break;
          default:
            output[2] = "auto";
            output[3] = positionParts[0];
        }
        break;
      case 3:
        throw "Unable to process a 3 part position '"+position+"'";
      case 4:
        output = positionParts;
        break;
    }

    // set first keyword if auto
    switch (output[0]) {
      case "auto":
        switch (output[2]) {
          case "auto":
          case "top":
          case "bottom":
            output[0] = "left";
            break;
          case "left":
          case "right":
            output[0] = "top";
            break;
        }
        break;
    }

    // set second keyword if auto
    switch (output[2]) {
      case "auto":
        switch (output[0]) {
          case "auto":
          case "top":
          case "bottom":
            output[2] = "left";
            break;
          case "left":
          case "right":
            output[2] = "top";
            break;
        }
        break;
    }

    // swap x & y if need be
    switch (output[2]) {
      case "left":
      case "right":
        var t1 = output[0];
        var t2 = output[1];
        output[0] = output[2];
        output[1] = output[3];
        output[2] = t1;
        output[3] = t2;
        break;
    }

    this.x = {
      keyword: output[0],
      value: output[1]
    };
    this.y = {
      keyword: output[2],
      value: output[3]
    };

  },

  position$get$enum: function() {
    return this._position;
  }

});

/*
This is needed as sometimes browsers doesn't call the "ended" event properly.
It forces the ended event to trigger if the duration and current time are
within 0.01 of each other and the media is paused.
 */
Media.Class.Ended = Media.Class.extend({

  floorPrecision: 10,

  constructor: function Ended() {
    this.listenTo(Media, {
      "created": this.onCreated,
      "play": this.onPlay,
      "pause": this.onPause,
      "ended": this.onEnded
    });
  },

  onCreated: function(media) {
    media.defineProperties({
      hasFiredEnded$write: false
    });
  },

  onPlay: function(media) {
    media.hasFiredEnded = false;
  },

  onPause: function(media) {
    if (!this.isEnded(media) || media.isAtEnd) return;
    setTimeout(function() {
      if (!media.el) return;
      if (media.hasFiredEnded) return;
      if (!this.isEnded(media)) return;
      media.el.dispatchEvent(createEvent('ended'));
    }.bind(this), 150);
  },

  onEnded: function(media) {
    media.hasFiredEnded = true;
  },

  isEnded: function(media) {
    return (Math.abs(Math.floor(media.el.currentTime*this.floorPrecision) - Math.floor(media.el.duration*this.floorPrecision)) <= 1);
  }

});

Media.defineProperties({
  ended: new Media.Class.Ended()
});

Media.Class.PauseOnPlay = Media.Class.extend({

  constructor: function PauseOnPlay() {
    this.listenTo(Media, {
      "created": this.onCreated,
      "play": this.onPlay
    });
  },

  onCreated: function(media) {
    media.defineProperties({
      pauseonplay$enum$write: media.options.pauseonplay
    });
  },

  onPlay: function(media) {
    for (var i = 0, l = Media.players; i < l; i++) {
      var player = Media.players[i];
      if (!player.pauseonplay) continue;
      player.el.pause();
    }
  }

});

Media.defineProperties({
  pauseonplay: new Media.Class.PauseOnPlay()
});
Media.DefaultOptions.add({
  pauseonplay: false
});

Media.Class.Players = Media.Class.List.extend({

  constructor: function Players() {
    List.apply(this, arguments);
  },

  findById: function(id) {
    for (var i = 0, l = this.length; i < l; i++) {
      var player = this[i];
      if (!player.el) continue;
      if (player.el.id !== id) continue;
      return player;
    }
    return null;
  },

  findByElement: function(el) {
    for (var i = 0, l = this.length; i < l; i++) {
      var player = this[i];
      if (!player.el) continue;
      if (player.el.id !== el) continue;
      return player;
    }
    return null;
  }

});

Media.defineProperties({
  players$enum$write: new Media.Class.Players()
});

Media.Class.Resize = Media.Class.extend({

  constructor: function Resize(media) {
    bindAll(this, "onWindowResize", "onFullScreenChanged");
    this.listenTo(Media, {
      "created": this.onCreated,
      "resize": this.onResize
    });
    this.addEventListeners();
  },

  addEventListeners$write: function() {
    window.removeEventListener("resize", this.onWindowResize);
    window.addEventListener("resize", this.onWindowResize);
    document.addEventListener("fullscreenchange", this.onFullScreenChanged);
  },

  onCreated: function(media) {
    this.triggerMediaResize(media);
  },

  onFullScreenChanged$write: function() {
    this.resizeAllPlayers();
  },

  onResize: function(media, event) {
    if (event.fake) return;
    this.resizeAllPlayers();
  },

  onWindowResize$write: function() {
    this.resizeAllPlayers();
  },

  resizeAllPlayers$write: function() {
    for (var i = 0, l = Media.players.length; i < l; i++) {
      var media = Media.players[i];
      this.triggerMediaResize(media);
    }
  },

  triggerMediaResize: function(media) {
    var options = media.options;
    media.dispatchEvent("resize", {
      fullscreen: new Media.Class.Dimensions(options.mediafullscreensize, options.mediafullscreenratio, options.mediafullscreenposition),
      normal: new Media.Class.Dimensions(options.mediasize, options.mediaratio, options.mediaposition)
    });
    media.dispatchEvent("postresize", {
      fullscreen: new Media.Class.Dimensions(options.mediafullscreensize, options.mediafullscreenratio, options.mediafullscreenposition),
      normal: new Media.Class.Dimensions(options.mediasize, options.mediaratio, options.mediaposition)
    });
  },

  removeEventListeners$write: function() {
    window.removeEventListener("resize", this.onWindowResize);
    document.removeEventListener("fullscreenchange", this.onFullScreenChanged);
  }

});

Media.defineProperties({
  resize$write: new Media.Class.Resize()
});

Media.DOMEvents.add([
  "resize",
  "postresize"
]);
Media.DefaultOptions.add({
  mediasize: "contain",
  mediaratio: "16/9",
  mediaposition: "none none",
  mediafullscreensize: function() {
    return this.mediasize;
  },
  mediafullscreenratio: function() {
    return this.mediaratio;
  },
  mediafullscreenposition: function() {
    return this.mediaposition;
  }
});

Media.Class.TextTrack = Media.Class.extend({

  activeCues: null,
  cues: null,
  readyState: 0,
  label: null,
  kind: null,
  language: null,
  el: null,
  media: null,
  mode: "hidden",

  _default: false,

  default$get$enum: function() {
    return this._default;
  },

  default$set$enum: function(value) {
    if (this._default === value) return;
    this._default = value;
    this.trigger("change", true);
    this.media.dispatchEvent("texttrackchange", {
      track: this
    });
    for (var i = 0, l = this.activeCues.length; i < l; i++) {
      this.activeCues[i].isLive = false;
    }
    this.activeCues.length = 0;
  },

  constructor: function TextTrack(media, el) {
    this.cues = [];
    this.activeCues = [];
    this.el = el;
    this.defineProperties({
      media$write: media
    });
    this.default = (this.el.getAttribute("default")!==null);
    this.language = this.el.getAttribute("srclang");;
    this.label = this.el.getAttribute("label");
    this.kind = this.el.getAttribute("kind");
    this._previousMode = this.el.mode;
    this.el.mode = "disabled";
    this.fetch();
  },

  addCue: function(addCue) {
    for (var i = this.cues.length-1; i > -1; i--) {
      var cue = this.cues[i];
      if (cue !== addCue && cue.id !== addCue.id) continue;
      return;
    }
    this.cues.push(addCue);
  },

  removeCue: function(removeCue) {
    for (var i = this.cues.length-1; i > -1; i--) {
      var cue = this.cues[i];
      if (cue !== removeCue && cue.id !== removeCue.id) continue;
      this.cues.splice(i, 1);
    }
  },

  update$write: function() {
    if (!this.default) return;
    var ct = this.media.el.currentTime;
    var newLiveCues = this.cues.filter(function(cue) {
      return (cue.startTime <= ct && cue.endTime >= ct && !cue.isLive);
    });
    var toRemove = this.activeCues.filter(function(cue) {
      return (cue.startTime > ct || cue.endTime < ct) && cue.isLive;
    });
    if (newLiveCues.length === 0 && toRemove.length === 0) return;
    toRemove.forEach(function(cue) {
      cue.isLive = false;
    });
    this.activeCues = this.activeCues.filter(function(cue) {
      return !(cue.startTime > ct || cue.endTime < ct);
    });
    this.activeCues.push.apply(this.activeCues, newLiveCues);
    newLiveCues.forEach(function(cue) {
      cue.isLive = true;
    });
    this.media.dispatchEvent("cuechange", {
      track: this,
      media: this
    });
  },

  fetch$write: function() {
    this.readyState = Media.Class.TextTrack.READYSTATE.LOADING;
    getUrl(this.el.src, function(data) {
      if (!data) {
        this.readyState = Media.Class.TextTrack.READY_STATE.ERROR;
        return;
      }
      if (!this.parse(data)) {
        this.readyState = Media.Class.TextTrack.READYSTATE.ERROR;
      } else {
        this.readyState = Media.Class.TextTrack.READYSTATE.LOADED;
      }
      this.trigger("load", this);
    }, this);
  },

  parse$write: function(raw) {

    var eolChars = raw.indexOf("\r\n") > -1 ? "\r\n" : "\n";
    var lines = raw.split(eolChars);

    var groups = [];
    var group = [];

    // Get groups by line breaks
    for (var i = 0, l = lines.length; i < l; i++) {
      var line = lines[i];

      var isEnd = (i === lines.length-1);
      var isBlank = !line;

      if (isEnd && !isBlank) {
        group.push(line);
      }

      // form group
      if ((isEnd || isBlank) && group.length) {

        if (group[0].toLowerCase().indexOf("webvtt") > -1) {
          // drop webvtt line
          group.splice(0, 1);
          // drop group if empty
          if (!group.length) continue;
        }

        groups.push({
          title: null,
          lines: group
        });

        group = [];
        continue;

      }

      if (isBlank) continue;

      group.push(line);

    }

    // Remove NOTES and STYLES
    try {
      for (var i = 0, l = groups.length; i < l; i++) {
        var group = groups[i];
        var isNote = (group.lines[0].indexOf("NOTE") === 0);
        if (isNote) continue;

        var isStyle = (group.lines[0].indexOf("STYLE") === 0);
        if (isStyle) {
          console.log("Media does not support STYLE lines in WebVTT yet. Please leave an issue if needed.");
          // TODO: make style parser
          // https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API#Styling_WebTT_cues
          continue;
        }

        if (group.lines[0].indexOf("-->") === -1) {
          group.title = group.lines[0];
          group.lines.shift();
        }

        if (group.lines[0].indexOf("-->") === -1) {
          this.readyState = Media.Class.TextTrack.READYSTATE.ERROR;
          break;
        } else {
          extend(group, this.parseTimePlacement(group.lines[0]));
          group.lines.shift();
        }

        var cue = new Media.Class.TextTrackCue(group.startTime, group.endTime, group.lines.join("\n"));
        cue.defineProperties({
          track$write: this
        });
        cue.lineAlign = group.align;
        cue.line = group.line;
        cue.position = group.position;
        cue.size = group.size;
        cue.vertical = group.vertical;
        this.addCue(cue);

      }
    } catch (error) {
      console.log(error);
      return false;
    }

    // TODO: make line tag parser if required
    // https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API#Cue_payload_text_tags

    return true;
  },

  parseTimePlacement$write: function(line) {

    line = line.trim();

    var breakpoint = indexOfRegex(line, /-->/);
    if (breakpoint === -1) throw "Time declaration error, no -->";
    var start = line.slice(0, breakpoint).trim();
    line = line.slice(breakpoint);

    var startpoint = indexOfRegex(line, /[0-9]+/);
    if (startpoint === -1) throw "Time declaration error, no end time";
    line = line.slice(startpoint);

    var breakpoint = indexOfRegex(line, /[ ]{1}/);
    if (breakpoint === -1) breakpoint = line.length;
    var end = line.slice(0, breakpoint).trim();
    line = line.slice(breakpoint);

    return extend({
      startTime: this.parseTime(start),
      endTime: this.parseTime(end)
    }, this.parsePlacement(line));

  },

  timeUnits$write: [1/1000, 1, 60, 360],
  parseTime$write: function(time) {

    var blocks = time.split(/[\:\.\,]{1}/g).reverse();
    if (blocks.length < 3) throw "Time declaration error, mm:ss.ttt or hh:mm:ss.tt";
    var seconds = 0;
    for (var i = 0, l = blocks.length; i < l; i++) {
      seconds += this.timeUnits[i]*parseInt(blocks[i]);
    }
    return seconds;

  },

  parsePlacement$write: function(line) {

    var items = line.split(" ").filter(function(item) {return item;});
    var parsed = {
      line: -1,
      position: "50%",
      size: "100%",
      align: "middle"
    };
    items.forEach(function(item) {
      var parts = item.split(":");
      var valueParts = parts[1].split(",");
      var name = parts[0].toLowerCase();
      switch (name) {
        case "d": name = "vertical"; break;
        case "l": name = "line"; break;
        case "t": name = "position"; break;
        case "s": name = "size"; break;
        case "a": name = "align"; break;
        case "vertical": case "line": case "position": case "size": case "align": break;
        default:
          throw "Bad position declaration, "+name;
      }
      parsed[name] = valueParts[0] || parsed[name];
    });

    // set vertical to rl/lr/horizontal
    parsed.vertical = (parsed.vertical === "vertical") ?
      "rl" :
      (parsed.vertical === "vertical-lr") ?
      "lr" :
      "horizontal";

    for (var name in parsed) {
      var value = parsed[name];
      switch (name) {
        case "line":
          value = String(value || -1);
          break;
        case "position":
          value = String(value || "0%");
          break;
        case "size":
          value = String(value || "100%");
          break;
        case "align":
          value = String(value || "middle");
          switch (value) {
            case "start": case "middle": case "end":
              break;
            default:
              throw "Invalid align declaration";
          }
          break;
      }
    }

    return parsed;
  },

  destroy: function() {
    for (var i = 0, l = this.cues.length; i < l; i++) {
      this.cues[i].destroy();
    }
    this.el.mode = this._previousMode;
    this.cues.length = 0;
    this.activeCues.length = 0;
    this.media = null;
    this.el = null;
    this.stopListening();
  }

}, {

  READYSTATE: {
    NONE: 0,
    LOADING: 1,
    LOADED: 2,
    ERROR: 3
  }

});

Media.DOMEvents.add([
  "texttrackchange",
  "cuechange"
]);

/**
 * A combination of TextTrackCue and VTTCue
 * @type {Object}
 */
Media.Class.TextTrackCue = Media.Class.extend({

  region: null,
  id: null,
  startTime: null,
  endTime: null,
  vertical: null,
  snapToLines: null,
  line: null,
  lineAlign: null,
  position: null,
  positionAlign: null,
  size: null,
  textAlign: null,
  text: null,

  track$write:null,
  _isLive$write: false,

  isLive$get$enum: function() {
    return this._isLive;
  },

  isLive$set$enum: function(value) {
    var eventName;
    if (!this._isLive && value) eventName = "enter";
    else if (this._isLive && !value) eventName = "exit";
    if (!eventName) return;
    this._isLive = value;
    this.trigger(eventName, this);
    this.track.media.dispatchEvent("cue"+eventName, {
      cue: this
    });
  },

  constructor: function TextTrackCue(startTime, endTime, text) {
    this.id = "cue-" + ++Media.Class.TextTrackCue.id,
    this.startTime = startTime;
    this.endTime = endTime;
    this.text = text;
    this.defineProperties({
      _isLive$write: false,
      track$write: false
    });
  },

  getCueAsHTML: function() {
    var classprefix = this.track.media.options.classprefix;
    var containerSpan = document.createElement("span");
    var containerAttributes = {
      id: this.id,
      lang: this.track.language,
      class: classprefix+"cue",
      style: ""
    }
    this.renderCuePlacement(containerAttributes, this);
    for (var k in containerAttributes) {
      containerSpan.setAttribute(k, containerAttributes[k]);
    }
    var innerSpan = document.createElement("span");
    innerSpan.setAttribute("class", classprefix+"cue-text");
    innerSpan.innerHTML = '<span class="'+classprefix+'cue-line">' + this.text.replace(/\n/g, '</span><br><span class="'+classprefix+'cue-line">') + "</span>";
    containerSpan.appendChild(innerSpan);
    return containerSpan;
  },

  renderCuePlacement$write: function(htmlObj, cue) {

    var classprefix = this.track.media.options.classprefix;
    var classes = htmlObj['class'].split(" ");
    classes.push(classprefix+"cue-"+cue.vertical);
    var style = "position: absolute;";

    switch (cue.vertical) {
      case "horizontal":
        style += "transform: translateX(-50%);"
        switch (cue.lineAlign) {
          case "start":
            style += "text-align: left;";
            classes.push(classprefix+"cue-align-left");
            break;
          case "middle":
            style += "text-align: center;";
            classes.push(classprefix+"cue-align-center");
            break;
          case "end":
            style += "text-align: right;";
            classes.push(classprefix+"cue-align-right");
            break;
        }
        style += "width:" + cue.size +";";
        style += "left:" + cue.position +";";
        var isPercentageMeasure = (String(cue.line).indexOf("%") > -1);
        if (isPercentageMeasure || cue.line >= 0) {
          var top = cue.line;
          style += "top:" + cue.line + "%";
        } else {
          var bottom = 100 - (Math.abs(cue.line) * 100);
          style += "bottom:" + bottom + "%";
        }
        break;
      case "rl":
        style += "transform: translateY(-50%);";
        switch (cue.lineAlign) {
          case "start":
            style += "text-align: left;";
            classes.push(classprefix+"cue-align-top");
            break;
          case "middle":
            style += "text-align: center;";
            classes.push(classprefix+"cue-align-middle");
            break;
          case "end":
            style += "text-align: right;";
            classes.push(classprefix+"cue-align-bottom");
            break;
        }
        style += "height:" + cue.size +";";
        style += "top:" + cue.position +";";
        var isPercentageMeasure = (String(cue.line).indexOf("%") > -1);
        if (isPercentageMeasure || cue.line >= 0) {
          var left = cue.line;
          style += "left:" + cue.line + "%";
        } else {
          var right = 100 - (Math.abs(cue.line) * 100);
          style += "right:" + right + "%";
        }
        break;
      case "lr":
        style += "transform: translateY(-50%);";
        switch (cue.lineAlign) {
          case "start":
            style += "text-align: left;";
            classes.push(classprefix+"cue-align-top");
            break;
          case "middle":
            style += "text-align: center;";
            classes.push(classprefix+"cue-align-middle");
            break;
          case "end":
            style += "text-align: right;";
            classes.push(classprefix+"cue-align-bottom");
            break;
        }
        style += "height:" + cue.size +";";
        style += "top:" + cue.position +";";
        var isPercentageMeasure = (String(cue.line).indexOf("%") > -1);
        if (isPercentageMeasure || cue.line >= 0) {
          var right = cue.line;
          style += "right:" + cue.line + "%";
        } else {
          var left = 100 - (Math.abs(cue.line) * 100);
          style += "left:" + left + "%";
        }
        break;
    }

    htmlObj['class'] = classes.join(" ");
    htmlObj['style'] = style;

    return htmlObj;

  },

  destroy: function() {
    this.media = null;
  }

}, {
  id: 0
});

Media.DOMEvents.add([
  "cueenter",
  "cueexit"
]);

/**
 * TextTrackList keeps all of the VTT tracks from the media component for use
 * in rendering captions or subtitles.
 * TODO: update track list when dom changes
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
Media.Class.TextTrackList = Media.Class.List.extend({

  media$write: null,

  constructor: function TextTrackList(media) {
    this.defineProperties({
      media$write: media
    });
    this.fetch();
  },

  default$get: function() {
    return this.find(function(track) {
      return track.default;
    });
  },

  fetch$write: function() {
    this.destroy();
    var tracks = {};
    var trackElements = this.media.el.querySelectorAll("track[type='text/vtt']");
    toArray(trackElements).forEach(function(el) {
      var lang = el.getAttribute("srclang");
      var src = el.getAttribute("src");
      if (!lang || !src || tracks[lang]) return;
      tracks[lang] = new Media.Class.TextTrack(this.media, el);
    }, this);
    this.addTracks(ObjectValues(tracks));
  },

  addTracks$write: function(tracks) {
    for (var i = 0, l = tracks.length; i < l; i++) {
      this.addTrack(tracks[i]);
    }
  },

  addTrack: function(track) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === track) return;
    }
    this.push(track);
    this.trigger("add", track, this);
    this.media.dispatchEvent("addtexttrack", {
      track: track
    });
  },

  removeTrack: function(track) {
    var isRemoved = false;
    for (var i = this.length-1; i > -1; i--) {
      if (this[i] !== track) continue;
      this.splice(i, 1);
      isRemoved = true;
    }
    if (!isRemoved) return;
    this.trigger("remove", track, this);
    this.media.dispatchEvent("removetexttrack", {
      track: track
    });
  },

  getTrackById: function(id) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i].el.id === id) return this[i];
    }
    return null;
  },

  destroy: function() {
    for (var i = 0, l = this.length; i < l; i++) {
      this[i].destroy();
    }
    this.length = 0;
    this.stopListening();
  }

});

Media.DOMEvents.add([
  "addtexttrack",
  "removetexttrack"
]);

Media.Class.TextTracks = Media.Class.extend({

  constructor: function TextTracks(media) {
    this.listenTo(Media, {
      create: this.onCreate,
      timeupdate: this.onTimeUpdate,
      destroy: this.onDestroy
    });
  },

  onCreate: function(media) {
    media.defineProperties({
      tracks$enum$write: new Media.Class.TextTrackList(media)
    });
  },

  onTimeUpdate: function(media, event) {
    if (!event.slow) return;
    for (var i = 0, l = media.tracks.length; i < l; i++) {
      var track = media.tracks[i];
      track.update();
    }
  },

  onDestroy: function(media) {
    if (!media.tracks) return;
    media.tracks.destroy();
    delete media.tracks;
  }

}, null, {
  instanceEvents: true
});

Media.defineProperties({
  texttracks$write: new Media.Class.TextTracks()
});

/*
This makes timeupdate events trigger at greater frequency, 120fps, 60fps and
12fps rather than the 4fps in most browsers.
*/
Media.Class.TimeUpdate = Media.Class.extend({

  playing: null,
  interval: null,
  slowInterval: null,
  inRaf: false,
  lastTickTime: null,
  slowLastTickTime: null,
  mediumLastTickTime: null,

  constructor: function TimeUpdate() {
    this.playing = [];
    this.listenTo(Media, {
      "play": this.onPlay,
      "pause finish destroyed": this.onPause
    });
    this.onRaf = this.onRaf.bind(this);
  },

  onPlay: function(media) {
    for (var i = 0, l = this.playing.length; i < l; i++) {
      if (this.playing[i] === media) return;
    }
    this.playing.push(media);
    if (this.inRaf) return;
    rafer.request(this.onRaf);
    this.inRaf = true;
  },

  onRaf: function() {
    var fpsfast = Media.DefaultOptions.get("fpsfast");
    this.interval = 1000/fpsfast;
    this.mediumInterval = 1000/(Media.DefaultOptions.get("fpsmedium") || fpsfast / 2);
    this.slowInterval = 1000/(Media.DefaultOptions.get("fpsslow") || fpsfast / 3);
    var now = Date.now();
    if (now < this.lastTickTime + this.interval) {
      if (!this.playing.length) {
        return this.inRaf = false;
      }
      return rafer.request(this.onRaf);
    }
    var options = {
      fast: true,
      medium: false,
      slow: false,
    }
    if (now >= this.mediumLastTickTime + this.mediumInterval) {
      this.mediumLastTickTime = now;
      options.medium = true;
    }
    if (now >= this.slowLastTickTime + this.slowInterval) {
      this.slowLastTickTime = now;
      options.slow = true;
    }
    this.lastTickTime = now;
    for (var i = 0, l = this.playing.length; i < l; i++) {
      this.playing[i].dispatchEvent('timeupdate', options);
    }

    return rafer.request(this.onRaf);
  },

  onPause: function(media) {
    for (var i = this.playing.length-1; i > -1; i--) {
      if (this.playing[i] !== media) continue;
      this.playing.splice(i, 1);
    }
  }

}, null, {
  instanceEvents: true
});

Media.defineProperties({
  "timeupdate$write": new Media.Class.TimeUpdate()
});
Media.DefaultOptions.add({
  fpsfast: 60, // Browser max : video manipulation
  fpsmedium: 30, // Movie standard : ui
  fpsslow: 12 // Half speed : subtitles
});

Media.defineProperties({
  "utils$write": {}
});
Media.utils.Rafer = Rafer;
Media.utils.rafer = rafer;
Media.utils.Class = Class;
Media.utils.List = List;
Media.utils.Elements = Elements;
Media.utils.elements = elements;
Media.utils.Events = Events;
Media.utils.EventsInitialize = EventsInitialize;
Media.utils.EventsArgumentsNotation = EventsArgumentsNotation;
Media.utils.EventRegister = EventRegister;
Media.utils.EventsRegistry = EventsRegistry;
Media.utils.properties = properties;
Media.utils.toArray = toArray;
Media.utils.isArray = isArray;
Media.utils.isObject = isObject;
Media.utils.extend = extend;
Media.utils.extendNotEnumerable = extendNotEnumerable;
Media.utils.deepDefaults = deepDefaults;
Media.utils.defaults = defaults;
Media.utils.indexOfRegex = indexOfRegex;
Media.utils.lastIndexOfRegex = lastIndexOfRegex;
Media.utils.includes = includes;
Media.utils.replace = replace;
Media.utils.parseUnit = parseUnit;
Media.utils.delay = delay;
Media.utils.debounce = debounce;
Media.utils.bindAll = bindAll;
Media.utils.toggleClass = toggleClass;
Media.utils.removeAttribute = removeAttribute;
Media.utils.removeElement = removeElement;
Media.utils.toggleClass = toggleClass;
Media.utils.prependElement = prependElement;
Media.utils.createEvent = createEvent;
})(window, window.jQuery);
