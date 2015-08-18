'use strict';

import React       from 'react/addons';
const  TestUtils   = React.addons.TestUtils;

import TestHelpers from '../../utils/testHelpers';

require('../../utils/createAuthenticatedSuite')('Component: Header', function() {

  let user = TestHelpers.fixtures.user;
  let HeaderComponent = TestHelpers.stubRouterContext(require('../../app/js/components/Header'), { currentUser: user });

  before(function() {
    this.header = TestUtils.renderIntoDocument(React.createElement(HeaderComponent));
  });

});