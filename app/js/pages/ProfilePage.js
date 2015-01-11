/**
 * @jsx React.DOM
 */
'use strict';

var React                   = require('react/addons');
var Reflux                  = require('reflux');
var _                       = require('lodash');

var DocumentTitle           = require('../components/DocumentTitle');
var MetaTagsMixin           = require('../mixins/MetaTagsMixin');
var UserActions             = require('../actions/UserActions');
var ViewingProfileStore     = require('../stores/ViewingProfileStore');
var AuthenticatedRouteMixin = require('../mixins/AuthenticatedRouteMixin');
var PlaylistList            = require('../components/PlaylistList');
var MiniTracklist           = require('../components/MiniTracklist');
var ProfileSidebar          = require('../components/ProfileSidebar');

var ProfilePage = React.createClass({

  mixins: [AuthenticatedRouteMixin, Reflux.ListenerMixin, MetaTagsMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    currentTrack: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      currentUser: {},
      user: {},
      error: null
    };
  },

  _onViewingProfileChange: function(err, user) {
    if ( err ) {
      console.log('error loading profile:', err);
      this.setState({ error: err });
    } else {
      this.setState({ user: user }, function() {
        this.updateMetaTags({
          'url': 'http://www.monolist.co/profile/' + this.state.user.username,
          'title': this.state.user.username,
          'name': this.state.user.username,
          'image': this.state.user.imageUrl
        });
      }.bind(this));
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if ( nextProps.params.username !== this.props.params.username || !_.isEqual(this.props.currentUser, nextProps.currentUser) ) {
      UserActions.openProfile(this.props.params.username.toString(), this._onViewingProfileChange);
    }
  },

  componentDidMount: function() {
    UserActions.openProfile(this.props.params.username.toString(), this._onViewingProfileChange);
    this.listenTo(ViewingProfileStore, this._onViewingProfileChange);
  },

  renderUserPlaylists: function() {
    var element = null;

    if ( !_.isEmpty(this.state.user.playlists) ) {
      element = (
        <PlaylistList playlists={this.state.user.playlists} />
      );
    } else {
      element = (
        <h4 className="hard nudge--bottom light">This user has not created any public playlists yet!</h4>
      );
    }

    return element;
  },

  renderUserCollaborations: function() {
    var element = null;

    if ( !_.isEmpty(this.state.user.collaborations) ) {
      element = (
        <PlaylistList playlists={this.state.user.collaborations} />
      );
    } else {
      element = (
        <h4 className="hard nudge--bottom light">This user has not collaborated on any public playlists yet!</h4>
      );
    }

    return element;
  },

  renderUserPlaylistLikes: function() {
    var element = null;

    if ( !_.isEmpty(this.state.user.likes) ) {
      element = (
        <PlaylistList playlists={this.state.user.likes} />
      );
    } else {
      element = (
        <h4 className="hard nudge--bottom light">This user has not liked any playlists yet!</h4>
      );
    }

    return element;
  },

  renderUserStarredTracks: function() {
    var element = null;

    if ( !_.isEmpty(this.state.user.starredTracks) ) {
      element = (
        <MiniTracklist currentUser={this.props.currentUser}
                       profileUser={this.state.user}
                       currentTrack={this.props.currentTrack}
                       tracks={this.state.user.starredTracks} />
      );
    } else {
      element = (
        <h5 className="hard light">This user has not starred any tracks yet!</h5>
      );
    }

    return element;
  },

  render: function() {
    return (
      <div>

        <section className="content profile has-right-sidebar">

          <DocumentTitle title={this.state.user.username} />

          <div className="playlists-container">
            <div className="title-container">
              <div className="icon-container">
                <i className="fa fa-list"></i>
              </div>
              <h5 className="title">Playlists</h5>
            </div>
            {this.renderUserPlaylists()}

            <div className="title-container">
              <div className="icon-container">
                <i className="fa fa-users"></i>
              </div>
              <h5 className="title">Collaborations</h5>
            </div>
            {this.renderUserCollaborations()}

            <div className="title-container">
              <div className="icon-container">
                <i className="fa fa-heart"></i>
              </div>
              <h5 className="title">Liked</h5>
            </div>
            {this.renderUserPlaylistLikes()}
          </div>


          <div className="stars-container">
            <div className="title-container flush--bottom">
              <div className="icon-container">
                <i className="fa fa-star"></i>
              </div>
              <h5 className="title">Starred</h5>
            </div>
            {this.renderUserStarredTracks()}
          </div>

        </section>

        <nav className="sidebar right">
          <ProfileSidebar currentUser={this.props.currentUser} user={this.state.user} />
        </nav>
      </div>
    );
  }

});

module.exports = React.createFactory(ProfilePage);