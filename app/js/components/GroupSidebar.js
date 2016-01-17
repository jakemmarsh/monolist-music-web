'use strict';

import React                from 'react';
import LinkedStateMixin     from 'react-addons-linked-state-mixin';
import {ListenerMixin}      from 'reflux';
import _                    from 'lodash';
import cx                   from 'classnames';

import GroupActions         from '../actions/GroupActions';
import UserSearchModalMixin from '../mixins/UserSearchModalMixin';
import EditGroupModalMixin  from '../mixins/EditGroupModalMixin';
import {isUserGroupCreator} from '../utils/PermissionsHelpers';

const GroupSidebar = React.createClass({

  mixins: [LinkedStateMixin, ListenerMixin, UserSearchModalMixin, EditGroupModalMixin],

  propTypes: {
    currentUser: React.PropTypes.object,
    group: React.PropTypes.object,
    getUserLevel: React.PropTypes.func,
    isUserSelected: React.PropTypes.func,
    selectUser: React.PropTypes.func,
    deselectUser: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      currentUser: {},
      group: {},
      isUserSelected: function() {},
      selectUser: function() {},
      deselectUser: function() {},
      getUserLevel: function() {}
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
    const hasNewGroup = !_.isEmpty(nextProps.group) && !_.isEqual(this.props.group, nextProps.group);
    const hasNewUser = !_.isEmpty(nextProps.currentUser) && !_.isEqual(this.props.currentUser, nextProps.currentUser);

    if ( hasNewGroup || hasNewUser ) {
      this.setState({
        currentUserIsMember: !!_.where(nextProps.group.members, { id: nextProps.currentUser.id }).length,
        currentUserDoesFollow: !!_.where(nextProps.group.followers, { userId: nextProps.currentUser.id }).length
      });
    }
  },

  setPrivacyLevel(newPrivacyLevel) {
    GroupActions.update(this.props.group.id, {
      privacy: newPrivacyLevel
    });
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

  renderGroupDescription() {
    if ( this.props.group.description ) {
      return (
        <p>
          {this.props.group.description}
        </p>
      );
    }
  },

  renderJoinLeaveButton() {
    const shouldDisplay = !isUserGroupCreator(this.props.group, this.props.currentUser) && (this.props.group.privacy !== 'private' || this.state.currentUserIsMember);
    const buttonText = this.state.currentUserIsMember ? 'Leave' : 'Join';
    const classes = cx({
      'action-button': true,
      'join-leave-button': true,
      'half-width': true,
      'inactive': this.state.currentUserIsMember
    });

    if ( !_.isEmpty(this.props.currentUser) && !_.isEmpty(this.props.group) && shouldDisplay ) {
      return (
        <div ref="joinLeaveButton" className={classes} onClick={this.toggleGroupMembership}>
          {buttonText}
        </div>
      );
    }
  },

  renderFollowButton() {
    const buttonText = this.state.currentUserDoesFollow ? 'Following' : 'Follow';
    const classes = cx({
      'action-button': true,
      'follow-button': true,
      'half-width': true,
      'inactive': this.state.currentUserDoesFollow
    });

    if ( !_.isEmpty(this.props.currentUser) && !this.state.currentUserIsMember ) {
      return (
        <div ref="followButton" className={classes} onClick={this.toggleFollowGroup}>
          {buttonText}
        </div>
      );
    }
  },

  renderManageMembersButton() {
    const userIsMember = this.props.isUserSelected(this.props.currentUser);
    const groupInviteLevel = this.props.group.inviteLevel;
    const userLevel = this.props.getUserLevel(this.props.currentUser);

    if ( userIsMember && userLevel >= groupInviteLevel && !_.isEmpty(this.props.group) ) {
      return (
        <div ref="manageMembersButton" className="action-buttons-container">
          <div className="action-button" onClick={this.openUserSearchModal.bind(null, this.props.group.members)}>
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
          <a href={null} onClick={this.openEditGroupModal}>
            <i className="icon-cogs" />
          </a>
          {this.props.group.title}
        </h4>

        <div className="action-buttons-container">
          {this.renderJoinLeaveButton()}
          {this.renderFollowButton()}
        </div>

        <div className="image-container" style={imageStyle} />

        {this.renderGroupDescription()}

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