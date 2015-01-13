/**
 * @jsx React.DOM
 */
'use strict';

var React           = require('react/addons');
var cx              = React.addons.classSet;
var _               = require('lodash');
var $               = require('jquery');

var Helpers         = require('../utils/Helpers');
var OpenLinkMixin   = require('../mixins/OpenLinkMixin');
var TrackActions    = require('../actions/TrackActions');
var PlaylistActions = require('../actions/PlaylistActions');

var MiniTracklist = React.createClass({

  mixins: [OpenLinkMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    profileUser: React.PropTypes.object.isRequired,
    tracks: React.PropTypes.array.isRequired,
    currentTrack: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      curentUser: {},
      profileUser: {},
      tracks: [],
      currentTrack: {}
    };
  },

  getInitialState: function() {
    return {
      tracks: this.props.tracks
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if ( !_.isEqual(this.props.tracks, nextProps.tracks) ) {
      this.setState({ tracks: nextProps.tracks });
    }
  },

  componentDidUpdate: function() {
    $('.track-star').hover(function() {
      $(this).removeClass('fa-star');
      $(this).addClass('fa-star-o');
    });

    $('.track-star').mouseleave(function() {
      $(this).removeClass('fa-star-o');
      $(this).addClass('fa-star');
    });
  },

  stopPropagation: function(evt) {
    evt.stopPropagation();
  },

  unstarTrack: function(track, evt) {
    var tracksCopy = this.state.tracks;

    evt.preventDefault();
    evt.stopPropagation();

    tracksCopy = _.reject(tracksCopy, function(starredTrack) {
      return starredTrack.sourceParam === track.sourceParam && starredTrack.sourceUrl === track.sourceUrl;
    });

    this.setState({ tracks: tracksCopy }, TrackActions.unstar(track));
  },

  selectTrack: function(track, index) {
    PlaylistActions.play(this.state.tracks, function() {
      TrackActions.select(track, index);
    }.bind(this));
  },

  renderStar: function(track) {
    var element;

    if ( !_.isEmpty(this.props.currentUser) && this.props.currentUser.id === this.props.profileUser.id ) {
      element = (
        <i className="track-star fa fa-star" onClick={this.unstarTrack.bind(null, track)} />
      );
    }

    return element;
  },

  renderTrackDuration: function(track) {
    var element = null;

    if ( track.duration ) {
      element = (
        <span className="duration">{Helpers.formatSecondsAsTime(track.duration)}</span>
      );
    }

    return element;
  },

  renderTrackSource: function(track) {
    var element;
    var elementClasses = 'source ' + track.source;
    var iconClasses = 'fa fa-' + track.source;

    if ( track.source === 'youtube' ) {
      iconClasses += '-play';
    }

    element = (
      <div className={elementClasses}>
        <i className={iconClasses}></i>
        <a href={track.sourceUrl} onClick={this.openExternalLink} target="_blank" />
      </div>
    );

    return element;
  },

  renderStarredTracks: function() {
    var isActive;
    var classes;

    return _.map(this.state.tracks, function(track, index) {
      isActive = !_.isEmpty(this.props.currentTrack) && this.props.currentTrack.sourceParam === track.sourceParam && this.props.currentTrack.sourceUrl === track.sourceUrl;
      classes = cx({
        'mini-track': true,
        'active': isActive
      });

      return (
        <li className={classes} key={index} onClick={this.selectTrack.bind(null, track, index)}>
          <div className="star-container">
            {this.renderStar(track)}
          </div>
          <div className="info-container">
            <h6 className="title small">{track.title} {this.renderTrackDuration(track)}</h6>
          </div>
          {this.renderTrackSource(track)}
        </li>
      );
    }.bind(this));
  },

  render: function() {
    return (
      <ul className="mini-tracklist">
        {this.renderStarredTracks()}
      </ul>
    );
  }

});

module.exports = React.createFactory(MiniTracklist);