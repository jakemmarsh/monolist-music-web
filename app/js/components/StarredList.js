/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var StarredList = React.createClass({

  propTypes: {
    tracks: React.PropTypes.array.isRequired
  },

  getDefaultProps: function() {
    return {
      tracks: []
    };
  },

  render: function() {
    return (
      <div />
    );
  }

});

module.exports = React.createFactory(StarredList);