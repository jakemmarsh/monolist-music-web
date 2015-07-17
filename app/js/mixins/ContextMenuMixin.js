'use strict';

var DropdownMenu = require('../components/DropdownMenu');

var ContextMenuMixin = {

  getInitialState() {
    return {
      displayContextMenu: false
    };
  },

  clickMenuItem(e) {
    e.stopPropagation();
    e.preventDefault();
  },

  hideContextMenu() {
    this.setState({ displayContextMenu: false }, () => {
      document.onclick = function() {};
    });
  },

  showContextMenu(e, menuItems, width) {
    this.setState({
      displayContextMenu: true,
      menuItems: menuItems, // the list of menu items to be rendered within the dropdown menu
      mouseX: e.pageX,
      mouseY: e.pageY,
      width: width || null
    }, function() {
      document.onclick = () => {
        if ( this.state.displayContextMenu ) {
          this.hideContextMenu();
        }
      };
    });
  },

  renderContextMenu() {
    if ( this.state.displayContextMenu ) {
      return (
        <DropdownMenu left={this.state.mouseX} top={this.state.mouseY} width={this.state.width}>
          {this.state.menuItems}
        </DropdownMenu>
      );
    }
  }

};

export default ContextMenuMixin;