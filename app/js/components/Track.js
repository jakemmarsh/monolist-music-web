/**
 * @jsx React.DOM
 */
 'use strict';

var React = require('react/addons');

var cx    = React.addons.classSet;

var Track = React.createClass({

  renderTrackSource: function() {
    var element;
    var elementClasses = 'source ' + this.props.track.source;
    var iconClasses = 'fa fa-' + this.props.track.source;

    if ( this.props.track.source === 'youtube' ) {
      iconClasses += '-play';
    }

    element = (
      <div className={elementClasses}>
        <i className={iconClasses}></i>
      </div>
    );

    return element;
  },

  renderTrackComments: function() {
    var element;

    // TODO: logic and layout for track comments
    element = null;

    return element;
  },

  render: function() {
    var classes = cx({
      'track': true,
      'active': this.props.isActive
    });

    return (
      <li className={classes} onClick={this.props.selectTrack ? this.props.selectTrack.bind(null, this.props.track, 'search') : null}>
        <div className="track-info">
          <div className="artwork-container">
            <img src={this.props.track.image} className="artwork" />
          </div>
          <div className="info-container">
            <h5 className="title">{this.props.track.title} <span className="duration">3:43</span></h5>
            <h6 className="artist">{this.props.track.artist}</h6>
          </div>
          <div className="participant-container">
          </div>
          {this.renderTrackSource()}
        </div>
        {this.renderTrackComments()}
      </li>
    );
  }

});

module.exports = Track;