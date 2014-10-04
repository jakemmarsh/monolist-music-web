/**
 * @jsx React.DOM
 */
'use strict';

var DropdownMenu = require('../components/DropdownMenu');

var ContextMenuMixin = {

  menuItems: [
    {
      title: 'Delete Track',
      icon: 'fa-remove'
    },
    {
      title: 'Add to Playlist',
      icon: 'fa-plus',
      subItems: [
        {
          title: 'My Rap Playlist'
        }
      ]
    }
  ],

  getInitialState: function() {
    return {
      displayContextMenu: false
    };
  },

  componentDidMount: function() {
    document.onclick = function() {
      if ( this.state.displayContextMenu ) {
        this.hideContextMenu();
      }
    }.bind(this);
  },

  clickMenuItem: function(e) {
    e.stopPropagation();
    e.preventDefault();
  },

  hideContextMenu: function() {
    this.setState({
      displayContextMenu: false
    });
  },

  showContextMenu: function(e, menuItems) {
    this.setState({
      displayContextMenu: true,
      menuItems: menuItems, // the list of menu items to be rendered within the dropdown menu
      mouseX: e.pageX,
      mouseY: e.pageY
    });
  },

  renderContextMenu: function() {
    var element = null;

    if ( this.state.displayContextMenu ) {
      element = (
        <DropdownMenu left={this.state.mouseX} top={this.state.mouseY}>
          {this.state.menuItems}
        </DropdownMenu>
      );
    }

    return element;
  }

};

module.exports = ContextMenuMixin;