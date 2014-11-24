/**
 * @jsx React.DOM
 */
'use strict';

var React               = require('react/addons');
var Reflux              = require('reflux');
var _                   = require('underscore');

var DocumentTitle       = require('../components/DocumentTitle');
var GlobalActions       = require('../actions/GlobalActions');
var ViewingProfileStore = require('../stores/ViewingProfileStore');
var Avatar              = require('../components/Avatar');
var PlaylistList        = require('../components/PlaylistList');

var ProfilePage = React.createClass({

  mixins: [Reflux.ListenerMixin],

  propTypes: {
    playlist: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      user: {}
    };
  },

  _onViewingProfileChange: function(user) {
    this.setState({
      user: user
    });
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
        <h3 className="no-playlists">This user has not created any public playlists yet!</h3>
      );
    }

    return element;
  },

  renderUserLikes: function() {
    var element = null;

    if ( !_.isEmpty(this.state.user.likes) ) {
      element = (
        <PlaylistList playlists={this.state.user.likes} />
      );
    } else {
      element = (
        <h4 className="no-liked-playlists">This user has not liked any playlists yet!</h4>
      );
    }

    return element;
  },

  render: function() {
    return (
      <section className="content profile">

        <DocumentTitle title={this.state.user.username} />

        <div className="profile-header-container">
          <div className="avatar-container">
            <Avatar user={this.state.user} />
          </div>
          <div className="name-container">
            <h3 className="name">{this.state.user.username}</h3>
          </div>
          <div className="buttons-container"></div>
        </div>

        <div className="content-container">
          <div className="playlists-container">
            <div className="title-container">
              <div className="icon-container">
                <i className="fa fa-list"></i>
              </div>
              <h5 className="title">Playlists by {this.state.user.username}</h5>
            </div>
            {this.renderUserPlaylists()}
          </div>
          <div className="tracks-container">
            <div className="title-container">
              <div className="icon-container">
                <i className="fa fa-heart"></i>
              </div>
              <h5 className="title">Liked</h5>
            </div>
            {this.renderUserLikes()}
          </div>
        </div>

      </section>
    );
  }

});

module.exports = React.createFactory(ProfilePage);