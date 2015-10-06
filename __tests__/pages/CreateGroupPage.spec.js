'use strict';

import React           from 'react/addons';
import when            from 'when';

import TestHelpers     from '../../utils/testHelpers';
import CreateGroupPage from '../../app/js/pages/CreateGroupPage';
import GroupAPI        from '../../app/js/utils/GroupAPI';
import AwsAPI          from '../../app/js/utils/AwsAPI';

const  TestUtils       = React.addons.TestUtils;

describe('Page: CreateGroup', function() {

  let group = TestHelpers.fixtures.group;

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');
    TestHelpers.testPage('/groups/create', {}, {}, CreateGroupPage, this.container, function(component) {
      this.page = component;
      done();
    }.bind(this));
  });

  it('should exist', function(done) {
    Should.exist(this.page.getDOMNode());
    done();
  });

  it('should update state according to inputs', function(done) {
    let titleInput = this.page.refs.titleInput.getDOMNode();
    let descriptionInput = this.page.refs.descriptionInput.getDOMNode();
    let privacySelect = this.page.refs.privacySelect.getDOMNode();

    TestUtils.Simulate.change(titleInput, { target: { value: group.title } });
    TestUtils.Simulate.change(descriptionInput, { target: { value: group.description } });
    TestUtils.Simulate.change(privacySelect, { target: { value: 'private' } });
    // Accessed directly here because it doesn't appear until privacy is private
    TestUtils.Simulate.change(this.page.refs.inviteLevelSelect.getDOMNode(), { target: { value: group.inviteLevel } });

    this.page.state.title.should.eql(group.title);
    this.page.state.description.should.eql(group.description);
    this.page.state.privacy.should.eql('private');
    this.page.state.inviteLevel.should.eql(group.inviteLevel);

    done();
  });

  it('should disable the submit button until a title has been entered', function(done) {
    let titleInput = this.page.refs.titleInput.getDOMNode();
    let submitButton = this.page.refs.submitButton.getDOMNode();

    submitButton.disabled.should.be.true();
    TestUtils.Simulate.change(titleInput, { target: { value: group.title } });
    submitButton.disabled.should.be.false();

    done();
  });

  it('should call handleSubmit on form submit', function(done) {
    let titleInput = this.page.refs.titleInput.getDOMNode();
    let submitButton = this.page.refs.submitButton.getDOMNode();

    sandbox.mock(this.page).expects('handleSubmit').once();

    TestUtils.Simulate.change(titleInput, { target: { value: group.title } });
    TestUtils.Simulate.click(submitButton);

    done();
  });

  it('should call createGroup and uploadImage on submit', function(done) {
    sandbox.mock(this.page).expects('createGroup').once().returns(when());
    sandbox.mock(this.page).expects('uploadImage').once().returns(when());

    this.page.handleSubmit(TestHelpers.createNativeClickEvent());

    done();
  });

  it('should post the group to the API on createGroup', function(done) {
    let groupToPost = {
      title: group.title,
      description: group.description,
      privacy: group.privacy,
      inviteLevel: group.inviteLevel
    };

    sandbox.mock(GroupAPI).expects('create').withArgs(groupToPost);
    this.page.createGroup(groupToPost);

    done();
  });

  it('should upload the image if one exists', function(done) {
    let image = {};
    this.page.setState({ image: image });

    sandbox.mock(AwsAPI).expects('uploadGroupImage').withArgs(group, image);
    this.page.uploadImage(group);

    done();
  });

  afterEach(function() {
    if ( this.container ) { React.unmountComponentAtNode(this.container); }
  });

});