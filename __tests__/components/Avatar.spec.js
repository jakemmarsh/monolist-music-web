'use strict';

import React       from 'react/addons';
import $           from 'jquery';
import {Link}      from 'react-router';

import TestHelpers from '../../utils/testHelpers';
import Avatar      from '../../app/js/components/Avatar';

const  TestUtils   = React.addons.TestUtils;

describe('Component: Avatar', function() {

  let user = TestHelpers.fixtures.user;

  it('should not render a link if props.includeLink is false', function(done) {
    let AvatarComponent = TestHelpers.stubRouterContext(Avatar, { user: user, includeLink: false });
    let $avatar = $(TestUtils.renderIntoDocument(React.createElement(AvatarComponent)).getDOMNode());

    $avatar.find('a').length.should.eql(0);

    done();
  });

  it('should render a link if props.includeLink is true', function(done) {
    let AvatarComponent = TestHelpers.stubRouterContext(Avatar, { user: user, includeLink: true });
    let $avatar = $(TestUtils.renderIntoDocument(React.createElement(AvatarComponent)).getDOMNode());

    $avatar.find('a').length.should.eql(1);

    done();
  });

  it('should set the background image from user info', function(done) {
    let AvatarComponent = TestHelpers.stubRouterContext(Avatar, { user: user });
    let $avatar = $(TestUtils.renderIntoDocument(React.createElement(AvatarComponent)).getDOMNode());

    $avatar.css('background-image').should.eql('url(' + user.imageUrl + ')');

    done();
  });

});