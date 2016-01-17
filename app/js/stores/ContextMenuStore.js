'use strict';

import Reflux        from 'reflux';

import GlobalActions from '../actions/GlobalActions';

const ContextMenuStore = Reflux.createStore({

  init() {
    this.x = null;
    this.y = null;
    this.width = null;
    this.contents = null;

    this.listenTo(GlobalActions.openContextMenu, this.open);
    this.listenTo(GlobalActions.closeContextMenu, this.close);
  },

  open(contents, x, y, width) {
    this.contents = contents;
    this.x = x || null;
    this.y = y || null;
    this.width = width || null;

    this.trigger({
      x: this.x,
      y: this.y,
      width: this.width,
      contents: this.contents
    });

    document.onclick = GlobalActions.closeContextMenu;
  },

  close() {
    this.x = null;
    this.y = null;
    this.width = null;
    this.contents = null;

    this.trigger({
      x: this.x,
      y: this.y,
      width: this.width,
      contents: this.contents
    });

    document.onclick = function() {};
  }

});

export default ContextMenuStore;
