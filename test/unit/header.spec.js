/* global describe, beforeEach, it, expect */
'use strict';

var React                 = require('react/addons');
var TestUtils             = React.addons.TestUtils;
var makeStubbedDescriptor = require('../utils/makeStubbedDescriptor');

var Header                = require('../../app/js/components/Header');

describe('Header', function() {

  var HeaderComponent;
  var HeaderElement;

  beforeEach(function() {
    HeaderComponent = makeStubbedDescriptor(Header, {});
    HeaderElement = TestUtils.renderIntoDocument(HeaderComponent);
  });

  it('should exist', function() {
    expect(HeaderElement).not.toBe(null);
  });

});