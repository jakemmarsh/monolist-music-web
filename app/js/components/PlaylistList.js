'use strict';

import React        from 'react/addons';
import _            from 'lodash';

import PlaylistCard from './PlaylistCard';

var PlaylistList = React.createClass({

  propTypes: {
    playlists: React.PropTypes.array.isRequired,
    cardClassName: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      playlists: [],
      cardClassName: null
    };
  },

  renderPlaylists() {
    let elements = null;

    if ( !_.isEmpty(this.props.playlists) ) {
    elements = _.map(this.props.playlists, (playlist, index) => {
      return (
        <li className={this.props.cardClassName} key={index}>
          <PlaylistCard playlist={playlist} />
        </li>
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
      <ul className="playlist-list pure-g">

        {this.renderPlaylists()}

      </ul>
    );
  }

});

export default PlaylistList;