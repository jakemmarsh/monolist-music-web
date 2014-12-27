/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');
var Link  = React.createFactory(require('react-router').Link);
var _     = require('lodash');

var PlaylistTags = React.createClass({

  propTypes: {
    tags: React.PropTypes.array.isRequired,
    className: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      tags: [],
      className: ''
    };
  },

  renderTags: function() {
    var tagElements = null;

    tagElements = _.map(this.props.tags, function(tag, index) {
      return (
        <li className="tag" key={index}>
          {tag}
          <Link to="PlaylistSearch" query={{ q: tag }} />
        </li>
      );
    }.bind(this));

    return tagElements;
  },

  render: function() {
    var classes = this.props.className + ' playlist-tags-container';

    return (
      <ul className={classes}>
        {this.renderTags()}
      </ul>
    );
  }

});

module.exports = React.createFactory(PlaylistTags);