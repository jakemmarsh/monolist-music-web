'use strict';

import React           from 'react';
import TestUtils       from 'react-addons-test-utils';
import $               from 'jquery';

import AudioControlBar from '../../app/js/components/AudioControlBar';

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

  it('#seekTrack should correctly seek in the track based on click position', function(done) {
    const spy = sandbox.spy();
    const controlBar = TestUtils.renderIntoDocument(
      <AudioControlBar seekTrack={spy} />
    );
    const evt = {
      pageX: 1000
    };
    const duration = 10;
    const $seekBar = $(controlBar.refs.seek);
    const clickLeftOffset = evt.pageX - $seekBar.offset().left;
    const newTime = clickLeftOffset / $seekBar.outerWidth() * duration;

    sandbox.mock(controlBar).expects('getTrackDuration').returns(duration);
    controlBar.seekTrack(evt);

    sinon.assert.calledOnce(spy);
    spy.calledWith(newTime).should.be.true();

    done();
  });

  it('#updateVolume should change the volume based on click position', function(done) {
    const spy = sandbox.spy();
    const controlBar = TestUtils.renderIntoDocument(
      <AudioControlBar updateVolume={spy} />
    );
    const evt = {
      pageX: 1000
    };
    const $volumeBar = $(controlBar.refs.volume);
    const clickLeftOffset = evt.pageX - $volumeBar.offset().left;
    const newVolume = clickLeftOffset / $volumeBar.outerWidth();

    controlBar.updateVolume(evt);

    sinon.assert.calledOnce(spy);
    spy.calledWith(newVolume).should.be.true();

    done();
  });

  it('should call #seekTrack on scrubber click', function(done) {
    const controlBar = TestUtils.renderIntoDocument(
      <AudioControlBar seekTrack={sandbox.stub()} />
    );
    const seekBar = controlBar.refs.seek;

    sandbox.mock(controlBar).expects('seekTrack').once();
    TestUtils.Simulate.click(seekBar);

    done();
  });

  it('should call #updateVolume on volume bar click', function(done) {
    const controlBar = TestUtils.renderIntoDocument(
      <AudioControlBar updateVolume={sandbox.stub()} />
    );
    const volumeBar = controlBar.refs.volume;

    sandbox.mock(controlBar).expects('updateVolume').once();
    TestUtils.Simulate.click(volumeBar);

    done();
  });

  it('should call props.previousTrack on click', function(done) {
    const spy = sandbox.spy();
    const controlBar = TestUtils.renderIntoDocument(
      <AudioControlBar previousTrack={spy} />
    );
    const backButton = controlBar.refs.backButton;

    TestUtils.Simulate.click(backButton);
    sinon.assert.calledOnce(spy);

    done();
  });

  it('should call props.togglePlay on click', function(done) {
    const spy = sandbox.spy();
    const controlBar = TestUtils.renderIntoDocument(
      <AudioControlBar togglePlay={spy} />
    );
    const playPauseButton = controlBar.refs.playPauseButton;

    TestUtils.Simulate.click(playPauseButton);
    sinon.assert.calledOnce(spy);

    done();
  });

  it('should call props.nextTrack on click', function(done) {
    const spy = sandbox.spy();
    const controlBar = TestUtils.renderIntoDocument(
      <AudioControlBar nextTrack={spy} />
    );
    const nextButton = controlBar.refs.nextButton;

    TestUtils.Simulate.click(nextButton);
    sinon.assert.calledOnce(spy);

    done();
  });

  it('should call props.toggleRepeat on click', function(done) {
    const spy = sandbox.spy();
    const controlBar = TestUtils.renderIntoDocument(
      <AudioControlBar toggleRepeat={spy} />
    );
    const repeatButton = controlBar.refs.toggleRepeat;

    TestUtils.Simulate.click(repeatButton);
    sinon.assert.calledOnce(spy);

    done();
  });

  it('should call props.toggleShuffle on click', function(done) {
    const spy = sandbox.spy();
    const controlBar = TestUtils.renderIntoDocument(
      <AudioControlBar toggleShuffle={spy} />
    );
    const shuffleButton = controlBar.refs.toggleShuffle;

    TestUtils.Simulate.click(shuffleButton);
    sinon.assert.calledOnce(spy);

    done();
  });

});