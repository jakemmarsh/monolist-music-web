'use strict';

import React           from 'react/addons';

import TestHelpers     from '../../utils/testHelpers';
import CreateGroupPage from '../../app/js/pages/CreateGroupPage';

const  TestUtils       = React.addons.TestUtils;

describe('Page: CreateGroup', function() {

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');
    TestHelpers.testPage('/groups/create', CreateGroupPage, this.container, function(component) {
      this.page = component;
      done();
    }.bind(this));
  });

  it('should exist', function(done) {
    Should.exist(this.page.getDOMNode());
    done();
  });

  afterEach(function() {
    if ( this.container ) { React.unmountComponentAtNode(this.container); }
  });

});