'use strict';

import React       from 'react/addons';
import _           from 'lodash';
import $           from 'jquery';
import cx          from 'classnames';

import UserActions from '../actions/UserActions';
import Avatar      from './Avatar';

var ProfileSidebar = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired
  },

  getDefaultProps() {
    return {
      user: {}
    };
  },

  getInitialState() {
    return {
      currentUserDoesFollow: false
    };
  },

  componentWillReceiveProps(nextProps) {
    if ( !_.isEqual(nextProps.user) && !_.isEqual(this.props.user, nextProps.user) ) {
      this.setState({
        currentUserDoesFollow: !!_.where(nextProps.user.followers, { followerId: nextProps.currentUser.id }).length
      });
    }
  },

  componentDidUpdate() {
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

  toggleFollowUser() {
    this.setState({ currentUserDoesFollow: !this.state.currentUserDoesFollow }, UserActions.follow.bind(null, this.props.user));
  },

  renderFollowButton() {
    let buttonText = this.state.currentUserDoesFollow ? 'Following' : 'Follow';
    let classes = cx({
      'action-button': true,
      'follow-button': true,
      'inactive': this.state.currentUserDoesFollow
    });

    if ( !_.isEmpty(this.props.currentUser) && this.props.currentUser.id !== this.props.user.id ) {
      return (
        <div className={classes} onClick={this.toggleFollowUser}>
          {buttonText}
        </div>
      );
    }
  },

  render() {
    // TODO: do we want a collaborations count in the sidebar?
    return (
      <div className="profile-sidebar">

        <h4 className="username">
          {this.props.user.username}
          <i className="icon-user"></i>
        </h4>

        <div className="action-buttons-container">
          {this.renderFollowButton()}
        </div>

        <Avatar user={this.props.user} includeLink={false} size="225px" />

        <div className="stats-container">
          <div className="playlist-count-container">
            <i className="icon-list"></i> {this.props.user.playlists ? this.props.user.playlists.length : 0}
          </div>
          <div className="group-count-container">
            <i className="icon-group"></i> {this.props.user.groups ? this.props.user.groups.length : 0}
          </div>
          <div className="like-count-container">
            <i className="icon-heart"></i> {this.props.user.likes ? this.props.user.likes.length : 0}
          </div>
        </div>

        <div className="shadow" />

      </div>
    );
  }

});

export default ProfileSidebar;