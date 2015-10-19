'use strict';

import ReactDOM    from 'react-dom';

import TestHelpers from '../../utils/testHelpers';
import LoginPage   from '../../app/js/pages/LoginPage';

describe('Page: Login', function() {

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');
    TestHelpers.testPage('/login', {}, {}, {}, LoginPage, this.container, (component) => {
      this.page = component;
      done();
    });
  });

  afterEach(function() {
    if ( this.container ) { ReactDOM.unmountComponentAtNode(this.container); }
  });

});