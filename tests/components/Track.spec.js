'use strict';

import React              from 'react';
import ReactDOM           from 'react-dom';
import TestUtils          from 'react-addons-test-utils';

import TestHelpers        from '../../utils/testHelpers';
import copyObject         from '../../utils/copyObject';
import Track              from '../../app/js/components/Track';
import PlaylistActions    from '../../app/js/actions/PlaylistActions';
import TrackActions       from '../../app/js/actions/TrackActions';
import GlobalActions      from '../../app/js/actions/GlobalActions';
import PermissionsHelpers from '../../app/js/utils/PermissionsHelpers';

describe('Component: Track', function() {

  const USER = TestHelpers.fixtures.user;
  const TRACK = TestHelpers.fixtures.track;
  const PLAYLIST = TestHelpers.fixtures.playlist;
  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <Track {...props} />
    );
  }

  beforeEach(function() {
    props = {
      currentUser: copyObject(USER),
      index: 0,
      track: copyObject(TRACK),
      playlist: copyObject(PLAYLIST),
      type: 'playlist'
    };
  });

  it('#componentWillReceiveProps should set the initial state when receiving a new track', function() {
    renderComponent();

    const newTrack = copyObject(TRACK);
    newTrack.id = 2;

    sandbox.spy(rendered, 'setState');

    rendered.componentWillReceiveProps({ track: newTrack, currentUser: props.currentUser });

    sinon.assert.calledOnce(rendered.setState);
    sinon.assert.calledWith(rendered.setState, {
      isUpvoted: false,
      isDownvoted: false,
      score: 0
    });
  });

  it('#upvote should update state accordingly and call the action', function() {
    renderComponent();

    sandbox.mock(TrackActions).expects('upvote').once().withArgs(rendered);
    sandbox.mock(rendered).expects('setState').once().withArgs({
      isUpvoted: !rendered.state.isUpvoted,
      isDownvoted: false,
      score: 1
    });

    rendered.upvote(TestHelpers.createNativeClickEvent());
  });

  it('#downvote should update state accordingly and call the action', function() {
    renderComponent();

    sandbox.mock(TrackActions).expects('downvote').once().withArgs(rendered);
    sandbox.mock(rendered).expects('setState').once().withArgs({
      isUpvoted: false,
      isDownvoted: !rendered.state.isDownvoted,
      score: -1
    });

    rendered.downvote(TestHelpers.createNativeClickEvent());
  });

  it('#showContextMenu should call GlobalActions.openContextMenu', function() {
    renderComponent();

    sandbox.stub(GlobalActions, 'openContextMenu');

    rendered.showContextMenu(TestHelpers.createNativeClickEvent());
    sinon.assert.calledOnce(GlobalActions.openContextMenu);
  });

  it('#postComment should call the action', function() {
    renderComponent();
    const body = 'test comment body';

    sandbox.stub(TrackActions, 'addComment');

    rendered.postComment(body);

    sinon.assert.calledOnce(TrackActions.addComment);
    sinon.assert.calledWith(TrackActions.addComment, body, props.track);
  });

  it('#deleteComment should call the action', function() {
    renderComponent();
    const commentId = 1;

    sandbox.stub(TrackActions, 'removeComment');

    rendered.deleteComment(commentId);

    sinon.assert.calledOnce(TrackActions.removeComment);
    sinon.assert.calledWith(TrackActions.removeComment, props.track.id, commentId);
  });

  it('#renderArtwork should only return an element if the track has an imageUrl', function() {
    const newTrack = copyObject(TRACK);
    newTrack.imageUrl = null;

    props.track = newTrack;
    renderComponent();

    Should(rendered.renderArtwork()).be.undefined();

    props.track = copyObject(TRACK);
    renderComponent();

    Should(rendered.renderArtwork()).not.be.undefined();
  });

  it('#renderDuration should only return an element if the track has a duration', function() {
    const newTrack = copyObject(TRACK);
    newTrack.duration = null;

    props.track = newTrack;
    renderComponent();

    Should(rendered.renderDuration()).be.undefined();

    props.track = copyObject(TRACK);
    renderComponent();

    Should(rendered.renderDuration()).not.be.undefined();
  });

  it('#renderCollaboratorOptions should only return an element if in playlist and user is owner/collaborator', function() {
    renderComponent();

    Should(rendered.renderCollaboratorOptions()).be.undefined();

    sandbox.stub(PermissionsHelpers, 'isUserPlaylistCollaborator').returns(true);
    renderComponent();

    Should(rendered.renderCollaboratorOptions()).not.be.undefined();
  });

  it('#renderTrackCreator should only return only return an element if in playlist and track.user exists', function() {
    const newTrack = copyObject(TRACK);
    newTrack.user = null;

    props.track = newTrack;
    renderComponent();

    Should(rendered.renderTrackCreator()).be.undefined();

    props.track = copyObject(TRACK);
    renderComponent();

    Should(rendered.renderTrackCreator()).not.be.undefined();
  });

  it('#renderCommentList should only return an element if in playlist and user is owner/collaborator', function() {
    renderComponent();

    Should(rendered.renderCommentList()).be.undefined();

    sandbox.stub(PermissionsHelpers, 'isUserPlaylistCollaborator').returns(true);
    renderComponent();

    Should(rendered.renderCommentList()).not.be.undefined();
  });

  it('clicking the component should call the correct actions', function() {
    renderComponent();

    sandbox.stub(PlaylistActions, 'play').yields();
    sandbox.stub(TrackActions, 'select');

    TestUtils.Simulate.click(ReactDOM.findDOMNode(rendered));

    sinon.assert.calledOnce(PlaylistActions.play);
    sinon.assert.calledOnce(TrackActions.select);
  });

  // it('clicking the upvote arrow should invoke #upvote', function() {
  //   sandbox.stub(PermissionsHelpers, 'isUserPlaylistCollaborator').returns(true);
  //   const track = TestHelpers.renderStubbedComponent(Track, {
  //     type: 'playlist',
  //     track: mockTrack,
  //     playlist: playlist
  //   });
  //   const arrow = track.refs.upvote;

  //   sandbox.mock(track).expects('upvote').once();

  //   TestUtils.Simulate.click(arrow);
  // });

  // it('clicking the downvote arrow should invoke #downvote', function() {
  //   sandbox.stub(PermissionsHelpers, 'isUserPlaylistCollaborator').returns(true);
  //   const track = TestHelpers.renderStubbedComponent(Track, {
  //     type: 'playlist',
  //     track: mockTrack,
  //     playlist: playlist
  //   });
  //   const arrow = track.refs.downvote;

  //   sandbox.mock(track).expects('downvote').once();

  //   TestUtils.Simulate.click(arrow);
  // });

  it('clicking the comment toggle should toggle comment display and span text', function() {
    sandbox.stub(PermissionsHelpers, 'isUserPlaylistCollaborator').returns(true);
    renderComponent();
    const commentToggle = rendered.refs.commentToggle;

    assert.strictEqual(commentToggle.textContent, 'Show Comments (0)');
    assert.isFalse(rendered.refs.commentList.props.shouldDisplay);

    TestUtils.Simulate.click(rendered.refs.commentToggle);

    assert.strictEqual(commentToggle.textContent, 'Hide Comments');
    assert.isTrue(rendered.refs.commentList.props.shouldDisplay);
  });

});
