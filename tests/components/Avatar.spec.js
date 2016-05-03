'use strict';

import React       from 'react';
import ReactDOM    from 'react-dom';
import TestUtils   from 'react-addons-test-utils';

import TestHelpers from '../../utils/testHelpers';
import Avatar      from '../../app/js/components/Avatar';

describe('Component: Avatar', function() {

  const user = TestHelpers.fixtures.user;

  it('should not render a link if props.includeLink is false', function() {
    const avatar = TestUtils.renderIntoDocument(
      <Avatar user={user} includeLink={false} />
    );

    TestUtils.scryRenderedDOMComponentsWithTag(avatar, 'a').length.should.equal(0);
  });

  it('should render a link if props.includeLink is true', function() {
    const avatar = TestHelpers.renderStubbedComponent(Avatar, { user: user, includeLink: true });

    TestUtils.scryRenderedDOMComponentsWithTag(avatar, 'a').length.should.equal(1);
  });

  it('should set the background image from user info', function() {
    const avatar = TestHelpers.renderStubbedComponent(Avatar, { user: user });

    ReactDOM.findDOMNode(avatar).style.backgroundImage.should.eql(`url(${user.imageUrl})`);
  });

});
