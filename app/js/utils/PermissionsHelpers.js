'use strict';

import _ from 'lodash';

const PermissionsHelpers = {

  userCanViewPlaylist(playlist = {}, user = {}) {
    const collaboration = _.find(playlist.collaborators, { id: user.id });

    return playlist.privacy === 'public' || !_.isEmpty(collaboration) || playlist.owner.id === user.id;
  },

  isUserPlaylistCreator(playlist = {}, user = {}) {
    if ( _.isEmpty(user) ) {
      return false;
    }

    const userIsOwner = playlist.ownerType === 'user' && playlist.owner.id === user.id;
    const userIsGroupOwner = playlist.ownerType === 'group' && playlist.owner.ownerId === user.id;

    return userIsOwner || userIsGroupOwner;
  },

  isUserPlaylistCollaborator(playlist = {}, user = {}) {
    if ( _.isEmpty(user) ) {
      return false;
    }

    const isCollaborator = _.some(playlist.collaborators, { id: user.id });
    const isOwnedByGroup = playlist.ownerType === 'group';
    const isGroupOwner = isOwnedByGroup && playlist.owner.ownerId === user.id;
    const isGroupMember = isOwnedByGroup && _.some(playlist.owner.memberships, { userId: user.id });

    return isCollaborator || isGroupOwner || isGroupMember;
  },

  userCanFollowPlaylist(playlist = {}, user = {}) {
    return playlist.ownerType === 'user' && playlist.owner.id !== user.id;
  },

  userCanViewGroup(group = {}, user = {}) {
    const membership = _.find(group.memberships, { userId: user.id });

    return group.privacy === 'public' || !_.isEmpty(membership) || group.owner.id === user.id;
  },

  isUserGroupCreator(group, user) {
    if ( _.isEmpty(user) ) {
      return false;
    }

    return group && user && group.owner && group.owner.id === user.id;
  }

};

export default PermissionsHelpers;
