'use strict';

import ReactDOM           from 'react-dom';
import TestUtils          from 'react-addons-test-utils';
import when               from 'when';

import TestHelpers        from '../../utils/testHelpers';
import CreatePlaylistPage from '../../app/js/pages/CreatePlaylistPage';
import PlaylistActions    from '../../app/js/actions/PlaylistActions';
import AwsAPI             from '../../app/js/utils/AwsAPI';

describe('Page: CreatePlaylist', function() {

  const user = Object.freeze(TestHelpers.fixtures.user);
  const playlist = Object.freeze(TestHelpers.fixtures.playlist);
  const group = Object.freeze(TestHelpers.fixtures.group);

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');
    TestHelpers.testPage('/playlists/create', { currentUser: user }, {}, {}, CreatePlaylistPage, this.container, (component) => {
      this.page = component;
      done();
    });
  });

  it('should update state according to inputs', function() {
    const titleInput = this.page.refs.titleInput;
    const privacySelect = this.page.refs.privacySelect;

    TestUtils.Simulate.change(titleInput, { target: { value: playlist.title } });
    TestUtils.Simulate.change(privacySelect, { target: { value: playlist.privacy } });

    this.page.state.title.should.eql(playlist.title);
    this.page.state.privacy.should.eql(playlist.privacy);
  });

  it('should disable the submit button until a title has been entered', function() {
    const titleInput = this.page.refs.titleInput;
    const submitButton = this.page.refs.submitButton;

    submitButton.disabled.should.be.true();
    TestUtils.Simulate.change(titleInput, { target: { value: playlist.title } });
    submitButton.disabled.should.be.false();
  });

  it('should call handleSubmit on form submit', function() {
    const titleInput = this.page.refs.titleInput;
    const submitButton = this.page.refs.submitButton;

    sandbox.mock(this.page).expects('handleSubmit').once();

    TestUtils.Simulate.change(titleInput, { target: { value: playlist.title } });
    TestUtils.Simulate.click(submitButton);
  });

  it('#handleSubmit should call createPlaylist and uploadImage as user if static not defined', function() {
    const playlistToCreate = {
      title: 'test',
      tags: ['test'],
      privacy: 'public',
      ownerId: user.id,
      ownerType: 'user'
    };

    this.page.setState({
      title: playlistToCreate.title,
      tags: playlistToCreate.tags,
      privacy: playlistToCreate.privacy
    });

    sandbox.mock(this.page).expects('createPlaylist').once().withArgs(playlistToCreate).returns(when(playlist));
    sandbox.mock(this.page).expects('uploadImage').once().returns(when(playlist));

    this.page.handleSubmit(TestHelpers.createNativeClickEvent());
  });

  it('#handleSubmit should call createPlaylist and uploadImage as user if static not defined', function() {
    const playlistToCreate = {
      title: 'test',
      tags: ['test'],
      privacy: 'public',
      ownerId: group.id,
      ownerType: 'group'
    };

    this.page.setState({
      title: playlistToCreate.title,
      tags: playlistToCreate.tags,
      privacy: playlistToCreate.privacy
    });
    CreatePlaylistPage.group = group;

    sandbox.mock(this.page).expects('createPlaylist').once().withArgs(playlistToCreate).returns(when(playlist));
    sandbox.mock(this.page).expects('uploadImage').once().returns(when(playlist));

    this.page.handleSubmit(TestHelpers.createNativeClickEvent());
  });

  it('should call the create action', function() {
    const playlistToPost = {
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
    const image = {};
    this.page.setState({ image: image });

    sandbox.mock(AwsAPI).expects('uploadPlaylistImage').withArgs(playlist, image);
    this.page.uploadImage(playlist);
  });

  afterEach(function() {
    if ( this.container ) { ReactDOM.unmountComponentAtNode(this.container); }
  });

});
