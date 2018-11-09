Media.Class.DOMChanges = Media.Class.extend({

  constructor: function DOMChanges() {
    this.listenTo(Media, {
      "created": this.onCreated,
      "destroyed": this.onDestroyed
    });
  },

  onCreated: function(media) {
    if (media.mutationobserver) return;
    var mutationobserver = new MutationObserver(function(mutations, mutationobserver) {
      media.dispatchEvent("change", { mutations: mutations });
    });
    mutationobserver.observe(media.el, { attributes:true, childList: true, subtree: true });
    media.defineProperties({
      mutationobserver$value: mutationobserver
    });
    this.listenTo(media.options, "change", function(event) {
      this.onOptionsChange(media, event);
    });
  },

  onOptionsChange: function(media) {
    media.dispatchEvent("change", {
      mutations: null
    });
  },

  hold: function(media) {
    this.onDestroyed(media);
  },

  resume: function(media) {
    this.onCreated(media);
  },

  onDestroyed: function(media) {
    if (!media.mutationobserver) return;
    media.mutationobserver.disconnect();
    delete media.mutationobserver;
    this.stopListening(media.options, "change");
  }

});

Media.defineProperties({
  changes$write: new Media.Class.DOMChanges()
});

Media.DOMEvents.add([
  'change'
]);
