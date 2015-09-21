'use strict';

import React        from 'react/addons';
import _            from 'lodash';

import PlaylistList from '../components/PlaylistList';

var ProfileCollaborationsPage = React.createClass({

  propTypes: {
    user: React.PropTypes.object
  },

  render() {
    if ( !_.isEmpty(this.props.user.collaborations) ) {
      return (
        <PlaylistList playlists={this.props.user.collaborations} cardClassName="pure-u-1-2" />
      );
    } else {
      return (
        <h4 className="hard nudge--bottom light text-center">This user has not collaborated on any public playlists yet!</h4>
      );
    }
  }

});

export default ProfileCollaborationsPage;