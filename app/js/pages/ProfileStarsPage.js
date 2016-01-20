'use strict';

import React     from 'react';
import _         from 'lodash';

import Tracklist from '../components/Tracklist';

const ProfileStarsPage = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
    userCollaborations: React.PropTypes.array,
    user: React.PropTypes.object
  },

  render() {
    if ( !_.isEmpty(this.props.user.starredTracks) ) {
      return (
        <Tracklist type="stars"
                   playlist={{ tracks: this.props.user.starredTracks }}
                   currentTrack={this.props.currentTrack}
                   userCollaborations={this.props.userCollaborations}
                   currentUser={this.props.currentUser} />
      );
    } else {
      return (
        <h4 className="hard nudge--bottom light text-center">This user has not starred any tracks yet!</h4>
      );
    }
  }

});

export default ProfileStarsPage;
