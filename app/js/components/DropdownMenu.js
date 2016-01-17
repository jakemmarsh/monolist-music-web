'use strict';

import React    from 'react';
import ReactDOM from 'react-dom';
import _        from 'lodash';
import $        from 'jquery';
import cx       from 'classnames';

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
    items: React.PropTypes.array,
    children: React.PropTypes.object
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
    const $menu = $(ReactDOM.findDOMNode(this));
    const $window = $(window);
    const menuWidth = $menu.width();
    const menuHeight = $menu.height();
    const topEdge = this.props.top;
    const rightEdge = this.props.left + menuWidth - $window.scrollLeft();
    const bottomEdge = this.props.top + menuHeight - $window.scrollTop();
    const leftEdge = this.props.left;
    const screenWidth = $window.width();
    const screenHeight = $window.height();
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
          <li key={index}>
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
    const menuClasses = cx({
      'dropdown-menu': true,
      'playlist-overflow': this.state.playlistsWillOverflow
    });
    const menuStyles = {
      top: this.state.top,
      left: this.state.left,
      width: this.props.width
    };

    return (
      <ul className={menuClasses} style={menuStyles}>
        {this.renderMenuItems()}
      </ul>
    );
  }

});

export default DropdownMenu;