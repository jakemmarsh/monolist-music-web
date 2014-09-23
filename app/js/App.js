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
    artistImageUrl: 'http://userserve-ak.last.fm/serve/500/55311643/Childish+Gambino+800pxChildish_GambinoBowery_Ba.jpg',
    url: '/api/stream/soundcloud/164497989',
    image: 'https://i1.sndcdn.com/artworks-000064028350-zpvcu0-large.jpg?e76cf77',
    id: 0
  },
  {
    title: 'Alright (ft. Big Sean)',
    artist: 'Logic',
    source: 'soundcloud',
    artistImageUrl: 'http://userserve-ak.last.fm/serve/500/69817516/Logic+a2.jpg',
    url: '/api/stream/soundcloud/146132553',
    image: 'https://i1.sndcdn.com/artworks-000077385297-oitifi-large.jpg?e76cf77',
    id: 1
  },
  {
    title: 'Jit/Juke',
    artist: 'Big Sean',
    source: 'soundcloud',
    artistImageUrl: 'http://userserve-ak.last.fm/serve/500/56846877/Big+Sean+sean.png',
    url: '/api/stream/soundcloud/168793745',
    image: 'https://i1.sndcdn.com/artworks-000091744682-w6c1ym-large.jpg?e76cf77',
    id: 2
  },
  {
    title: 'Fight Night',
    artist: 'Migos',
    source: 'youtube',
    artistImageUrl: 'http://upload.wikimedia.org/wikipedia/commons/2/2a/Migos_on_couch_2014-05-02_14-02.png',
    url: '/api/stream/youtube/HsVnUpl2IKQ',
    image: 'https://i.ytimg.com/vi/HsVnUpl2IKQ/hqdefault.jpg',
    id: 3
  },
  {
    title: 'I',
    artist: 'Kendrick Lamar',
    source: 'youtube',
    artistImageUrl: 'http://userserve-ak.last.fm/serve/500/52100641/Kendrick+Lamar+KL1.jpg',
    url: '/api/stream/youtube/hYIqaHWiW5M',
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

    $(document).keyup(this.handleKeyPress);
  },

  handleKeyPress: function(evt) {
    var keyCode = evt.keyCode || evt.which;

    // Only use global actions if user isn't in an input or textarea
    if ( !($('input').is(':focus')) && !($('textarea').is(':focus')) ) {
      evt.preventDefault();
      evt.stopPropagation();

      switch( keyCode ) {
        // Space bar
        case 32:
          this.togglePlay();
          return false;
        // Left arrow
        case 37:
          this.lastTrack();
          return false;
        // Right arrow
        case 39:
          this.nextTrack();
          return false;
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
                          isPlaying={this.state.isPlaying}
                          volume={this.state.volume}
                          currentTime={this.state.currentTime}
                          duration={this.state.duration}
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