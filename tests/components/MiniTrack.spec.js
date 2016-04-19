'use strict';

import React     from 'react';
import TestUtils from 'react-addons-test-utils';

describe('Components: MiniTrack', function() {

  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <MiniTrack {...props} />
    );
  }

  beforeEach(function() {
    props = {};
  });

});
