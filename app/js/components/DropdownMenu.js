'use strict';

import React from 'react/addons';
import _     from 'lodash';
import $     from 'jquery';
import cx    from 'classnames';

var DropdownMenu = React.createClass({

  propTypes: {
    top: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]),
    left: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]),
    width: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
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
    let topEdge = this.props.top;
    let rightEdge = this.props.left + menuWidth - $window.scrollLeft();
    let bottomEdge = this.props.top + menuHeight - $window.scrollTop();
    let leftEdge = this.props.left;
    let screenWidth = $window.width();
    let screenHeight = $window.height();
    let newState = {};

    if ( topEdge < 0 ) {
      newState.newTop = 0;
    } else if ( rightEdge > screenWidth ) {
      newState.left = screenWidth - menuWidth + $window.scrollLeft();
    } else if ( bottomEdge > screenHeight ) {
      newState.top = screenHeight - menuHeight + $window.scrollTop();
      if ( bottomEdge + 100 > screenHeight ) {
        newState.playlistsWillOverflow = true;
      }
    } else if ( leftEdge < 0 ) {
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
        iconClasses = 'icon-' + item.icon;

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