/**
 * @jsx React.DOM
 */
 'use strict';

var React                   = require('react/addons');
var Reflux                  = require('reflux');
var Navigation              = require('react-router').Navigation;
var _                       = require('lodash');

var TrackActions            = require('../actions/TrackActions');
var PlaylistActions         = require('../actions/PlaylistActions');
var ViewingPlaylistStore    = require('../stores/ViewingPlaylistStore');
var AuthenticatedRouteMixin = require('../mixins/AuthenticatedRouteMixin');
var AddCollaboratorMixin    = require('../mixins/AddCollaboratorMixin');
var MetaTagsMixin           = require('../mixins/MetaTagsMixin');
var DocumentTitle           = require('../components/DocumentTitle');
var ListLink                = require('../components/ListLink');
var PageControlBar          = require('../components/PageControlBar');
var SearchBar               = require('../components/SearchBar');
var Tracklist               = require('../components/Tracklist');
var PlaylistSidebar         = require('../components/PlaylistSidebar');

var PlaylistPage = React.createClass({

  mixins: [AuthenticatedRouteMixin, Navigation, React.addons.LinkedStateMixin, Reflux.ListenerMixin, AddCollaboratorMixin, MetaTagsMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    userCollaborations: React.PropTypes.array,
    currentTrack: React.PropTypes.object,
    showContextMenu: React.PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      currentUser: {}
    };
  },

  getInitialState: function() {
    return {
      playlist: {},
      query: ''
    };
  },

  _onViewingPlaylistChange: function(playlist) {
    if ( playlist !== null ) {
      this.setState({ playlist: playlist }, function() {
        this.updateMetaTags({
          'url': 'http://www.monolist.co/playlist/' + this.state.playlist.slug,
          'title': this.state.playlist.title,
          'name': this.state.playlist.title,
          'image': this.state.playlist.imageUrl
        });
      }.bind(this));
    } else {
      this.transitionTo('Playlists');
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if ( nextProps.params.slug !== this.props.params.slug ) {
      PlaylistActions.open(nextProps.params.slug.toString(), this._onViewingPlaylistChange);
    }
  },

  componentDidMount: function() {
    PlaylistActions.open(this.props.params.slug.toString(), this._onViewingPlaylistChange);
    this.listenTo(ViewingPlaylistStore, this._onViewingPlaylistChange);
  },

  userIsCreator: function() {
    return !_.isEmpty(this.props.currentUser) && this.state.playlist.userId === this.props.currentUser.id;
  },

  userIsCollaborator: function() {
    return !!_.where(this.state.playlist.collaborations, { userId: this.props.currentUser.id }).length;
  },

  deletePlaylist: function() {
    PlaylistActions.delete(this.state.playlist);
  },

  quitCollaborating: function() {
    this.removeCollaborator(this.props.currentUser);
  },

  getPossiblePlaylists: function() {
    return _.reject(this.props.userCollaborations, function(playlist) {
      return playlist.id === this.state.playlist.id;
    }.bind(this));
  },

  addTrackToPlaylist: function(playlist, track) {
    PlaylistActions.addTrack(playlist, track);
  },

  removeTrackFromPlaylist: function(trackToDelete) {
    var playlistCopy = this.state.playlist;

    playlistCopy.tracks = _.reject(this.state.playlist.tracks, function(track) {
      return track.id === trackToDelete.id;
    });

    this.setState({ playlist: playlistCopy }, PlaylistActions.removeTrack(this.state.playlist, trackToDelete));
  },

  renderStarTrackOption: function(track) {
    var userHasStarred = !_.isEmpty(this.props.currentUser) && !!_.where(this.props.currentUser.starredTracks, {
      sourceParam: track.sourceParam,
      sourceUrl: track.sourceUrl
    }).length;
    var iconClass = 'fa ' + (userHasStarred ? 'fa-star-o' : 'fa-star');
    var text = userHasStarred ? 'Unstar Track' : 'Star Track';
    var func = userHasStarred ? TrackActions.unstar : TrackActions.star;
    var element = null;

    if ( !_.isEmpty(this.props.currentUser) ) {
      element = (
        <li onClick={func.bind(null, track, null)}>
          <i className={iconClass} />
          {text}
        </li>
      );
    }

    return element;
  },

  renderPossiblePlaylists: function(playlists, track) {
    return _.map(playlists, function(playlist, index) {
      return (
        <li key={index} onClick={this.addTrackToPlaylist.bind(null, playlist, track)}>{playlist.title}</li>
      );
    }.bind(this));
  },

  renderAddTrackOption: function(track) {
    var element = null;
    var otherPlaylistOptions = this.getPossiblePlaylists();

    if ( !!otherPlaylistOptions.length ) {
      element = (
        <li>
          <i className="fa fa-plus" />
          Add Track To Playlist
          <ul>
            {this.renderPossiblePlaylists(otherPlaylistOptions, track)}
          </ul>
        </li>
      );
    }

    return element;
  },

  renderDeleteOption: function(track) {
    var element = null;

    if ( this.userIsCollaborator() || this.userIsCreator() ) {
      element = (
        <li onClick={this.removeTrackFromPlaylist.bind(null, track)}>
          <i className="fa fa-remove"></i>
          Delete Track
        </li>
      );
    }

    return element;
  },

  showTrackContextMenu: function(track, e) {
    var menuItems = (
      <div>
        {this.renderStarTrackOption(track)}
        {this.renderAddTrackOption(track)}
        {this.renderDeleteOption(track)}
      </div>
    );

    e.stopPropagation();
    e.preventDefault();

    this.props.showContextMenu(e, menuItems);
  },

  renderPlaylistOptions: function() {
    var element = null;

    if ( this.userIsCreator() ) {
      element = (
        <ul className="playlist-options">
          <ListLink to="TrackSearch">
            <i className="fa fa-plus"></i>
            Add Track
          </ListLink>
          <li onClick={this.toggleCollaboratorModal}>
            <i className="fa fa-user"></i>
            Add/Remove Collaborators
          </li>
          <li onClick={this.deletePlaylist}>
            <i className="fa fa-remove"></i>
            Delete Playlist
          </li>
        </ul>
      );
    } else if ( this.userIsCollaborator() ) {
      element = (
        <ul className="playlist-options">
          <ListLink to="TrackSearch">
            <i className="fa fa-plus"></i>
            Add Track
          </ListLink>
          <li onClick={this.quitCollaborating}>
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

        <DocumentTitle title={this.state.playlist.title} />

        <section className="content playlist has-right-sidebar">
          <PageControlBar type="playlist">
            <div className="options-container">
              {this.renderPlaylistOptions()}
            </div>
            <div className="search-container">
              <SearchBar valueLink={this.linkState('query')}
                         placeholder="Search playlist...">
              </SearchBar>
            </div>
          </PageControlBar>
          <Tracklist type="playlist"
                     playlist={this.state.playlist}
                     filter={this.state.query}
                     currentTrack={this.props.currentTrack}
                     showContextMenu={this.showTrackContextMenu}
                     currentUser={this.props.currentUser}
                     userIsCreator={this.userIsCreator()}
                     userIsCollaborator={this.userIsCollaborator()} />
        </section>

        <nav className="sidebar right">
          <PlaylistSidebar currentUser={this.props.currentUser} playlist={this.state.playlist} />
        </nav>

      </div>
    );
  }

});

module.exports = React.createFactory(PlaylistPage);