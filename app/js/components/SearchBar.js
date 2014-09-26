/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var SearchBar = React.createClass({

  propTypes: {
    value: React.PropTypes.string.isRequired,
    placeholder: React.PropTypes.string,
    onChange: React.PropTypes.func,
    onKeyPress: React.PropTypes.func
  },

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
      <div className="search-bar">
        <div className="icon-container">
          <i className="fa fa-search" />
        </div>
        <input ref="input"
               type="text"
               value={this.props.value}
               onChange={this.props.onChange}
               onKeyPress={this.props.onKeyPress}
               placeholder={this.props.placeholder} />
      </div>
    );
  }

});

module.exports = SearchBar;