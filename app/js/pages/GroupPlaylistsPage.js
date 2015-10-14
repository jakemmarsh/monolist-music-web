'use strict';

import React              from 'react/addons';
import _                  from 'lodash';
import {History}          from 'react-router';

import CreatePlaylistPage from './CreatePlaylistPage';
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

  renderCreateButton() {
    if ( this.props.isUserMember(this.props.currentUser) ) {
      return (
        <div className="nudge-half--bottom text-right">
          <a href className="btn text-center" onClick={this.navigateToCreatePage}>
            <i className="icon-plus nudge-quarter--right" /> Create
          </a>
        </div>
      );
    }
  },

  renderPlaylists() {
    if ( !_.isEmpty(this.props.playlists) ) {
      return (
        <PlaylistList playlists={this.props.playlists} cardClassName="pure-u-1-2" />
      );
    } else {
      return (
        <h4 className="hard nudge--bottom light text-center">This group has not made any playlists yet!</h4>
      );
    }
  },

  render() {
    return (
      <div>

        {this.renderCreateButton()}

        {this.renderPlaylists()}

      </div>
    );
  }

});

export default GroupPlaylistsPage;