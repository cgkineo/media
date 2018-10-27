var Elements = List.extend({

  subject: null,

  constructor: function Elements(selector, subject) {
    this.subject = subject || document;
    this.add(selector, this.subject);
    this.selector = selector;
  },

  filterByAttribute: function(attrName, filterValue) {
    var items = this.filter(function(item) {
      if (!item.getAttribute) return;
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
      if (!item.tagName) return;
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
    var path = this.path();
    return Boolean(path.find(function(item) {
      if (!(item instanceof Element)) return;
      var style = window.getComputedStyle(item);
      var isHidden = style.visibility == "hidden" ||
        style.display == "none" || style.opacity == 0;
      return isHidden;
    }));
  },

  path: function(selector) {
    var path = this.parents();
    path.unshift(this[0]);
    if (selector) {
      path = path.filter(function(item) {
        return (item.matches(selector));
      });
    }
    return path;
  },

  parents: function(selector) {
    var parent = this[0];
    var parents = new Elements();
    if (!parent) return parents;
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

  children: function(selector) {
    var element = this[0];
    if (!element) return new Elements();
    var children = new Elements(element.children);
    if (selector) {
      children = children.filter(function(item) {
        return (item.matches(selector));
      });
    }
    return children;
  },

  remove: function() {
    this.forEach(function(element) {
      if (element.remove) return element.remove();
      if (element.parentNode) element.parentNode.removeChild(element);
    });
  },

  replaceWith: function(withElement) {
    var element = this[0];
    if (!element) return this;
    if (element.replaceWith) {
      element.replaceWith(withElement);
      return this;
    }
    var parent = element.parentNode;
    for (var i = 0, l = parent.childNodes.length; i < l; i++) {
      if (parent.childNodes[i] !== element) continue;
      parent.insertBefore(withElement, element);
      elements(element).remove();
      return this;
    }
    return this;
  },

  prepend: function(element) {
    var container = this[0];
    if (!container) return this;
    if (!container.childNodes.length) {
      container.appendChild(element);
      return this;
    }
    container.insertBefore(element, container.childNodes[0]);
    return this;
  },

  value: function() {
    return this[0].value;
  },

  add: function(selector, subject) {
    this.selector = "";
    subject = subject || document;
    if (selector instanceof HTMLElement || selector === window || selector === document) {
      this.push(selector);
      return this;
    }
    if (selector instanceof Array || selector instanceof NodeList || selector instanceof HTMLCollection) {
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
      if (!this[i].cloneNode) continue;
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
      if (!element.addEventListener) return;
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
      if (!element.removeEventListener) return;
      element.removeEventListener(name, callback);
    });
    return this;
  },

  append: function(element) {
    this[0].appendChild(element);
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
      if (element.removeAttribute) return element.removeAttribute(name);
      if (element.attributes.removeNamedItem && element.attributes.getNamedItem(name)) {
        return element.attributes.removeNamedItem(name);
      }
      element.setAttribute(name, "");
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
      if (!element.setAttribute) return;
      element.setAttribute(name, value);
    });
    return this;
  },

  toggleClass: function(classNames, bool) {
    this.forEach(function(element) {
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
      if (element.classList.length) return;
      elements(element).removeAttribute("class");
    });
    return this;
  },

  html: function(value) {
    if (value === undefined) {
      return this[0] && this[0].innerHTML;
    }
    this.forEach(function(element) {
      element.innerHTML = value;
    });
  },

  dispatchEvent: function(name, options) {
    var element = this[0];
    options = defaults(options, {
      bubbles: false,
      cancelable: true
    });
    if (!Elements._ie11) {
      try {
        var event = new Event(name, options);
        extend(event, options);
        element.dispatchEvent(event);
        return this;
      } catch (e) {
        Elements._ie11 = true;
      }
    }
    if (!Elements._ie11) return;
    var event = document.createEvent('Event');
    event.initEvent(name, options.bubbles, options.cancelable);
    extend(event, options);
    element.dispatchEvent(event);
    return this;
  }

});

var elements = function(selector, subject) { return new Elements(selector, subject); };
extend(elements, Elements);
