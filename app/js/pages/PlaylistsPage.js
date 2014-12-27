/**
 * @jsx React.DOM
 */
'use strict';

var React                   = require('react');
var _                       = require('lodash');

var DocumentTitle           = require('../components/DocumentTitle');
var AuthenticatedRouteMixin = require('../mixins/AuthenticatedRouteMixin');
var PlaylistList            = require('../components/PlaylistList');

var PlaylistsPage = React.createClass({

  mixins: [AuthenticatedRouteMixin],

  propTypes: {
    userCollaborations: React.PropTypes.array.isRequired,
    playlist: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      userCollaborations: [],
      userLikes: []
    };
  },

  renderCollaboratingPlaylists: function() {
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

  renderLikedPlaylists: function() {
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

  render: function() {
    return (
      <section className="content playlists">

        <DocumentTitle title="Playlists" />

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
    );
  }

});

module.exports = React.createFactory(PlaylistsPage);