'use strict';

import React              from 'react';
import {ListenerMixin}    from 'reflux';
import _                  from 'lodash';
import {History}          from 'react-router';
import cx                 from 'classnames';

import GroupActions       from '../actions/GroupActions';
import Modals             from '../utils/Modals';
import PermissionsHelpers from '../utils/PermissionsHelpers';
import TagList            from './TagList';
import ActionButton       from './ActionButton';

const GroupSubheader = React.createClass({

  mixins: [ListenerMixin, History],

  propTypes: {
    currentUser: React.PropTypes.object,
    group: React.PropTypes.object,
    getUserLevel: React.PropTypes.func,
    isUserMember: React.PropTypes.func,
    addMember: React.PropTypes.func,
    removeMember: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      currentUser: {},
      group: {},
      isUserMember: function() {},
      addMember: function() {},
      removeMember: function() {},
      getUserLevel: function() {}
    };
  },

  isUserSelected(user) { return this.props.isUserMember(user); },
  selectUser(user) { return this.props.addMember(user); },
  deselectUser(user) { return this.props.removeMember(user); },

  currentUserDoesFollow() {
    return _.some(this.props.group.followers, { followerId: this.props.currentUser.id });
  },

  toggleGroupMembership() {
    if ( this.props.isUserMember(this.props.currentUser) ) {
      this.props.removeMember(this.props.currentUser);
    } else {
      this.props.addMember(this.props.currentUser);
    }
  },

  toggleFollowGroup() {
    GroupActions.follow(this.props.group.id, this.props.currentUser);
  },

  deleteGroup() {
    GroupActions.delete(this.props.group, () => {
      this.history.pushState(null, '/groups');
    });
  },

  renderGroupImage() {
    if ( this.props.group.imageUrl ) {
      const imageStyles = {
        backgroundImage: `url(${this.props.group.imageUrl})`
      };

      return (
        <div className="entity-subheader-image-container">
          <div className="entity-subheader-image" style={imageStyles} />
        </div>
      );
    }
  },

  renderGroupInfo() {
    const privacyIconClasses = cx('entity-subheader-privacy-icon', 'delta', {
      'icon-globe': this.props.group.privacy === 'public',
      'icon-lock': this.props.group.privacy === 'private'
    });

    if ( this.props.group.id ) {
      return (
        <div>
          <h1 className="entity-subheader-title">
            {this.props.group.title}
            <i className={privacyIconClasses} />
          </h1>
          <ul className="entity-subheader-stats">
            <li className="entity-subheader-stat-item">
              <span>
                <i className="icon-user entity-subheader-stat-icon" /> {this.props.group.members ? this.props.group.members.length : 0}
              </span>
            </li>
          </ul>
          <TagList type="group" tags={this.props.group.tags} className="nudge-quarter--ends" />
        </div>
      );
    }
  },

  renderJoinLeaveButton() {
    const currentUserIsMember = this.props.isUserMember(this.props.currentUser);
    const shouldDisplay = !PermissionsHelpers.isUserGroupCreator(this.props.group, this.props.currentUser) && (this.props.group.privacy !== 'private' || currentUserIsMember);
    const icon = currentUserIsMember ? 'user-times' : 'user-plus';
    const tooltip = currentUserIsMember ? 'Leave' : 'Join';

    if ( !_.isEmpty(this.props.currentUser) && shouldDisplay ) {
      return (
        <ActionButton ref="joinLeaveButton"
                      onClick={this.toggleGroupMembership}
                      icon={icon}
                      tooltip={tooltip} />
      );
    }
  },

  renderFollowButton() {
    const currentUserDoesFollow = this.currentUserDoesFollow();
    const classes = cx({
      'active-yellow': this.currentUserDoesFollow()
    });
    const tooltip = currentUserDoesFollow ? 'Unfollow' : 'Follow';

    if ( !_.isEmpty(this.props.currentUser) && !this.props.isUserMember(this.props.currentUser) ) {
      return (
        <ActionButton ref="followButton"
                      onClick={this.toggleFollowGroup}
                      icon="rss-square"
                      className={classes}
                      tooltip={tooltip} />
      );
    }
  },

  renderManageMembersButton() {
    const userIsMember = this.props.isUserMember(this.props.currentUser);
    const groupInviteLevel = this.props.group.inviteLevel;
    const userLevel = this.props.getUserLevel(this.props.currentUser);
    const clickHandler = Modals.openUserSearch.bind(
      null,
      this.props.group.members,
      this.props.currentUser,
      this.selectUser,
      this.deselectUser,
      this.isUserSelected
    );

    if ( userIsMember && userLevel >= groupInviteLevel ) {
      return (
        <ActionButton ref="manageMembersButton"
                      onClick={clickHandler}
                      icon="group"
                      tooltip="Manage Members" />
      );
    }
  },

  renderEditButton() {
    if ( PermissionsHelpers.isUserGroupCreator(this.props.group, this.props.currentUser) ) {
      const clickHandler = Modals.openEditGroup.bind(null, this.props.group);

      return (
        <ActionButton ref="editButton"
                      onClick={clickHandler}
                      icon="edit"
                      tooltip="Edit" />
      );
    }
  },

  renderDeleteButton() {
    const userIsCreator = PermissionsHelpers.isUserGroupCreator(this.props.group, this.props.currentUser);

    if ( userIsCreator ) {
      const clickHandler = Modals.openConfirmation.bind(
        null,
        'Are you sure you want to delete this group?',
        this.deleteGroup
      );

      return (
        <ActionButton ref="deleteButton"
                      onClick={clickHandler}
                      icon="close"
                      tooltip="Delete" />
      );
    }
  },

  renderActionButtons() {
    if ( this.props.group.id ) {
      return (
        <div className="entity-subheader-button-group">
          {this.renderFollowButton()}
          {this.renderJoinLeaveButton()}
          {this.renderManageMembersButton()}
          {this.renderEditButton()}
          {this.renderDeleteButton()}
        </div>
      );
    }
  },

  render() {
    return (
      <div className="entity-subheader group-subheader">
        <div className="max-width-wrapper d-f ai-c">
          {this.renderGroupImage()}

          <div className="entity-subheader-info-container">
            {this.renderGroupInfo()}
          </div>

          <div className="entity-subheader-actions-container text-right">
            {this.renderActionButtons()}
          </div>
        </div>
      </div>
    );
  }

});

export default GroupSubheader;
