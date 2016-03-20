'use strict';

import React                     from 'react';
import LinkedStateMixin          from 'react-addons-linked-state-mixin';
import {ListenerMixin}           from 'reflux';
import {History}                 from 'react-router';
import _                         from 'lodash';
import DocumentTitle             from 'react-document-title';
import lscache                   from 'lscache';

import Helpers                   from '../utils/Helpers';
import PlaylistActions           from '../actions/PlaylistActions';
import PermissionsHelpers        from '../utils/PermissionsHelpers';
import ViewingPlaylistStore      from '../stores/ViewingPlaylistStore';
import UserSearchModalMixin      from '../mixins/UserSearchModalMixin';
import AddTrackByUrlModalMixin   from '../mixins/AddTrackByUrlModalMixin';
import ConfirmationModalMixin    from '../mixins/ConfirmationModalMixin';
import MetaTagsMixin             from '../mixins/MetaTagsMixin';
import PageControlBar            from '../components/PageControlBar';
import SearchBar                 from '../components/SearchBar';
import Tracklist                 from '../components/Tracklist';
import PlaylistSidebar           from '../components/PlaylistSidebar';
import Spinner                   from '../components/Spinner';

const PlaylistPage = React.createClass({

  mixins: [History, LinkedStateMixin, ListenerMixin, AddTrackByUrlModalMixin, UserSearchModalMixin, ConfirmationModalMixin, MetaTagsMixin],

  propTypes: {
    currentUser: React.PropTypes.object,
    userCollaborations: React.PropTypes.array,
    currentTrack: React.PropTypes.object,
    params: React.PropTypes.object
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
      error: null,
      loading: true,
      query: '',
      sortAttribute: 'order'
    };
  },

  _onViewingPlaylistChange(err, playlist) {
    if ( err ) {
      this.setState({ loading: false, error: err });
      return;
    }

    const hasPlaylist = !_.isEmpty(playlist);
    const hasNewSlug = playlist.id === this.state.playlist.id && playlist.slug !== this.state.playlist.slug;
    const userCanView = PermissionsHelpers.userCanViewPlaylist(playlist, this.props.currentUser);

    if ( hasPlaylist && userCanView ) {
      if ( hasNewSlug ) {
        this.history.replaceState(null, `/playlist/${playlist.slug}`);
      }

      this.setState({
        loading: false,
        error: null,
        playlist: playlist,
        sortAttribute: lscache.get(`sortAttribute:${playlist.slug}`) || 'order'
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

  componentWillReceiveProps(nextProps) {
    if ( nextProps.params.slug !== this.props.params.slug ) {
      this.setState(this.getInitialState(), () => {
        PlaylistActions.open(nextProps.params.slug.toString());
      });
    }
  },

  componentDidMount() {
    this.listenTo(ViewingPlaylistStore, this._onViewingPlaylistChange);
    PlaylistActions.open(this.props.params.slug.toString());
  },

  handleSortAttributeChange(evt) {
    this.setState({
      sortAttribute: evt.target.value
    }, () => {
      if ( !_.isEmpty(this.state.playlist) ) {
        lscache.set(`sortAttribute:${this.state.playlist.slug}`, this.state.sortAttribute);
      }
    });
  },

  // for UserSearchModalMixin
  selectUser(user) {
    let playlistCopy = JSON.parse(JSON.stringify(this.state.playlist));

    playlistCopy.collaborators.push(user);

    this.setState({ playlist: playlistCopy }, PlaylistActions.addCollaborator.bind(null, this.state.playlist, user));
  },

  // for UserSearchModalMixin
  deselectUser(user) {
    let playlistCopy = JSON.parse(JSON.stringify(this.state.playlist));

    playlistCopy.collaborators = _.reject(this.state.playlist.collaborators, (collaborator) => {
      return collaborator.id === user.id;
    });

    this.setState({ playlist: playlistCopy }, PlaylistActions.removeCollaborator.bind(null, this.state.playlist, user));
  },

  deletePlaylist() {
    PlaylistActions.delete(this.state.playlist, () => {
      this.history.pushState(null, `/playlists`);
    });
  },

  quitCollaborating() {
    this.deselectUser(this.props.currentUser);
  },

  getPossiblePlaylists() {
    return _.reject(this.props.userCollaborations, playlist => {
      return playlist.id === this.state.playlist.id;
    });
  },

  removeTrackFromPlaylist(trackToDelete) {
    let playlistCopy = JSON.parse(JSON.stringify(this.state.playlist));

    playlistCopy.tracks = _.reject(this.state.playlist.tracks, track => {
      return track.id === trackToDelete.id;
    });

    this.setState({ playlist: playlistCopy }, PlaylistActions.removeTrack.bind(null, this.state.playlist, trackToDelete));
  },

  renderAddTrackFromUrlOption() {
    const userIsCreator = PermissionsHelpers.isUserPlaylistCreator(this.state.playlist, this.props.currentUser);
    const userIsCollaborator = PermissionsHelpers.isUserPlaylistCollaborator(this.state.playlist, this.props.currentUser);

    if ( userIsCreator || userIsCollaborator ) {
      return (
        <li onClick={this.openAddTrackByUrlModal.bind(null, this.state.playlist)}>
          <i className="icon-plus" />
          Add Track from URL
        </li>
      );
    }
  },

  renderQuitCollaboratingOption() {
    const isOwnedByGroup = this.state.playlist.ownerType === 'group';
    const isGroupOwner = isOwnedByGroup && this.state.playlist.owner.id === this.props.currentUser.id;
    const isGroupMember = isOwnedByGroup && _.some(this.state.playlist.owner.memberships, { userId: this.props.currentUser.id });
    const userIsCollaborator = PermissionsHelpers.isUserPlaylistCollaborator(this.state.playlist, this.props.currentUser);

    if ( !isGroupMember && !isGroupOwner && userIsCollaborator ) {
      return (
        <li onClick={this.quitCollaborating}>
          <i className="icon-close"></i>
          Quit Collaborating
        </li>
      );
    }
  },

  renderCollaboratorsOption() {
    const userIsCreator = PermissionsHelpers.isUserPlaylistCreator(this.state.playlist, this.props.currentUser);

    if ( userIsCreator ) {
      return (
        <li className="highlight-option" onClick={this.openUserSearchModal.bind(null, this.state.playlist.collaborators)}>
          <i className="icon-user"></i>
          Add & Remove Collaborators
        </li>
      );
    }
  },

  renderDeleteOption() {
    const userIsCreator = PermissionsHelpers.isUserPlaylistCreator(this.state.playlist, this.props.currentUser);

    if ( userIsCreator ) {
      return (
        <li onClick={this.openConfirmationModal.bind(null, 'Are you sure you want to delete this playlist?', this.deletePlaylist)}>
          <i className="icon-close"></i>
          Delete Playlist
        </li>
      );
    }
  },

  renderTracklist() {
    let element;

    if ( this.state.loading ) {
      element = (
        <div className="text-center nudge--top">
          <Spinner size={30} />
        </div>
      );
    } else {
      element = (
        <Tracklist type="playlist"
                   playlist={this.state.playlist}
                   filter={this.state.query}
                   currentTrack={this.props.currentTrack}
                   currentUser={this.props.currentUser}
                   userCollaborations={this.props.userCollaborations}
                   removeTrackFromPlaylist={this.removeTrackFromPlaylist}
                   sortAttribute={this.state.sortAttribute} />
      );
    }

    return element;
  },

  render() {
    return (
      <DocumentTitle title={Helpers.buildPageTitle(this.state.playlist.title)}>
      <div className="d-f ord-2 fx-4">

        <section className="content playlist has-right-sidebar fx-3 ord-1 ovy-a">
          <PageControlBar type="playlist">
            <div className="options-container">
              <ul className="playlist-options">
                {this.renderCollaboratorsOption()}
                {this.renderAddTrackFromUrlOption()}
                {this.renderQuitCollaboratingOption()}
                {this.renderDeleteOption()}
              </ul>
            </div>
            <div className="search-container">
              <SearchBar valueLink={this.linkState('query')}
                         placeholder="Filter tracks...">
              </SearchBar>
            </div>
            <div className="sort-container text-right">
              <label htmlFor="sort">Sort by:</label>
              <select id="sort" value={this.state.sortAttribute} onChange={this.handleSortAttributeChange}>
                <option value="order">Order</option>
                <option value="createdAt">Add Date</option>
                <option value="title">Title</option>
                <option value="artist">Creator</option>
              </select>
            </div>
          </PageControlBar>
          {this.renderTracklist()}
        </section>

        <nav className="sidebar right fx-300 ord-1 ovy-a">
          <PlaylistSidebar currentUser={this.props.currentUser} playlist={this.state.playlist} />
        </nav>

      </div>
      </DocumentTitle>
    );
  }

});

export default PlaylistPage;
