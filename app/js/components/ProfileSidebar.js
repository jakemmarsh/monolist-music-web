/**
 * @jsx React.DOM
 */
'use strict';

var React  = require('react/addons');
var _      = require('lodash');
var cx     = React.addons.classSet;

var Avatar = require('./Avatar');

var ProfileSidebar = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      user: {}
    };
  },

  getInitialState: function() {
    return {
      currentUserDoesFollow: !!_.where(this.props.user.subscriptions, { subscriberId: this.props.currentUser.id }).length
    };
  },

  toggleFollowUser: function() {
    this.setState({ currentUserDoesFollow: !this.state.currentUserDoesFollow });
    // TODO: make database call
  },

  renderFollowButton: function() {
    var element = null;
    var buttonText = this.state.currentUserDoesFollow ? 'Unfollow' : 'Follow';
    var classes = cx({
      'action-button': true,
      'inactive': this.state.currentUserDoesFollow
    });

    if ( true ) {
      element = (
        <div className={classes} onClick={this.toggleFollowUser}>
          {buttonText}
        </div>
      );
    }

    return element;
  },

  render: function() {
    return (
      <div className="profile-sidebar">

        <h4 className="username">
          {this.props.user.username}
          <i className="fa fa-user"></i>
        </h4>

        <div className="action-buttons-container">
          {this.renderFollowButton()}
        </div>

        <Avatar user={this.props.user} includeLink={false} />

        <div className="stats-container">
          <div className="playlist-count-container">
            <i className="fa fa-list"></i> {this.props.user.playlists ? this.props.user.playlists.length : 0}
          </div>
          <div className="collaboration-count-container">
            <i className="fa fa-users"></i> {this.props.user.collaborations ? this.props.user.collaborations.length : 0}
          </div>
          <div className="like-count-container">
            <i className="fa fa-heart"></i> {this.props.user.likes ? this.props.user.likes.length : 0}
          </div>
        </div>

        <div className="shadow" />

      </div>
    );
  }

});

module.exports = React.createFactory(ProfileSidebar);