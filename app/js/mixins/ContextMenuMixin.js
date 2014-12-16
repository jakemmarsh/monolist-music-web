/**
 * @jsx React.DOM
 */
'use strict';

var DropdownMenu = require('../components/DropdownMenu');

var ContextMenuMixin = {

  getInitialState: function() {
    return {
      displayContextMenu: false
    };
  },

  clickMenuItem: function(e) {
    e.stopPropagation();
    e.preventDefault();
  },

  hideContextMenu: function() {
    this.setState({ displayContextMenu: false }, function() {
      document.onclick = function() {};
    });
  },

  showContextMenu: function(e, menuItems, width) {
    this.setState({
      displayContextMenu: true,
      menuItems: menuItems, // the list of menu items to be rendered within the dropdown menu
      mouseX: e.pageX,
      mouseY: e.pageY,
      width: width || null
    }, function() {
      document.onclick = function() {
        if ( this.state.displayContextMenu ) {
          this.hideContextMenu();
        }
      }.bind(this);
    });
  },

  renderContextMenu: function() {
    var element = null;

    if ( this.state.displayContextMenu ) {
      element = (
        <DropdownMenu left={this.state.mouseX} top={this.state.mouseY} width={this.state.width}>
          {this.state.menuItems}
        </DropdownMenu>
      );
    }

    return element;
  }

};

module.exports = ContextMenuMixin;