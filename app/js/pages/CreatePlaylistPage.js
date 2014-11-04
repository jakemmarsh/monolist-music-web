/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');

var CreatePlaylistPage = React.createClass({

  componentDidMount: function() {
    this.props.updatePageTitle('Create Playlist');
  },

  render: function() {
    return (
      <section className="content create-playlist" />
    );
  }

});

module.exports = React.createFactory(CreatePlaylistPage);