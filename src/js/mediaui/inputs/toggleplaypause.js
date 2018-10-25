MediaUI.Input.TogglePlayPause = MediaUI.Input.extend({

  ui: null,
  $els: null,

  constructor: function TogglePlayPause(ui) {
    MediaUI.Input.apply(this, arguments);
    bindAll(this, "onClick", "onTap");
    this.$els = ui.$all().filterByAttribute(ui.options.inputattribute, "toggleplaypause");
    if (!this.$els.length) return;
    this.ui = ui;
    this.$els.on({
      "click": this.onClick
    });
    this.listenTo(this.ui, {
      "tap": this.onTap
    });
  },

  onClick: function(event) {
    event.stopPropagation();
    var $target = elements(event.target);
    if ($target.isHidden()) return;
    this.ui.trigger("stoptap");
    this.toggle();
  },

  onTap: function(event) {
    var $target = elements(event.target);
    var playpausetogglenotouch = $target.filterByAttribute(this.ui.options.inputattribute, "toggleplaypause:notouch");
    if ($target.isHidden() || !playpausetogglenotouch.length || Media.device.wasTouchedRecently) return;
    this.toggle();
  },

  toggle: function() {
    var isPaused = this.ui.source.paused;
    if (isPaused) this.ui.source.play();
    else this.ui.source.pause();
  },

  destroy: function() {
    MediaUI.Input.prototype.destroy.apply(this, arguments);
    this.$els.off("click", this.onClick);
    this.ui = null;
  }

});

