/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');

var PlaylistsPage = React.createClass({

  propTypes: {
    updateHeader: React.PropTypes.func.isRequired,
    playlist: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
    selectTrack: React.PropTypes.func
  },

  componentDidMount: function() {
    this.props.updateHeader({
      title: 'Playlists',
      icon: 'fa-list'
    });
  },

  render: function() {
    return (
      <section className="content playlists">

        List of all your Playlists

      </section>
    );
  }

});

module.exports = PlaylistsPage;