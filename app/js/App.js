/**
 * @jsx React.DOM
 */
'use strict';

var React               = require('react/addons');
var $                   = require('jquery');
var _                   = require('underscore');

var Header              = require('./components/Header');
var CurrentlyPlaying    = require('./components/CurrentlyPlaying');
var PlayerControlsMixin = require('./mixins/PlayerControlsMixin');
var NavigationSidebar   = require('./components/NavigationSidebar');

var playlist = [
  {
    title: 'Candler Road',
    artist: 'Childish Gambino',
    source: 'soundcloud',
    sourceParam: '164497989',
    image: 'https://i1.sndcdn.com/artworks-000064028350-zpvcu0-large.jpg?e76cf77',
    id: 0
  },
  {
    title: 'Alright (ft. Big Sean)',
    artist: 'Logic',
    source: 'soundcloud',
    sourceParam: '146132553',
    image: 'https://i1.sndcdn.com/artworks-000077385297-oitifi-large.jpg?e76cf77',
    id: 1
  },
  {
    title: 'Jit/Juke',
    artist: 'Big Sean',
    source: 'soundcloud',
    sourceParam: '168793745',
    image: 'https://i1.sndcdn.com/artworks-000091744682-w6c1ym-large.jpg?e76cf77',
    id: 2
  },
  {
    title: 'Fight Night',
    artist: 'Migos',
    source: 'youtube',
    sourceParam: 'HsVnUpl2IKQ',
    image: 'https://i.ytimg.com/vi/HsVnUpl2IKQ/hqdefault.jpg',
    id: 3
  },
  {
    title: 'I',
    artist: 'Kendrick Lamar',
    source: 'youtube',
    sourceParam: 'hYIqaHWiW5M',
    image: 'https://i.ytimg.com/vi/hYIqaHWiW5M/hqdefault.jpg',
    id: 4
  }
];

var App = React.createClass({

  mixins: [PlayerControlsMixin],

  propTypes: {
    activeRouteHandler: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      title: null,
      icon: null,
      onPlaylist: false,
      playlist: playlist
    };
  },

  componentDidMount: function() {
    this.preloadPlaylistImages();

    $(document).keydown(this.handleGlobalKeyPress);
  },

  handleGlobalKeyPress: function(evt) {
    var keyCode = evt.keyCode || evt.which;
    var isInInput = ($('input').is(':focus')) && !($('textarea').is(':focus'));
    var isControlKey = (keyCode === 32 || keyCode === 37 || keyCode === 39);

    // Only use global actions if user isn't in an input or textarea
    if ( !isInInput && isControlKey ) {
      evt.stopPropagation();
      evt.preventDefault();

      switch( keyCode ) {
        // Space bar
        case 32:
          this.togglePlay();
          break;
        // Left arrow
        case 37:
          this.lastTrack();
          break;
        // Right arrow
        case 39:
          this.nextTrack();
          break;
      }
    }
  },

  preloadPlaylistImages: function() {
    var preloadImage;

    _.each(this.state.playlist, function(track) {
      preloadImage = new Image();
      preloadImage.src = track.artistImageUrl;
    });
  },

  updateHeader: function(newState, cb) {
    cb = cb || function() {};

    this.setState(newState, function() {
      cb();
    });
  },

  setPlaylist: function(newPlaylist, cb) {
    cb = cb || function() {};

    this.setState({
      playlist: newPlaylist
    }, function() {
      cb();
    });
  },

  render: function() {
    return (
      <div>

        <Header title={this.state.title}
                icon={this.state.icon} />

        <CurrentlyPlaying ref="currentlyPlaying"
                          displayFull={true}
                          playlist={this.state.playlist}
                          currentTrack={this.state.currentTrack}
                          currentAudio={this.state.currentAudio}
                          currentTime={this.state.currentTime}
                          duration={this.state.duration}
                          volume={this.state.volume}
                          repeat={this.state.repeat}
                          shuffle={this.state.shuffle}
                          nextTrack={this.nextTrack}
                          lastTrack={this.lastTrack}
                          togglePlay={this.togglePlay}
                          updateProgress={this.seekTrack}
                          updateVolume={this.updateVolume}
                          toggleRepeat={this.toggleRepeat}
                          toggleShuffle={this.toggleShuffle} />

        <div className="table-wrapper">
          <NavigationSidebar />
          <this.props.activeRouteHandler updateHeader={this.updateHeader}
                                         playlist={this.state.playlist}
                                         currentTrack={this.state.currentTrack}
                                         setPlaylist={this.setPlaylist}
                                         selectTrack={this.selectTrack} />
        </div>

      </div>
    );
  }

});

module.exports = App;