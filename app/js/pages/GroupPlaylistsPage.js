'use strict';

import React              from 'react';
import {History}          from 'react-router';

import CreatePlaylistPage from './CreatePlaylistPage';
import CreateNewCard      from '../components/CreateNewCard';
import PlaylistList       from '../components/PlaylistList';

const GroupPlaylistsPage = React.createClass({

  mixins: [History],

  propTypes: {
    currentUser: React.PropTypes.object,
    group: React.PropTypes.object,
    playlists: React.PropTypes.array,
    isUserMember: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      currentUser: {},
      group: {},
      playlists: [],
      isUserMember: function() {}
    };
  },

  navigateToCreatePage(evt) {
    if ( evt ) { evt.preventDefault(); }

    CreatePlaylistPage.group = this.props.group;
    this.history.pushState(null, '/playlists/create');
  },

  renderPlaylists() {
    let firstItem;

    if ( this.props.isUserMember(this.props.currentUser) ) {
      firstItem = (
        <CreateNewCard type="playlist" onClick={this.navigateToCreatePage} />
      );
    }

    return (
      <PlaylistList firstItem={firstItem} playlists={this.props.playlists} cardClassName="pure-u-1-2" />
    );
  },

  render() {
    return (
      <div>

        {this.renderPlaylists()}

      </div>
    );
  }

});

export default GroupPlaylistsPage;