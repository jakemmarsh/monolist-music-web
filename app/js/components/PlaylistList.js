'use strict';

import React        from 'react';
import _            from 'lodash';

import PlaylistCard from './PlaylistCard';

const PlaylistList = React.createClass({

  propTypes: {
    playlists: React.PropTypes.array,
    cardClassName: React.PropTypes.string,
    className: React.PropTypes.string,
    firstItem: React.PropTypes.element
  },

  getDefaultProps() {
    return {
      playlists: [],
      cardClassName: null
    };
  },

  renderPlaylists() {
    let elements = null;

    if ( !_.isEmpty(this.props.playlists) || this.props.firstItem ) {
      elements = _.map(this.props.playlists, (playlist, index) => {
        return (
          <li className={this.props.cardClassName} key={index}>
            <PlaylistCard playlist={playlist} />
          </li>
        );
      });

      if ( this.props.firstItem ) {
        elements.unshift(
          <li className={this.props.cardClassName} key={this.props.playlists.length}>
            {this.props.firstItem}
          </li>
        );
      }
    } else {
      elements = (
        <h3 className="nudge--top text-center light full-width">No playlists yet!</h3>
      );
    }

    return elements;
  },

  render() {
    const classes = 'playlist-list pure-g' + (!!this.props.className ? ` ${this.props.className}` : '');

    return (
      <ul className={classes}>

        {this.renderPlaylists()}

      </ul>
    );
  }

});

export default PlaylistList;
