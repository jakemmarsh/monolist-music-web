'use strict';

import React        from 'react/addons';
import _            from 'lodash';

import PlaylistList from '../components/PlaylistList';

var ProfileStarsPage = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired
  },

  render() {
    if ( !_.isEmpty(this.props.currentUser) && this.props.currentUser.id === this.props.user.id ) {
      if ( !_.isEmpty(this.props.user.starredTracks) ) {
        return (
          <MiniTracklist currentUser={this.props.currentUser}
                         profileUser={this.props.user}
                         currentTrack={this.props.currentTrack}
                         tracks={this.props.user.starredTracks} />
        );
      } else {
        return (
          <h4 className="hard nudge--bottom light">This user has not starred any tracks yet!</h4>
        );
      }
    }
  }

});

export default ProfileStarsPage;