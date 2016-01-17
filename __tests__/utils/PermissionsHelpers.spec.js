'use strict';

import PermissionsHelpers from '../../app/js/utils/PermissionsHelpers';

describe('Util: PermissionsHelpers', function() {

  const user = { id: 1 };

  describe('#userCanViewPlaylist', function() {
    it('should return true if playlist is public', function() {
      const playlist = {
        privacy: 'public',
        owner: {},
        collaborators: []
      };

      PermissionsHelpers.userCanViewPlaylist(playlist, user).should.be.true();
    });

    it('should return true if user is collaborator', function() {
      const playlist = {
        privacy: 'private',
        owner: {},
        collaborators: [user]
      };

      PermissionsHelpers.userCanViewPlaylist(playlist, user).should.be.true();
    });

    it('should return true if user is playlist owner', function() {
      const playlist = {
        privacy: 'private',
        owner: user,
        collaborators: []
      };

      PermissionsHelpers.userCanViewPlaylist(playlist, user).should.be.true();
    });

    it('should otherwise return false', function() {
      const playlist = {
        privacy: 'private',
        owner: {},
        collaborators: []
      };

      PermissionsHelpers.userCanViewPlaylist(playlist, user).should.be.false();
    });
  });

  describe('#isUserPlaylistCreator', function() {
    it('should return true if user is playlist owner', function() {
      const playlist = {
        ownerType: 'user',
        owner: user
      };

      PermissionsHelpers.isUserPlaylistCreator(playlist, user).should.be.true();
    });

    it('should return true if playlist owner is group and user owns group', function() {
      const playlist = {
        ownerType: 'group',
        owner: {
          ownerId: user.id
        }
      };

      PermissionsHelpers.isUserPlaylistCreator(playlist, user).should.be.true();
    });

    it('should otherwise return false', function() {
      const playlist = {};

      PermissionsHelpers.isUserPlaylistCreator(playlist, user).should.be.false();
    });
  });

  describe('#isUserPlaylistCollaborator', function() {
    it('should return true if user is collaborator', function() {
      const playlist = {
        collaborators: [user]
      };

      PermissionsHelpers.isUserPlaylistCollaborator(playlist, user).should.be.true();
    });

    it('should return true if playlist owner is group and user owns group', function() {
      const playlist = {
        ownerType: 'group',
        owner: {
          ownerId: user.id
        }
      };

      PermissionsHelpers.isUserPlaylistCollaborator(playlist, user).should.be.true();
    });

    it('should return true if playlist owner is group and user is member of group', function() {
      const playlist = {
        ownerType: 'group',
        owner: {
          memberships: [{ userId: user.id }]
        }
      };

      PermissionsHelpers.isUserPlaylistCollaborator(playlist, user).should.be.true();
    });

    it('should otherwise return false', function() {
      const playlist = {};

      PermissionsHelpers.isUserPlaylistCollaborator(playlist, user).should.be.false();
    });
  });

  describe('#userCanFollowPlaylist', function() {
    it('should return true if user exists and is not playlist owner', function() {
      const playlist = {
        ownerType: 'user',
        owner: {
          id: 2
        }
      };

      PermissionsHelpers.userCanFollowPlaylist(playlist, user).should.be.true();
    });

    it('should otherwise return false', function() {
      const playlist = {};

      PermissionsHelpers.userCanFollowPlaylist(playlist, user).should.be.false();
    });
  });

  describe('#userCanViewGroup', function() {
    it('should return true if group is public', function() {
      const group = {
        privacy: 'public'
      };

      PermissionsHelpers.userCanViewGroup(group, user).should.be.true();
    });

    it('should return true if user is member of group', function() {
      const group = {
        memberships: [{ userId: user.id }]
      };

      PermissionsHelpers.userCanViewGroup(group, user).should.be.true();
    });

    it('should return true if user is group owner', function() {
      const group = {
        owner: {
          id: user.id
        }
      };

      PermissionsHelpers.userCanViewGroup(group, user).should.be.true();
    });

    it('should otherwise return false', function() {
      const group = {
        owner: {}
      };

      PermissionsHelpers.userCanViewGroup(group, user).should.be.false();
    });
  });

  describe('#isUserGroupCreator', function() {
    it('should return true if user is group owner', function() {
      const group = {
        owner: {
          id: user.id
        }
      };

      PermissionsHelpers.isUserGroupCreator(group, user).should.be.true();
    });

    it('should otherwise return false', function() {
      const group = {
        owner: {
          id: 2
        }
      };

      PermissionsHelpers.isUserGroupCreator(group, user).should.be.false();
    });
  });

});
