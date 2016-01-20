'use strict';

import ReactDOM        from 'react-dom';
import TestUtils       from 'react-addons-test-utils';

import TestHelpers     from '../../utils/testHelpers';
import Track           from '../../app/js/components/Track';
import PlaylistActions from '../../app/js/actions/PlaylistActions';
import TrackActions    from '../../app/js/actions/TrackActions';
import GlobalActions   from '../../app/js/actions/GlobalActions';

describe('Component: Track', function() {

  const mockTrack = TestHelpers.fixtures.track;
  const user = TestHelpers.fixtures.user;
  const playlist = TestHelpers.fixtures.playlist;

  it('#componentWillReceiveProps should set the initial state when receiving a new track', function() {
    let track = TestHelpers.renderStubbedComponent(Track, { track: mockTrack, playlist: playlist, type: 'playlist' });
    let newTrack = mockTrack;
    newTrack.id = 2;

    sandbox.mock(track).expects('setState').once().withArgs({
      isUpvoted: false,
      isDownvoted: false,
      score: 0
    });

    track.componentWillReceiveProps({ track: newTrack });
  });

  it('#toggleCommentDisplay should flip the state of displayComments', function() {
    let track = TestHelpers.renderStubbedComponent(Track, { track: mockTrack, playlist: playlist });

    track.state.displayComments.should.be.false();
    track.toggleCommentDisplay(TestHelpers.createNativeClickEvent());
    track.state.displayComments.should.be.true();
  });

  it('#selectTrack should call the actions for selecting a track and playlist', function() {
    let track = TestHelpers.renderStubbedComponent(Track, { track: mockTrack, playlist: playlist });

    sandbox.mock(PlaylistActions).expects('play').once();
    sandbox.mock(TrackActions).expects('select').once();

    track.selectTrack(TestHelpers.createNativeClickEvent());
  });

  it('#upvote should update state accordingly and call the action', function() {
    let track = TestHelpers.renderStubbedComponent(Track, { track: mockTrack, playlist: playlist });

    sandbox.mock(TrackActions).expects('upvote').once().withArgs(track);
    sandbox.mock(track).expects('setState').once().withArgs({
      isUpvoted: !track.state.isUpvoted,
      isDownvoted: false,
      score: 1
    });

    track.upvote(TestHelpers.createNativeClickEvent());
  });

  it('#downvote should update state accordingly and call the action', function() {
    let track = TestHelpers.renderStubbedComponent(Track, { track: mockTrack, playlist: playlist });

    sandbox.mock(TrackActions).expects('downvote').once().withArgs(track);
    sandbox.mock(track).expects('setState').once().withArgs({
      isUpvoted: false,
      isDownvoted: !track.state.isDownvoted,
      score: -1
    });

    track.downvote(TestHelpers.createNativeClickEvent());
  });

  it('#showContextMenu should call GlobalActions.openContextMenu', function() {
    const track = TestHelpers.renderStubbedComponent(Track, { track: mockTrack, playlist: playlist });
    const openContextMenuStub = sandbox.stub(GlobalActions, 'openContextMenu');

    track.showContextMenu(TestHelpers.createNativeClickEvent());
    sinon.assert.calledOnce(openContextMenuStub);
  });

  it('#postComment should call the action', function() {
    let track = TestHelpers.renderStubbedComponent(Track, { track: mockTrack, playlist: playlist });
    let body = 'test comment body';

    sandbox.mock(TrackActions).expects('addComment').once().withArgs(body, mockTrack);

    track.postComment(body);
  });

  it('#deleteComment should call the action', function() {
    let track = TestHelpers.renderStubbedComponent(Track, { track: mockTrack, playlist: playlist });
    let commentId = 1;

    sandbox.mock(TrackActions).expects('removeComment').once().withArgs(mockTrack.id, commentId);

    track.deleteComment(commentId);
  });

  it('#renderDropdownToggle should only return an element if there is a current user and is not a post', function() {
    let track = TestHelpers.renderStubbedComponent(Track, {
      track: mockTrack,
      playlist: playlist
    });

    Should(track.renderDropdownToggle()).be.undefined();

    track = TestHelpers.renderStubbedComponent(Track, {
      type: 'playlist',
      currentUser: user,
      track: mockTrack,
      playlist: playlist
    });

    Should(track.renderDropdownToggle()).not.be.undefined();
  });

  it('#renderArtwork should only return an element if the track has an imageUrl', function() {
    let newTrack = JSON.parse(JSON.stringify(mockTrack));
    newTrack.imageUrl = null;
    let track = TestHelpers.renderStubbedComponent(Track, {
      track: newTrack,
      playlist: playlist
    });

    Should(track.renderArtwork()).be.undefined();

    track = TestHelpers.renderStubbedComponent(Track, {
      track: mockTrack,
      playlist: playlist
    });

    Should(track.renderArtwork()).not.be.undefined();
  });

  it('#renderDuration should only return an element if the track has a duration', function() {
    let newTrack = JSON.parse(JSON.stringify(mockTrack));
    newTrack.duration = null;
    let track = TestHelpers.renderStubbedComponent(Track, {
      track: newTrack,
      playlist: playlist
    });

    Should(track.renderDuration()).be.undefined();

    track = TestHelpers.renderStubbedComponent(Track, {
      track: mockTrack,
      playlist: playlist
    });

    Should(track.renderDuration()).not.be.undefined();
  });

  it('#renderCollaboratorOptions should only return an element if in playlist and user is owner/collaborator', function() {
    let track = TestHelpers.renderStubbedComponent(Track, {
      type: 'post',
      userIsCollaborator: false,
      track: mockTrack,
      playlist: playlist
    });

    Should(track.renderCollaboratorOptions()).be.undefined();

    track = TestHelpers.renderStubbedComponent(Track, {
      type: 'playlist',
      userIsCollaborator: true,
      track: mockTrack,
      playlist: playlist
    });

    Should(track.renderCollaboratorOptions()).not.be.undefined();
  });

  it('#renderTrackCreator should only return only return an element if in playlist and track.user exists', function() {
    let newTrack = JSON.parse(JSON.stringify(mockTrack));
    newTrack.user = null;
    let track = TestHelpers.renderStubbedComponent(Track, {
      type: 'post',
      track: newTrack,
      playlist: playlist
    });

    Should(track.renderTrackCreator()).be.undefined();

    track = TestHelpers.renderStubbedComponent(Track, {
      type: 'playlist',
      track: mockTrack,
      playlist: playlist
    });

    Should(track.renderTrackCreator()).not.be.undefined();
  });

  it('#renderCommentList should only return an element if in playlist and user is owner/collaborator', function() {
    let track = TestHelpers.renderStubbedComponent(Track, {
      type: 'post',
      userIsCollaborator: false,
      track: mockTrack,
      playlist: playlist
    });

    Should(track.renderCommentList()).be.undefined();

    track = TestHelpers.renderStubbedComponent(Track, {
      type: 'playlist',
      userIsCollaborator: true,
      track: mockTrack,
      playlist: playlist
    });

    Should(track.renderCommentList()).not.be.undefined();
  });

  it('clicking the component should invoke #selectTrack', function() {
    let track = TestHelpers.renderStubbedComponent(Track, {
      index: 0,
      track: mockTrack,
      playlist: playlist
    });

    sandbox.mock(track).expects('selectTrack').once();

    TestUtils.Simulate.click(ReactDOM.findDOMNode(track));
  });

  it('clicking the upvote arrow should invoke #upvote', function() {
    let track = TestHelpers.renderStubbedComponent(Track, {
      type: 'playlist',
      userIsCollaborator: true,
      track: mockTrack,
      playlist: playlist
    });
    let arrow = track.refs.upvote;

    sandbox.mock(track).expects('upvote').once();

    TestUtils.Simulate.click(arrow);
  });

  it('clicking the downvote arrow should invoke #downvote', function() {
    let track = TestHelpers.renderStubbedComponent(Track, {
      type: 'playlist',
      userIsCollaborator: true,
      track: mockTrack,
      playlist: playlist
    });
    let arrow = track.refs.downvote;

    sandbox.mock(track).expects('downvote').once();

    TestUtils.Simulate.click(arrow);
  });

  it('clicking the comment toggle should invoke #toggleCommentDisplay', function() {
    let track = TestHelpers.renderStubbedComponent(Track, {
      type: 'playlist',
      userIsCollaborator: true,
      track: mockTrack,
      playlist: playlist
    });
    let toggle = track.refs.commentToggle;

    sandbox.mock(track).expects('toggleCommentDisplay').once();

    TestUtils.Simulate.click(toggle);
  });

});