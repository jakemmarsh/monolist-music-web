'use strict';

import React           from 'react/addons';

import AudioControlBar from '../../app/js/components/AudioControlBar';

const  TestUtils   = React.addons.TestUtils;

describe('Component: AudioControlBar', function() {

  it('', function(done) {
    let controlBar = TestUtils.renderIntoDocument(
      <AudioControlBar />
    );

    console.log(controlBar);

    done();
  });

});