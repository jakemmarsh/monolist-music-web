'use strict';

import React                   from 'react';
import {Link}                  from 'react-router';
import _                       from 'lodash';
import DocumentTitle           from 'react-document-title';

import Helpers                 from '../utils/Helpers';
import AuthenticatedRouteMixin from '../mixins/AuthenticatedRouteMixin';
import PageControlBar          from '../components/PageControlBar';
import Title                   from '../components/Title';
import PlaylistList            from '../components/PlaylistList';

var PlaylistsPage = React.createClass({

  mixins: [AuthenticatedRouteMixin],

  propTypes: {
    userCollaborations: React.PropTypes.array.isRequired,
    playlist: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      userCollaborations: [],
      userLikes: []
    };
  },

  renderControlBar() {
    if ( !_.isEmpty(this.props.currentUser) ) {
      return (
        <PageControlBar type="search" className="nudge-half--bottom">
          <Link className="btn text-center" to="CreatePlaylist">
            <i className="icon-plus block" /> Create
          </Link>
          <div className="search-container" />
          <div className="loading-container" />
          <div className="options-container" />
        </PageControlBar>
      );
    }
  },

  renderCollaboratingPlaylists() {
    var element = null;

    if ( !_.isEmpty(this.props.userCollaborations) ) {
      element = (
        <PlaylistList playlists={this.props.userCollaborations} />
      );
    } else {
      element = (
        <h4 className="hard nudge--bottom light">You have not collaborated on any playlists yet!</h4>
      );
    }

    return element;
  },

  renderLikedPlaylists() {
    var element = null;

    if ( !_.isEmpty(this.props.userLikes) ) {
      element = (
        <PlaylistList playlists={this.props.userLikes} />
      );
    } else {
      element = (
        <h4 className="hard nudge--bottom light">You have not liked any playlists yet!</h4>
      );
    }

    return element;
  },

  render() {
    return (
      <DocumentTitle title={Helpers.buildPageTitle('Playlists')}>
      <section className="content playlists">

        {this.renderControlBar()}

        <Title text="Collaborating Playlists" icon="handshake" />

        {this.renderCollaboratingPlaylists()}

        <Title text="Liked Playlists" icon="heart" />

        {this.renderLikedPlaylists()}

      </section>
      </DocumentTitle>
    );
  }

});

export default PlaylistsPage;