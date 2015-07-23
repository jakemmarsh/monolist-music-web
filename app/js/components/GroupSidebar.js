'use strict';

import React        from 'react/addons';
import _            from 'lodash';
import $            from 'jquery';
import cx           from 'classnames';

import GroupActions from '../actions/GroupActions';

var GroupSidebar = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    group: React.PropTypes.object.isRequired,
    getUserLevel: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      group: {}
    };
  },

  getInitialState() {
    return {
      currentUserIsMember: false,
      currentUserDoesFollow: false
    };
  },

  componentWillReceiveProps(nextProps) {
    if ( !_.isEmpty(nextProps.group) && !_.isEqual(this.props.group, nextProps.group) ) {
      console.log('matching membership:', _.where(nextProps.group.memberships, { userId: nextProps.currentUser.id }));
      this.setState({
        currentUserIsMember: !!_.where(nextProps.group.memberships, { userId: nextProps.currentUser.id }).length,
        currentUserDoesFollow: !!_.where(nextProps.group.followers, { userId: nextProps.currentUser.id }).length
      });
    }
  },

  toggleGroupMembership() {
    this.setState({ currentUserIsMember: !this.state.currentUserIsMember }, () => {
      if ( this.state.currentUserIsMember ) {
        GroupActions.addMember(this.props.group.id, this.props.currentUser);
      } else {
        GroupActions.removeMember(this.props.group.id, this.props.currentUser);
      }
    });
  },

  toggleFollowGroup() {
    this.setState({ currentUserDoesFollow: !this.state.currentUserDoesFollow }, GroupActions.follow.bind(null, this.props.group.id));
  },

  renderJoinLeaveButton() {
    let currentUserIsOwner = this.props.group.ownerId === this.props.currentUser.id;
    let shouldDisplay = !currentUserIsOwner && (this.props.group.privacy !== 'private' || this.state.currentUserIsMember);
    let buttonText = this.state.currentUserIsMember ? 'Leave' : 'Join';
    let classes = cx({
      'action-button': true,
      'join-leave-button': true,
      'half-width': true,
      'inactive': this.state.currentUserIsMember
    });

    if ( !_.isEmpty(this.props.currentUser) && !_.isEmpty(this.props.group) && shouldDisplay ) {
      return (
        <div className={classes} onClick={this.toggleGroupMembership}>
          {buttonText}
        </div>
      );
    }
  },

  renderFollowButton() {
    let currentUserIsOwner = this.props.group.ownerId === this.props.currentUser.id;
    let buttonText = this.state.currentUserDoesFollow ? 'Following' : 'Follow';
    let classes = cx({
      'action-button': true,
      'follow-button': true,
      'half-width': true,
      'inactive': this.state.currentUserDoesFollow
    });

    if ( !_.isEmpty(this.props.currentUser) && !_.isEmpty(this.props.group) && !currentUserIsOwner ) {
      return (
        <div className={classes} onClick={this.toggleFollowGroup}>
          {buttonText}
        </div>
      );
    }
  },

  render() {
    let imageStyle = {};

    if ( this.props.group.imageUrl ) {
      imageStyle.backgroundImage = 'url(' + this.props.group.imageUrl + ')';
    }

    return (
      <div className="playlist-group-sidebar">

        <h4 className="title flush--top">
          {this.props.group.title}
          <i className="fa fa-users"></i>
        </h4>

        <div className="action-buttons-container">
          {this.renderJoinLeaveButton()}
          {this.renderFollowButton()}
        </div>

        <div className="image-container" style={imageStyle} />

        <div className="stats-container">
          <div className="member-count-container">
            <i className="fa fa-users"></i> {this.props.group.members ? this.props.group.members.length : 0}
          </div>
        </div>

        <div className="shadow" />

      </div>
    );
  }

});

export default GroupSidebar;