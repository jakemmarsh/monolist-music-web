'use strict';

import React           from 'react';
import ReactDOM        from 'react-dom';
import TestUtils       from 'react-addons-test-utils';

import testHelpers     from '../../utils/testHelpers';
import copyObject      from '../../utils/copyObject';
import PlayerSidebar   from '../../app/js/components/PlayerSidebar';
import PlaybackActions from '../../app/js/actions/PlaybackActions';

describe('Component: PlayerSidebar', function() {

  const TRACK = testHelpers.fixtures.track;
  const PLAYLIST = testHelpers.fixtures.playlist;
  const USER = testHelpers.fixtures.user;

  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <PlayerSidebar {...props} />
    );
  }

  beforeEach(function() {
    props = {
      currentUser: copyObject(USER),
      currentPlaylist: copyObject(PLAYLIST),
      userCollaborations: []
    };
  });

  context('without a current track', function() {
    beforeEach(function() {
      props.currentTrack = undefined;
      renderComponent();
    });

    it('should render without the "expanded" class', function() {
      const sidebarElement = ReactDOM.findDOMNode(rendered);

      assert.isFalse(sidebarElement.classList.contains('expanded'));
    });
  });

  context('with a current track', function() {
    beforeEach(function() {
      props.currentTrack = copyObject(TRACK);
      renderComponent();
    });

    it('should render with the "expanded" class', function() {
      const sidebarElement = ReactDOM.findDOMNode(rendered);

      assert.isTrue(sidebarElement.classList.contains('expanded'));
    });
  });

  it('should render CurrentlyPlaying', function() {
    renderComponent();

    const currentlyPlaying = rendered.refs.currentlyPlaying;

    assert.isDefined(currentlyPlaying);
    assert.strictEqual(currentlyPlaying.props.currentUser, props.currentUser);
    assert.strictEqual(currentlyPlaying.props.userCollaborations, props.userCollaborations);
    assert.strictEqual(currentlyPlaying.props.player, props.player);
    assert.strictEqual(currentlyPlaying.props.audio, props.audio);
    assert.strictEqual(currentlyPlaying.props.currentTrack, props.currentTrack);
    assert.strictEqual(currentlyPlaying.props.buffering, props.buffering);
    assert.strictEqual(currentlyPlaying.props.paused, props.paused);
    assert.strictEqual(currentlyPlaying.props.time, props.time);
    assert.strictEqual(currentlyPlaying.props.duration, props.duration);
    assert.strictEqual(currentlyPlaying.props.volume, props.volume);
    assert.strictEqual(currentlyPlaying.props.repeat, props.repeat);
    assert.strictEqual(currentlyPlaying.props.shuffle, props.shuffle);
  });

  it('should render Tracklist for the current playlist', function() {
    renderComponent();

    const tracklist = rendered.refs.tracklist;

    assert.isDefined(tracklist);
    assert.strictEqual(tracklist.props.type, 'playlist');
    assert.strictEqual(tracklist.props.mini, true);
    assert.strictEqual(tracklist.props.playlist, props.currentPlaylist);
    assert.strictEqual(tracklist.props.currentTrack, props.currentTrack);
    assert.strictEqual(tracklist.props.currentUser, props.currentUser);
    assert.strictEqual(tracklist.props.userCollaborations, props.userCollaborations);
  });

  it('should render the elapsed playback time', function() {
    props.time = 123;

    renderComponent();

    assert.strictEqual(rendered.refs.timePassed.textContent, '2:03');
  });

  it('should render the remaining playback time', function() {
    props.time = 123;
    props.duration = 230;

    renderComponent();

    assert.strictEqual(rendered.refs.timeLeft.textContent, '1:47');
  });

  describe('seek bar', function() {
    beforeEach(function() {
      props.time = 120;
      props.duration = 240;
      sandbox.stub(PlaybackActions, 'seek');
      renderComponent();
    });

    it('should render the bar fill representing amount played', function() {
      assert.strictEqual(rendered.refs.seekBarFill.style.width, '50%');
    });

    it('should call PlaybackActions.seek with correct value on click', function() {
      sandbox.stub(rendered.refs.seekBar, 'getBoundingClientRect').returns({
        left: 10,
        width: 100
      });

      TestUtils.Simulate.click(rendered.refs.seekBar, { pageX: 50 });

      sinon.assert.calledOnce(PlaybackActions.seek);
      sinon.assert.calledWith(PlaybackActions.seek, 96);
    });
  });

  describe('repeat button', function() {
    context('when props.repeat == "none"', function() {
      beforeEach(function() {
        props.repeat = 'none';
        sandbox.stub(PlaybackActions, 'toggleRepeat');
        renderComponent();
      });

      it('should render without active class', function() {
        assert.isFalse(rendered.refs.repeatButton.classList.contains('active'));
      });

      it('should not render the repeat track indicator', function() {
        assert.isUndefined(rendered.refs.repeatTrackIndicator);
      });

      it('should call PlaybackActions.toggleRepeat on click', function() {
        TestUtils.Simulate.click(rendered.refs.repeatButton);

        sinon.assert.calledOnce(PlaybackActions.toggleRepeat);
      });
    });

    context('when props.repeat == "track"', function() {
      beforeEach(function() {
        props.repeat = 'track';
        sandbox.stub(PlaybackActions, 'toggleRepeat');
        renderComponent();
      });

      it('should render with active class', function() {
        assert.isTrue(rendered.refs.repeatButton.classList.contains('active'));
      });

      it('should render the repeat track indicator', function() {
        assert.isDefined(rendered.refs.repeatTrackIndicator);
      });

      it('should call PlaybackActions.toggleRepeat on click', function() {
        TestUtils.Simulate.click(rendered.refs.repeatButton);

        sinon.assert.calledOnce(PlaybackActions.toggleRepeat);
      });
    });

    context('when props.repeat == "playlist"', function() {
      beforeEach(function() {
        props.repeat = 'playlist';
        sandbox.stub(PlaybackActions, 'toggleRepeat');
        renderComponent();
      });

      it('should render with active class', function() {
        assert.isTrue(rendered.refs.repeatButton.classList.contains('active'));
      });

      it('should not render the repeat track indicator', function() {
        assert.isUndefined(rendered.refs.repeatTrackIndicator);
      });

      it('should call PlaybackActions.toggleRepeat on click', function() {
        TestUtils.Simulate.click(rendered.refs.repeatButton);

        sinon.assert.calledOnce(PlaybackActions.toggleRepeat);
      });
    });
  });

  describe('shuffle button', function() {
    context('when props.shuffle is true', function() {
      beforeEach(function() {
        props.shuffle = true;
        sandbox.stub(PlaybackActions, 'toggleShuffle');
        renderComponent();
      });

      it('should render with active class', function() {
        assert.isTrue(rendered.refs.shuffleButton.classList.contains('active'));
      });

      it('should call PlaybackActions.toggleShuffle on click', function() {
        TestUtils.Simulate.click(rendered.refs.shuffleButton);

        sinon.assert.calledOnce(PlaybackActions.toggleShuffle);
      });
    });

    context('when props.shuffle is false', function() {
      beforeEach(function() {
        props.shuffle = false;
        sandbox.stub(PlaybackActions, 'toggleShuffle');
        renderComponent();
      });

      it('should not render with active class', function() {
        assert.isFalse(rendered.refs.shuffleButton.classList.contains('active'));
      });

      it('should call PlaybackActions.toggleShuffle on click', function() {
        TestUtils.Simulate.click(rendered.refs.shuffleButton);

        sinon.assert.calledOnce(PlaybackActions.toggleShuffle);
      });
    });
  });

  describe('play button', function() {
    context('when props.buffering is true', function() {
      beforeEach(function() {
        props.buffering = true;
        renderComponent();
      });

      it('should render buffering spinner', function() {
        assert.isDefined(rendered.refs.bufferingSpinner);
      });

      it('should not render play button', function() {
        assert.isUndefined(rendered.refs.playPauseButton);
      });
    });

    context('when props.buffering is false', function() {
      beforeEach(function() {
        props.buffering = false;
      });

      it('should not render buffering spinner', function() {
        renderComponent();

        assert.isUndefined(rendered.refs.bufferingSpinner);
      });

      it('should render play button', function() {
        renderComponent();

        assert.isDefined(rendered.refs.playPauseButton);
      });

      context('when props.paused is true', function() {
        beforeEach(function() {
          props.paused = true;
        });

        it('should render with icon-play class', function() {
          renderComponent();

          assert.isTrue(rendered.refs.playPauseButton.classList.contains('icon-play'));
          assert.isFalse(rendered.refs.playPauseButton.classList.contains('icon-pause'));
        });
      });

      context('when props.paused is false', function() {
        beforeEach(function() {
          props.paused = false;
        });

        it('should render with icon-pause class', function() {
          renderComponent();

          assert.isFalse(rendered.refs.playPauseButton.classList.contains('icon-play'));
          assert.isTrue(rendered.refs.playPauseButton.classList.contains('icon-pause'));
        });
      });
    });
  });

  describe('volume button', function() {
    context('when muted', function() {
      beforeEach(function(done) {
        sandbox.stub(PlaybackActions, 'updateVolume');
        renderComponent();
        rendered.setState({
          isMuted: true,
          unmutedVolume: 0.7
        }, done);
      });

      it('should unmute and restore volume on click', function() {
        TestUtils.Simulate.click(rendered.refs.volumeButton);

        sinon.assert.calledOnce(PlaybackActions.updateVolume);
        sinon.assert.calledWith(PlaybackActions.updateVolume, 0.7);
      });
    });

    context('when not muted', function() {
      beforeEach(function(done) {
        sandbox.stub(PlaybackActions, 'updateVolume');
        renderComponent();
        rendered.setState({ isMuted: false }, done);
      });

      it('should mute and set volume on click', function() {
        TestUtils.Simulate.click(rendered.refs.volumeButton);

        sinon.assert.calledOnce(PlaybackActions.updateVolume);
        sinon.assert.calledWith(PlaybackActions.updateVolume, 0);
      });
    });

    it('should show and hide the volume bar on mouseEnter/mouseLeave of container', function() {
      renderComponent();

      assert.isUndefined(rendered.refs.volumeBar);
      TestUtils.Simulate.mouseEnter(rendered.refs.volumeContainer);
      assert.isDefined(rendered.refs.volumeBar);
      TestUtils.Simulate.mouseLeave(rendered.refs.volumeContainer);
      assert.isUndefined(rendered.refs.volumeBar);
    });

    context('while volume bar is shown', function() {
      beforeEach(function() {
        props.volume = 0.5;
        sandbox.stub(PlaybackActions, 'updateVolume');
        renderComponent();
        TestUtils.Simulate.mouseEnter(rendered.refs.volumeContainer);
      });

      it('should render the bar fill representing current volume', function() {
        assert.strictEqual(rendered.refs.volumeBarFill.style.height, '50%');
      });

      it('should call PlaybackActions.updateVolume with correct value on click', function() {
        sandbox.stub(rendered.refs.volumeBar, 'getBoundingClientRect').returns({
          bottom: 10,
          height: 100
        });

        TestUtils.Simulate.click(rendered.refs.volumeBar, { pageY: 50 });

        sinon.assert.calledOnce(PlaybackActions.updateVolume);
        sinon.assert.calledWith(PlaybackActions.updateVolume, 0.4);
      });
    });
  });

  describe('#componentDidUpdate', function() {
    let newTrack;

    beforeEach(function() {
      const currentPlaylist = copyObject(PLAYLIST);
      const firstTrack = copyObject(TRACK);
      newTrack = copyObject(TRACK);
      newTrack.id += 1;
      newTrack.sourceParam = '123456789';
      currentPlaylist.tracks.push(firstTrack);
      currentPlaylist.tracks.push(newTrack);

      props.currentPlaylist = currentPlaylist;
      props.currentTrack = firstTrack;

      renderComponent();
    });

    it('should scroll to the correct track in the list after receiving a new currentTrack', function() {
      rendered.componentDidUpdate({
        currentTrack: newTrack,
        currentPlaylist: props.currentPlaylist
      });

      const trackNode = ReactDOM.findDOMNode(
        rendered.refs.tracklist.refs.child.refs[`${newTrack.source}-${newTrack.sourceParam}`]
      );

      assert.strictEqual(rendered.refs.playlistContainer.scrollTop, trackNode.offsetTop);
    });
  });

});
