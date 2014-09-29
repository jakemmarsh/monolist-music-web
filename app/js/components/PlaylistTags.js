/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');
var _     = require('underscore');

var PlaylistTags = React.createClass({

  propTypes: {
    tags: React.PropTypes.array.isRequired
  },

  renderTags: function() {
    var tagElements;

    tagElements = _.map(this.props.tags, function(tag, index) {
      return (
        <li className="tag" key={index}>
          {tag}
        </li>
      );
    });

    return tagElements;
  },

  render: function() {
    return (
      <ul className="playlist-tags-container">
        {this.renderTags()}
      </ul>
    );
  }

});

module.exports = PlaylistTags;