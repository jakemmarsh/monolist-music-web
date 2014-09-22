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
      onChange: function() {}
    };
  },

  render: function() {
    return (
      <div className="search">
        <div className="icon-container">
          <i className="fa fa-search" />
        </div>
        <input type="text" className="search-bar" value={this.props.value} onChange={this.props.onChange} placeholder={this.props.placeholder} />
      </div>
    );
  }

});

module.exports = SearchBar;