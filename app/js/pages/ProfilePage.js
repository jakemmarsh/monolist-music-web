/**
 * @jsx React.DOM
 */
'use strict';

var React               = require('react/addons');
var Reflux              = require('reflux');
var _                   = require('lodash');

var DocumentTitle       = require('../components/DocumentTitle');
var MetaTagsMixin       = require('../mixins/MetaTagsMixin');
var GlobalActions       = require('../actions/GlobalActions');
var ViewingProfileStore = require('../stores/ViewingProfileStore');
var PlaylistList        = require('../components/PlaylistList');
var MiniTracklist       = require('../components/MiniTracklist');
var ProfileSidebar      = require('../components/ProfileSidebar');

var ProfilePage = React.createClass({

  mixins: [Reflux.ListenerMixin, MetaTagsMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      user: {}
    };
  },

  _onViewingProfileChange: function(err, user) {
    if ( err ) {
      // TODO: handle error
      console.log('error loading profile:', err);
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
    if ( nextProps.params.username !== this.props.params.username ) {
      GlobalActions.openUserProfile(this.props.params.username.toString(), this._onViewingProfileChange);
    }
  },

  componentWillMount: function() {
    GlobalActions.openUserProfile(this.props.params.username.toString(), this._onViewingProfileChange);
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
        <h4 className="hard nudge--bottom">This user has not created any public playlists yet!</h4>
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

  renderUserStars: function() {
    var element = null;

    if ( !_.isEmpty(this.state.user.stars) ) {
      element = (
        <MiniTracklist tracks={this.state.user.stars} />
      );
    } else {
      element = (
        <h4 className="hard nudge--bottom light">This user has not starred any tracks yet!</h4>
      );
    }

    return element;
  },

  render: function() {
    return (
      <div>

        <section className="content profile">

          <DocumentTitle title={this.state.user.username} />

          <div className="content-container">

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
              <div className="title-container">
                <div className="icon-container">
                  <i className="fa fa-star"></i>
                </div>
                <h5 className="title">Starred</h5>
              </div>
              {this.renderUserStars()}
            </div>
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