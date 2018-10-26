var MediaUIList = List.extend({

  constructor: function MediaUIList() {},

  add: function(ui) {
    var found = this.find(function(item) {
      return ui === item;
    });
    if (found) return;
    this.push(ui);
  },

  remove: function(ui) {
    var foundIndex = -1;
    for (var i = 0, l = this.length; i < l; i++) {
      if (ui !== this[i]) continue;
      foundIndex = i;
      break;
    }
    if (foundIndex === -1) return;
    this.splice(foundIndex, 1);
  }

});
