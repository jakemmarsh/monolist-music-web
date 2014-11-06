/* global describe, beforeEach, it, expect */
'use strict';

var React     = require('react/addons');
var TestUtils = React.addons.TestUtils;

var Footer = require('../../app/js/components/Footer');

describe('Footer', function() {

  var FooterComponent;
  var FooterElement;

  beforeEach(function() {
    FooterComponent = new Footer();
    FooterElement = TestUtils.renderIntoDocument(FooterComponent);
  });

  it('should exist', function() {
    expect(FooterElement).not.toBe(null);
  });

});