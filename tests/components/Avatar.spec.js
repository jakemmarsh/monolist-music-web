'use strict';

import React       from 'react';
import ReactDOM    from 'react-dom';
import TestUtils   from 'react-addons-test-utils';

import testHelpers from '../../utils/testHelpers';
import copyObject  from '../../utils/copyObject';
import Avatar      from '../../app/js/components/Avatar';

describe('Component: Avatar', function() {

  const USER = copyObject(testHelpers.fixtures.user);
  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <Avatar {...props} />
    );
  }

  beforeEach(function() {
    props = {
      user: USER
    };
  });

  it('should not render a link if props.includeLink is false', function() {
    props.includeLink = false;
    renderComponent();

    TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'a').length.should.equal(0);
  });

  it('should render a link if props.includeLink is true', function() {
    props.includeLink = true;
    renderComponent();

    TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'a').length.should.equal(1);
  });

  it('should set the background image from user info', function() {
    renderComponent();

    ReactDOM.findDOMNode(rendered).style.backgroundImage.should.eql(`url(${props.user.imageUrl})`);
  });

});
