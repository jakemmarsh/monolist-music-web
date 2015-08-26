'use strict';

import React       from 'react/addons';
import {Link}      from 'react-router';

import TestHelpers from '../../utils/testHelpers';
import Avatar      from '../../app/js/components/Avatar';

const  TestUtils   = React.addons.TestUtils;

describe('Component: Avatar', function() {

  let user = TestHelpers.fixtures.user;
  let StubbedAvatar = TestHelpers.stubRouterContext(Avatar);

  it('should not render a link if props.includeLink is false', function(done) {
    let AvatarComponent = TestHelpers.stubRouterContext(Avatar, { currentUser: user, includeLink: false });
    let avatar = TestUtils.renderIntoDocument(React.createElement(AvatarComponent));
    let link = TestUtils.scryRenderedComponentsWithType(avatar, Link);

    link.should.be.empty();

    done();
  });

  it('should render a link if props.includeLink is true', function(done) {
    let AvatarComponent = TestHelpers.stubRouterContext(Avatar, { currentUser: user, includeLink: true });
    let avatar = TestUtils.renderIntoDocument(React.createElement(AvatarComponent));
    let link = TestUtils.scryRenderedComponentsWithType(avatar, Link);

    //console.log('avatar:', avatar);
    console.log('link:', link);
    link.should.have.length.above(0);

    done();
  });

  it('should set the background image from user info', function(done) {
    let AvatarComponent = TestHelpers.stubRouterContext(Avatar, { currentUser: user });
    let avatar = TestUtils.renderIntoDocument(React.createElement(AvatarComponent)).getDOMNode();

    // console.log('dom node:', avatar.getDOMNode());
    // console.log('background iamge:', avatar.style.backgroundImage);

    done();
  });

});