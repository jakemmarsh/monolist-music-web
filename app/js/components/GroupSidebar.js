'use strict';

import React                from 'react/addons';
import {ListenerMixin}      from 'reflux';
import _                    from 'lodash';
import cx                   from 'classnames';

import GroupActions         from '../actions/GroupActions';
import UserSearchModalMixin from '../mixins/UserSearchModalMixin';

var GroupSidebar = React.createClass({


  mixins: [React.addons.LinkedStateMixin, ListenerMixin, UserSearchModalMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    group: React.PropTypes.object.isRequired,
    getUserLevel: React.PropTypes.func.isRequired,
    isUserSelected: React.PropTypes.func.isRequired,
    selectUser: React.PropTypes.func.isRequired,
    deselectUser: React.PropTypes.func.isRequired
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

  // for UserSearchModalMixin
  isUserSelected(user) { return this.props.isUserSelected(user); },
  selectUser(user) { return this.props.selectUser(user); },
  deselectUser(user) { return this.props.deselectUser(user); },

  componentWillReceiveProps(nextProps) {
    let hasNewGroup = !_.isEmpty(nextProps.group) && !_.isEqual(this.props.group, nextProps.group);
    let hasNewUser = !_.isEmpty(nextProps.currentUser) && !_.isEqual(this.props.currentUser, nextProps.currentUser);

    if ( hasNewGroup || hasNewUser ) {
      this.setState({
        currentUserIsMember: !!_.where(nextProps.group.members, { id: nextProps.currentUser.id }).length,
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
    let currentUserIsOwner = this.props.group.owner.id === this.props.currentUser.id;
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
    let buttonText = this.state.currentUserDoesFollow ? 'Following' : 'Follow';
    let classes = cx({
      'action-button': true,
      'follow-button': true,
      'half-width': true,
      'inactive': this.state.currentUserDoesFollow
    });

    if ( !_.isEmpty(this.props.currentUser) && !this.state.currentUserIsMember ) {
      return (
        <div className={classes} onClick={this.toggleFollowGroup}>
          {buttonText}
        </div>
      );
    }
  },

  renderManageMembersButton() {
    let userIsMember = this.props.isUserSelected(this.props.currentUser);
    let groupInviteLevel = this.props.group.inviteLevel;
    let userLevel = this.props.getUserLevel(this.props.currentUser);

    if ( userIsMember && userLevel >= groupInviteLevel && !_.isEmpty(this.props.group) ) {
      return (
        <div className="action-buttons-container">
          <div className="action-button" onClick={this.toggleUserSearchModal.bind(null, this.props.group.members)}>
            Add/Remove Members
          </div>
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
      <div className="group-sidebar">

        <h4 className="title flush--top">
          {this.props.group.title}
          <i className="icon-group"></i>
        </h4>

        <div className="action-buttons-container">
          {this.renderJoinLeaveButton()}
          {this.renderFollowButton()}
        </div>

        <div className="image-container" style={imageStyle} />

        <div className="stats-container">
          <div className="member-count-container">
            <i className="icon-user"></i> {this.props.group.members ? this.props.group.members.length : 0}
          </div>
        </div>

        {this.renderManageMembersButton()}

        <div className="shadow" />

      </div>
    );
  }

});

export default GroupSidebar;