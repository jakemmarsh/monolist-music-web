'use strict';

import React       from 'react/addons';
import should      from 'should';
import Stub        from '../../utils/stubRouterContext';
import TestHelpers from '../../utils/testHelpers';
const  TestUtils    = React.addons.TestUtils;

require('../../utils/createAuthenticatedSuite')('Component: Header', function() {

  let user = TestHelpers.testUser;
  let HeaderComponent = Stub(require('../../app/js/components/Header'), { currentUser: user });
  let header;

  before(() => {
    header = TestUtils.renderIntoDocument(React.createElement(HeaderComponent));
  });

});