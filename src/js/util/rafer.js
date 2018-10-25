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
