'use strict';

import React       from 'react/addons';

import TestHelpers from '../../utils/testHelpers';

const  TestUtils    = React.addons.TestUtils;

require('../../utils/createAuthenticatedSuite')('Component: Header', function() {

  let user = TestHelpers.fixtures.user;
  let HeaderComponent = TestHelpers.stubRouterContext(require('../../app/js/components/Header'), { currentUser: user });

  before(function() {
    this.header = TestUtils.renderIntoDocument(React.createElement(HeaderComponent));
  });

});