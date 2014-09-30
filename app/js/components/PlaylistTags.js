/**
 * @jsx React.DOM
 */
'use strict';

var React        = require('react/addons');
var transitionTo = require('react-router').transitionTo;
var _            = require('underscore');

var PlaylistTags = React.createClass({

  propTypes: {
    tags: React.PropTypes.array.isRequired
  },

  searchTag: function(tag) {
    transitionTo('PlaylistSearch', {}, { q: tag });
  },

  renderTags: function() {
    var tagElements;

    tagElements = _.map(this.props.tags, function(tag, index) {
      return (
        <li className="tag" key={index} onClick={this.searchTag.bind(null, tag)}>
          {tag}
        </li>
      );
    }.bind(this));

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