'use strict';

import React              from 'react';
import LinkedStateMixin   from 'react-addons-linked-state-mixin';
import {ListenerMixin}    from 'reflux';
import _                  from 'lodash';
import cx                 from 'classnames';

import GroupActions       from '../actions/GroupActions';
import Modals             from '../utils/Modals';
import PermissionsHelpers from '../utils/PermissionsHelpers';
import TagList            from './TagList';

const GroupSubheader = React.createClass({

  mixins: [LinkedStateMixin, ListenerMixin],

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

  // for UserSearchModalMixin
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

  renderJoinLeaveButton() {
    const currentUserIsMember = this.props.isUserMember(this.props.currentUser);
    // console.log('currentUserIsMember:', currentUserIsMember);
    // console.log('isUserGroupCreator:', PermissionsHelpers.isUserGroupCreator(this.props.group, this.props.currentUser));
    const shouldDisplay = !PermissionsHelpers.isUserGroupCreator(this.props.group, this.props.currentUser) && (this.props.group.privacy !== 'private' || currentUserIsMember);
    // console.log('should display:', shouldDisplay);
    const iconClasses=cx({
      'icon-user-plus': !currentUserIsMember,
      'icon-user-times': currentUserIsMember
    });

    if ( shouldDisplay ) {
      console.log('will render join/leave button');
      return (
        <div ref="joinLeaveButton" className="btn entity-subheader-action-button" onClick={this.toggleGroupMembership}>
          <i ref="joinLeaveIcon" className={iconClasses} />
        </div>
      );
    }
  },

  renderFollowButton() {
    const classes = cx('btn', 'entity-subheader-action-button', {
      'active-yellow': this.currentUserDoesFollow()
    });

    if ( !_.isEmpty(this.props.currentUser) && !this.props.isUserMember(this.props.currentUser) ) {
      return (
        <div ref="followButton" className={classes} onClick={this.toggleFollowGroup}>
          <i className="icon-rss-square" />
        </div>
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
      console.log('will render manage members button');
      return (
        <div ref="manageMembersButton"
             className="btn entity-subheader-action-button"
             onClick={clickHandler}>
          <i className="icon-group" />
        </div>
      );
    }
  },

  renderEditButton() {
    if ( PermissionsHelpers.isUserGroupCreator(this.props.group, this.props.currentUser) ) {
      const clickHandler = Modals.openEditGroup.bind(null, this.props.group);

      return (
        <div ref="editButton"
             className="btn entity-subheader-action-button"
             onClick={clickHandler}>
          <i className="icon-cog" />
        </div>
      );
    }
  },

  render() {
    const privacyIconClasses = cx('entity-subheader-privacy-icon', 'delta', {
      'icon-globe': this.props.group.privacy === 'public',
      'icon-lock': this.props.group.privacy === 'private'
    });

    return (
      <div className="entity-subheader group-subheader">

        {this.renderGroupImage()}

        <div className="entity-subheader-info-container">
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

        <div className="entity-subheader-actions-container text-right">
          <div className="entity-subheader-button-group">
            {this.renderFollowButton()}
            {this.renderJoinLeaveButton()}
            {this.renderManageMembersButton()}
            {this.renderEditButton()}
          </div>
        </div>

      </div>
    );
  }

});

export default GroupSubheader;
