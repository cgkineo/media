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
    value: defaults(classOptions, parent['classOptions'], {
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
  if (child['classOptions'].extendFunction) {
    extendNotEnumerable(child, {
      extend: ClassExtend
    });
  }

  // Add events system to Class
  if (child['classOptions'].classEvents) {
    extendNotEnumerable(child, Events);
  }

  // Extend constructor with parent functions and cls properties
  if (child['classOptions'].inheritClassEnumerables) extend(child, parent);
  extend(child, cls);

  // Add events system to prototype
  if (child['classOptions'].instanceEvents && child.prototype.events === undefined) {
    extendNotEnumerable(child.prototype, Events);
  }

  // Extend constructor.prototype with prototype chain
  extend(child.prototype, proto);

  // Apply properties pattern to constructor prototype
  if (child['classOptions'].instanceProperties) {
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
  if (child['classOptions'].classProperties) {
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

// Create base Class and List prototypes
// Add Events system to both class and instances
var Class = ClassExtend.call(ClassParent, { constructor: function Class() {} }, {}, { classEvents: false, instanceEvents: false });
var List = ClassExtend.call(ListParent, { constructor: function List() {} }, {}, { classEvents: false, instanceEvents: false });
if (!Array.prototype.find) {
  List.prototype.find = function(iterator) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (iterator(this[i], i)) return this[i];
    }
    return;
  };
}
