'use strict';

import React                   from 'react';
import _                       from 'lodash';
import DocumentTitle           from 'react-document-title';

import Helpers                 from '../utils/Helpers';
import AuthenticatedRouteMixin from '../mixins/AuthenticatedRouteMixin';
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

        <div className="title-container">
          <div className="icon-container">
            <i className="fa fa-user"></i>
          </div>
          <h5 className="title">Collaborating Playlists</h5>
        </div>

        {this.renderCollaboratingPlaylists()}

        <div className="title-container">
          <div className="icon-container">
            <i className="fa fa-heart"></i>
          </div>
          <h5 className="title">Liked Playlists</h5>
        </div>

        {this.renderLikedPlaylists()}

      </section>
      </DocumentTitle>
    );
  }

});

export default PlaylistsPage;