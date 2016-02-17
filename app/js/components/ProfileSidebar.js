'use strict';

import React       from 'react';
import _           from 'lodash';
import cx          from 'classnames';

import UserActions from '../actions/UserActions';
import Avatar      from './Avatar';

var ProfileSidebar = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object,
    user: React.PropTypes.object
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
    const followButton = this.refs.followButton;

    if ( followButton ) {
      if ( this.state.currentUserDoesFollow ) {
        followButton.addEventListener('mouseenter', () => {
          followButton.textContent = 'Unfollow';
        });

        followButton.addEventListener('mouseleave', () => {
          followButton.textContent = 'Following';
        });
      } else {
        // TODO: include methods to unbind in all removeEventListener calls
        followButton.removeEventListener('hover');
        followButton.removeEventListener('mouseleave');
      }
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

    if ( !_.isEmpty(this.props.currentUser) && !_.isEmpty(this.props.user) && this.props.currentUser.id !== this.props.user.id ) {
      return (
        <div ref="followButton" className={classes} onClick={this.toggleFollowUser}>
          {buttonText}
        </div>
      );
    }
  },

  render() {
    return (
      <div className="profile-sidebar">

        <h4 className="username">
          {this.props.user.username}
          <i className="icon-user"></i>
        </h4>

        <div className="action-buttons-container">
          {this.renderFollowButton()}
        </div>

        <Avatar user={this.props.user} includeLink={false} size="175px" />

        <div className="stats-container">
          <div className="playlist-count-container">
            <i className="icon-list highlight"></i> {this.props.user.playlists ? this.props.user.playlists.length : 0}
          </div>
          <div className="group-count-container">
            <i className="icon-group"></i> {this.props.user.groups ? this.props.user.groups.length : 0}
          </div>
          <div className="like-count-container">
            <i className="icon-heart red"></i> {this.props.user.likes ? this.props.user.likes.length : 0}
          </div>
          <div className="starred-count-container">
            <i className="icon-star star-yellow"></i> {this.props.user.starredTracks ? this.props.user.starredTracks.length : 0}
          </div>
        </div>

        <div className="shadow" />

      </div>
    );
  }

});

export default ProfileSidebar;