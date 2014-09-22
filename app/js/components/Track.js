/**
 * @jsx React.DOM
 */
 'use strict';

var React = require('react/addons');

var cx    = React.addons.classSet;

var Track = React.createClass({

  renderTrackSource: function() {
    var element;
    var classes = 'source ' + this.props.track.source;

    element = (
      <div className={classes}></div>
    );

    return element;
  },

  render: function() {
    var classes = cx({
      'track': true,
      'active': this.props.isActive
    });

    return (
      <li className={classes} onClick={this.props.selectTrack.bind(null, this.props.track.id)}>
        <div className="artwork-container">
          <img src={this.props.track.image} className="artwork" />
        </div>
        <div className="info-container">
          <h5 className="title">{this.props.track.title} <span className="duration">3:43</span></h5>
          <h6 className="artist">{this.props.track.artist}</h6>
        </div>
        <div className="participant-container">
        </div>
        {this.renderTrackSource}
      </li>
    );
  }

});

module.exports = Track;