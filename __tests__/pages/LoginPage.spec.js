'use strict';

import React       from 'react/addons';

import TestHelpers from '../../utils/testHelpers';
import LoginPage   from '../../app/js/pages/LoginPage';

const  TestUtils   = React.addons.TestUtils;

describe('Page: Login', function() {

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');
    TestHelpers.testPage('/login', LoginPage, this.container, (component) => {
      console.log('got Loginpage:', component);
      this.page = component;
      done();
    });
  });

  it('should exist', function(done) {
    Should.exist(this.page.getDOMNode());
    done();
  });

  afterEach(function() {
    if ( this.container ) { React.unmountComponentAtNode(this.container); }
  });

});