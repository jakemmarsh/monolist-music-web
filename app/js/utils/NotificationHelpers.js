'use strict';

const NotificationHelpers = {

  verbMap: {
    'follow': 'began following',
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
    'playlist': '/playlist/',
    'post': '/post/'
  }

};

export default NotificationHelpers;