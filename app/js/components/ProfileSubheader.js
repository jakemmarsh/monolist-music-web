'use strict';

import React       from 'react';
import _           from 'lodash';
import cx          from 'classnames';

import UserActions from '../actions/UserActions';

const ProfileSubheader = React.createClass({

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
        currentUserDoesFollow: _.some(nextProps.user.followers, { followerId: nextProps.currentUser.id })
      });
    }
  },

  toggleFollowUser() {
    this.setState({
      currentUserDoesFollow: !this.state.currentUserDoesFollow
    }, UserActions.follow.bind(null, this.props.user));
  },

  renderUserImage() {
    if ( this.props.user.imageUrl ) {
      const imageStyles = {
        backgroundImage: `url(${this.props.user.imageUrl})`
      };

      return (
        <div className="entity-subheader-image-container">
          <div className="entity-subheader-image" style={imageStyles} />
        </div>
      );
    }
  },

  renderFollowButton() {
    const hasUserAndProfile = !_.isEmpty(this.props.currentUser) && !_.isEmpty(this.props.user);
    const usersAreDifferent = this.props.currentUser.id !== this.props.user.id;

    if ( hasUserAndProfile && usersAreDifferent ) {
      const classes = cx('btn', 'entity-subheader-action-button', {
        'active-yellow': this.state.currentUserDoesFollow
      });

      return (
        <div ref="followButton" className={classes} onClick={this.toggleFollowUser}>
          <i className="icon-rss-square" />
        </div>
      );
    }
  },

  render() {
    return (
      <div className="entity-subheader profile-subheader">

        {this.renderUserImage()}

        <div className="entity-subheader-info-container">
          <h1 className="entity-subheader-title">
            {this.props.user.username}
          </h1>
          <ul className="entity-subheader-stats">
            <li className="entity-subheader-stat-item">
              <span className="nudge-quarter--right">
                <i className="icon-list entity-subheader-stat-icon" />
                {this.props.user.playlists ? this.props.user.playlists.length : 0}
              </span>
              <span className="nudge-quarter--right">
                <i className="icon-group entity-subheader-stat-icon" />
                {this.props.user.groups ? this.props.user.groups.length : 0}
              </span>
              <span className="nudge-quarter--right">
                <i className="icon-heart entity-subheader-stat-icon" />
                {this.props.user.likes ? this.props.user.likes.length : 0}
              </span>
              <span>
                <i className="icon-star entity-subheader-stat-icon" />
                {this.props.user.starredTracks ? this.props.user.starredTracks.length : 0}
              </span>
            </li>
          </ul>
        </div>

        <div className="entity-subheader-actions-container text-right">
          <div className="entity-subheader-button-group">
            {this.renderFollowButton()}
          </div>
        </div>

      </div>
    );
  }

});

export default ProfileSubheader;
