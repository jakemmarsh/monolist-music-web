'use strict';

import React        from 'react';
import _            from 'lodash';

import PlaylistList from '../components/PlaylistList';

var ProfileLikesPage = React.createClass({

  propTypes: {
    user: React.PropTypes.object
  },

  render() {
    if ( !_.isEmpty(this.props.user.likes) ) {
      return (
        <PlaylistList playlists={this.props.user.likes} cardClassName="pure-u-1-2" />
      );
    } else {
      return (
        <h4 className="hard nudge--bottom light text-center">This user has not liked any public playlists yet!</h4>
      );
    }
  }

});

export default ProfileLikesPage;