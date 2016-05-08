'use strict';

import React           from 'react';
import TestUtils       from 'react-addons-test-utils';

import testHelpers     from '../../utils/testHelpers';
import copyObject      from '../../utils/copyObject';
import CreateGroupPage from '../../app/js/pages/CreateGroupPage';
import GroupActions    from '../../app/js/actions/GroupActions';
import AwsAPI          from '../../app/js/utils/AwsAPI';

describe('Page: CreateGroup', function() {

  const group = copyObject(testHelpers.fixtures.group);
  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <CreateGroupPage {...props} />
    );
  }

  beforeEach(function() {
    props = {};
    renderComponent();
  });

  it('should update state according to inputs', function() {
    const titleInput = rendered.refs.titleInput;
    const descriptionInput = rendered.refs.descriptionInput;
    const privacySelect = rendered.refs.privacySelect;

    TestUtils.Simulate.change(titleInput, { target: { value: group.title } });
    TestUtils.Simulate.change(descriptionInput, { target: { value: group.description } });
    TestUtils.Simulate.change(privacySelect, { target: { value: 'private' } });
    TestUtils.Simulate.change(rendered.refs.inviteLevelSelect, { target: { value: group.inviteLevel } });

    rendered.state.title.should.eql(group.title);
    rendered.state.description.should.eql(group.description);
    rendered.state.privacy.should.eql('private');
    rendered.state.inviteLevel.should.eql(group.inviteLevel);
  });

  it('should disable the submit button until a title has been entered', function() {
    const titleInput = rendered.refs.titleInput;
    const submitButton = rendered.refs.submitButton;

    submitButton.disabled.should.be.true();
    TestUtils.Simulate.change(titleInput, { target: { value: group.title } });
    submitButton.disabled.should.be.false();
  });

  it('should call createGroup and uploadImage on submit', function() {
    const titleInput = rendered.refs.titleInput;

    sandbox.stub(rendered, 'createGroup').resolves(group);
    sandbox.stub(rendered, 'uploadImage').resolves(group);

    TestUtils.Simulate.change(titleInput, { target: { value: group.title } });
    TestUtils.Simulate.submit(rendered.refs.form);

    return Promise.resolve().then(() => {
      sinon.assert.calledOnce(rendered.createGroup);
      sinon.assert.calledOnce(rendered.uploadImage);
    });
  });

  it('should post the group to the API on createGroup', function(done) {
    const groupToPost = {
      title: group.title,
      description: group.description,
      privacy: group.privacy,
      inviteLevel: group.inviteLevel
    };
    const createStub = sandbox.stub(GroupActions, 'create', () => {
      sinon.assert.calledWith(createStub, groupToPost, sinon.match.func);
      done();
    });

    rendered.createGroup(groupToPost);
  });

  it('should upload the image if one exists', function() {
    const image = {};
    rendered.setState({ image: image });

    sandbox.stub(AwsAPI, 'uploadGroupImage');

    rendered.uploadImage(group);

    sinon.assert.calledOnce(AwsAPI.uploadGroupImage);
    sinon.assert.calledWith(AwsAPI.uploadGroupImage, image, group.id);
  });

});
