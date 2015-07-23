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
      left: this.props.left
    };
  },

  _checkEdges() {
    let $menu = $(this.getDOMNode());
    let menuWidth = $menu.outerWidth();
    let menuHeight = $menu.outerHeight();
    let topEdge = this.state.top;
    let rightEdge = this.state.left + menuWidth;
    let bottomEdge = this.state.top + menuHeight;
    let leftEdge = this.state.left;
    let screenWidth = $(window).width();
    let screenHeight = $(window).height();
    let newTop = null;
    let newLeft = null;

    if ( topEdge < 0 ) {
      newTop = 0;
    } else if ( rightEdge > screenWidth ) {
      newLeft = screenWidth - menuWidth;
    } else if ( bottomEdge > screenHeight ) {
      newTop = screenHeight - menuHeight;
    } else if ( leftEdge < 0 ) {
      newLeft = 0;
    }

    if ( _.isNumber(newTop) ) {
      this.setState({
        top: newTop,
        bottomDidOverflow: newTop < this.state.top
      });
    } else if ( _.isNumber(newLeft) ) {
      this.setState({ left: newLeft });
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
      'bottom-overflow': this.state.bottomDidOverflow
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