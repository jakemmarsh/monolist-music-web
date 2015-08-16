'use strict';

import React              from 'react/addons';
import when               from 'when';

import TestHelpers        from '../../utils/testHelpers';
import CreatePlaylistPage from '../../app/js/pages/CreatePlaylistPage';
import PlaylistActions    from '../../app/js/actions/PlaylistActions';
import AwsAPI             from '../../app/js/utils/AwsAPI';

const  TestUtils          = React.addons.TestUtils;

describe('Page: CreatePlaylist', function() {

  let playlist = TestHelpers.fixtures.playlist;

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');
    TestHelpers.testPage('/playlists/create', CreatePlaylistPage, this.container, (component) => {
      this.page = component;
      done();
    });
  });

  it('should exist', function(done) {
    Should.exist(this.page.getDOMNode());
    done();
  });

  it('should update state according to inputs', function(done) {
    let titleInput = this.page.refs.titleInput.getDOMNode();
    let privacySelect = this.page.refs.privacySelect.getDOMNode();

    TestUtils.Simulate.change(titleInput, { target: { value: playlist.title } });
    TestUtils.Simulate.change(privacySelect, { target: { value: playlist.privacy } });

    this.page.state.title.should.eql(playlist.title);
    this.page.state.privacy.should.eql(playlist.privacy);

    done();
  });

  it('should disable the submit button until a title has been entered', function(done) {
    let titleInput = this.page.refs.titleInput.getDOMNode();
    let submitButton = this.page.refs.submitButton.getDOMNode();

    submitButton.disabled.should.be.true();
    TestUtils.Simulate.change(titleInput, { target: { value: playlist.title } });
    submitButton.disabled.should.be.false();

    done();
  });

  it('should call handleSubmit on form submit', function(done) {
    let titleInput = this.page.refs.titleInput.getDOMNode();
    let submitButton = this.page.refs.submitButton.getDOMNode();

    sandbox.mock(this.page).expects('handleSubmit').once();

    TestUtils.Simulate.change(titleInput, { target: { value: playlist.title } });
    TestUtils.Simulate.click(submitButton);

    done();
  });

  it('should call createPlaylist and uploadImage on submit', function(done) {
    sandbox.mock(this.page).expects('createPlaylist').once().returns(when());
    sandbox.mock(this.page).expects('uploadImage').once().returns(when());

    this.page.handleSubmit(TestHelpers.createNativeClickEvent());

    done();
  });

  it('should call the create action on createPlaylist', function(done) {
    let playlistToPost = {
      title: playlist.title,
      tags: playlist.tags,
      privacy: playlist.privacy,
      ownerId: playlist.ownerId,
      ownerType: playlist.ownerType
    };

    sandbox.mock(PlaylistActions).expects('create').withArgs(playlistToPost);
    this.page.createPlaylist(playlistToPost);

    done();
  });

  it('should upload the image if one exists', function(done) {
    let image = {};
    this.page.setState({ image: image });

    sandbox.mock(AwsAPI).expects('uploadPlaylistImage').withArgs(playlist, image);
    this.page.uploadImage(playlist);

    done();
  });

  afterEach(function() {
    if ( this.container ) { React.unmountComponentAtNode(this.container); }
  });

});