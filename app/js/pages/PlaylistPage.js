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

var playlist = {
  tracks: [
    {
      title: 'Candler Road',
      artist: 'Childish Gambino',
      duration: 214615,
      source: 'soundcloud',
      sourceParam: '164497989',
      image: 'https://i1.sndcdn.com/artworks-000064028350-zpvcu0-large.jpg?e76cf77',
      id: 0,
      comments: [
        {
          body: 'this is a comment',
          author: 'jakemmarsh'
        }
      ],
    },
    {
      title: 'Alright (ft. Big Sean)',
      artist: 'Logic',
      source: 'soundcloud',
      sourceParam: '146132553',
      image: 'https://i1.sndcdn.com/artworks-000077385297-oitifi-large.jpg?e76cf77',
      id: 1
    },
    {
      title: 'Jit/Juke',
      artist: 'Big Sean',
      source: 'soundcloud',
      sourceParam: '168793745',
      image: 'https://i1.sndcdn.com/artworks-000091744682-w6c1ym-large.jpg?e76cf77',
      id: 2
    },
    {
      title: 'Fight Night',
      artist: 'Migos',
      source: 'youtube',
      sourceParam: 'HsVnUpl2IKQ',
      image: 'https://i.ytimg.com/vi/HsVnUpl2IKQ/hqdefault.jpg',
      id: 3
    },
    {
      title: 'I',
      artist: 'Kendrick Lamar',
      source: 'youtube',
      sourceParam: 'hYIqaHWiW5M',
      image: 'https://i.ytimg.com/vi/hYIqaHWiW5M/hqdefault.jpg',
      id: 4
    }
  ]
};

var PlaylistPage = React.createClass({

  mixins: [CreateStoreMixin([PlaylistStore])],

  propTypes: {
    updateHeader: React.PropTypes.func.isRequired,
    playlist: React.PropTypes.object.isRequired,
    currentTrack: React.PropTypes.object,
    selectTrack: React.PropTypes.func.isRequired
  },

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

  selectTrack: function(track, index) {
    // TODO: only call this if its not already the current playlist
    this.props.selectPlaylist(playlist);

    this.props.selectTrack(track, index);
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
                     tracks={playlist.tracks}
                     filter={this.state.query}
                     selectTrack={this.selectTrack}
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