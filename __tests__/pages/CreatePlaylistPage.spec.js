'use strict';

import React              from 'react/addons';

import TestHelpers        from '../../utils/testHelpers';
import CreatePlaylistPage from '../../app/js/pages/CreatePlaylistPage';

const  TestUtils          = React.addons.TestUtils;

describe('Page: CreatePlaylist', function() {

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');
    TestHelpers.testPage('/playlists/create', CreatePlaylistPage, this.container, (component) => {
      console.log('got playlsit page:', component);
      this.page = component;
      done();
    });
  });

  it('should exist', function(done) {
    Should.exist(this.page.getDOMNode());
    done();
  });

  afterEach(function() {
    if ( this.container ) { React.unmountComponentAtNode(this.container); }
  });

});