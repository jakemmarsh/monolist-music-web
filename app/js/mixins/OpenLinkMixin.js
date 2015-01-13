'use strict';

var gui = global.window.nwDispatcher.requireNwGui();

var OpenLinkMixin = {

  openExternalLink: function(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    gui.Shell.openExternal(evt.target.href);
  }

};

module.exports = OpenLinkMixin;