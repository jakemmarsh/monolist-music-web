'use strict';

import React          from 'react/addons';

import TestHelpers    from '../../utils/testHelpers';
import RegisterPage   from '../../app/js/pages/RegisterPage';

const  TestUtils      = React.addons.TestUtils;

describe('Page: Register', function() {

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');
    TestHelpers.testPage('/register', RegisterPage, this.container, (component) => {
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