/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var SearchBar = React.createClass({

  getDefaultProps: function() {
    return {
      placeholder: 'Search...',
      value: '',
      onChange: function() {},
      onKeyPress: function() {}
    };
  },

  render: function() {
    return (
      <div className="search">
        <div className="icon-container">
          <i className="fa fa-search" />
        </div>
        <input ref="input"
               type="text"
               className="search-bar"
               value={this.props.value}
               onChange={this.props.onChange}
               onKeyPress={this.props.onKeyPress}
               placeholder={this.props.placeholder} />
      </div>
    );
  }

});

module.exports = SearchBar;