'use strict';

import React            from 'react';
import TestUtils        from 'react-addons-test-utils';

import testHelpers      from '../../utils/testHelpers';
import copyObject       from '../../utils/copyObject';
import CurrentlyPlaying from '../../app/js/components/CurrentlyPlaying';
import GlobalActions    from '../../app/js/actions/GlobalActions';
import TrackActions     from '../../app/js/actions/TrackActions';

describe('Component: CurrentlyPlaying', function() {

  const TRACK = testHelpers.fixtures.track;
  const USER = testHelpers.fixtures.user;

  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <CurrentlyPlaying {...props} />
    );
  }

  beforeEach(function() {
    props = {};
  });

  context('when the track is from YouTube', function() {
    beforeEach(function() {
      const newTrack = copyObject(TRACK);
      newTrack.source = 'youtube';

      props.currentTrack = newTrack;
    });

    it('should render the track title', function() {
      renderComponent();

      assert.strictEqual(rendered.refs.trackTitle.textContent, props.currentTrack.title);
    });

    context('when the track has an artist', function() {
      beforeEach(function() {
        renderComponent();
      });

      it('should render the track artist', function() {
        assert.strictEqual(rendered.refs.trackArtist.textContent, props.currentTrack.artist);
      });
    });

    context('when the track has no artist', function() {
      beforeEach(function() {
        delete props.currentTrack.artist;

        renderComponent();
      });

      it('should not render the track artist', function() {
        assert.isUndefined(rendered.refs.trackArtist);
      });
    });
  });

  context('when the track is not from YouTube', function() {
    beforeEach(function() {
      const newTrack = copyObject(TRACK);
      newTrack.source = 'soundcloud';

      props.currentTrack = newTrack;
    });

    it('should render the track title', function() {
      renderComponent();

      assert.strictEqual(rendered.refs.trackTitle.textContent, props.currentTrack.title);
    });

    context('when the track has an artist', function() {
      beforeEach(function() {
        renderComponent();
      });

      it('should render the track artist', function() {
        assert.strictEqual(rendered.refs.trackArtist.textContent, props.currentTrack.artist);
      });
    });

    context('when the track has no artist', function() {
      beforeEach(function() {
        delete props.currentTrack.artist;
        renderComponent();
      });

      it('should not render the track artist', function() {
        assert.isUndefined(rendered.refs.trackArtist);
      });
    });

    context('when the track has an imageUrl', function() {
      beforeEach(function() {
        renderComponent();
      });

      it('should render the artwork with the correct background image', function() {
        assert.strictEqual(rendered.refs.artwork.style.backgroundImage, `url(${props.currentTrack.imageUrl})`);
        assert.strictEqual(rendered.refs.imageBackground.style.backgroundImage, `url(${props.currentTrack.imageUrl})`);
      });
    });

    context('when the track does not have an imageUrl', function() {
      beforeEach(function() {
        delete props.currentTrack.imageUrl;
        renderComponent();
      });

      it('should not render the artwork with a background image', function() {
        assert.strictEqual(rendered.refs.artwork.style.backgroundImage, '');
        assert.strictEqual(rendered.refs.imageBackground.style.backgroundImage, '');
      });
    });
  });

  it('should open context menu on button click', function() {
    props.currentTrack = copyObject(TRACK);
    renderComponent();

    sandbox.stub(GlobalActions, 'openContextMenu');

    TestUtils.Simulate.click(rendered.refs.contextMenuButton, { pageX: 5, pageY: 10 });

    sinon.assert.calledOnce(GlobalActions.openContextMenu);
    sinon.assert.calledWith(GlobalActions.openContextMenu, testHelpers.isJsx, 5, 10, null, true);
  });

  context('when there is a user', function() {
    beforeEach(function() {
      props.currentTrack = copyObject(TRACK);
      props.currentUser = copyObject(USER);
    });

    it('should render the voting arrows', function() {
      renderComponent();

      assert.isDefined(rendered.refs.upvoteButton);
      assert.isDefined(rendered.refs.downvoteButton);
    });

    it('should call TrackActions.upvote on click', function() {
      renderComponent();
      sandbox.stub(TrackActions, 'upvote');

      TestUtils.Simulate.click(rendered.refs.upvoteButton);

      sinon.assert.calledOnce(TrackActions.upvote);
      sinon.assert.calledWith(TrackActions.upvote, props.currentTrack, props.currentUser);
    });

    it('should call TrackActions.downvote on click', function() {
      renderComponent();
      sandbox.stub(TrackActions, 'downvote');

      TestUtils.Simulate.click(rendered.refs.downvoteButton);

      sinon.assert.calledOnce(TrackActions.downvote);
      sinon.assert.calledWith(TrackActions.downvote, props.currentTrack, props.currentUser);
    });

    context('when the user has upvoted the track', function() {
      beforeEach(function() {
        props.currentTrack.upvotes.push({
          trackId: props.currentTrack.id,
          userId: props.currentUser.id
        });

        renderComponent();
      });

      it('should render the upvote arrow with "active" class', function() {
        assert.isTrue(rendered.refs.upvoteButton.classList.contains('active'));
      });

      it('should render the downvote arrow without the "active" class', function() {
        assert.isFalse(rendered.refs.downvoteButton.classList.contains('active'));
      });
    });

    context('when the user has downvoted the track', function() {
      beforeEach(function() {
        props.currentTrack.downvotes.push({
          trackId: props.currentTrack.id,
          userId: props.currentUser.id
        });

        renderComponent();
      });

      it('should render the downvote arrow with "active" class', function() {
        assert.isTrue(rendered.refs.downvoteButton.classList.contains('active'));
      });

      it('should render the upvote arrow without the "active" class', function() {
        assert.isFalse(rendered.refs.upvoteButton.classList.contains('active'));
      });
    });
  });

  context('when there is not a user', function() {
    beforeEach(function() {
      props.currentTrack = copyObject(TRACK);
      props.currentUser = {};

      renderComponent();
    });

    it('should not render the voting arrows', function() {
      assert.isUndefined(rendered.refs.upvoteButton);
      assert.isUndefined(rendered.refs.downvoteButton);
    });
  });

});
