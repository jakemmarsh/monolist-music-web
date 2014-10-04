/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');
var _     = require('underscore');

var DropdownMenu = React.createClass({

  propTypes: {
    top: React.PropTypes.number.isRequired,
    left: React.PropTypes.number.isRequired,
    items: React.PropTypes.array
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
      'position': 'absolute',
      'top': this.props.top,
      'left': this.props.left
    };

    return (
      <ul className="dropdown-menu" style={menuStyles}>
        {this.renderMenuItems()}
      </ul>
    );
  }

});

module.exports = DropdownMenu;