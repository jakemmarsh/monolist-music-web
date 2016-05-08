'use strict';

import React              from 'react';
import TestUtils          from 'react-addons-test-utils';

import testHelpers        from '../../utils/testHelpers';
import copyObject         from '../../utils/copyObject';
import CreatePlaylistPage from '../../app/js/pages/CreatePlaylistPage';
import PlaylistActions    from '../../app/js/actions/PlaylistActions';
import AwsAPI             from '../../app/js/utils/AwsAPI';

describe('Page: CreatePlaylist', function() {

  const user = copyObject(testHelpers.fixtures.user);
  const playlist = copyObject(testHelpers.fixtures.playlist);
  const group = copyObject(testHelpers.fixtures.group);
  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <CreatePlaylistPage {...props} />
    );
  }

  beforeEach(function() {
    props = {
      currentUser: copyObject(user)
    };
  });

  it('should update state according to inputs', function() {
    renderComponent();

    const titleInput = rendered.refs.titleInput;
    const privacySelect = rendered.refs.privacySelect;

    TestUtils.Simulate.change(titleInput, { target: { value: playlist.title } });
    TestUtils.Simulate.change(privacySelect, { target: { value: playlist.privacy } });

    rendered.state.title.should.eql(playlist.title);
    rendered.state.privacy.should.eql(playlist.privacy);
  });

  it('should disable the submit button until a title has been entered', function() {
    renderComponent();

    const titleInput = rendered.refs.titleInput;
    const submitButton = rendered.refs.submitButton;

    submitButton.disabled.should.be.true();
    TestUtils.Simulate.change(titleInput, { target: { value: playlist.title } });
    submitButton.disabled.should.be.false();
  });

  it('should call createPlaylist and uploadImage as user if static not defined on form submit', function() {
    renderComponent();

    const playlistToCreate = {
      title: 'test',
      tags: [],
      privacy: 'public',
      ownerId: props.currentUser.id,
      ownerType: 'user'
    };

    sandbox.stub(rendered, 'createPlaylist').resolves(playlist);
    sandbox.stub(rendered, 'uploadImage').resolves(playlist);

    TestUtils.Simulate.change(rendered.refs.titleInput, { target: { value: playlistToCreate.title } });
    TestUtils.Simulate.submit(rendered.refs.form);

    return Promise.resolve().then(() => {
      sinon.assert.calledOnce(rendered.createPlaylist);
      sinon.assert.calledWith(rendered.createPlaylist, playlistToCreate);
      sinon.assert.calledOnce(rendered.uploadImage);
    });
  });

  it('should call createPlaylist and uploadImage as group if static is defined on form submit', function() {
    CreatePlaylistPage.group = copyObject(group);
    renderComponent();

    const playlistToCreate = {
      title: 'test',
      tags: [],
      privacy: 'public',
      ownerId: group.id,
      ownerType: 'group'
    };

    sandbox.stub(rendered, 'createPlaylist').resolves(playlist);
    sandbox.stub(rendered, 'uploadImage').resolves(playlist);

    TestUtils.Simulate.change(rendered.refs.titleInput, { target: { value: playlistToCreate.title } });
    TestUtils.Simulate.submit(rendered.refs.form);

    return Promise.resolve().then(() => {
      sinon.assert.calledOnce(rendered.createPlaylist);
      sinon.assert.calledWith(rendered.createPlaylist, playlistToCreate);
      sinon.assert.calledOnce(rendered.uploadImage);
    });
  });

  it('#createPlaylist should call the create action', function() {
    renderComponent();

    const playlistToPost = {
      title: playlist.title,
      tags: playlist.tags,
      privacy: playlist.privacy,
      ownerId: playlist.ownerId,
      ownerType: playlist.ownerType
    };

    sandbox.stub(PlaylistActions, 'create');
    rendered.createPlaylist(playlistToPost);

    sinon.assert.calledOnce(PlaylistActions.create);
    sinon.assert.calledWith(PlaylistActions.create, playlistToPost);
  });

  it('#uploadImage should upload the image if one exists', function() {
    renderComponent();

    const image = {};
    rendered.setState({ image: image });

    sandbox.stub(AwsAPI, 'uploadPlaylistImage');

    rendered.uploadImage(playlist);

    sinon.assert.calledOnce(AwsAPI.uploadPlaylistImage);
    sinon.assert.calledWith(AwsAPI.uploadPlaylistImage, image, playlist.id);
  });

});
