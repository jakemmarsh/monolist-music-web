'use strict';

import React                from 'react';
import {ListenerMixin}      from 'reflux';
import {History}            from 'react-router';
import _                    from 'lodash';
import DocumentTitle        from 'react-document-title';
import lscache              from 'lscache';

import Helpers              from '../utils/Helpers';
import PlaylistActions      from '../actions/PlaylistActions';
import PermissionsHelpers   from '../utils/PermissionsHelpers';
import ViewingPlaylistStore from '../stores/ViewingPlaylistStore';
import MetaTagsMixin        from '../mixins/MetaTagsMixin';
import PageControlBar       from '../components/PageControlBar';
import SearchBar            from '../components/SearchBar';
import Tracklist            from '../components/Tracklist';
import PlaylistSubheader    from '../components/PlaylistSubheader';
import Spinner              from '../components/Spinner';

const PlaylistPage = React.createClass({

  mixins: [History, ListenerMixin, MetaTagsMixin],

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

      console.log('new playlist:', playlist);

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
      this.history.pushState(null, `/profile/${this.props.currentUser.username}/playlists`);
    }
  },

  componentWillReceiveProps(nextProps) {
    if ( nextProps.params.slug !== this.props.params.slug ) {
      this.setState(this.getInitialState(), () => {
        PlaylistActions.open(nextProps.params.slug.toString());
      });
    }

    if ( this.state.playlist && this.state.playlist.privacy === 'private' && _.isEmpty(nextProps.currentUser) ) {
      this.history.pushState(null, `/profile/${this.props.currentUser.username}/playlists`);
    }
  },

  componentDidMount() {
    this.listenTo(ViewingPlaylistStore, this._onViewingPlaylistChange);
    PlaylistActions.open(this.props.params.slug.toString());
  },

  handleQueryChange(evt) {
    this.setState({
      query: evt.target.value
    });
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

  getPossiblePlaylists() {
    return _.reject(this.props.userCollaborations, playlist => {
      return playlist.id === this.state.playlist.id;
    });
  },

  removeTrackFromPlaylist(trackToDelete) {
    PlaylistActions.removeTrack(this.state.playlist, trackToDelete);
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
      <div className="d-f fx-4">
        <section className="content playlist fx-3">
          <PlaylistSubheader currentUser={this.props.currentUser}
                             playlist={this.state.playlist} />
          <div className="max-width-wrapper">
            <PageControlBar type="playlist">
              <div className="search-container">
                <SearchBar value={this.state.query}
                           onChange={this.handleQueryChange}
                           placeholder="Filter tracks..." />
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
          </div>
        </section>
      </div>
      </DocumentTitle>
    );
  }

});

export default PlaylistPage;
