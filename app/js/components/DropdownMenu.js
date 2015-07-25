'use strict';

import React from 'react/addons';
import _     from 'lodash';
import $     from 'jquery';
import cx    from 'classnames';

var DropdownMenu = React.createClass({

  propTypes: {
    top: React.PropTypes.oneOfType([
      React.PropTypes.number.isRequired,
      React.PropTypes.string.isRequired
    ]),
    left: React.PropTypes.oneOfType([
      React.PropTypes.number.isRequired,
      React.PropTypes.string.isRequired
    ]),
    width: React.PropTypes.oneOfType([
      React.PropTypes.number.isRequired,
      React.PropTypes.string.isRequired
    ]),
    items: React.PropTypes.array
  },

  getDefaultProps() {
    return {
      top: '100%',
      left: 0
    };
  },

  getInitialState() {
    return {
      top: this.props.top,
      left: this.props.left,
      playlistsWillOverflow: false
    };
  },

  _checkEdges() {
    let $menu = $(this.getDOMNode());
    let $window = $(window);
    let menuWidth = $menu.width();
    let menuHeight = $menu.height();
    let topEdge = this.state.top;
    let rightEdge = this.state.left + menuWidth - $window.scrollLeft();
    let bottomEdge = this.state.top + menuHeight - $window.scrollTop();
    let leftEdge = this.state.left;
    let screenWidth = $window.width();
    let screenHeight = $window.height();
    var newState = {};

    if ( topEdge < 0 ) {
      newState.newTop = 0;
      console.log('top overflow');
    } else if ( rightEdge > screenWidth ) {
      console.log('right overflow');
      newState.left = screenWidth - menuWidth + $window.scrollLeft();
    } else if ( bottomEdge > screenHeight ) {
      console.log('bottom overflow');
      newState.top = screenHeight - menuHeight + $window.scrollTop();
      if ( bottomEdge + 70 > screenHeight ) {
        newState.playlistsWillOverflow = true;
      }
    } else if ( leftEdge < 0 ) {
      console.log('left overflow');
      newState.left = 0;
    }

    if ( !_.isEmpty(newState) ) {
      console.log('will set new state:', newState);
      this.setState(newState);
    }
  },

  componentDidMount() {
    this._checkEdges();
  },

  componentDidUpdate() {
    // TODO: set new state if new 'top' or 'left' props
    this._checkEdges();
  },

  renderSubmenuItems(submenuItems) {
    return _.map(submenuItems, (item, index) => {
        return (
          <li key={index}>{item.title}</li>
        );
      });
  },

  renderMenuItems() {
    let items;
    let iconClasses;

    if ( this.props.items ) {
      items = _.map(this.props.items, (item, index) => {
        iconClasses = 'fa ' + item.icon;

        return (
          <li key={index} onClick={this.props.clickMenuItem}>
            <i className={iconClasses}></i>
            {item.title}
            <ul>
              {this.renderSubmenuItems(item.subItems)}
            </ul>
          </li>
        );
      });
    } else {
      items = this.props.children;
    }

    return items;
  },

  render: function() {
    let menuClasses = cx({
      'dropdown-menu': true,
      'playlist-overflow': this.state.playlistsWillOverflow
    });
    let menuStyles = {
      'top': this.state.top,
      'left': this.state.left,
      'width': this.props.width
    };

    return (
      <ul className={menuClasses} style={menuStyles}>
        {this.renderMenuItems()}
      </ul>
    );
  }

});

export default DropdownMenu;