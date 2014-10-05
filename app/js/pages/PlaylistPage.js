/**
 * @jsx React.DOM
 */
 'use strict';

var React           = require('react/addons');

var PageControlBar  = require('../components/PageControlBar');
var SearchBar       = require('../components/SearchBar');
var Tracklist       = require('../components/Tracklist');
var PlaylistSidebar = require('../components/PlaylistSidebar');

var playlist = {
  privacy: 'public',
  userIsCollaborator: true,
  title: 'My Rap Playlist',
  tags: ['Rap', 'Hip-Hop', 'Party'],
  image: 'http://8tracks.imgix.net/i/000/307/062/tumblr_mgumffe90i1ql91h0o1_1280-9978.jpg?fm=jpg&q=65&w=1024&h=1024&fit=max',
  likes: 34,
  plays: 923,
  tracks: [
    {
      title: 'Candler Road',
      artist: 'Childish Gambino',
      duration: 214.615,
      source: 'soundcloud',
      sourceParam: '164497989',
      image: 'https://i1.sndcdn.com/artworks-000064028350-zpvcu0-large.jpg?e76cf77',
      id: 0,
      comments: [
        {
          body: 'this is a comment',
          author: 'jakemmarsh',
          timestamp: new Date()
        }
      ],
      upvotes: 7,
      downvotes: 3
    },
    {
      title: 'Alright (ft. Big Sean)',
      artist: 'Logic',
      source: 'soundcloud',
      sourceParam: '146132553',
      image: 'https://i1.sndcdn.com/artworks-000077385297-oitifi-large.jpg?e76cf77',
      id: 1,
      upvotes: 9,
      downvotes: 4
    },
    {
      title: 'Jit/Juke',
      artist: 'Big Sean',
      source: 'soundcloud',
      sourceParam: '168793745',
      image: 'https://i1.sndcdn.com/artworks-000091744682-w6c1ym-large.jpg?e76cf77',
      id: 2,
      upvotes: 8,
      downvotes: 1
    },
    {
      title: 'Fight Night',
      artist: 'Migos',
      source: 'youtube',
      sourceParam: 'HsVnUpl2IKQ',
      image: 'https://i.ytimg.com/vi/HsVnUpl2IKQ/hqdefault.jpg',
      id: 3,
      upvotes: 3,
      downvotes: 8
    },
    {
      title: 'I',
      artist: 'Kendrick Lamar',
      source: 'youtube',
      sourceParam: 'hYIqaHWiW5M',
      image: 'https://i.ytimg.com/vi/hYIqaHWiW5M/hqdefault.jpg',
      id: 4,
      upvotes: 2,
      downvotes: 1
    }
  ]
};

var PlaylistPage = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    updatePageTitle: React.PropTypes.func.isRequired,
    playlist: React.PropTypes.object.isRequired,
    currentTrack: React.PropTypes.object,
    selectTrack: React.PropTypes.func.isRequired,
    showContextMenu: React.PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      playlist: playlist
    };
  },

  getInitialState: function() {
    return {
      query: ''
    };
  },

  componentDidMount: function() {
    // TODO: replace with this.props.playlist
    this.props.updatePageTitle(playlist.title);
  },

  addTrackToCurrentPlaylist: function() {
    console.log('add a new track to current playlist');
  },

  addTrackToPlaylist: function(track) {
    console.log('add to playlist:', track);
  },

  removeTrackFromPlaylist: function(track) {
    console.log('remove from playlist:', track);
  },

  showTrackContextMenu: function(track, e) {
    var menuItems = null;

    console.log('show menu for track:', track);

    // TODO: fix to be dynamic based on current user/playlist
    if ( playlist.userIsCollaborator ) {
      menuItems = (
        <div>
          <li>
            <i className="fa fa-plus"></i>
            Add Track To Playlist
            <ul>
              <li onClick={this.addTrackToPlaylist.bind(null, track)}>My Rap Playlist</li>
            </ul>
          </li>
          <li onClick={this.removeTrackFromPlaylist.bind(null, track)}>
            <i className="fa fa-remove"></i>
            Delete Track
          </li>
        </div>
      );

      e.stopPropagation();
      e.preventDefault();

      this.props.showContextMenu(e, menuItems);
    }
  },

  selectTrack: function(track, index) {
    // TODO: only call this if its not already the current playlist
    this.props.selectPlaylist(playlist);

    this.props.selectTrack(track, index);
  },

  renderPlaylistOptions: function() {
    var element = null;

    // TODO: fix to be dynamic based on current user/playlist
    if ( playlist.userIsCollaborator ) {
      element = (
        <ul className="playlist-options">
          <li onClick={this.addTrackToCurrentPlaylist}>
            <i className="fa fa-plus"></i>
            Add Track
          </li>
          <li onClick={this.props.QuitPlaylistCollaboration}>
            <i className="fa fa-remove"></i>
            Quit Collaborating
          </li>
        </ul>
      );
    }

    return element;
  },

  render: function() {
    return (
      <div>

        <section className="content playlist">
          <PageControlBar type="playlist">
            <div className="options-container">
              {this.renderPlaylistOptions()}
            </div>
            <div className="search-container">
              <SearchBar valueLink={this.linkState('query')}
                         onChange={this.updateQuery}
                         placeholder="Search playlist...">
              </SearchBar>
            </div>
          </PageControlBar>
          <Tracklist type="playlist"
                     tracks={playlist.tracks}
                     filter={this.state.query}
                     selectTrack={this.selectTrack}
                     currentTrack={this.props.currentTrack}
                     showContextMenu={this.showTrackContextMenu} />
        </section>

        <nav className="sidebar right">
          <PlaylistSidebar playlist={playlist} />
        </nav>

      </div>
    );
  }

});

module.exports = PlaylistPage;