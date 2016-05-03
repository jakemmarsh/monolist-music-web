'use strict';

import React           from 'react';
import getUrls         from 'get-urls';
import _               from 'lodash';

import GlobalActions   from '../actions/GlobalActions';
import PlaylistActions from '../actions/PlaylistActions';
import TrackAPI        from '../utils/TrackAPI';
import Title           from './Title';
import Track           from './Track';

const AddTrackFromUrlForm = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    playlist: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      body: '',
      track: null
    };
  },

  clearTrack() {
    this.setState({ track: null });
  },

  buildTrack(source, sourceUrl) {
    TrackAPI.getTrackDetails(source, sourceUrl).then((track) => {
      this.setState({ track: track });
    });
  },

  checkUrls(urls) {
    const amRegex = new RegExp('audiomack.com', 'i');
    const bcRegex = new RegExp('bandcamp.com', 'i');
    const scRegex = new RegExp('soundcloud.com', 'i');
    const ytRegex = new RegExp('youtu\.be|youtube\.com', 'i');
    let source = null;
    const sourceUrl = _.find(urls, (url) => {
      if ( amRegex.test(url) ) {
        source = 'audiomack';
        return true;
      } else if ( bcRegex.test(url) ) {
        source = 'bandcamp';
        return true;
      } else if ( scRegex.test(url) ) {
        source = 'soundcloud';
        return true;
      } else if ( ytRegex.test(url) ) {
        source = 'youtube';
        return true;
      }
    });

    if ( source && sourceUrl ) {
      this.buildTrack(source, sourceUrl);
    } else {
      this.clearTrack();
    }
  },

  handleUrlInputChange(evt) {
    const newVal = evt.currentTarget.value;
    const urls = getUrls(newVal);

    this.setState({ body: newVal }, this.checkUrls.bind(null, urls));
  },

  handleFormSubmit(evt) {
    evt.preventDefault();

    PlaylistActions.addTrack(this.props.playlist, this.state.track, () => {
      this.setState(this.getInitialState(), () => {
        // Reload playlist with new track
        PlaylistActions.open(this.props.playlist.slug);
        GlobalActions.closeModal();
      });
    });
  },

  renderTrack() {
    if ( !_.isEmpty(this.state.track) ) {
      return (
        <Track type="post"
               track={this.state.track}
               index={0}
               currentUser={this.props.currentUser} />
      );
    }
  },

  render() {
    return (
      <form className="add-track-from-url-form" onSubmit={this.handleFormSubmit}>

        <Title icon="plus" text="Add a Track by URL" className="flush--bottom" />

        <p className="flush--top text-left">
          Paste the URL of a track from Audiomack, Bandcamp, SoundCloud, or YouTube below
          and it will be automatically detected to be added to this playlist.
        </p>

        <input type="text"
               className="full-width"
               placeholder="http://www.source.com/track"
               onChange={this.handleUrlInputChange}
               value={this.state.body} />

        {this.renderTrack()}

        <div className="text-right nudge-half--top">
          <button type="submit" className="btn" disabled={!this.state.track}>Add Track</button>
        </div>

      </form>
    );
  }

});

export default AddTrackFromUrlForm;
