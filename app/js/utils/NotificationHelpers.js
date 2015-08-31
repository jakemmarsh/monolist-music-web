'use strict';

import GroupAPI    from './GroupAPI';
import PlaylistAPI from './PlaylistAPI';

const NotificationHelpers = {

  verbMap: {
    'follow': 'began following you.',
    'create': 'created',
    'like': 'liked',
    'addComment': 'commented on',
    'addTrack': 'added a track to',
    'addCollaborator': 'added you as a collaborator to',
    'removeCollaborator': 'removed you as a collaborator from',
    'upvote': 'upvoted',
    'downvote': 'downvoted',
    'addMember': 'added you as a member to',
    'removeMember': 'removed you as a member from',
    'updateMemberLevel': 'updated your member level in'
  },

  entityPathMap: {
    'group': '/group/',
    'user': '/profile/',
    'playlist': '/playlist/'
  },

  retrievalMap: {
    'playlist': PlaylistAPI.get,
    'group': GroupAPI.get
  },

  getRelatedEntity(entityType, entityId) {
    return new Promise((resolve, reject) => {
      this.retrievalMap[entityType](entityId).then((entity) => {
        resolve({
          identifier: entity.slug || entity.username || entity.id,
          title: entity.username || entity.title
        });
      }).catch((err) => {
        reject(err);
      });
    });
  }

};

export default NotificationHelpers;