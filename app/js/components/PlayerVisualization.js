'use strict';

// import 'dancer';
// import 'dancer-waveform';

import React from 'react/addons';
import _     from 'lodash';

let mainColor = '#c386fb'; // Light purple
let kickColor = '#4f7dff'; // Darker purple

var PlayerVisualization = React.createClass({

  propTypes: {
    audio: React.PropTypes.object,
    currentTrack: React.PropTypes.object
  },

  componentDidMount() {
    let element = this.getDOMNode();
    let ctx = element.getContext('2d');
    this.dancer = new window.Dancer();

    this.dancer.createKick({
      threshold: 0.15,
      onKick: function() {
        ctx.strokeStyle = kickColor;
        ctx.strokeWidth = 5;
      },
      offKick: function() {
        ctx.strokeStyle = mainColor;
        ctx.strokeWidth = 2;
      }
    }).on();

    if ( this.props.audio ) {
      this.dancer.load(this.props.audio);
    }

    this.dancer.waveform(element, {
      strokeStyle: mainColor,
      strokeWidth: 2
    });
  },

  componentDidUpdate(prevProps) {
    let hasTrack = !_.isEmpty(this.props.currentTrack);
    let hasNewTrack = hasTrack && !_.isEqual(this.props.currentTrack, prevProps.currentTrack);
    // Only update dancer if new track
    if ( hasNewTrack ) {
      this.dancer.load(this.props.audio);
    }

    // Toggle visualizations if track is playing
    if ( this.props.audio.playing && !this.dancer.isPlaying() ) {
      this.dancer.play();
    }
  },

  render() {
    return (
      <canvas className="player-visualization"></canvas>
    );
  }

});

export default PlayerVisualization;