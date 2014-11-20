/**
 * @jsx React.DOM
 */
'use strict';

var React                   = require('react');

var DocumentTitle           = require('../components/DocumentTitle');
var GlobalActions           = require('../actions/GlobalActions');
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
      userCollaborations: []
    };
  },

  getInitialState: function() {
    return {
      userLikes: []
    };
  },

  _onUserLikesChange: function(likes) {
    this.setState({ userLikes: likes });
  },

  componentWillMount: function() {
    GlobalActions.loadUserLikes(this._onUserLikesChange);
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

        <PlaylistList playlists={this.props.userCollaborations} />

        <div className="title-container">
          <div className="icon-container">
            <i className="fa fa-heart"></i>
          </div>
          <h5 className="title">Liked Playlists</h5>
        </div>

        <PlaylistList playlists={this.state.userLikes} />

      </section>
    );
  }

});

module.exports = React.createFactory(PlaylistsPage);