Media.Class.DOMChanges = Media.Class.extend({

  constructor: function DOMChanges(media) {
    this.listenTo(Media, {
      "created": this.onCreated,
      "destroyed": this.onDestroyed
    });
  },

  onCreated: function(media) {
    var mutationobserver = new MutationObserver(function(mutations, mutationobserver) {
      this.dispatchEvent("change", { mutations: mutations });
    }.bind(media));
    mutationobserver.observe(media.el, { attributes:true, childList: true, subtree: true });
    media.defineProperties({
      mutationobserver$value: mutationobserver
    });
  },

  onDestroyed: function(media) {
    media.mutationobserver.disconnect();
  }

});

Media.defineProperties({
  domchanges$write: new Media.Class.DOMChanges()
});

Media.DOMEvents.add([
  'change'
]);
