/**
 * @jsx React.DOM
 */
 'use strict';

var React = require('react/addons');
var Link  = require('react-router').Link;

var CreateStoreMixin = require('../mixins/CreateStoreMixin');
var PlaylistStore    = require('../stores/PlaylistStore');
var Playlist         = require('../components/Playlist');
var PlaylistSidebar  = require('../components/PlaylistSidebar');

var playlists = [
  {
    title: 'Example Playlist',
    id: 0
  },
  {
    title: 'My Rap Playlist',
    id: 1
  }
];

var PlaylistPage = React.createClass({

  mixins: [CreateStoreMixin([PlaylistStore])],

  getDefaultProps: function() {
    return {
      playlists: playlists
    };
  },

  getStateFromStore: function(props) {
    props = props || this.props;
    // var playlist = PlaylistStore.get(props.params.username);
    var playlist = {
      title: 'My Rap Playlist',
      privacy: 'public'
    };

    return {
      playlist: playlist
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState(this.getStateFromStore(nextProps));
  },

  componentDidMount: function() {
    this.props.updateHeader({
      title: this.state.playlist.title,
      icon: this.state.playlist.privacy === 'public' ? 'fa-globe' : 'fa-lock',
      onPlaylist: true
    });
  },

  render: function() {
    return (
      <div>
        <section className="content">
          <Playlist tracks={this.props.playlist} selectTrack={this.props.selectTrack} currentTrack={this.props.currentTrack} />
        </section>

        <nav className="sidebar right">
          <PlaylistSidebar playlists={this.props.playlists} currentPlaylistId={this.props.params.id} />
        </nav>
      </div>
    );
  }

});

module.exports = PlaylistPage;