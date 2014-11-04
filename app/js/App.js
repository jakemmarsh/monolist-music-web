/**
 * @jsx React.DOM
 */
'use strict';

var React               = require('react/addons');

var Header              = require('./components/Header');
var CurrentlyPlaying    = require('./components/CurrentlyPlaying');
var PlayerControlsMixin = require('./mixins/PlayerControlsMixin');
var ContextMenuMixin    = require('./mixins/ContextMenuMixin');
var NavigationSidebar   = require('./components/NavigationSidebar');
var Footer              = require('./components/Footer');

var playlist = {
  tracks: [
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
  ]
};

var App = React.createClass({

  mixins: [PlayerControlsMixin, ContextMenuMixin],

  propTypes: {
    activeRouteHandler: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      playlist: playlist
    };
  },

  updatePageTitle: function(title) {
    var newPageTitle = '';

    if ( title ) {
      newPageTitle += title;
      newPageTitle += ' \u2014 ';
    }

    newPageTitle += 'Monolist';

    document.title = newPageTitle;
  },

  render: function() {
    return (
      <div>

        <Header title={this.state.title}
                icon={this.state.icon} />

        <CurrentlyPlaying ref="currentlyPlaying"
                          playlist={this.state.playlist}
                          currentTrack={this.state.track}
                          currentAudio={this.state.audio}
                          repeat={this.state.repeat}
                          shuffle={this.state.shuffle}
                          nextTrack={this.nextTrack}
                          lastTrack={this.lastTrack}
                          togglePlay={this.togglePlay}
                          seekTrack={this.seekTrack}
                          updateVolume={this.updateVolume}
                          toggleRepeat={this.toggleRepeat}
                          toggleShuffle={this.toggleShuffle} />

        <div className="table-wrapper">
          <NavigationSidebar />
          <this.props.activeRouteHandler updatePageTitle={this.updatePageTitle}
                                         playlist={this.state.playlist}
                                         currentTrack={this.state.track}
                                         selectPlaylist={this.selectPlaylist}
                                         selectTrack={this.selectTrack}
                                         showContextMenu={this.showContextMenu} />
        </div>

        {this.renderContextMenu()}

        <Footer />

      </div>
    );
  }

});

module.exports = React.createFactory(App);