'use strict';

import React                  from 'react';
import LinkedStateMixin       from 'react-addons-linked-state-mixin';
import {ListenerMixin}        from 'reflux';
import {History}              from 'react-router';
import _                      from 'lodash';
import DocumentTitle          from 'react-document-title';
import lscache                from 'lscache';

import Helpers                from '../utils/Helpers';
import PlaylistActions        from '../actions/PlaylistActions';
import PermissionsHelpers     from '../utils/PermissionsHelpers';
import ViewingPlaylistStore   from '../stores/ViewingPlaylistStore';
import UserSearchModalMixin   from '../mixins/UserSearchModalMixin';
import ConfirmationModalMixin from '../mixins/ConfirmationModalMixin';
import MetaTagsMixin          from '../mixins/MetaTagsMixin';
import PageControlBar         from '../components/PageControlBar';
import SearchBar              from '../components/SearchBar';
import Tracklist              from '../components/Tracklist';
import PlaylistSidebar        from '../components/PlaylistSidebar';

const PlaylistPage = React.createClass({

  mixins: [History, LinkedStateMixin, ListenerMixin, UserSearchModalMixin, ConfirmationModalMixin, MetaTagsMixin],

  propTypes: {
    currentUser: React.PropTypes.object,
    userCollaborations: React.PropTypes.array,
    currentTrack: React.PropTypes.object,
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
      query: '',
      sortAttribute: 'createdAt'
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
        sortAttribute: lscache.get(`sortAttribute:${playlist.slug}`) || 'createdAt'
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

  componentWillReceiveProps(nextProps) {
    if ( nextProps.params.slug !== this.props.params.slug ) {
      PlaylistActions.open(nextProps.params.slug.toString());
    }
  },

  componentDidMount() {
    this.listenTo(ViewingPlaylistStore, this._onViewingPlaylistChange);
    PlaylistActions.open(this.props.params.slug.toString());
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
    const userIsCreator = PermissionsHelpers.isUserPlaylistCreator(this.state.playlist, this.props.currentUser);
    let element = null;

    if ( userIsCreator && !_.isEmpty(this.state.playlist) ) {
      element = (
        <ul className="playlist-options">
          <li className="highlight-option" onClick={this.openUserSearchModal.bind(null, this.state.playlist.collaborators)}>
            <i className="icon-user"></i>
            Add & Remove Collaborators
          </li>
          <li onClick={this.openConfirmationModal.bind(null, 'Are you sure you want to delete this playlist?', this.deletePlaylist)}>
            <i className="icon-close"></i>
            Delete Playlist
          </li>
        </ul>
      );
    }

    return element;
  },

  render() {
    const userIsCollaborator = PermissionsHelpers.isUserPlaylistCollaborator(this.state.playlist, this.props.currentUser);

    return (
      <DocumentTitle title={Helpers.buildPageTitle(this.state.playlist.title)}>
      <div className="d-f ord-2 fx-4">

        <section className="content playlist has-right-sidebar fx-3 ord-1 ovy-a">
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
                     currentUser={this.props.currentUser}
                     userIsCreator={PermissionsHelpers.isUserPlaylistCreator(this.state.playlist, this.props.currentUser)}
                     userIsCollaborator={userIsCollaborator}
                     userCollaborations={this.props.userCollaborations}
                     removeTrackFromPlaylist={this.removeTrackFromPlaylist}
                     sortPlaylist={this.props.sortPlaylist}
                     sortAttribute={this.state.sortAttribute} />
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
