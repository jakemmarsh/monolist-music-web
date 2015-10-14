'use strict';

import React              from 'react/addons';
import when               from 'when';

import TestHelpers        from '../../utils/testHelpers';
import CreatePlaylistPage from '../../app/js/pages/CreatePlaylistPage';
import PlaylistActions    from '../../app/js/actions/PlaylistActions';
import AwsAPI             from '../../app/js/utils/AwsAPI';

const  TestUtils          = React.addons.TestUtils;

describe('Page: CreatePlaylist', function() {

  const user = Object.freeze(TestHelpers.fixtures.user);
  const playlist = Object.freeze(TestHelpers.fixtures.playlist);
  const group = Object.freeze(TestHelpers.fixtures.group);

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');
    TestHelpers.testPage('/playlists/create', { currentUser: user }, {}, CreatePlaylistPage, this.container, (component) => {
      this.page = component;
      done();
    });
  });

  it('should exist', function() {
    Should.exist(this.page.getDOMNode());
  });

  it('should update state according to inputs', function() {
    let titleInput = this.page.refs.titleInput.getDOMNode();
    let privacySelect = this.page.refs.privacySelect.getDOMNode();

    TestUtils.Simulate.change(titleInput, { target: { value: playlist.title } });
    TestUtils.Simulate.change(privacySelect, { target: { value: playlist.privacy } });

    this.page.state.title.should.eql(playlist.title);
    this.page.state.privacy.should.eql(playlist.privacy);
  });

  it('should disable the submit button until a title has been entered', function() {
    let titleInput = this.page.refs.titleInput.getDOMNode();
    let submitButton = this.page.refs.submitButton.getDOMNode();

    submitButton.disabled.should.be.true();
    TestUtils.Simulate.change(titleInput, { target: { value: playlist.title } });
    submitButton.disabled.should.be.false();
  });

  it('should call handleSubmit on form submit', function() {
    let titleInput = this.page.refs.titleInput.getDOMNode();
    let submitButton = this.page.refs.submitButton.getDOMNode();

    sandbox.mock(this.page).expects('handleSubmit').once();

    TestUtils.Simulate.change(titleInput, { target: { value: playlist.title } });
    TestUtils.Simulate.click(submitButton);
  });

  it('#handleSubmit should call createPlaylist and uploadImage as user if static not defined', function() {
    const playlist = {
      title: 'test',
      tags: ['test'],
      privacy: 'public',
      ownerId: user.id,
      ownerType: 'user'
    };

    this.page.refs.tagInput.getTokens = function() {
      return playlist.tags;
    };
    this.page.setState({
      title: playlist.title,
      tags: playlist.tags,
      privacy: playlist.privacy
    })

    sandbox.mock(this.page).expects('createPlaylist').once().withArgs(playlist).returns(when());
    sandbox.mock(this.page).expects('uploadImage').once().returns(when());

    this.page.handleSubmit(TestHelpers.createNativeClickEvent());
  });

  it('#handleSubmit should call createPlaylist and uploadImage as user if static not defined', function() {
    const playlist = {
      title: 'test',
      tags: ['test'],
      privacy: 'public',
      ownerId: group.id,
      ownerType: 'group'
    };

    this.page.refs.tagInput.getTokens = function() {
      return playlist.tags;
    };
    this.page.setState({
      title: playlist.title,
      tags: playlist.tags,
      privacy: playlist.privacy
    });
    CreatePlaylistPage.group = group;

    sandbox.mock(this.page).expects('createPlaylist').once().withArgs(playlist).returns(when());
    sandbox.mock(this.page).expects('uploadImage').once().returns(when());

    this.page.handleSubmit(TestHelpers.createNativeClickEvent());
  });

  it('should call the create action', function() {
    let playlistToPost = {
      title: playlist.title,
      tags: playlist.tags,
      privacy: playlist.privacy,
      ownerId: playlist.ownerId,
      ownerType: playlist.ownerType
    };

    sandbox.mock(PlaylistActions).expects('create').withArgs(playlistToPost);
    this.page.createPlaylist(playlistToPost);
  });

  it('should upload the image if one exists', function() {
    let image = {};
    this.page.setState({ image: image });

    sandbox.mock(AwsAPI).expects('uploadPlaylistImage').withArgs(playlist, image);
    this.page.uploadImage(playlist);
  });

  afterEach(function() {
    if ( this.container ) { React.unmountComponentAtNode(this.container); }
  });

});