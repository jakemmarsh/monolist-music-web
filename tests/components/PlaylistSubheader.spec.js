'use strict';

import React             from 'react';
import ReactDOM          from 'react-dom';
import TestUtils         from 'react-addons-test-utils';

import testHelpers       from '../../utils/testHelpers';
import copyObject        from '../../utils/copyObject';
import Modals            from '../../app/js/utils/Modals';
import PlaylistActions   from '../../app/js/actions/PlaylistActions';
import PlaylistSubheader from '../../app/js/components/PlaylistSubheader';

describe('Component: PlaylistSubheader', function() {

  const PLAYLIST = testHelpers.fixtures.playlist;
  const USER = testHelpers.fixtures.user;
  let props;
  let rendered;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <PlaylistSubheader {...props} />
    );
  }

  beforeEach(function() {
    props = {};
  });

  describe('manage collaborators button', function() {
    context('when user is not playlist owner', function() {
      beforeEach(function() {
        const newPlaylist = copyObject(PLAYLIST);
        newPlaylist.owner = {};

        props.playlist = newPlaylist;
        props.currentUser = copyObject(USER);

        renderComponent();
      });

      it('should not render', function() {
        assert.isUndefined(rendered.refs.manageCollaboratorsButton);
      });
    });

    context('when user is playlist owner', function() {
      beforeEach(function() {
        const newPlaylist = copyObject(PLAYLIST);
        const newUser = copyObject(USER);
        newPlaylist.owner = newUser;

        props.playlist = newPlaylist;
        props.currentUser = newUser;
        props.selectUser = sandbox.stub();
        props.deselectUser = sandbox.stub();

        sandbox.stub(Modals, 'openUserSearch');
        renderComponent();
      });

      it('should render', function() {
        assert.isDefined(rendered.refs.manageCollaboratorsButton);
      });

      it('should open user search modal on click', function() {
        const button = ReactDOM.findDOMNode(rendered.refs.manageCollaboratorsButton);
        TestUtils.Simulate.click(button);

        sinon.assert.calledOnce(Modals.openUserSearch);
        sinon.assert.calledWith(
          Modals.openUserSearch,
          props.playlist.collaborators,
          props.currentUser,
          rendered.selectUser,
          rendered.deselectUser,
          rendered.isUserSelected
        );
      });
    });
  });

  describe('add track from URL button', function() {
    context('when user is not the playlist owner or collaborator', function() {
      beforeEach(function() {
        const newPlaylist = copyObject(PLAYLIST);
        newPlaylist.owner = { id: 5000 };
        newPlaylist.collaborators = [];

        props.playlist = newPlaylist;
        props.currentUser = copyObject(USER);
        renderComponent();
      });

      it('should not render', function() {
        assert.isUndefined(rendered.refs.addTrackFromUrlButton);
      });
    });

    context('when user is playlist owner', function() {
      beforeEach(function() {
        const newPlaylist = copyObject(PLAYLIST);
        const newUser = copyObject(USER);
        newPlaylist.owner = newUser;
        newPlaylist.collaborators = [];

        props.playlist = newPlaylist;
        props.currentUser = newUser;

        sandbox.stub(Modals, 'openAddTrackByUrl');
        renderComponent();
      });

      it('should render', function() {
        assert.isDefined(rendered.refs.addTrackFromUrlButton);
      });

      it('should open add track modal on click', function() {
        const button = ReactDOM.findDOMNode(rendered.refs.addTrackFromUrlButton);
        TestUtils.Simulate.click(button);

        sinon.assert.calledOnce(Modals.openAddTrackByUrl);
        sinon.assert.calledWith(Modals.openAddTrackByUrl, props.playlist, props.currentUser);
      });
    });

    context('when user is a collaborator', function() {
      beforeEach(function() {
        const newPlaylist = copyObject(PLAYLIST);
        const newUser = copyObject(USER);
        newPlaylist.owner = { id: 5000 };
        newPlaylist.collaborators.push(newUser);

        props.playlist = newPlaylist;
        props.currentUser = newUser;

        sandbox.stub(Modals, 'openAddTrackByUrl');
        renderComponent();
      });

      it('should render', function() {
        assert.isDefined(rendered.refs.addTrackFromUrlButton);
      });

      it('should open add track modal on click', function() {
        const button = ReactDOM.findDOMNode(rendered.refs.addTrackFromUrlButton);
        TestUtils.Simulate.click(button);

        sinon.assert.calledOnce(Modals.openAddTrackByUrl);
        sinon.assert.calledWith(Modals.openAddTrackByUrl, props.playlist, props.currentUser);
      });
    });
  });

  describe('follow button', function() {
    context('when playlist is owned by a group', function() {
      beforeEach(function() {
        const newPlaylist = copyObject(PLAYLIST);
        newPlaylist.ownerType = 'group';

        props.playlist = newPlaylist;
        props.currentUser = copyObject(USER);

        renderComponent();
      });

      it('should not render', function() {
        assert.isUndefined(rendered.refs.followButton);
      });
    });

    context('when user is playlist owner', function() {
      beforeEach(function() {
        const newPlaylist = copyObject(PLAYLIST);
        const newUser = copyObject(USER);
        newPlaylist.ownerType = 'user';
        newPlaylist.owner = newUser;

        props.playlist = newPlaylist;
        props.currentUser = newUser;

        renderComponent();
      });

      it('should not render', function() {
        assert.isUndefined(rendered.refs.followButton);
      });
    });

    context('when there is no user', function() {
      beforeEach(function() {
        props.playlist = copyObject(PLAYLIST);
        props.currentUser = {};

        renderComponent();
      });

      it('should not render', function() {
        assert.isUndefined(rendered.refs.followButton);
      });
    });

    context('when playlist is owned by a different user', function() {
      beforeEach(function() {
        const newPlaylist = copyObject(PLAYLIST);
        const newUser = copyObject(USER);
        newPlaylist.ownerType = 'user';
        newPlaylist.owner = newUser;

        props.playlist = newPlaylist;
        props.currentUser = copyObject(testHelpers.fixtures.secondUser);

        sandbox.stub(PlaylistActions, 'follow');
      });

      it('should render', function() {
        renderComponent();
        assert.isDefined(rendered.refs.followButton);
      });

      it('should call action on click', function() {
        renderComponent();
        const button = ReactDOM.findDOMNode(rendered.refs.followButton);
        TestUtils.Simulate.click(button);

        sinon.assert.calledOnce(PlaylistActions.follow);
      });

      context('when the user does not follow the playlist', function() {
        beforeEach(function() {
          props.playlist.followers = [];

          renderComponent();
        });

        it('should render with the correct props', function() {
          const button = rendered.refs.followButton;

          assert.strictEqual(button.props.className, '');
          assert.strictEqual(button.props.onClick, PlaylistActions.follow);
          assert.strictEqual(button.props.icon, 'rss-square');
          assert.strictEqual(button.props.tooltip, 'Follow');
        });
      });

      context('when the user does follow the playlist', function() {
        beforeEach(function() {
          props.playlist.followers = [];
          props.playlist.followers.push({
            playlistId: props.playlist.id,
            userId: props.currentUser.id
          });

          renderComponent();
        });

        it('should render with the correct props', function() {
          const button = rendered.refs.followButton;

          assert.strictEqual(button.props.className, 'active-yellow');
          assert.strictEqual(button.props.onClick, PlaylistActions.follow);
          assert.strictEqual(button.props.icon, 'rss-square');
          assert.strictEqual(button.props.tooltip, 'Unfollow');
        });
      });
    });
  });

  describe('like button', function() {
    context('with no signed-in user', function() {
      beforeEach(function() {
        props.currentUser = null;

        renderComponent();
      });

      it('should not render', function() {
        assert.isUndefined(rendered.refs.likeButton);
      });
    });

    context('with a signed in user', function() {
      const newPlaylist = copyObject(PLAYLIST);
      const newUser = copyObject(USER);

      beforeEach(function() {
        props.currentUser = newUser;
        props.playlist = newPlaylist;
      });

      it('should render', function() {
        renderComponent();

        assert.isDefined(rendered.refs.likeButton);
      });

      context('when the user has not "liked" the playlist', function() {
        beforeEach(function() {
          props.playlist.likes = [];
          renderComponent();
        });

        it('should render with the correct props', function() {
          const button = rendered.refs.likeButton;

          assert.strictEqual(button.props.className, '');
          assert.strictEqual(button.props.onClick, PlaylistActions.like);
          assert.strictEqual(button.props.icon, 'heart');
          assert.strictEqual(button.props.tooltip, 'Like');
        });
      });

      context('when the user has "liked" the playlist', function() {
        beforeEach(function() {
          props.playlist.likes.push({
            userId: newUser.id,
            playlistId: newPlaylist.id
          });

          renderComponent();
        });

        it('should render with the correct props', function() {
          const button = rendered.refs.likeButton;

          assert.strictEqual(button.props.className, 'active-red');
          assert.strictEqual(button.props.onClick, PlaylistActions.like);
          assert.strictEqual(button.props.icon, 'heart');
          assert.strictEqual(button.props.tooltip, 'Unlike');
        });
      });
    });
  });

  describe('share button', function() {
    context('when playlist is private', function() {
      beforeEach(function() {
        const newPlaylist = copyObject(PLAYLIST);
        newPlaylist.privacy = 'private';

        props.playlist = newPlaylist;

        renderComponent();
      });

      it('should not render', function() {
        assert.isUndefined(rendered.refs.shareButton);
      });
    });

    context('when playlist is public', function() {
      beforeEach(function() {
        const newPlaylist = copyObject(PLAYLIST);
        newPlaylist.privacy = 'public';

        props.playlist = newPlaylist;

        sandbox.stub(Modals, 'openShare');
        renderComponent();
      });

      it('should render', function() {
        assert.isDefined(rendered.refs.shareButton);
      });

      it('should open share modal on click', function() {
        const button = ReactDOM.findDOMNode(rendered.refs.shareButton);
        TestUtils.Simulate.click(button);

        sinon.assert.calledOnce(Modals.openShare);
        sinon.assert.calledWith(Modals.openShare, props.playlist);
      });
    });
  });

  describe('edit button', function() {
    context('when user is not playlist owner', function() {
      beforeEach(function() {
        const newPlaylist = copyObject(PLAYLIST);
        newPlaylist.owner = {};

        props.playlist = newPlaylist;
        props.currentUser = copyObject(USER);

        renderComponent();
      });

      it('should not render', function() {
        assert.isUndefined(rendered.refs.editButton);
      });
    });

    context('when user is playlist owner', function() {
      beforeEach(function() {
        const newPlaylist = copyObject(PLAYLIST);
        const newUser = copyObject(USER);
        newPlaylist.owner = newUser;

        props.playlist = newPlaylist;
        props.currentUser = newUser;

        sandbox.stub(Modals, 'openEditPlaylist');
        renderComponent();
      });

      it('should render', function() {
        assert.isDefined(rendered.refs.editButton);
      });

      it('should open edit modal on click', function() {
        const button = ReactDOM.findDOMNode(rendered.refs.editButton);
        TestUtils.Simulate.click(button);

        sinon.assert.calledOnce(Modals.openEditPlaylist);
        sinon.assert.calledWith(Modals.openEditPlaylist, props.playlist);
      });
    });
  });

  describe('quit collaborating button', function() {
    context('when playlist is owned by group', function() {
      let newPlaylist;
      let newUser;

      beforeEach(function() {
        newPlaylist = copyObject(PLAYLIST);
        newUser = copyObject(USER);
        newPlaylist.ownerType = 'group';
      });

      context('when user is group member', function() {
        beforeEach(function() {
          props.playlist = newPlaylist;
          props.currentUser = newUser;

          renderComponent();
        });

        it('should not render', function() {
          assert.isUndefined(rendered.refs.quitCollaboratingButton);
        });
      });

      context('when user is group owner', function() {
        beforeEach(function() {
          newPlaylist.owner = newUser;

          props.playlist = newPlaylist;
          props.currentUser = newUser;

          renderComponent();
        });

        it('should not render', function() {
          assert.isUndefined(rendered.refs.quitCollaboratingButton);
        });
      });
    });

    context('when user is playlist creator', function() {
      beforeEach(function() {
        const newPlaylist = copyObject(PLAYLIST);
        const newUser = copyObject(USER);
        newPlaylist.owner = newUser;

        props.playlist = newPlaylist;
        props.currentUser = newUser;

        renderComponent();
      });

      it('should not render', function() {
        assert.isUndefined(rendered.refs.quitCollaboratingButton);
      });
    });

    context('when user is not a collaborator', function() {
      beforeEach(function() {
        const newPlaylist = copyObject(PLAYLIST);
        const newUser = copyObject(USER);
        newPlaylist.collaborators = [];
        newPlaylist.owner = { id: 500 };

        props.playlist = newPlaylist;
        props.currentUser = newUser;

        renderComponent();
      });

      it('should not render', function() {
        assert.isUndefined(rendered.refs.quitCollaboratingButton);
      });
    });

    context('when user is a collaborator', function() {
      beforeEach(function() {
        const newPlaylist = copyObject(PLAYLIST);
        const newUser = copyObject(USER);
        newPlaylist.collaborators = [{ id: newUser.id }];

        props.playlist = newPlaylist;
        props.currentUser = newUser;

        sandbox.stub(PlaylistActions, 'removeCollaborator');
        renderComponent();
      });

      it('should render', function() {
        assert.isDefined(rendered.refs.quitCollaboratingButton);
      });

      it('should call PlaylistActions.removeCollaborator on click', function() {
        const button = ReactDOM.findDOMNode(rendered.refs.quitCollaboratingButton);
        TestUtils.Simulate.click(button);

        sinon.assert.calledOnce(PlaylistActions.removeCollaborator);
        sinon.assert.calledWith(PlaylistActions.removeCollaborator, props.playlist, props.currentUser);
      });
    });
  });

  describe('delete button', function() {
    context('when user is not playlist owner', function() {
      beforeEach(function() {
        const newPlaylist = copyObject(PLAYLIST);
        newPlaylist.owner = {};

        props.playlist = newPlaylist;
        props.currentUser = copyObject(USER);

        renderComponent();
      });

      it('should not render', function() {
        assert.isUndefined(rendered.refs.deleteButton);
      });
    });

    context('when user is playlist owner', function() {
      beforeEach(function() {
        const newPlaylist = copyObject(PLAYLIST);
        const newUser = copyObject(USER);
        newPlaylist.owner = newUser;

        props.playlist = newPlaylist;
        props.currentUser = newUser;

        sandbox.stub(Modals, 'openConfirmation');
        renderComponent();
      });

      it('should render', function() {
        assert.isDefined(rendered.refs.deleteButton);
      });

      it('should open confirmation modal on click', function() {
        const button = ReactDOM.findDOMNode(rendered.refs.deleteButton);
        TestUtils.Simulate.click(button);

        sinon.assert.calledOnce(Modals.openConfirmation);
        sinon.assert.calledWith(
          Modals.openConfirmation,
          'Are you sure you want to delete this playlist?',
          rendered.deletePlaylist
        );
      });
    });
  });

});
