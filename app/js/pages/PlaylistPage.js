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
import MetaTagsMixin             from '../mixins/MetaTagsMixin';
import PageControlBar            from '../components/PageControlBar';
import SearchBar                 from '../components/SearchBar';
import Tracklist                 from '../components/Tracklist';
import PlaylistSubheader         from '../components/PlaylistSubheader';
import Spinner                   from '../components/Spinner';

const PlaylistPage = React.createClass({

  mixins: [History, LinkedStateMixin, ListenerMixin, MetaTagsMixin],

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
      this.history.pushState(null, '/playlists');
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

  selectUser(user) {
    const playlistCopy = Object.assign({}, this.state.playlist);

    playlistCopy.collaborators.push(user);

    this.setState({ playlist: playlistCopy }, PlaylistActions.addCollaborator.bind(null, this.state.playlist, user));
  },

  deselectUser(user) {
    const playlistCopy = Object.assign({}, this.state.playlist);

    playlistCopy.collaborators = _.reject(this.state.playlist.collaborators, (collaborator) => {
      return collaborator.id === user.id;
    });

    this.setState({ playlist: playlistCopy }, PlaylistActions.removeCollaborator.bind(null, this.state.playlist, user));
  },

  getPossiblePlaylists() {
    return _.reject(this.props.userCollaborations, playlist => {
      return playlist.id === this.state.playlist.id;
    });
  },

  removeTrackFromPlaylist(trackToDelete) {
    const playlistCopy = Object.assign({}, this.state.playlist);

    playlistCopy.tracks = _.reject(this.state.playlist.tracks, track => {
      return track.id === trackToDelete.id;
    });

    this.setState({ playlist: playlistCopy }, PlaylistActions.removeTrack.bind(null, this.state.playlist, trackToDelete));
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
        <section className="content playlist fx-3 ord-1 ovy-a">
          <PlaylistSubheader currentUser={this.props.currentUser}
                             playlist={this.state.playlist}
                             selectUser={this.selectUser}
                             deselectUser={this.deselectUser} />
          <PageControlBar type="playlist">
            <div className="search-container">
              <SearchBar valueLink={this.linkState('query')} placeholder="Filter tracks..." />
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
      </div>
      </DocumentTitle>
    );
  }

});

export default PlaylistPage;
