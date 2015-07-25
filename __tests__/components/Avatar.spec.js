'use strict';

import React       from 'react/addons';
import {Link}      from 'react-router';
import Stub        from '../../utils/stubRouterContext';
import TestHelpers from '../../utils/testHelpers';
import Avatar      from '../../app/js/components/Avatar';
const  TestUtils   = React.addons.TestUtils;

require('../../utils/createAuthenticatedSuite')('Component: Avatar', function() {

  let user = TestHelpers.testUser;

  it('should not render a link if props.includeLink is false', done => {
    let AvatarComponent = Stub(Avatar, { currentUser: user, includeLink: false });
    let avatar = TestUtils.renderIntoDocument(React.createElement(AvatarComponent));
    let link = TestUtils.scryRenderedComponentsWithType(avatar, Link);
    console.log('link:', link);

    should.not.exist(link);

    done();
  });

  it('should render a link if props.includeLink is true', done => {
    let AvatarComponent = Stub(Avatar, { currentUser: user, includeLink: true });
    let avatar = TestUtils.renderIntoDocument(React.createElement(AvatarComponent));
    let link = TestUtils.scryRenderedComponentsWithType(avatar, Link);

    console.log('avatar:', avatar.getDOMNode());

    link.should.exist();

    done();
  });

  it('should set the background image from user info', done => {
    let AvatarComponent = Stub(Avatar, { currentUser: user });
    let avatar = TestUtils.renderIntoDocument(React.createElement(AvatarComponent)).getDOMNode();

    console.log('background iamge:', avatar.style.backgroundImage);

    done();
  });

});