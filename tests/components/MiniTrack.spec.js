'use strict';

import React           from 'react';
import ReactDOM        from 'react-dom';
import TestUtils       from 'react-addons-test-utils';

import testHelpers     from '../../utils/testHelpers';
import copyObject      from '../../utils/copyObject';
import MiniTrack       from '../../app/js/components/MiniTrack';
import GlobalActions   from '../../app/js/actions/GlobalActions';
import PlaylistActions from '../../app/js/actions/PlaylistActions';
import TrackActions    from '../../app/js/actions/TrackActions';

describe('Components: MiniTrack', function() {

  const TRACK = testHelpers.fixtures.track;
  const PLAYLIST = testHelpers.fixtures.playlist;
  const USER = testHelpers.fixtures.user;

  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <MiniTrack {...props} />
    );
  }

  beforeEach(function() {
    props = {
      currentUser: copyObject(USER),
      userCollaborations: [],
      type: 'playlist',
      playlist: copyObject(PLAYLIST),
      index: 1
    };
  });

  it('should render the track title', function() {
    props.track = copyObject(TRACK);
    renderComponent();

    assert.strictEqual(rendered.refs.trackTitle.textContent, props.track.title);
  });

  it('should render a link to the user who added the track', function() {
    const newTrack = copyObject(TRACK);
    newTrack.user = copyObject(USER);

    props.track = newTrack;
    renderComponent();

    const uploaderLink = rendered.refs.uploaderLink;
    const uploaderLinkElement = ReactDOM.findDOMNode(uploaderLink);

    assert.strictEqual(uploaderLinkElement.textContent, ` ${props.track.user.username}`);
    assert.strictEqual(uploaderLink.props.to, `/profile/${props.track.user.username}`);
  });

  it('should add the track source as a class', function() {
    props.track = copyObject(TRACK);
    renderComponent();

    const trackElement = ReactDOM.findDOMNode(rendered);

    assert.isTrue(trackElement.classList.contains(props.track.source));
  });

  context('with a className property', function() {
    beforeEach(function() {
      props.track = copyObject(TRACK);
      props.className = 'test-class';
      renderComponent();
    });

    it('should add the class', function() {
      const trackElement = ReactDOM.findDOMNode(rendered);

      assert.isTrue(trackElement.classList.contains('test-class'));
    });
  });

  it('should call PlaylistActions.play and TrackActions.select on click', function() {
    props.track = copyObject(TRACK);
    renderComponent();

    sandbox.stub(PlaylistActions, 'play').yields();
    sandbox.stub(TrackActions, 'select');

    TestUtils.Simulate.click(ReactDOM.findDOMNode(rendered));

    sinon.assert.calledOnce(PlaylistActions.play);
    sinon.assert.calledWith(PlaylistActions.play, props.playlist, sinon.match.func);
    sinon.assert.calledOnce(TrackActions.select);
    sinon.assert.calledWith(TrackActions.select, props.track, props.index);
  });

  it('should call openContextMenu on icon click', function() {
    props.track = copyObject(TRACK);
    renderComponent();

    sandbox.stub(GlobalActions, 'openContextMenu');

    TestUtils.Simulate.click(rendered.refs.menuToggle, { pageX: 5, pageY: 10 });

    sinon.assert.calledOnce(GlobalActions.openContextMenu);
    sinon.assert.calledWith(GlobalActions.openContextMenu, testHelpers.isJsx, 5, 10);
  });

});
