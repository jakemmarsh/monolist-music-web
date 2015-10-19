'use strict';

import React       from 'react';
import ReactDOM    from 'react-dom';
import TestUtils   from 'react-addons-test-utils';
import $           from 'jquery';

import TestHelpers from '../../utils/testHelpers';
import Avatar      from '../../app/js/components/Avatar';

describe('Component: Avatar', function() {

  let user = TestHelpers.fixtures.user;

  it('should not render a link if props.includeLink is false', function(done) {
    let avatar = TestUtils.renderIntoDocument(
      <Avatar user={user} includeLink={false} />
    );

    TestUtils.scryRenderedDOMComponentsWithTag(avatar, 'a').length.should.equal(0);

    done();
  });

  it('should render a link if props.includeLink is true', function(done) {
    let avatar = TestHelpers.renderStubbedComponent(Avatar, { user: user, includeLink: true });

    TestUtils.scryRenderedDOMComponentsWithTag(avatar, 'a').length.should.equal(1);

    done();
  });

  it('should set the background image from user info', function(done) {
    let avatar = TestHelpers.renderStubbedComponent(Avatar, { user: user });

    $(ReactDOM.findDOMNode(avatar)).css('background-image').should.eql('url(' + user.imageUrl + ')');

    done();
  });

});