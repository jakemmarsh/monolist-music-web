'use strict';

import React                   from 'react';
import {Link}                  from 'react-router';
import _                       from 'lodash';
import DocumentTitle           from 'react-document-title';

import Helpers                 from '../utils/Helpers';
import AuthenticatedRouteMixin from '../mixins/AuthenticatedRouteMixin';
import Title                   from '../components/Title';
import PlaylistList            from '../components/PlaylistList';

var PlaylistsPage = React.createClass({

  mixins: [AuthenticatedRouteMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    userCollaborations: React.PropTypes.array.isRequired,
    userLikes: React.PropTypes.array.isRequired,
    playlist: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      userCollaborations: [],
      userLikes: []
    };
  },

  renderCreateButton() {
    if ( !_.isEmpty(this.props.currentUser) ) {
      return (
        <Link className="btn text-center" to="CreatePlaylist">
          <i className="icon-plus block" /> Create
        </Link>
      );
    }
  },

  renderCollaboratingPlaylists() {
    let element = null;

    if ( !_.isEmpty(this.props.userCollaborations) ) {
      element = (
        <PlaylistList playlists={this.props.userCollaborations} cardClassName="pure-u-1-3" />
      );
    } else {
      element = (
        <h4 className="hard nudge--bottom light">You have not collaborated on any playlists yet!</h4>
      );
    }

    return element;
  },

  renderLikedPlaylists() {
    let element = null;

    if ( !_.isEmpty(this.props.userLikes) ) {
      element = (
        <PlaylistList playlists={this.props.userLikes} cardClassName="pure-u-1-3" />
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

        <div className="pure-g">
          <div className="pure-u-5-6">
            <Title text="Collaborating Playlists" icon="handshake" className="hard" />
          </div>
          <div className="pure-u-1-6 text-right">
            {this.renderCreateButton()}
          </div>
        </div>

        {this.renderCollaboratingPlaylists()}

        <Title text="Liked Playlists" icon="heart" />

        {this.renderLikedPlaylists()}

      </section>
      </DocumentTitle>
    );
  }

});

export default PlaylistsPage;