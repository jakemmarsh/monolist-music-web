'use strict';

import _ from 'lodash';

const PermissionsHelpers = {

  userCanViewPlaylist(playlist = {}, user = {}) {
    const collaboration = _.find(playlist.collaborators, { id: user.id });

    if ( playlist.privacy === 'public' || !_.isEmpty(collaboration) || playlist.owner.id === user.id ) {
      return true;
    }

    return false;
  },

  isUserPlaylistCreator(playlist = {}, user = {}) {
    const userIsOwner = playlist.ownerType === 'user' && playlist.owner.id === user.id;
    const userIsGroupOwner = playlist.ownerType === 'group' && playlist.owner.ownerId === user.id;

    return userIsOwner || userIsGroupOwner;
  },

  isUserPlaylistCollaborator(playlist = {}, user = {}) {
    const isCollaborator = !!_.where(playlist.collaborators, { id: user.id }).length;
    const isOwnedByGroup = playlist.ownerType === 'group';
    const isGroupOwner = isOwnedByGroup && playlist.owner.ownerId === user.id;
    const isGroupMember = isOwnedByGroup && !!_.where(playlist.owner.memberships, { userId: user.id }).length;

    return isCollaborator || isGroupOwner || isGroupMember;
  },

  userCanFollowPlaylist(playlist = {}, user = {}) {
    return playlist.ownerType === 'user' && playlist.owner.id !== user.id;
  },

  userCanViewGroup(group = {}, user = {}) {
    const membership = _.find(group.memberships, { userId: user.id });

    if ( group.privacy === 'public' || !_.isEmpty(membership) || group.owner.id === user.id ) {
      return true;
    }

    return false;
  },

  isUserGroupCreator(group, user) {
    return group.owner.id === user.id;
  }

};

export default PermissionsHelpers;
