'use strict';

import React       from 'react/addons';
import should      from 'should';
import TestHelpers from '../../utils/testHelpers';
const  TestUtils    = React.addons.TestUtils;

require('../../utils/createAuthenticatedSuite')('Component: Header', function() {

  let user = TestHelpers.testUser;
  let HeaderComponent = TestHelpers.stubRouterContext(require('../../app/js/components/Header'), { currentUser: user });
  let header;

  before(() => {
    header = TestUtils.renderIntoDocument(React.createElement(HeaderComponent));
  });

});