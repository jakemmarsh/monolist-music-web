/**
 * @jsx React.DOM
 */
 'use strict';

var React = require('react/addons');

var CreateStoreMixin    = require('../mixins/CreateStoreMixin');
var PlaylistStore       = require('../stores/PlaylistStore');
var TracklistControlBar = require('../components/TracklistControlBar');
var SearchBar           = require('../components/SearchBar');
var Tracklist           = require('../components/Tracklist');
var PlaylistSidebar     = require('../components/PlaylistSidebar');

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

  getInitialState: function() {
    return {
      query: ''
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
      icon: this.state.playlist.privacy === 'public' ? 'fa-globe' : 'fa-lock'
    });
  },

  updateQuery: function(evt) {
    this.setState({
      query: evt.target.value
    });
  },

  render: function() {
    return (
      <div>

        <section className="content">
          <TracklistControlBar type="playlist">
            <div className="options-container">
            </div>
            <div className="search-container">
              <SearchBar value={this.state.query}
                         onChange={this.updateQuery}
                         placeholder="Search playlist...">
              </SearchBar>
            </div>
          </TracklistControlBar>
          <Tracklist type="playlist"
                     tracks={this.props.playlist.tracks}
                     filter={this.state.query}
                     selectTrack={this.props.selectTrack}
                     currentTrack={this.props.currentTrack} />
        </section>

        <nav className="sidebar right">
          <PlaylistSidebar playlists={this.props.playlists} currentPlaylistId={this.props.params.id} />
        </nav>

      </div>
    );
  }

});

module.exports = PlaylistPage;