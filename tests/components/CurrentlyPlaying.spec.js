'use strict';

import React            from 'react';
import TestUtils        from 'react-addons-test-utils';

import testHelpers      from '../../utils/testHelpers';
import copyObject       from '../../utils/copyObject';
import CurrentlyPlaying from '../../app/js/components/CurrentlyPlaying';

describe('Component: CurrentlyPlaying', function() {

  const TRACK = testHelpers.fixtures.track;

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
      });
    });

    context('when the track does not have an imageUrl', function() {
      beforeEach(function() {
        delete props.currentTrack.imageUrl;
        renderComponent();
      });

      it('should not render the artwork with a background image', function() {
        assert.strictEqual(rendered.refs.artwork.style.backgroundImage, '');
      });
    });
  });

});
