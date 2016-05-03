'use strict';

import React           from 'react';
import _               from 'lodash';
import cx              from 'classnames';

import Animations      from '../utils/Animations';
import GlobalActions   from '../actions/GlobalActions';
import PlaylistActions from '../actions/PlaylistActions';
import TrackActions    from '../actions/TrackActions';
import APIUtils        from '../utils/APIUtils';

const CurrentlyPlaying = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object,
    userCollaborations: React.PropTypes.array,
    player: React.PropTypes.object,
    audio: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
    currentPlaylist: React.PropTypes.object,
    buffering: React.PropTypes.bool,
    paused: React.PropTypes.bool,
    time: React.PropTypes.number,
    duration: React.PropTypes.number,
    volume: React.PropTypes.number,
    repeat: React.PropTypes.string,
    shuffle: React.PropTypes.bool
  },

  _displayArtOrVideo(upcomingTrack) {
    const animationDuration = 300;
    const ytPlayerContainer = this.refs.ytPlayerContainer;
    const artwork = this.refs.artwork;

    if ( upcomingTrack.source === 'youtube' ) {
      Animations.fadeOut(artwork, animationDuration).then(() => {
        Animations.fadeIn(ytPlayerContainer, animationDuration);
      });
    } else {
      Animations.fadeOut(ytPlayerContainer, animationDuration).then(() => {
        Animations.fadeIn(artwork, animationDuration);
      });
    }
  },

  componentDidMount() {
    if ( !_.isEmpty(this.props.currentTrack) ) {
      this._displayArtOrVideo(this.props.currentTrack);
    }
  },

  componentWillReceiveProps(nextProps) {
    if ( !_.isEmpty(nextProps.currentTrack) && !_.isEqual(nextProps.currentTrack, this.props.currentTrack) ) {
      this._displayArtOrVideo(nextProps.currentTrack);
    }
  },

  isTrackUpvoted()  {
    return _.some(this.props.currentTrack.upvotes, { userId: this.props.currentUser.id });
  },

  isTrackDownvoted() {
    return _.some(this.props.currentTrack.downvotes, { userId: this.props.currentUser.id });
  },

  doTwitterShare() {
    const trackTitle = this.props.currentTrack.title + (this.props.currentTrack.artist ? ` by ${this.props.currentTrack.artist}` : '');
    const text = `Now Playing: ${trackTitle}`;
    const tags = ['NowPlaying'];
    const playlistUrl = `http://app.monolist.co/playlist/${this.props.currentPlaylist.slug}`;
    const url = APIUtils.buildTwitterUrl(text, tags, playlistUrl);
    const width = 550;
    const height = 300;
    const left = (screen.width / 2) - (width / 2);
    const top = (screen.height / 2) - (height / 2);

    window.open(
      url,
      '',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=' + height + ',width=' + width + ',top=' + top + ',left=' + left
    );
  },

  openContextMenu(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    const menuItems = (
      <div>
        {this.renderStarTrackOption()}
        {this.renderAddTrackOption()}
        {this.renderTweetTrackOption()}
      </div>
    );

    GlobalActions.openContextMenu(menuItems, evt.pageX, evt.pageY, null, true);
  },

  handleTrackUpvote() {
    TrackActions.upvote(this.props.currentTrack, this.props.currentUser);
  },

  handleTrackDownvote() {
    TrackActions.downvote(this.props.currentTrack, this.props.currentUser);
  },

  renderArtist() {
    if ( this.props.currentTrack && this.props.currentTrack.artist ) {
      return (
        <h5 ref="trackArtist" className="currently-playing-song-artist flush--ends">
          {this.props.currentTrack.artist}
        </h5>
      );
    }
  },

  renderPossiblePlaylists() {
    return _.map(this.props.userCollaborations, (playlist, index) => {
      if ( playlist.id !== this.props.currentPlaylist.id ) {
        return (
          <li className="menu-item"
              key={index}
              onClick={PlaylistActions.addTrack.bind(null, playlist, this.props.currentTrack)}>
            {playlist.title}
          </li>
        );
      }
    });
  },

  renderStarTrackOption() {
    const hasUser = !_.isEmpty(this.props.currentUser);
    const userHasStarred = hasUser && _.some(this.props.currentUser.starredTracks, {
      sourceParam: this.props.currentTrack.sourceParam,
      sourceUrl: this.props.currentTrack.sourceUrl
    });
    const iconClass = userHasStarred ? 'icon-star-o' : 'icon-star';
    const text = userHasStarred ? 'Unstar Track' : 'Star Track';
    const func = userHasStarred ? TrackActions.unstar : TrackActions.star;

    if ( hasUser ) {
      return (
        <li className="menu-item" onClick={func.bind(null, this.props.currentTrack)}>
          <i className={iconClass} />
          {text}
        </li>
      );
    }
  },

  renderAddTrackOption() {
    if ( !_.isEmpty(this.props.currentUser) && this.props.userCollaborations.length ) {
      return (
        <li className="menu-item">
        <i className="icon-chevron-left float-left" />
          <i className="icon-plus" />
          Add Track To Playlist
          <ul>
            {this.renderPossiblePlaylists()}
          </ul>
        </li>
      );
    }
  },

  renderTweetTrackOption() {
    return (
      <li className="menu-item" onClick={this.doTwitterShare}>
        <i className="icon-twitter" />
        Tweet Track
      </li>
    );
  },

  renderTitle() {
    if ( this.props.currentTrack && this.props.currentTrack.title ) {
      return (
        <h4 ref="trackTitle" className="currently-playing-song-title flush--ends">
          {this.props.currentTrack.title}
        </h4>
      );
    }
  },

  renderVotingArrows() {
    if ( !_.isEmpty(this.props.currentUser) && !_.isEmpty(this.props.currentTrack) ) {
      const isTrackUpvoted = this.isTrackUpvoted();
      const isTrackDownvoted = this.isTrackDownvoted();

      const upvoteClasses = cx('currently-playing-upvote-button', 'icon-chevron-up', 'zeta', {
        active: isTrackUpvoted && !isTrackDownvoted
      });
      const downvoteClasses = cx('currently-playing-downvote-button', 'icon-chevron-down', 'zeta', {
        active: isTrackDownvoted && !isTrackUpvoted
      });

      return (
        <div>
            <div className="fx-1">
              <i ref="upvoteButton"
                 className={upvoteClasses}
                 onClick={this.handleTrackUpvote} />
            </div>
            <div className="fx-1">
              <i ref="downvoteButton"
                 className={downvoteClasses}
                 onClick={this.handleTrackDownvote} />
            </div>
        </div>
      );
    }
  },

  render() {
    const track = this.props.currentTrack;
    const hasImage = track && track.source !== 'youtube' && track.imageUrl;
    const artworkStyles = {
      backgroundImage: hasImage ? `url(${track.imageUrl})` : null
    };

    return (
      <div className="currently-playing">

        <div className="currently-playing-artwork-container">
          <div ref="ytPlayerContainer">
            <div ref="ytPlayer" id="yt-player" className="currently-playing-video" />
          </div>
          <div ref="artwork" className="currently-playing-artwork" style={artworkStyles} />
        </div>

        <div className="currently-playing-song-info-container d-f ai-c fxd-r">
          <div className="fx-1 text-right">
            <i ref="contextMenuButton"
               className="currently-playing-menu-button icon-ellipsis-h delta"
               onClick={this.openContextMenu} />
          </div>
          <div className="w-1-1 soft-half--sides text-center">
            {this.renderArtist()}
            {this.renderTitle()}
          </div>
          <div className="fx-1 d-f fxd-c">
            {this.renderVotingArrows()}
          </div>
        </div>

      </div>
    );
  }

});

export default CurrentlyPlaying;
