'use strict';

import React    from 'react';
import ReactDOM from 'react-dom';
import _        from 'lodash';
import cx       from 'classnames';

const DropdownMenu = React.createClass({

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
    openLeft: React.PropTypes.bool,
    items: React.PropTypes.array,
    children: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      top: '100%',
      left: 0,
      openLeft: false
    };
  },

  getInitialState() {
    return {
      top: this.props.top,
      left: this.props.openLeft ? this.props.left : this.props.left ,
      playlistsWillOverflow: false
    };
  },

  _checkEdges() {
    const menu = ReactDOM.findDOMNode(this).getBoundingClientRect();
    const menuWidth = menu.width;
    const menuHeight = menu.height;
    const topEdge = this.props.top;
    const rightEdge = this.props.left + menuWidth - window.scrollX;
    const bottomEdge = this.props.top + menuHeight - window.scrollY;
    const leftEdge = this.props.left;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const newState = {};

    if ( topEdge < 0 ) {
      newState.newTop = 0;
    } else if ( bottomEdge > screenHeight ) {
      newState.top = screenHeight - menuHeight + window.scrollY;

      if ( bottomEdge + 100 > screenHeight ) {
        newState.playlistsWillOverflow = true;
      }
    }

    if ( this.props.openLeft ) {
      newState.left = this.props.left - menuWidth;
    } else if ( leftEdge < 0 ) {
      newState.left = 0;
    } else if ( rightEdge > screenWidth ) {
      newState.left = screenWidth - menuWidth + window.scrollX;
    }

    if ( !_.isEmpty(newState) ) {
      this.setState(newState);
    }
  },

  componentDidMount() {
    this._checkEdges();
  },

  componentDidUpdate(prevProps) {
    if ( prevProps.left !== this.props.left || prevProps.top !== this.props.top ) {
      this._checkEdges();
    }
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
    const menuClasses = cx('dropdown-menu', {
      'playlist-overflow': this.state.playlistsWillOverflow,
      'open-left': this.props.openLeft
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
