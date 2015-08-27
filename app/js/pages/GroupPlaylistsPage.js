'use strict';

import React        from 'react/addons';
import _            from 'lodash';

import PlaylistList from '../components/PlaylistList';

var GroupPlaylistsPage = React.createClass({

  propTypes: {
    group: React.PropTypes.object.isRequired,
    playlists: React.PropTypes.array.isRequired
  },

  render() {
    return (
      <div>
        <PlaylistList playlists={this.props.playlists} cardClassName="pure-u-1-3" />
      </div>
    );
  }

});

export default GroupPlaylistsPage;