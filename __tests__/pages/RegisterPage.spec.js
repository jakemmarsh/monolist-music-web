'use strict';

import ReactDOM       from 'react-dom';

import TestHelpers    from '../../utils/testHelpers';
import RegisterPage   from '../../app/js/pages/RegisterPage';

describe('Page: Register', function() {

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');
    TestHelpers.testPage('/register', {}, {}, {}, RegisterPage, this.container, (component) => {
      this.page = component;
      done();
    });
  });

  afterEach(function() {
    if ( this.container ) { ReactDOM.unmountComponentAtNode(this.container); }
  });

});