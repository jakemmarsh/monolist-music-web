/**
 * @jsx React.DOM
 */
'use strict';

var React  = require('react/addons');

require('dancer');
require('dancer-waveform');

var mainColor = '#c386fb'; // Light purple
var kickColor = '#4f7dff'; // Darker purple

var PlayerVisualization = React.createClass({

  componentDidMount: function() {
    var element = this.getDOMNode();
    var ctx = element.getContext('2d');
    this.dancer = new window.Dancer();

    this.dancer.createKick({
      threshold: 0.15,
      onKick: function () {
        ctx.strokeStyle = kickColor;
        ctx.strokeWidth = 5;
      },
      offKick: function () {
        ctx.strokeStyle = mainColor;
        ctx.strokeWidth = 2;
      }
    }).on();

    if ( this.props.currentAudio ) {
      this.dancer.load(this.props.currentAudio);
    }

    this.dancer.waveform(element, {
      strokeStyle: mainColor,
      strokeWidth: 2
    });
  },

  componentDidUpdate: function(prevProps) {
    // Only update dancer if new track
    if ( this.props.currentAudio.src !== prevProps.currentAudio.src ) {
      this.dancer.load(this.props.currentAudio);
    }

    // Toggle visualizations if track is playing
    if ( !this.props.currentAudio.paused ) {
      this.dancer.play();
    }
  },

  render: function() {
    return (
      <canvas id="background-image-test" className="player-background-image"></canvas>
    );
  }

});

module.exports = PlayerVisualization;