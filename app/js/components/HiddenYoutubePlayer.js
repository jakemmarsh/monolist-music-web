/**
 * @jsx React.DOM
 */
 /* global YT */
'use strict';

var React = require('react/addons');

var HiddenYoutubePlayer = React.createClass({

  propTypes: {
    createYouTubePlayer: React.PropTypes.func.isRequired,
    initializeYouTubePlayer: React.PropTypes.func.isRequired,
    youTubeListener: React.PropTypes.func.isRequired
  },

  componentWillMount: function() {
    this._loadPlayerAPI();
    window.onYouTubeIframeAPIReady = this._onYouTubeAPIReady;
  },

  _loadPlayerAPI: function() {
    var tag = document.createElement('script');
    var firstScriptTag = document.getElementsByTagName('script')[0];

    tag.src = 'https://www.youtube.com/iframe_api';
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  },

  _onYouTubeAPIReady: function() {
    this.props.createYouTubePlayer(new YT.Player('youtube-player', {
      height: '0',
      width: '0',
      events: {
        'onReady': this.props.initializeYouTubePlayer,
        'onStateChange': this.props.youTubeListener
      }
    }));
  },

  render: function() {
    return (
      <div id="youtube-player" />
    );
  }

});

module.exports = React.createFactory(HiddenYoutubePlayer);