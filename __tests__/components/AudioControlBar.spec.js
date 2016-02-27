'use strict';

import React           from 'react';
import TestUtils       from 'react-addons-test-utils';

import AudioControlBar from '../../app/js/components/AudioControlBar';
import PlaybackActions from '../../app/js/actions/PlaybackActions';

describe('Component: AudioControlBar', function() {

  it('#getTrackDuration should return the correct duration for the current track', function(done) {
    let controlBar = TestUtils.renderIntoDocument(
      <AudioControlBar currentTrack={{ duration: 10 }} />
    );

    controlBar.getTrackDuration().should.eql(10);

    controlBar = TestUtils.renderIntoDocument(
      <AudioControlBar player={{ duration: 15 }} />
    );

    controlBar.getTrackDuration().should.eql(15);

    controlBar = TestUtils.renderIntoDocument(
      <AudioControlBar duration={20} />
    );

    controlBar.getTrackDuration().should.eql(20);

    done();
  });

  it('#seek should correctly seek in the track based on click position', function() {
    const seekStub = sandbox.stub(PlaybackActions, 'seek');
    const controlBar = TestUtils.renderIntoDocument(
      <AudioControlBar />
    );
    const getTrackDurationStub = sandbox.stub(controlBar, 'getTrackDuration').returns(duration);
    const evt = {
      pageX: 1000
    };
    const duration = 10;
    const seekBar = controlBar.refs.seek;
    const clickLeftOffset = evt.pageX - seekBar.offsetLeft;
    const newTime = clickLeftOffset / seekBar.offsetWidth * duration;

    controlBar.seek(evt);

    sinon.assert.calledOnce(getTrackDurationStub);
    sinon.assert.calledOnce(seekStub);
    sinon.assert.calledWith(seekStub, newTime);
  });

  it('#updateVolume should change the volume based on click position', function() {
    const updateVolumeStub = sandbox.stub(PlaybackActions, 'updateVolume');
    const controlBar = TestUtils.renderIntoDocument(
      <AudioControlBar />
    );
    const evt = {
      pageX: 1000
    };
    const volumeBar = controlBar.refs.volume;
    const clickLeftOffset = evt.pageX - volumeBar.offsetLeft;
    const newVolume = clickLeftOffset / volumeBar.offsetWidth;

    controlBar.updateVolume(evt);

    sinon.assert.calledOnce(updateVolumeStub);
    sinon.assert.calledWith(updateVolumeStub, newVolume);
  });

  it('should call seek action on scrubber click', function() {
    const seekStub = sandbox.stub(PlaybackActions, 'seek');
    const controlBar = TestUtils.renderIntoDocument(
      <AudioControlBar />
    );
    const seekBar = controlBar.refs.seek;

    TestUtils.Simulate.click(seekBar);

    sinon.assert.calledOnce(seekStub);
  });

  it('should call updateVolume action on volume bar click', function() {
    const updateVolumeStub = sandbox.stub(PlaybackActions, 'updateVolume');
    const controlBar = TestUtils.renderIntoDocument(
      <AudioControlBar />
    );
    const volumeBar = controlBar.refs.volume;

    TestUtils.Simulate.click(volumeBar);

    sinon.assert.calledOnce(updateVolumeStub);
  });

  it('should call PlaybackActions.previousTrack on click', function() {
    const previousTrackStub = sandbox.stub(PlaybackActions, 'previousTrack');
    const controlBar = TestUtils.renderIntoDocument(
      <AudioControlBar />
    );
    const backButton = controlBar.refs.backButton;

    TestUtils.Simulate.click(backButton);

    sinon.assert.calledOnce(previousTrackStub);
  });

  it('should call PlaybackActions.togglePlay on click', function() {
    const togglePlayStub = sandbox.stub(PlaybackActions, 'togglePlay');
    const controlBar = TestUtils.renderIntoDocument(
      <AudioControlBar />
    );
    const playPauseButton = controlBar.refs.playPauseButton;

    TestUtils.Simulate.click(playPauseButton);

    sinon.assert.calledOnce(togglePlayStub);
  });

  it('should call PlaybackActions.nextTrack on click', function() {
    const nextTrackStub = sandbox.stub(PlaybackActions, 'nextTrack');
    const controlBar = TestUtils.renderIntoDocument(
      <AudioControlBar />
    );
    const nextButton = controlBar.refs.nextButton;

    TestUtils.Simulate.click(nextButton);

    sinon.assert.calledOnce(nextTrackStub);
  });

  it('should call PlaybackActions.toggleRepeat on click', function() {
    const toggleRepeatStub = sandbox.stub(PlaybackActions, 'toggleRepeat');
    const controlBar = TestUtils.renderIntoDocument(
      <AudioControlBar />
    );
    const repeatButton = controlBar.refs.toggleRepeat;

    TestUtils.Simulate.click(repeatButton);

    sinon.assert.calledOnce(toggleRepeatStub);
  });

  it('should call PlaybackActions.toggleShuffle on click', function() {
    const toggleShuffleStub = sandbox.stub(PlaybackActions, 'toggleShuffle');
    const controlBar = TestUtils.renderIntoDocument(
      <AudioControlBar />
    );
    const shuffleButton = controlBar.refs.toggleShuffle;

    TestUtils.Simulate.click(shuffleButton);

    sinon.assert.calledOnce(toggleShuffleStub);
  });

});