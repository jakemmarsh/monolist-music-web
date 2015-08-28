'use strict';

import React        from 'react/addons';
import _            from 'lodash';

import PlaylistList from '../components/PlaylistList';

var ProfilePlaylistsPage = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired
  },

  render() {
    if ( !_.isEmpty(this.props.user.playlists) ) {
      return (
        <PlaylistList playlists={this.props.user.playlists} cardClassName="pure-u-1-3" />
      );
    } else {
      return (
        <h4 className="hard nudge--bottom light text-center">This user has not created any public playlists yet!</h4>
      );
    }
  }

});

export default ProfilePlaylistsPage;