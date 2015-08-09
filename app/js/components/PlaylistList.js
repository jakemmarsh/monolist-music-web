'use strict';

import React        from 'react/addons';
import _            from 'lodash';

import PlaylistCard from './PlaylistCard';

var PlaylistList = React.createClass({

  propTypes: {
    playlists: React.PropTypes.array.isRequired
  },

  getDefaultProps() {
    return {
      playlists: []
    };
  },

  renderPlaylists() {
    let elements = null;

    if ( !_.isEmpty(this.props.playlists) ) {
    elements = _.map(this.props.playlists, (playlist, index) => {
      return (
        <PlaylistCard playlist={playlist} key={index} />
      );
    });
    } else {
      elements = (
        <h3 className="flush--top light">No playlists yet!</h3>
      );
    }

    return elements;
  },

  render() {
    return (
      <ul className="playlist-group-list">

        {this.renderPlaylists()}

      </ul>
    );
  }

});

export default PlaylistList;