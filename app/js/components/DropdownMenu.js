/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');
var _     = require('lodash');

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

  getDefaultProps: function() {
    return {
      top: '100%',
      left: 0,
      // width: '100%'
    };
  },

  renderSubmenuItems: function(submenuItems) {
    return _.map(submenuItems, function(item, index) {
        return (
          <li key={index}>{item.title}</li>
        );
      });
  },

  renderMenuItems: function() {
    var items;
    var iconClasses;

    if ( this.props.items ) {
      items = _.map(this.props.items, function(item, index) {
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
      }.bind(this));
    } else {
      items = this.props.children;
    }

    return items;
  },

  render: function() {
    var menuStyles = {
      'top': this.props.top,
      'left': this.props.left,
      'width': this.props.width
    };

    return (
      <ul className="dropdown-menu" style={menuStyles}>
        {this.renderMenuItems()}
      </ul>
    );
  }

});

module.exports = React.createFactory(DropdownMenu);