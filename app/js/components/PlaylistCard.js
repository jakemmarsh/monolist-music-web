'use strict';

import React              from 'react/addons';
import _                  from 'lodash';
import {Link, Navigation} from 'react-router';

import PlaylistActions    from '../actions/PlaylistActions';
import TrackActions       from '../actions/TrackActions';
import PlaylistTags       from './PlaylistTags';

var PlaylistCard = React.createClass({

  mixins: [Navigation],

  propTypes: {
    playlist: React.PropTypes.object.isRequired
  },

  getDefaultProps() {
    return {
      playlist: {}
    };
  },

  playPlaylist(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    PlaylistActions.play(this.props.playlist, () => {

      // TODO: how to transition to track without having playlist.tracks?
      // TrackActions.select(null, this.props.playlist.tracks[0], 0);
      this.transitionTo('Playlist', { slug: this.props.playlist.slug });
    });
  },

  renderTags() {
    if ( !_.isEmpty(this.props.playlist.tags) ) {
      return (
        <PlaylistTags className="nudge-quarter--ends" tags={this.props.playlist.tags} />
      );
    }
  },

  render() {
    let imageStyle = {};

    if ( this.props.playlist.imageUrl ) {
      imageStyle.backgroundImage = 'url(' + this.props.playlist.imageUrl + ')';
    }

    return (
      <div className="playlist-card nudge-half--right nudge-half--bottom">

        <div className="image-container">
          <div className="image" style={imageStyle}>
            <i className="fa fa-play play-button" onClick={this.playPlaylist} />
            <div className="filter" />
            <Link to="Playlist" params={{ slug: this.props.playlist.slug }} />
          </div>
        </div>

        <div className="details-container">
          <Link to="Playlist" params={{ slug: this.props.playlist.slug }}>
            <h5 className="title flush--top">{this.props.playlist.title}</h5>
          </Link>

          <div className="stats-container soft-quarter--bottom">
            <div className="play-count-container">
              <i className="fa fa-play"></i> {this.props.playlist.plays ? this.props.playlist.plays.length : 0}
            </div>
            <div className="like-count-container">
              <i className="fa fa-heart"></i> {this.props.playlist.likes ? this.props.playlist.likes.length : 0}
            </div>
          </div>

          {this.renderTags()}
        </div>

      </div>
    );
  }

});

export default PlaylistCard;