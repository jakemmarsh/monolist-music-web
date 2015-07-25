'use strict';

import React                from 'react/addons';
import {ListenerMixin}      from 'reflux';
import {Navigation}         from 'react-router';
import _                    from 'lodash';
import DocumentTitle        from 'react-document-title';

import Helpers              from '../utils/Helpers';
import TrackActions         from '../actions/TrackActions';
import PlaylistActions      from '../actions/PlaylistActions';
import ViewingPlaylistStore from '../stores/ViewingPlaylistStore';
import AddCollaboratorMixin from '../mixins/AddCollaboratorMixin';
import MetaTagsMixin        from '../mixins/MetaTagsMixin';
import ListLink             from '../components/ListLink';
import PageControlBar       from '../components/PageControlBar';
import SearchBar            from '../components/SearchBar';
import Tracklist            from '../components/Tracklist';
import PlaylistSidebar      from '../components/PlaylistSidebar';

var PlaylistPage = React.createClass({

  mixins: [Navigation, React.addons.LinkedStateMixin, ListenerMixin, AddCollaboratorMixin, MetaTagsMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    userCollaborations: React.PropTypes.array,
    currentTrack: React.PropTypes.object,
    showContextMenu: React.PropTypes.func.isRequired
  },

  getDefaultProps() {
    return {
      currentUser: {}
    };
  },

  getInitialState() {
    return {
      playlist: {},
      loading: true,
      query: ''
    };
  },

  _onViewingPlaylistChange(err, playlist) {
    if ( err ) {
      this.setState({ loading: false, error: err.message });
    } else if ( playlist !== null ) {
      this.setState({ loading: false, error: null, playlist: playlist }, () => {
        this.updateMetaTags({
          'url': 'http://www.monolist.co/playlist/' + this.state.playlist.slug,
          'title': this.state.playlist.title,
          'name': this.state.playlist.title,
          'image': this.state.playlist.imageUrl
        });
      });
    } else {
      this.transitionTo('Playlists');
    }
  },

  componentWillReceiveProps(nextProps) {
    if ( nextProps.params.slug !== this.props.params.slug ) {
      PlaylistActions.open(nextProps.params.slug.toString());
    }
  },

  componentDidMount() {
    this.listenTo(ViewingPlaylistStore, this._onViewingPlaylistChange);
    PlaylistActions.open(this.props.params.slug.toString());
  },

  userIsCreator() {
    return this.state.playlist.ownerType === 'user' && this.state.playlist.ownerId === this.props.currentUser.id;
  },

  userIsCollaborator() {
    return !!_.where(this.state.playlist.collaborations, { userId: this.props.currentUser.id }).length;
  },

  deletePlaylist() {
    PlaylistActions.delete(this.state.playlist);
  },

  quitCollaborating() {
    this.removeCollaborator(this.props.currentUser);
  },

  getPossiblePlaylists() {
    return _.reject(this.props.userCollaborations, playlist => {
      return playlist.id === this.state.playlist.id;
    });
  },

  addTrackToPlaylist(playlist, track) {
    PlaylistActions.addTrack(playlist, track);
  },

  removeTrackFromPlaylist(trackToDelete) {
    let playlistCopy = this.state.playlist;

    playlistCopy.tracks = _.reject(this.state.playlist.tracks, track => {
      return track.id === trackToDelete.id;
    });

    this.setState({ playlist: playlistCopy }, PlaylistActions.removeTrack.bind(null, this.state.playlist, trackToDelete));
  },

  renderStarTrackOption(track) {
    let userHasStarred = !_.isEmpty(this.props.currentUser) && !!_.where(this.props.currentUser.starredTracks, {
      sourceParam: track.sourceParam,
      sourceUrl: track.sourceUrl
    }).length;
    let iconClass = 'fa ' + (userHasStarred ? 'fa-star-o' : 'fa-star');
    let text = userHasStarred ? 'Unstar Track' : 'Star Track';
    let func = userHasStarred ? TrackActions.unstar : TrackActions.star;
    let element = null;

    if ( !_.isEmpty(this.props.currentUser) ) {
      element = (
        <li onClick={func.bind(null, track, ()=>{})}>
          <i className={iconClass} />
          {text}
        </li>
      );
    }

    return element;
  },

  renderPossiblePlaylists(playlists, track) {
    return _.map(playlists, (playlist, index) => {
      return (
        <li key={index} onClick={this.addTrackToPlaylist.bind(null, playlist, track)}>{playlist.title}</li>
      );
    });
  },

  renderAddTrackOption(track) {
    let otherPlaylistOptions = this.getPossiblePlaylists();

    if ( !!otherPlaylistOptions.length ) {
      return (
        <li>
          <i className="fa fa-plus" />
          Add Track To Playlist
          <ul>
            {this.renderPossiblePlaylists(otherPlaylistOptions, track)}
          </ul>
        </li>
      );
    }
  },

  renderDeleteOption(track) {
    if ( this.userIsCollaborator() || this.userIsCreator() ) {
      return (
        <li onClick={this.removeTrackFromPlaylist.bind(null, track)}>
          <i className="fa fa-remove"></i>
          Delete Track
        </li>
      );
    }
  },

  showTrackContextMenu(evt, track) {
    let menuItems = (
      <div>
        {this.renderStarTrackOption(track)}
        {this.renderAddTrackOption(track)}
        {this.renderDeleteOption(track)}
      </div>
    );

    if ( evt ) {
      evt.stopPropagation();
      evt.preventDefault();
    }

    this.props.showContextMenu(evt, menuItems);
  },

  renderPlaylistOptions() {
    let element = null;

    if ( this.userIsCreator() ) {
      element = (
        <ul className="playlist-options">
          <ListLink to="TrackSearch" query={{ playlist: this.state.playlist.id }}>
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
          <ListLink to="TrackSearch" query={{ playlist: this.state.playlist.id }}>
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

  render() {
    return (
      <DocumentTitle title={Helpers.buildPageTitle(this.state.playlist.title)}>
      <div>

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
      </DocumentTitle>
    );
  }

});

export default PlaylistPage;