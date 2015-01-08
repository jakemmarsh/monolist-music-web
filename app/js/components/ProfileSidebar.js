/**
 * @jsx React.DOM
 */
'use strict';

var React       = require('react/addons');
var _           = require('lodash');
var $           = require('jquery');
var cx          = React.addons.classSet;

var UserActions = require('../actions/UserActions');
var Avatar      = require('./Avatar');

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
      currentUserDoesFollow: false
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if ( !_.isEqual(nextProps.user) && !_.isEqual(this.props.user, nextProps.user) ) {
      this.setState({
        currentUserDoesFollow: !!_.where(nextProps.user.followers, { followerId: nextProps.currentUser.id }).length
      });
    }
  },

  componentDidUpdate: function() {
    if ( this.state.currentUserDoesFollow ) {
      $('.follow-button.inactive').hover(function() {
        $(this).text('Unfollow');
      });

      $('.follow-button.inactive').mouseleave(function() {
        $(this).text('Following');
      });
    } else {
      $('.follow-button').unbind('mouseenter mouseleave');
    }
  },

  toggleFollowUser: function() {
    this.setState({ currentUserDoesFollow: !this.state.currentUserDoesFollow }, UserActions.follow(this.props.user));
  },

  renderFollowButton: function() {
    var element = null;
    var buttonText = this.state.currentUserDoesFollow ? 'Following' : 'Follow';
    var classes = cx({
      'action-button': true,
      'follow-button': true,
      'inactive': this.state.currentUserDoesFollow
    });

    if ( !_.isEmpty(this.props.currentUser) && this.props.currentUser.id !== this.props.user.id ) {
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

        <Avatar user={this.props.user} includeLink={false} size="225px" />

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