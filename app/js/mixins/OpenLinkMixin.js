'use strict';

var nwGuiDefined = global.window.nwDispatcher && global.window.nwDispatcher.requireNwGui;
var gui          = nwGuiDefined ? global.window.nwDispatcher.requireNwGui() : null;

var OpenLinkMixin = {

  openExternalLink: function(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    if ( gui ) {
      gui.Shell.openExternal(evt.target.href);
    }
  }

};

module.exports = OpenLinkMixin;