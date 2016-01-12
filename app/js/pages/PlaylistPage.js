'use strict';

import React                from 'react';
import LinkedStateMixin     from 'react-addons-linked-state-mixin';
import {ListenerMixin}      from 'reflux';
import {History}            from 'react-router';
import _                    from 'lodash';
import DocumentTitle        from 'react-document-title';

import Helpers              from '../utils/Helpers';
import TrackActions         from '../actions/TrackActions';
import PlaylistActions      from '../actions/PlaylistActions';
import ViewingPlaylistStore from '../stores/ViewingPlaylistStore';
import UserSearchModalMixin from '../mixins/UserSearchModalMixin';
import MetaTagsMixin        from '../mixins/MetaTagsMixin';
import ListLink             from '../components/ListLink';
import PageControlBar       from '../components/PageControlBar';
import SearchBar            from '../components/SearchBar';
import Tracklist            from '../components/Tracklist';
import PlaylistSidebar      from '../components/PlaylistSidebar';

var PlaylistPage = React.createClass({

  mixins: [History, LinkedStateMixin, ListenerMixin, UserSearchModalMixin, MetaTagsMixin],

  propTypes: {
    currentUser: React.PropTypes.object,
    userCollaborations: React.PropTypes.array,
    currentTrack: React.PropTypes.object,
    showContextMenu: React.PropTypes.func,
    params: React.PropTypes.object,
    sortPlaylist: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      currentUser: {}
    };
  },

  getInitialState() {
    return {
      playlist: {
        owner: {}
      },
      loading: true,
      query: ''
    };
  },

  _onViewingPlaylistChange(err, playlist) {
    if ( err ) {
      this.setState({ loading: false, error: err });
    } else if ( playlist !== null && this._userCanView(playlist) ) {
      this.setState({
        loading: false,
        error: null,
        playlist: playlist
      }, () => {
        this.updateMetaTags({
          'url': 'http://www.monolist.co/playlist/' + this.state.playlist.slug,
          'title': this.state.playlist.title,
          'name': this.state.playlist.title,
          'image': this.state.playlist.imageUrl
        });
      });
    } else {
      this.history.pushState(null, `/playlists`);
    }
  },

  _userCanView(playlist) {
    let collaboration = null;

    if ( !_.isEmpty(this.props.currentUser) ) {
      collaboration = _.find(playlist.collaborators, { id: this.props.currentUser.id });
    }

    if ( playlist.privacy === 'public' || !_.isEmpty(collaboration) || playlist.owner.id === this.props.currentUser.id ) {
      return true;
    }

    return false;
  },

  // for UserSearchModalMixin
  isUserSelected(user) {
    return user && !!_.where(this.state.playlist.collaborators, { id: user.id }).length;
  },

  // for UserSearchModalMixin
  selectUser(user) {
    let playlistCopy = this.state.playlist;

    playlistCopy.collaborators.push({
      id: user.id
    });

    this.setState({ playlist: playlistCopy }, PlaylistActions.addCollaborator.bind(null, this.state.playlist, user));
  },

  // for UserSearchModalMixin
  deselectUser(user) {
    let playlistCopy = JSON.parse(JSON.stringify(this.state.playlist));

    playlistCopy.collaborators = _.reject(this.state.playlist.collaborators, collaborator => {
      return collaborator.id === user.id;
    });

    this.setState({ playlist: playlistCopy }, PlaylistActions.removeCollaborator.bind(null, this.state.playlist, user));
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
    const userIsOwner = this.state.playlist.ownerType === 'user' && this.state.playlist.owner.id === this.props.currentUser.id;
    const userIsGroupLeader = this.state.playlist.ownerType === 'group' && this.state.playlist.owner.ownerId === this.props.currentUser.id;

    return userIsOwner || userIsGroupLeader;
  },

  userIsCollaborator() {
    const isCollaborator = !!_.where(this.state.playlist.collaborators, { id: this.props.currentUser.id }).length;
    const isOwnedByGroup = this.state.playlist.ownerType === 'group';
    const isGroupOwner = isOwnedByGroup && this.state.playlist.owner.ownerId === this.props.currentUser.id;
    const isGroupMember = isOwnedByGroup
                          && !!_.where(this.state.playlist.owner.memberships, { userId: this.props.currentUser.id }).length;

    return isCollaborator || isGroupOwner || isGroupMember;
  },

  deletePlaylist() {
    PlaylistActions.delete(this.state.playlist);
  },

  quitCollaborating() {
    this.deselectUser(this.props.currentUser);
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
    let playlistCopy = JSON.parse(JSON.stringify(this.state.playlist));

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
    let iconClass = 'fa ' + (userHasStarred ? 'icon-star-o' : 'icon-star');
    let text = userHasStarred ? 'Unstar Track' : 'Star Track';
    let func = userHasStarred ? TrackActions.unstar : TrackActions.star;
    let element = null;

    if ( !_.isEmpty(this.props.currentUser) ) {
      element = (
        <li className="menu-item" onClick={func.bind(null, track, ()=>{})}>
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
        <li className="menu-item"
            key={index}
            onClick={this.addTrackToPlaylist.bind(null, playlist, track)}>
          {playlist.title}
        </li>
      );
    });
  },

  renderAddTrackOption(track) {
    let otherPlaylistOptions = this.getPossiblePlaylists();

    if ( !!otherPlaylistOptions.length ) {
      return (
        <li className="menu-item">
          <i className="icon-plus" />
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
        <li className="menu-item" onClick={this.removeTrackFromPlaylist.bind(null, track)}>
          <i className="icon-close"></i>
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

  renderQuitCollaboratingOption() {
    let isOwnedByGroup = this.state.playlist.ownerType === 'group';
    let isGroupOwner = isOwnedByGroup && this.state.playlist.owner.id === this.props.currentUser.id;
    let isGroupMember = isOwnedByGroup
                          && !!_.where(this.state.playlist.owner.memberships, { userId: this.props.currentUser.id }).length;

    if ( !isGroupMember && !isGroupOwner ) {
      return (
        <li onClick={this.quitCollaborating}>
          <i className="icon-close"></i>
          Quit Collaborating
        </li>
      );
    }
  },

  renderPlaylistOptions() {
    let element = null;

    if ( this.userIsCreator() && !_.isEmpty(this.state.playlist) ) {
      element = (
        <ul className="playlist-options">
          <li onClick={this.toggleUserSearchModal.bind(null, this.state.playlist.collaborators)}>
            <i className="icon-user"></i>
            Add/Remove Collaborators
          </li>
          <li onClick={this.deletePlaylist}>
            <i className="icon-close"></i>
            Delete Playlist
          </li>
        </ul>
      );
    } else if ( this.userIsCollaborator() ) {
      element = (
        <ul className="playlist-options">
          <ListLink to={`/search/tracks?playlist=${this.state.playlist.id}`}>
            <i className="icon-plus"></i>
            Add Track
          </ListLink>
          {this.renderQuitCollaboratingOption()}
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
                     userIsCollaborator={this.userIsCollaborator()}
                     sortPlaylist={this.props.sortPlaylist} />
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