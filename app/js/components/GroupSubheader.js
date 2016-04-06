'use strict';

import React                from 'react';
import LinkedStateMixin     from 'react-addons-linked-state-mixin';
import {ListenerMixin}      from 'reflux';
import _                    from 'lodash';
import cx                   from 'classnames';

import GroupActions         from '../actions/GroupActions';
import UserSearchModalMixin from '../mixins/UserSearchModalMixin';
import EditGroupModalMixin  from '../mixins/EditGroupModalMixin';
import PermissionsHelpers   from '../utils/PermissionsHelpers';
import TagList              from './TagList';

const GroupSubheader = React.createClass({

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
      currentUserIsMember: _.some(this.props.group.members, { id: this.props.currentUser.id }),
      currentUserDoesFollow: _.some(this.props.group.followers, { userId: this.props.currentUser.id })
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
        currentUserIsMember: _.some(nextProps.group.members, { id: nextProps.currentUser.id }),
        currentUserDoesFollow: _.some(nextProps.group.followers, { userId: nextProps.currentUser.id })
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
    this.setState({
      currentUserDoesFollow: !this.state.currentUserDoesFollow
    }, GroupActions.follow.bind(null, this.props.group.id));
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
    const shouldDisplay = !PermissionsHelpers.isUserGroupCreator(this.props.group, this.props.currentUser) && (this.props.group.privacy !== 'private' || this.state.currentUserIsMember);
    const iconClasses=cx({
      'icon-user-plus': !this.state.currentUserIsMember,
      'icon-user-times': this.state.currentUserIsMember
    });

    if ( shouldDisplay ) {
      return (
        <div ref="joinLeaveButton" className="btn entity-subheader-action-button" onClick={this.toggleGroupMembership}>
          <i className={iconClasses} />
        </div>
      );
    }
  },

  renderFollowButton() {
    const classes = cx('btn', 'entity-subheader-action-button', {
      'active-yellow': this.state.currentUserDoesFollow
    });

    if ( !_.isEmpty(this.props.currentUser) && !this.state.currentUserIsMember ) {
      return (
        <div ref="followButton" className={classes} onClick={this.toggleFollowGroup}>
          <i className="icon-rss-square" />
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
        <div ref="manageMembersButton"
             className="btn entity-subheader-action-button"
             onClick={this.openUserSearchModal.bind(null, this.props.group.members)}>
          <i className="icon-group" />
        </div>
      );
    }
  },

  renderEditButton() {
    if ( PermissionsHelpers.isUserGroupCreator(this.props.group, this.props.currentUser) ) {
      return (
        <div className="btn entity-subheader-action-button" onClick={this.openEditGroupModal.bind(null, this.props.group)}>
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
