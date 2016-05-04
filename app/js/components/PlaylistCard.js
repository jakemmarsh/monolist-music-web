'use strict';

import React           from 'react';
import cx              from 'classnames';
import _               from 'lodash';
import {Link, History} from 'react-router';

import PlaylistActions from '../actions/PlaylistActions';
import PlaylistAPI     from '../utils/PlaylistAPI';
import TrackActions    from '../actions/TrackActions';
import TagList         from './TagList';

const PlaylistCard = React.createClass({

  mixins: [History],

  propTypes: {
    playlist: React.PropTypes.object,
    className: React.PropTypes.string,
    currentlyPlaying: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      playlist: {},
      className: '',
      currentlyPlaying: false
    };
  },

  playPlaylist(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    PlaylistAPI.get(this.props.playlist.slug).then((playlist) => {
      PlaylistActions.play(playlist, () => {
        TrackActions.select(playlist.tracks[0], 0, () => {
          this.history.pushState(null, `/playlist/${playlist.slug}`);
        });
      });
    });
  },

  renderCurrentlyPlayingIcon() {
    const randomNumber = Math.floor(Math.random() * 5) + 1;
    const classes = cx(
      'icon-volume-up',
      'playlist-card-currently-playing-icon',
      `playlist-card-currently-playing-icon-${randomNumber}`
    );

    if ( this.props.currentlyPlaying ) {
      return (
        <i className={classes} />
      );
    }
  },

  renderTags() {
    if ( !_.isEmpty(this.props.playlist.tags) ) {
      return (
        <TagList type="playlist" tags={this.props.playlist.tags} />
      );
    }
  },

  render() {
    const imageStyle = {};

    if ( this.props.playlist.imageUrl ) {
      imageStyle.backgroundImage = 'url(' + this.props.playlist.imageUrl + ')';
    }

    return (
      <div className={'playlist-card nudge-half--bottom nudge-half--right ' + this.props.className}>
        {this.renderCurrentlyPlayingIcon()}
        <div className="playlist-card-inner">

          <div className="image-container">
            <div className="image" style={imageStyle}>
              <i className="icon-play play-button" onClick={this.playPlaylist} />
              <div className="filter" />
              <Link to={`/playlist/${this.props.playlist.slug}`} />
            </div>
          </div>

          <div className="details-container">
            <Link to={`/playlist/${this.props.playlist.slug}`}>
              <h5 className="title flush--top nudge-quarter--bottom">{this.props.playlist.title}</h5>
            </Link>

            <div className="stats-container">
              <div className="play-count-container">
                <i className="icon-play"></i> {this.props.playlist.plays ? this.props.playlist.plays.length : 0}
              </div>
              <div className="like-count-container">
                <i className="icon-heart"></i> {this.props.playlist.likes ? this.props.playlist.likes.length : 0}
              </div>
            </div>

            {this.renderTags()}
          </div>

        </div>
      </div>
    );
  }

});

export default PlaylistCard;
